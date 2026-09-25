"""
Hookah Baithak — keep-alive sidecar (Flask, ~40 lines, no database, no state).

Two jobs:

1. It answers `GET /` and `GET /ping` with a 200 OK, so a cron job can hit *this*
   service to keep it warm.
2. Every PING_INTERVAL seconds a background thread hits TARGET_URL (the main
   Next.js site) so the site itself never falls asleep either.

Run it locally:
    pip install -r requirements.txt
    TARGET_URL=https://your-site.onrender.com python app.py

Deploy it free on Render as a second Web Service:
    Build:  pip install -r keepalive/requirements.txt
    Start:  gunicorn -w 1 -b 0.0.0.0:$PORT --chdir keepalive app:app
"""

import os
import threading
import time
from datetime import datetime, timezone
from urllib.request import Request, urlopen

from flask import Flask, jsonify

app = Flask(__name__)

TARGET_URL = os.environ.get("TARGET_URL", "").rstrip("/")
PING_INTERVAL = int(os.environ.get("PING_INTERVAL", "600"))  # 10 minutes
STARTED = time.time()
LAST = {"url": TARGET_URL or None, "status": None, "at": None}


def payload(extra=None):
    data = {
        "ok": True,
        "status": 200,
        "service": "hookah-baithak-keepalive",
        "message": "pong — the baithak is awake",
        "uptime_seconds": int(time.time() - STARTED),
        "time": datetime.now(timezone.utc).isoformat(),
        "last_upstream_ping": LAST,
    }
    if extra:
        data.update(extra)
    return jsonify(data), 200, {"Cache-Control": "no-store", "X-Robots-Tag": "noindex"}


@app.get("/")
@app.get("/ping")
@app.get("/health")
@app.get("/healthz")
def ping():
    return payload()


@app.route("/ping", methods=["HEAD"])
def ping_head():
    return "", 200, {"Cache-Control": "no-store"}


def wake_target():
    """Poke the main site on a loop so its free instance never sleeps."""
    while True:
        time.sleep(PING_INTERVAL)
        if not TARGET_URL:
            continue
        url = f"{TARGET_URL}/api/ping"
        try:
            req = Request(url, headers={"User-Agent": "hookah-baithak-keepalive/1.0"})
            with urlopen(req, timeout=20) as res:
                LAST.update(url=url, status=res.status)
        except Exception as err:  # never let the thread die
            LAST.update(url=url, status=f"error: {err.__class__.__name__}")
        LAST["at"] = datetime.now(timezone.utc).isoformat()


threading.Thread(target=wake_target, daemon=True).start()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))

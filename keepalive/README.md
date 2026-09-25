# Keep-alive sidecar

A ~40 line Flask app whose only job is to answer `200 OK` and to poke the main
site on a timer, so nothing on a free tier ever goes cold.

## Endpoints

| Route | Method | Answer |
| --- | --- | --- |
| `/`, `/ping`, `/health`, `/healthz` | `GET` | `200` + a small JSON body |
| `/ping` | `HEAD` | `200`, empty body |

## Environment

| Variable | Default | What it does |
| --- | --- | --- |
| `TARGET_URL` | – | The live site, e.g. `https://hookah-baithak.onrender.com`. Leave it empty and the sidecar only answers pings. |
| `PING_INTERVAL` | `600` | Seconds between upstream pokes. |
| `PORT` | `8080` | Port to bind. |

## Run it

```bash
pip install -r requirements.txt
TARGET_URL=https://your-site.onrender.com python app.py
curl -i localhost:8080/ping
```

## Deploy on Render (free)

* **Build command:** `pip install -r keepalive/requirements.txt`
* **Start command:** `gunicorn -w 1 -b 0.0.0.0:$PORT --chdir keepalive app:app`
* **Env:** `TARGET_URL = https://<your main service>.onrender.com`

## Or skip it entirely

The Next.js app already exposes `/api/ping`. Point https://cron-job.org at
`https://<your site>/api/ping` every 10 minutes and you are done — the Flask
service is only useful if you want a second, independent watchdog.

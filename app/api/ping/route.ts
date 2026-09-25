import { NextResponse } from 'next/server';

/**
 * Keep-alive endpoint.
 *
 * Free hosts (Render, Koyeb, Fly scale-to-zero…) put the service to sleep after
 * ~15 minutes of silence, and the first visitor after that waits ~50s for a cold
 * boot. Point a cron job (cron-job.org, UptimeRobot, GitHub Actions) at
 * `/api/ping` every 10 minutes and the box never goes cold.
 *
 * Answers 200 OK either way, but in the shape the caller wants:
 *   • a browser (Accept: text/html) gets a tiny page with a big "200 OK" on top
 *   • curl / cron / uptime monitors get the small JSON body
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const startedAt = Date.now();

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
};

function info() {
  return {
    ok: true,
    status: 200,
    service: 'hookah-baithak',
    message: 'pong — the baithak is awake',
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    time: new Date().toISOString(),
  };
}

function uptimeText(s: number) {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d) return `${d}d ${h}h ${m}m`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/** The big green 200 OK a human sees when they open the URL. */
function page() {
  const i = info();
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>200 OK · Hookah Baithak</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100dvh; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start; gap: 6px; padding: 8vh 20px 40px;
    background: radial-gradient(90% 70% at 50% 0%, #17351f, #0a0c0b 65%);
    color: #eaf5ec; text-align: center;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }
  .code {
    font-size: clamp(64px, 22vw, 190px); line-height: .92; font-weight: 800; letter-spacing: -.04em;
    color: #5ef2a0; text-shadow: 0 0 60px rgba(94,242,160,.35);
    animation: pop .5s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes pop { from { opacity: 0; transform: translateY(18px) scale(.92); filter: blur(8px); } }
  .pill {
    display: inline-flex; align-items: center; gap: 8px; margin-top: 14px;
    padding: 7px 14px; border-radius: 999px; font-size: 13px;
    border: 1px solid rgba(94,242,160,.35); background: rgba(94,242,160,.08); color: #bff6d6;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #5ef2a0; animation: beat 1.4s ease-in-out infinite; }
  @keyframes beat { 50% { opacity: .25; transform: scale(.7); } }
  dl { margin: 26px 0 0; display: grid; grid-template-columns: auto auto; gap: 6px 16px; font-size: 13px; }
  dt { color: #7f9b89; text-align: right; }
  dd { margin: 0; text-align: left; color: #d8ece0; }
  a { margin-top: 26px; color: #8fe0b4; font-size: 13px; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
</style>
</head><body>
  <div class="code">200 OK</div>
  <div class="pill"><span class="dot"></span> pong — the baithak is awake</div>
  <dl>
    <dt>service</dt><dd>${i.service}</dd>
    <dt>uptime</dt><dd>${uptimeText(i.uptimeSeconds)}</dd>
    <dt>time</dt><dd>${i.time}</dd>
  </dl>
  <a href="/">← back to the baithak</a>
</body></html>`;
}

function wantsHtml(req: Request) {
  const a = req.headers.get('accept') || '';
  return a.includes('text/html');
}

export async function GET(req: Request) {
  if (wantsHtml(req)) {
    return new Response(page(), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  return NextResponse.json(info(), { status: 200, headers });
}

export async function POST() {
  return NextResponse.json(info(), { status: 200, headers });
}

/** cheapest possible check — no body at all */
export async function HEAD() {
  return new Response(null, { status: 200, headers });
}

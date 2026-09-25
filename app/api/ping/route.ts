import { NextResponse } from 'next/server';

/**
 * Keep-alive endpoint.
 *
 * Free hosts (Render, Koyeb, Fly scale-to-zero…) put the service to sleep after
 * ~15 minutes of silence, and the first visitor after that waits ~50s for a cold
 * boot. Point a cron job (cron-job.org, UptimeRobot, GitHub Actions) at
 * `/api/ping` every 10 minutes and the box never goes cold.
 *
 * Always answers 200 OK, in a few bytes, with no caching anywhere in between.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const startedAt = Date.now();

function body() {
  return {
    ok: true,
    status: 200,
    service: 'hookah-baithak',
    message: 'pong — the baithak is awake',
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    time: new Date().toISOString(),
  };
}

const headers = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex',
};

export async function GET() {
  return NextResponse.json(body(), { status: 200, headers });
}

export async function POST() {
  return NextResponse.json(body(), { status: 200, headers });
}

/** cheapest possible check — no body at all */
export async function HEAD() {
  return new Response(null, { status: 200, headers });
}

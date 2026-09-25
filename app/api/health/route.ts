import { NextResponse } from 'next/server';

/** Alias of /api/ping, for uptime monitors that expect /api/health. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    { ok: true, status: 200, service: 'hookah-baithak', time: new Date().toISOString() },
    { status: 200, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  );
}

export async function HEAD() {
  return new Response(null, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}

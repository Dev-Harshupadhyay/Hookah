/**
 * The canonical origin for metadata, sitemap and robots.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL      — set this to your real domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL / VERCEL_URL — automatic on Vercel
 *   3. localhost fallback        — so builds never crash
 *
 * Empty strings are treated as "not set" (Vercel happily injects empty env
 * vars, which used to blow up `new URL('')` during the build).
 */
const clean = (v?: string | null) => {
  const s = (v ?? '').trim();
  if (!s) return '';
  const withProto = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    return new URL(withProto).origin;
  } catch {
    return '';
  }
};

export const SITE_URL =
  clean(process.env.NEXT_PUBLIC_SITE_URL) ||
  clean(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  clean(process.env.VERCEL_URL) ||
  'http://localhost:3000';

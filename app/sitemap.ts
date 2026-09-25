import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { HOOKAHS } from '@/lib/hookahs';



export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/hookahs', '/flavours', '/history', '/privacy'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p === '' ? 1 : 0.8,
  }));
  const hookahs = HOOKAHS.map((h) => ({
    url: `${SITE_URL}/hookahs/${h.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));
  return [...routes, ...hookahs];
}

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hookah Baithak — the online hookah lounge',
    short_name: 'Hookah Baithak',
    description:
      'A camera-based virtual hookah lounge with real hand tracking. 12 Indian hookahs, 20 desi flavours, no tobacco.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0a08',
    theme_color: '#15130f',
    categories: ['entertainment', 'games'],
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}

import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hookah-baithak.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hookah Baithak — smoke a virtual hookah with your hands',
    template: '%s · Hookah Baithak',
  },
  description:
    'A camera-based virtual hookah lounge. Pick up the pipe with your real hand, breathe in, blow clouds out — 12 Indian hookahs, 20 desi flavours, zero tobacco and zero nicotine.',
  keywords: [
    'virtual hookah',
    'online hookah',
    'hookah simulator',
    'shisha online',
    'hand tracking game',
    'MediaPipe hand tracking',
    'Indian hookah',
    'desi hookah',
    'Haryanvi hookah',
    'Koyilandy hookah',
    'hookah flavours India',
    'hookah baithak',
  ],
  authors: [{ name: 'Hookah Baithak' }],
  creator: 'Hookah Baithak',
  applicationName: 'Hookah Baithak',
  category: 'entertainment',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Hookah Baithak',
    title: 'Hookah Baithak — smoke a virtual hookah with your hands',
    description:
      'Turn on your camera, close your hand around the pipe, breathe in. 12 Indian hookahs, 20 desi flavours. No tobacco, no nicotine, nothing recorded.',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hookah Baithak — smoke a virtual hookah with your hands',
    description:
      'A camera-based hookah lounge in your browser. 12 Indian hookahs, 20 desi flavours, real hand tracking.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: { rating: 'adult' },
};

export const viewport: Viewport = {
  themeColor: '#15130f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: 'Hookah Baithak',
      inLanguage: 'en-IN',
      description:
        'A camera-based virtual hookah lounge with real hand tracking, 12 Indian hookahs and 20 desi flavours. No tobacco, no nicotine.',
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}#app`,
      name: 'Hookah Baithak',
      url: SITE_URL,
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any browser with a camera',
      browserRequirements: 'Requires WebGL and camera access',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      featureList: [
        'MediaPipe hand tracking',
        'On-device face detection',
        '12 Indian hookah models',
        '20 desi flavours with blending',
      ],
      isFamilyFriendly: false,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="site">
          <SiteNav />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

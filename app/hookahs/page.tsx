import type { Metadata } from 'next';
import Link from 'next/link';
import HookahArt from '@/components/HookahArt';
import LoungeLauncher from '@/components/LoungeLauncher';
import { HOOKAHS } from '@/lib/hookahs';

export const metadata: Metadata = {
  title: 'The rack — 12 Indian hookahs, from the Haryanvi chaupal to Bidri',
  description:
    'A guide to twelve hookahs you can pick up in Hookah Baithak: Haryanvi desi, Koyilandy Malabar, Bidri, Kashmiri jajeer, Mughal jade, Rajasthani kali, sheesham hookti and modern lounge glass.',
  alternates: { canonical: '/hookahs' },
  openGraph: {
    title: 'The rack — 12 Indian hookahs',
    description:
      'Haryanvi desi, Koyilandy Malabar, Bidri, Kashmiri jajeer, Mughal jade and more — every piece in the Hookah Baithak collection.',
    url: '/hookahs',
  },
};

const GROUPS: { key: string; title: string; note: string }[] = [
  { key: 'heritage', title: 'Heritage pieces', note: 'Still made, still smoked, region by region.' },
  { key: 'museum', title: 'Museum pieces', note: 'Objects that ended up behind glass.' },
  { key: 'house', title: 'House pieces', note: 'What the lounge hands you by default.' },
  { key: 'modern', title: 'Modern glass', note: 'The contemporary café shapes.' },
];

export default function RackPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Hookah Baithak — the rack',
            numberOfItems: HOOKAHS.length,
            itemListElement: HOOKAHS.map((h, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: h.name,
              url: `/hookahs/${h.slug}`,
              description: h.tagline,
            })),
          }),
        }}
      />
      <div className="wrap page-head">
        <div className="eyebrow">The rack / {HOOKAHS.length} hookahs</div>
        <h1>
          Every hookah in the <em>baithak.</em>
        </h1>
        <p className="lede">
          Same smoke, same flavours — a different piece to smoke them from. Eight of the twelve are
          Indian traditions with real makers behind them; the rest are the glass-and-steel shapes
          every lounge in the country settled on. Tap any one to read where it comes from.
        </p>
        <div style={{ marginTop: 20 }}>
          <LoungeLauncher label="Open the lounge" />
        </div>
      </div>

      {GROUPS.map((g) => {
        const items = HOOKAHS.filter((h) => h.rarity === g.key);
        if (!items.length) return null;
        return (
          <section className="wrap" key={g.key} style={{ padding: '18px 0 34px' }}>
            <div className="eyebrow">{g.note}</div>
            <h2 style={{ fontSize: 'clamp(22px,3.4vw,32px)', margin: '8px 0 18px' }}>{g.title}</h2>
            <div className="grid">
              {items.map((h) => (
                <Link key={h.slug} href={`/hookahs/${h.slug}`} className="tile">
                  <span className="tile-art">
                    <HookahArt hookah={h} waterColor="#6b74c9" glowColor="#aab2ee" />
                  </span>
                  <span className="tile-meta">
                    <strong>{h.name}</strong>
                    <small>{h.blurb}</small>
                    <small style={{ marginTop: 6, color: 'var(--gold)' }}>{h.region}</small>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

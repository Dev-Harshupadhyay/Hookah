import type { Metadata } from 'next';
import LoungeLauncher from '@/components/LoungeLauncher';
import { FLAVOURS } from '@/lib/flavours';

export const metadata: Metadata = {
  title: 'The flavour menu — 20 desi hookah flavours',
  description:
    'Rooh Afza, kesar elaichi, paan nights, chai sutta, kala khatta, thandai and more — the twenty-flavour menu of Hookah Baithak, blendable two at a time. Simulation only: no tobacco, no nicotine.',
  alternates: { canonical: '/flavours' },
  openGraph: {
    title: 'The flavour menu — 20 desi hookah flavours',
    description: 'Twenty Indian flavours, blend any two and set the balance.',
    url: '/flavours',
  },
};

const FAMILIES: { key: string; title: string; note: string }[] = [
  { key: 'house', title: 'House', note: 'What you get if you say “kuch bhi”.' },
  { key: 'desi', title: 'Desi counter', note: 'Paan shop, thela, gola cart.' },
  { key: 'mithai', title: 'Mithai', note: 'Sweet-shop heavy, dessert clouds.' },
  { key: 'fruit', title: 'Fruit', note: 'Orchard and juice-stall sweetness.' },
  { key: 'ice', title: 'Ice', note: 'Menthol finishes for hot nights.' },
  { key: 'floral', title: 'Floral', note: 'Rose, khus, gentle all session.' },
];

export default function FlavoursPage() {
  return (
    <>
      <div className="wrap page-head">
        <div className="eyebrow">The house collection / {FLAVOURS.length} flavours</div>
        <h1>
          Pick your <em>atmosphere.</em>
        </h1>
        <p className="lede">
          Every flavour here is an imaginary one — the site has nothing to burn. What it does have
          is colour: the mix you choose tints the water in the jar and the cloud that leaves your
          face. Pick one to keep it classic, pick two and slide the balance to make it yours.
        </p>
        <div style={{ marginTop: 20 }}>
          <LoungeLauncher label="Mix one now" />
        </div>
      </div>

      {FAMILIES.map((fam) => {
        const items = FLAVOURS.filter((f) => f.family === fam.key);
        if (!items.length) return null;
        return (
          <section className="wrap" key={fam.key} style={{ padding: '10px 0 32px' }}>
            <div className="eyebrow">{fam.note}</div>
            <h2 style={{ fontSize: 'clamp(22px,3.4vw,32px)', margin: '8px 0 18px' }}>{fam.title}</h2>
            <div className="grid">
              {items.map((f) => (
                <article key={f.slug} className="tile" style={{ cursor: 'default' }}>
                  <div
                    className="tile-art"
                    style={{
                      background: `radial-gradient(90% 80% at 50% 15%, ${f.glow} 0%, ${f.color} 65%, #14120f 130%)`,
                      aspectRatio: '16/9',
                    }}
                  />
                  <div className="tile-meta">
                    <strong>{f.name}</strong>
                    <small>{f.note}</small>
                    <small style={{ marginTop: 8, color: 'var(--ink-soft)' }}>{f.about}</small>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="wrap prose" style={{ paddingBottom: 20 }}>
        <h2>How blending works</h2>
        <p>
          Choose a second flavour and a balance slider appears. At 50/50 the two colours meet in
          the middle; push it to 80/20 and the dominant one takes over the water, the bubbles and
          the exhale. The blend is stored in the page URL, so the share button hands someone the
          exact mix — hookah, flavours and ratio — in one link.
        </p>
      </section>
    </>
  );
}

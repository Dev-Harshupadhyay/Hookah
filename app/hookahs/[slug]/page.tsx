import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HookahArt from '@/components/HookahArt';
import LoungeLauncher from '@/components/LoungeLauncher';
import { HOOKAHS, HOOKAH_BY_SLUG } from '@/lib/hookahs';

export function generateStaticParams() {
  return HOOKAHS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = HOOKAH_BY_SLUG[slug];
  if (!h) return {};
  const description = `${h.tagline} — ${h.region}. ${h.story[0].slice(0, 150)}…`;
  return {
    title: `${h.name} hookah — ${h.tagline}`,
    description,
    alternates: { canonical: `/hookahs/${h.slug}` },
    openGraph: { title: `${h.name} — ${h.tagline}`, description, url: `/hookahs/${h.slug}` },
  };
}

export default async function HookahPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = HOOKAH_BY_SLUG[slug];
  if (!h) notFound();
  const others = HOOKAHS.filter((x) => x.slug !== h.slug).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${h.name} — ${h.tagline}`,
            about: h.name,
            articleSection: 'Indian hookah traditions',
            inLanguage: 'en-IN',
            description: h.story[0],
          }),
        }}
      />
      <div className="wrap" style={{ padding: '34px 0 0' }}>
        <Link href="/hookahs" style={{ fontSize: 13, color: 'var(--muted)' }}>
          ← The rack
        </Link>
      </div>
      <div
        className="wrap"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,260px) minmax(0,1fr)',
          gap: 'clamp(20px,4vw,48px)',
          padding: '18px 0 20px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            background: 'radial-gradient(110% 80% at 50% 0%, #2a2723 0%, #121110 100%)',
            borderRadius: 'var(--radius)',
            padding: 18,
            display: 'grid',
            placeItems: 'center',
            position: 'sticky',
            top: 90,
          }}
        >
          <HookahArt
            hookah={h}
            waterColor="#6b74c9"
            glowColor="#aab2ee"
            intensity={0.5}
            className="detail-art"
          />
        </div>

        <div className="prose">
          <div className="eyebrow">{h.era}</div>
          <h1 style={{ fontSize: 'clamp(34px,6vw,58px)', lineHeight: 1.03, margin: '10px 0 8px' }}>
            {h.name}
          </h1>
          <p className="lede" style={{ marginTop: 0 }}>
            {h.tagline} · {h.region}
          </p>
          <ul className="facts">
            {h.facts.map((f) => (
              <li key={f.label}>
                <b>{f.label}</b>
                {f.value}
              </li>
            ))}
            <li>
              <b>Material</b>
              {h.material}
            </li>
          </ul>
          {h.story.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div style={{ marginTop: 26 }}>
            <LoungeLauncher label={`Smoke the ${h.name}`} />
          </div>
        </div>
      </div>

      <section className="wrap" style={{ padding: '30px 0 10px' }}>
        <div className="eyebrow">Also on the rack</div>
        <div className="grid" style={{ marginTop: 14 }}>
          {others.map((o) => (
            <Link key={o.slug} href={`/hookahs/${o.slug}`} className="tile">
              <span className="tile-art">
                <HookahArt hookah={o} waterColor="#6b74c9" glowColor="#aab2ee" />
              </span>
              <span className="tile-meta">
                <strong>{o.name}</strong>
                <small>{o.blurb}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import LoungeLauncher from '@/components/LoungeLauncher';
import HookahArt from '@/components/HookahArt';
import { HOOKAHS } from '@/lib/hookahs';
import { FLAVOURS } from '@/lib/flavours';

export const metadata: Metadata = {
  title: 'Hookah Baithak — smoke a virtual hookah with your hands',
  description:
    'Open your camera, close your hand around the pipe, breathe in and blow the clouds out. A virtual hookah lounge with real MediaPipe hand tracking, 12 Indian hookahs and 20 desi flavours. No tobacco, no nicotine.',
  alternates: { canonical: '/' },
};

const FAQ = [
  {
    q: 'Is there any real tobacco or nicotine involved?',
    a: 'None. Hookah Baithak is a simulation — animated smoke drawn on a canvas. Nothing burns, nothing is inhaled, nothing is sold.',
  },
  {
    q: 'Why does it ask for my camera?',
    a: 'The camera feed is what lets you pick the pipe up with your actual hand. Frames are processed on your device by MediaPipe and are never uploaded, recorded or stored. You can also play in drag mode with no camera at all.',
  },
  {
    q: 'Does it work on a phone?',
    a: 'Yes. It runs in Chrome or Safari on Android and iOS, using the front camera. On a weak device the tracking runs a little slower but stays usable.',
  },
  {
    q: 'What hookahs are in the collection?',
    a: 'Twelve pieces, mostly Indian: the Haryanvi desi chaupal hookah, a Koyilandy Malabar bell-metal piece, a Bidri silver-inlay base, a Kashmiri jajeer, a Mughal jade tribute, a Rajasthani brass kali, the small sheesham hookti, plus modern lounge glass.',
  },
  {
    q: 'Who invented the hookah?',
    a: 'Hakim Abu’l-Fath Gilani, a Persian physician in Emperor Akbar’s court at Fatehpur Sikri, designed the waterpipe in 16th-century Mughal India to pass tobacco smoke through water. It spread from India to Persia and then the Ottoman world.',
  },
];

export default function Home() {
  return (
    <>
      {/* first visit: what this is → 18+ → camera → hookah, no clicks needed */}
      <LoungeLauncher autoOpen />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* ── hero ─────────────────────────────────────────── */}
      <section
        style={{
          background: 'radial-gradient(90% 80% at 15% 0%, #241f19 0%, #131210 55%, #0b0a08 100%)',
          color: 'var(--cream)',
          padding: '70px 0 0',
          overflow: 'hidden',
        }}
      >
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow" style={{ color: 'rgba(251,246,228,.55)' }}>
              The online hookah lounge · 18+
            </div>
            <h1
              style={{
                fontSize: 'clamp(42px, 8vw, 92px)',
                lineHeight: 0.98,
                margin: '16px 0 18px',
              }}
            >
              Smoke a hookah
              <br />
              with your <em>hands.</em>
            </h1>
            <p
              className="lede"
              style={{ color: 'rgba(251,246,228,.72)', maxWidth: '46ch' }}
            >
              Turn on your camera and the pipe becomes real enough. Close your fist around it,
              bring it to your mouth, hold — then take it away and watch the cloud leave your
              face. Twelve Indian hookahs, twenty desi flavours, and not a single gram of tobacco.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 26, flexWrap: 'wrap' }}>
              <LoungeLauncher label="Enter the baithak" variant="plain" />
              <Link className="btn ghost" href="/hookahs">
                See the rack
              </Link>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(251,246,228,.45)', marginTop: 18 }}>
              Camera stays on your device · works without a camera too · free, no sign-up
            </p>
          </div>

          <div className="hero-art-wrap">
            <HookahArt
              hookah={HOOKAHS[0]}
              waterColor="#6b74c9"
              glowColor="#aab2ee"
              intensity={0.6}
              className="hero-art"
            />
          </div>
        </div>
      </section>

      {/* ── how ──────────────────────────────────────────── */}
      <section className="wrap" style={{ padding: '64px 0 10px' }}>
        <div className="eyebrow">How it works</div>
        <h2 style={{ fontSize: 'clamp(28px,4.4vw,44px)', margin: '12px 0 26px' }}>
          Three moves. No buttons, no controller, <em>just your hand.</em>
        </h2>
        <div className="grid">
          {[
            {
              n: '01',
              t: 'Pick it up',
              d: 'Google MediaPipe reads 21 landmarks on your hand, 30+ times a second. Close your fist around the mouthpiece and it sticks to your grip.',
            },
            {
              n: '02',
              t: 'Breathe in',
              d: 'A BlazeFace pass finds your mouth. Hold the pipe there and the coals glow, the water bubbles, the charge builds.',
            },
            {
              n: '03',
              t: 'Let it out',
              d: 'Move the pipe away and the cloud rolls out of your face in the colour of whatever flavour you poured in.',
            },
          ].map((s) => (
            <div key={s.n} className="card" style={{ padding: '20px 20px 24px' }}>
              <div className="eyebrow">{s.n}</div>
              <h3 style={{ margin: '8px 0 8px', fontSize: 22 }}>{s.t}</h3>
              <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.65, fontSize: 15 }}>
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── rack ─────────────────────────────────────────── */}
      <section className="wrap" style={{ padding: '58px 0 10px' }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 16 }}
        >
          <div>
            <div className="eyebrow">The rack / {HOOKAHS.length} hookahs</div>
            <h2 style={{ fontSize: 'clamp(28px,4.4vw,44px)', margin: '12px 0 8px' }}>
              Every hookah India <em>actually smokes.</em>
            </h2>
            <p className="lede" style={{ fontSize: 16 }}>
              Not a skin pack. Each piece is drawn from a real tradition — the wood and brass of a
              Haryanvi chaupal, the hammered bell metal of Koyilandy, silver wire on blackened
              Bidri zinc, and the glass-and-steel of a modern Delhi lounge.
            </p>
          </div>
          <Link className="btn" href="/hookahs">
            All twelve
          </Link>
        </div>
        <div className="grid" style={{ marginTop: 24 }}>
          {HOOKAHS.slice(0, 8).map((h) => (
            <Link key={h.slug} href={`/hookahs/${h.slug}`} className="tile">
              <span className="tile-art">
                <HookahArt hookah={h} waterColor="#6b74c9" glowColor="#aab2ee" />
              </span>
              <span className="tile-meta">
                <strong>{h.name}</strong>
                <small>{h.blurb}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── flavours ─────────────────────────────────────── */}
      <section className="wrap" style={{ padding: '58px 0 10px' }}>
        <div className="eyebrow">The house collection / {FLAVOURS.length} flavours</div>
        <h2 style={{ fontSize: 'clamp(28px,4.4vw,44px)', margin: '12px 0 8px' }}>
          Rooh Afza, kesar elaichi, chai sutta, <em>kala khatta.</em>
        </h2>
        <p className="lede" style={{ fontSize: 16 }}>
          Blend any two and set the balance — the water in the jar and the colour of your cloud
          change with the mix. Then share the link so someone else can smoke the same thing.
        </p>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}
          aria-label="Flavour list"
        >
          {FLAVOURS.map((f) => (
            <span
              key={f.slug}
              className="chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink)' }}
            >
              <i
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: `linear-gradient(140deg, ${f.glow}, ${f.color})`,
                  display: 'inline-block',
                }}
              />
              {f.name}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 22 }}>
          <Link className="btn" href="/flavours">
            Read the menu
          </Link>
        </div>
      </section>

      {/* ── story ────────────────────────────────────────── */}
      <section className="wrap" style={{ padding: '58px 0 10px' }}>
        <div
          className="card"
          style={{
            padding: 'clamp(22px,4vw,44px)',
            background: 'radial-gradient(90% 120% at 100% 0%, #2a241d 0%, #14120f 70%)',
            color: 'var(--cream)',
            border: 'none',
          }}
        >
          <div className="eyebrow" style={{ color: 'rgba(251,246,228,.55)' }}>
            Where it comes from
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', margin: '12px 0 14px' }}>
            The hookah was <em>invented in India.</em>
          </h2>
          <p style={{ color: 'rgba(251,246,228,.75)', lineHeight: 1.75, maxWidth: '68ch' }}>
            Hakim Abu’l-Fath Gilani, physician at Akbar’s court in Fatehpur Sikri, worried about
            the tobacco arriving with European visitors and built a pipe that dragged the smoke
            through water first. The idea travelled to Persia, took its modern shape there, then
            reached the Ottoman world. Back home it became something else entirely: the chaupal
            circle in Haryana, where the pipe goes to the eldest first and being cut off from it —
            <em> hookah paani band</em> — is still the sharpest thing a village can say to you.
          </p>
          <div style={{ marginTop: 22 }}>
            <Link className="btn ghost" href="/history">
              Read the full history
            </Link>
          </div>
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────── */}
      <section className="wrap prose" style={{ padding: '58px 0 20px' }}>
        <div className="eyebrow">Questions</div>
        <h2 style={{ marginTop: 12 }}>Everything people ask</h2>
        {FAQ.map((f) => (
          <div key={f.q} style={{ borderTop: '1px solid var(--line)', padding: '18px 0' }}>
            <h3 style={{ margin: '0 0 6px' }}>{f.q}</h3>
            <p style={{ margin: 0 }}>{f.a}</p>
          </div>
        ))}
        <div style={{ marginTop: 28 }}>
          <LoungeLauncher label="Alright, light it up" variant="primary" />
        </div>
      </section>
    </>
  );
}

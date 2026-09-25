import Link from 'next/link';

export default function SiteFooter() {
  return (
    <div className="wrap">
      <div className="warning" style={{ marginTop: 40 }}>
        <strong>18+ only.</strong> Hookah Baithak is a simulation. There is no tobacco, no nicotine,
        no smoke and nothing to inhale — only pixels. Nothing here is an invitation to smoke.
        Hookah smoke contains carbon monoxide, tar and heavy metals; a single real session can
        equal many cigarettes. <strong>Smoking is injurious to health.</strong>
      </div>
      <footer className="foot">
        <span>© {new Date().getFullYear()} Hookah Baithak · made in Delhi</span>
        <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <Link href="/hookahs">The rack</Link>
          <Link href="/flavours">Flavours</Link>
          <Link href="/history">History</Link>
          <Link href="/privacy">Camera &amp; privacy</Link>
        </span>
      </footer>
    </div>
  );
}

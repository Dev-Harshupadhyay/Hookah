import Link from 'next/link';

export default function SiteNav() {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link href="/" className="brand">
          Hookah <span>Baithak</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link href="/hookahs">The rack</Link>
          <Link href="/flavours">Flavours</Link>
          <Link href="/history" className="hide-sm">
            History
          </Link>
          <Link href="/privacy" className="hide-sm">
            Camera &amp; privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}

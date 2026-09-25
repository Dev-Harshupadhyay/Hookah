/**
 * Support Dev Harsh — the one place that knows anything about the developer,
 * his UPI handle and the deep link format.
 *
 * Nothing here talks to a server. A UPI deep link is just a URL the phone hands
 * to whichever UPI app is installed (GPay, PhonePe, Paytm, BHIM, Amazon Pay…),
 * with the payee and the amount pre-filled. This site never sees, processes or
 * stores a payment — only the user's own UPI app can confirm one.
 */

export const DEV = {
  name: 'Harsh Dev',
  handle: 'Dev Harsh',
  role: 'Creator / Developer / Builder',
  focus: 'Web Development, UI/UX, Music Projects',
  upi: 'pmharsh@fam',
  blurb:
    'Hookah Baithak is built and maintained by one person. If the baithak made you smile, a chai-sized tip keeps it online.',
  links: [
    { label: 'Portfolio', href: 'https://new-profotilo-flame.vercel.app/' },
    { label: 'Nostalgic Music Player', href: 'https://nostalgic-xwa6.onrender.com/' },
    { label: 'Timepass Premium', href: 'https://timepass-premium.vercel.app/' },
  ],
} as const;

export const AMOUNTS = [25, 50, 100] as const;
export const DEFAULT_AMOUNT = 25;

/** What the payer sees in their UPI app. Kept ASCII — some apps mangle emoji. */
const NOTE = 'Support Dev Harsh - Hookah Baithak';

/**
 * Build the UPI deep link.
 *
 *   upi://pay?pa=<vpa>&pn=<payee name>&am=<amount>&cu=INR&tn=<note>
 *
 * `pa` (payee address) and `cu` (currency) are the only truly required fields;
 * `am` is left out entirely when the amount is 0 so the app asks for it.
 */
export function upiLink(amount: number, scheme = 'upi'): string {
  // Built by hand rather than with URLSearchParams: that encodes spaces as '+',
  // and a few UPI apps show the '+' literally in the note.
  const q = [
    `pa=${encodeURIComponent(DEV.upi)}`,
    `pn=${encodeURIComponent(DEV.name)}`,
    amount > 0 ? `am=${amount.toFixed(2)}` : '',
    'cu=INR',
    `tn=${encodeURIComponent(NOTE)}`,
  ].filter(Boolean);
  return `${scheme}://pay?${q.join('&')}`;
}

/**
 * App-specific schemes. Android/iOS both understand the plain `upi://` link and
 * show an app chooser; these are for people who want to jump straight into one.
 */
export const UPI_APPS = [
  { label: 'Any UPI app', scheme: 'upi' },
  { label: 'GPay', scheme: 'tez' },
  { label: 'PhonePe', scheme: 'phonepe' },
  { label: 'Paytm', scheme: 'paytmmp' },
] as const;

export function isLikelyMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

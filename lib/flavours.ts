export interface Flavour {
  slug: string;
  name: string;
  note: string;
  /** water / smoke colour */
  color: string;
  glow: string;
  family: 'house' | 'ice' | 'fruit' | 'mithai' | 'desi' | 'floral';
  about: string;
}

export const FLAVOURS: Flavour[] = [
  { slug: 'classic', name: 'Classic', note: 'The original house blend', color: '#6b74c9', glow: '#aab2ee', family: 'house', about: 'Plain, unhurried, slightly sweet — the blend the rest of the menu is measured against.' },
  { slug: 'mint-freeze', name: 'Mint Freeze', note: 'Cool mint · an icy finish', color: '#3fbfa6', glow: '#9df0dd', family: 'ice', about: 'Sharp mint over an ice base. Best in a glass jar so you can watch the chill roll.' },
  { slug: 'double-apple', name: 'Double Apple', note: 'Orchard apple · warm spice', color: '#c0543f', glow: '#f3a58f', family: 'fruit', about: 'The two-apple mu\'assel that built hookah culture from Cairo to Karol Bagh — apple with a dark anise backbone.' },
  { slug: 'paan-nights', name: 'Paan Nights', note: 'Green leaf · a hint of rose', color: '#4a8f52', glow: '#a9e0ad', family: 'desi', about: 'Betel leaf, gulkand and fennel. The after-dinner flavour that tastes like a Delhi paan counter at midnight.' },
  { slug: 'mango-sunset', name: 'Mango Sunset', note: 'Golden mango · mellow evenings', color: '#e0972c', glow: '#ffd489', family: 'fruit', about: 'Ripe alphonso sweetness, thick and slow. Summer terrace flavour.' },
  { slug: 'rose-velvet', name: 'Rose Velvet', note: 'Soft petals · a floral finish', color: '#d4638f', glow: '#ffb7d3', family: 'floral', about: 'Gulab water and a touch of cream. Gentle enough to run all session.' },
  { slug: 'kesar-elaichi', name: 'Kesar Elaichi', note: 'Saffron threads · cardamom warmth', color: '#d9a52b', glow: '#ffe19a', family: 'mithai', about: 'Saffron and green cardamom — the mithai-shop pairing, warm rather than sweet.' },
  { slug: 'thandai', name: 'Thandai', note: 'Milky almond · a hint of Holi', color: '#cbb894', glow: '#f2e6cd', family: 'mithai', about: 'Almond, fennel, black pepper and rose. Tastes like the week of Holi.' },
  { slug: 'rooh-afza', name: 'Rooh Afza', note: 'Rose-red syrup · summer memories', color: '#c6304f', glow: '#ff90a6', family: 'desi', about: 'The red sherbet in a bottle, turned into smoke. Rose, khus and watermelon seed.' },
  { slug: 'nimbu-pudina', name: 'Nimbu Pudina', note: 'Zesty lemon · fresh mint', color: '#8cc23f', glow: '#d6f39a', family: 'ice', about: 'Lemon soda and mint. The palate cleanser of the menu.' },
  { slug: 'chai-sutta', name: 'Chai Sutta', note: 'Cutting chai · biscuit break', color: '#a87243', glow: '#e3bd90', family: 'desi', about: 'Masala chai, condensed milk, a parle-g edge. Ordered at 2am, always.' },
  { slug: 'coconut', name: 'Coconut', note: 'Creamy coconut · coastal air', color: '#e4e0d0', glow: '#fffaf0', family: 'house', about: 'Tender coconut water and cream — a nod to the coconut-shell base the first hookahs used.' },
  { slug: 'blue-mist', name: 'Blue Mist', note: 'Cool blue · after-dark favourite', color: '#3d7fd6', glow: '#a3c9ff', family: 'ice', about: 'Blueberry and mint. The colour everyone photographs.' },
  { slug: 'gulab-jamun', name: 'Gulab Jamun', note: 'Caramel syrup · dessert clouds', color: '#8a4a2b', glow: '#d9986c', family: 'mithai', about: 'Khoya, sugar syrup and rose. Heavy, dense clouds.' },
  { slug: 'kala-khatta', name: 'Kala Khatta', note: 'Tangy purple · gola memories', color: '#6b3a8f', glow: '#bd93e0', family: 'desi', about: 'Jamun syrup, black salt, lemon. Sweet, sour and salty in the same breath.' },
  { slug: 'zafrani-paan', name: 'Zafrani Paan', note: 'Golden saffron · fragrant paan', color: '#c89a3a', glow: '#f5d68c', family: 'desi', about: 'Saffron paan masala — the celebration flavour, ordered when the table is full.' },
  { slug: 'imli-chatpata', name: 'Imli Chatpata', note: 'Tamarind · chaat masala kick', color: '#96562a', glow: '#dda06a', family: 'desi', about: 'Tamarind and chaat masala. Genuinely savoury; not for everyone.' },
  { slug: 'litchi-chill', name: 'Litchi Chill', note: 'Litchi · frost finish', color: '#e58fa0', glow: '#ffd2dc', family: 'fruit', about: 'Litchi juice over ice. Light, fast, refreshing.' },
  { slug: 'jamun-ice', name: 'Jamun Ice', note: 'Black plum · deep freeze', color: '#4b2d6b', glow: '#a184c9', family: 'ice', about: 'Jamun with a hard menthol finish. Dark purple water.' },
  { slug: 'banarasi-meetha', name: 'Banarasi Meetha', note: 'Gulkand · fennel · magahi', color: '#7d9b4c', glow: '#cbe39b', family: 'desi', about: 'Magahi paan leaf, gulkand and saunf. Ghats-at-dawn sweetness.' },
];

export const FLAVOUR_BY_SLUG = Object.fromEntries(FLAVOURS.map((f) => [f.slug, f])) as Record<
  string,
  Flavour
>;

export const getFlavour = (slug: string): Flavour => FLAVOUR_BY_SLUG[slug] ?? FLAVOURS[0];

/** Mix two hex colours, t = 0 -> a, 1 -> b */
export function mixHex(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const out = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return '#' + out.map((v) => v.toString(16).padStart(2, '0')).join('');
}

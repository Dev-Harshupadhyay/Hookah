export type BaseShape =
  | 'round'
  | 'teardrop'
  | 'squat'
  | 'pot'
  | 'coconut'
  | 'globe'
  | 'melon'
  | 'urn';

export type StemStyle = 'ribbed' | 'plain' | 'slim' | 'bound' | 'carved' | 'inlay';

export interface Hookah {
  slug: string;
  name: string;
  tagline: string;
  /** Short line used in the picker grid */
  blurb: string;
  region: string;
  era: string;
  material: string;
  rarity: 'house' | 'heritage' | 'modern' | 'museum';
  /** Long-form SEO copy */
  story: string[];
  facts: { label: string; value: string }[];
  art: {
    base: BaseShape;
    stem: StemStyle;
    tray: 'none' | 'small' | 'wide' | 'steel' | 'brass';
    colors: {
      body: string;
      bodyDark: string;
      stem: string;
      stemDark: string;
      bowl: string;
      tray: string;
      hose: string;
      accent: string;
    };
    glass?: boolean;
    hoseSide?: 'left' | 'right';
  };
}

export const HOOKAHS: Hookah[] = [
  {
    slug: 'classic',
    name: 'Classic',
    tagline: 'The house hookah',
    blurb: 'Ribbed steel stem · round glass jar',
    region: 'Every lounge in India',
    era: 'Modern café standard',
    material: 'Stainless steel · borosilicate glass',
    rarity: 'house',
    story: [
      'The Classic is the shape almost every Indian hookah lounge settled on: a round glass jar, a ribbed steel stem, a wide tray for the coals and a washable silicone hose. It is not the oldest hookah in this collection, but it is the one an entire generation of Indian cafés grew up around.',
      'Its popularity is practical. Glass shows the water and the flavour colour, steel does not corrode, and the wide tray catches the ash from three coals without a fuss. Split the session between four people and the draw still stays light.',
      'In Hookah Baithak the Classic is the default piece — balanced draw, slow bubble, and a jar that takes the colour of whatever flavour you pour into it.',
    ],
    facts: [
      { label: 'Parts', value: 'Bowl · plate · stem · jar · hose' },
      { label: 'Best for', value: 'Everyday sessions, 2–4 people' },
      { label: 'Draw', value: 'Balanced' },
    ],
    art: {
      base: 'round',
      stem: 'ribbed',
      tray: 'wide',
      glass: true,
      colors: {
        body: '#c9cff2',
        bodyDark: '#8f97cf',
        stem: '#dfe3ef',
        stemDark: '#9aa2bb',
        bowl: '#3d4670',
        tray: '#e6e9f2',
        hose: '#6b7ac4',
        accent: '#b9a06a',
      },
    },
  },
  {
    slug: 'haryanvi-desi',
    name: 'Haryanvi Desi',
    tagline: 'Panchon ka pyaala',
    blurb: 'Rohida wood + brass · no tray, bound stem',
    region: 'Haryana — Charkhi Dadri, Mahendragarh, Bhiwani',
    era: 'Village chaupal, centuries old',
    material: 'Rohida (tecomella) wood · brass · terracotta chillum',
    rarity: 'heritage',
    story: [
      'In Haryana the hookah is not furniture, it is a social contract. "Panchon ka pyaala" — the cup of five — describes the four or five men who sit around one pipe at the chaupal and talk through the village. Hand it to the eldest first; that is the whole etiquette in one gesture. To be cut off from the circle, hookah paani band, is still the sharpest social punishment the village has.',
      'The build is completely different from a café shisha. The chillum on top holds tobacco and coal and is usually terracotta, wood or metal lined with mud. The tanki at the bottom holds the water. Two wooden pipes bound together with metal wire — the necha — run into the tanki, with cloth wrapped so the chillum sits tight. A bent kulfi leads to the neh, the mouthpiece you actually draw from, and thin gajj rods brace the whole frame.',
      'Craftspeople in Badhra village prefer rohida (tecomella) wood for its moisture content, and mustard oil is rubbed over the body every fortnight as maintenance. The smoke itself is tambaku: tobacco leaf pounded with lada, molten jaggery, in a rough 1:1 ratio. More jaggery makes it meetha hookah; more leaf makes it kauda — bitter, and much harder.',
    ],
    facts: [
      { label: 'Local names', value: 'Hookah · hookhi · hookti · kali' },
      { label: 'Parts', value: 'Chillum · tanki · necha · kulfi · neh · gajj · chakri' },
      { label: 'Wood', value: 'Rohida (tecomella), sheesham' },
      { label: 'Phrase', value: 'Hookah bhaichaare ka prateek hai' },
    ],
    art: {
      base: 'pot',
      stem: 'bound',
      tray: 'none',
      colors: {
        body: '#b98a3c',
        bodyDark: '#7d5820',
        stem: '#8a5a2b',
        stemDark: '#5b3a19',
        bowl: '#7b3f24',
        tray: '#b98a3c',
        hose: '#6d4522',
        accent: '#e2bc6a',
      },
    },
  },
  {
    slug: 'koyilandy-malabar',
    name: 'Koyilandy Malabar',
    tagline: 'Beaten by the Moosharis',
    blurb: 'Bell metal · coconut-shell base',
    region: 'Koyilandy, Kozhikode — Malabar coast, Kerala',
    era: 'Exported for ~500 years',
    material: 'Copper · brass · bell metal · coconut shell',
    rarity: 'heritage',
    story: [
      'Koyilandy is a fishing town on the Malabar coast that once exported hookahs across the Arabian Sea. Yemeni merchants carried them out of the port roughly five centuries ago, and the pieces are still known worldwide as Malabar or Koyilandy hookahs.',
      'They are made by the Moosharis — metal artisans of the Vishwakarma community, named after the moosha, the mud crucible they melt metal in. The form is modelled first in wax, coated in clay, then cast and hammered. Older pieces hide a coconut shell inside the metal water base, a direct descendant of the very first waterpipes.',
      'The surface is the point: dense chased patterns over the whole body, tight enough that the metal reads as textile. Very few families in Koyilandy still do this work, which makes an original hookah hard to find even in the town that named it.',
    ],
    facts: [
      { label: 'Makers', value: 'Moosharis (Vishwakarma metal artisans)' },
      { label: 'Technique', value: 'Wax model · clay coat · cast & chase' },
      { label: 'Also called', value: 'Malabar hookah' },
      { label: 'Status', value: 'Rare — a handful of families remain' },
    ],
    art: {
      base: 'coconut',
      stem: 'carved',
      tray: 'small',
      colors: {
        body: '#a4682f',
        bodyDark: '#6b3f18',
        stem: '#c98a43',
        stemDark: '#7d4e1d',
        bowl: '#5d3a1c',
        tray: '#c98a43',
        hose: '#8c5a2a',
        accent: '#f0cd8a',
      },
    },
  },
  {
    slug: 'bidri',
    name: 'Bidri',
    tagline: 'Silver in blackened zinc',
    blurb: 'Bidar inlay · matte black body',
    region: 'Bidar, Karnataka',
    era: 'Bahmani sultanate onwards (14th c.)',
    material: 'Zinc-copper alloy · pure silver inlay',
    rarity: 'museum',
    story: [
      'Bidriware takes its name from Bidar in Karnataka, where a zinc and copper alloy is engraved, inlaid with fine silver wire, then permanently blackened with a soil paste drawn from the old fort — soil that reacts with the alloy and leaves only the silver bright.',
      'Hookah bases were among the most prized Bidri objects. A globe base gave the craftsman an uninterrupted curved field for creepers, poppy flowers and geometric jaali, and the contrast of white metal on dead-matte black is unlike any other Indian metalwork.',
      'Most surviving Bidri hookah bases now sit in museum cabinets rather than smoking rooms — which is exactly why there is a version of it here that you can actually pick up.',
    ],
    facts: [
      { label: 'Craft', value: 'GI-tagged Bidriware' },
      { label: 'Inlay', value: 'Pure silver wire (tarkashi)' },
      { label: 'Blackening', value: 'Bidar fort soil + ammonium chloride' },
      { label: 'Form', value: 'Globe base, tall slim neck' },
    ],
    art: {
      base: 'globe',
      stem: 'inlay',
      tray: 'small',
      colors: {
        body: '#22212a',
        bodyDark: '#0e0d13',
        stem: '#2c2b35',
        stemDark: '#131219',
        bowl: '#1a1920',
        tray: '#d8d6dd',
        hose: '#3a3945',
        accent: '#e8e6ee',
      },
    },
  },
  {
    slug: 'kashmiri-jajeer',
    name: 'Kashmiri Jajeer',
    tagline: 'Jajeer by the kangri',
    blurb: 'Walnut wood · copper collar',
    region: 'Kashmir valley',
    era: 'Winter tradition',
    material: 'Walnut wood · copper · clay chillum',
    rarity: 'heritage',
    story: [
      'In Kashmiri the hookah is called jajeer. It belongs to long valley winters — passed around a room with a kangri under everyone\'s pheran, usually filled with tumbak, the coarse unflavoured leaf tobacco that rural South Asia has always smoked rather than sweet mu\'assel.',
      'The body leans on the two materials Kashmir works best: carved walnut and hammered copper, with a clay chillum on top. The proportions are squat and heavy so the piece sits steady on the floor.',
      'It is the plainest hookah in this rack and the harshest in real life. Here it is only smoke-coloured pixels, and it draws cold and slow.',
    ],
    facts: [
      { label: 'Kashmiri name', value: 'Jajeer' },
      { label: 'Tobacco', value: 'Tumbak (unflavoured leaf)' },
      { label: 'Body', value: 'Carved walnut, copper collar' },
      { label: 'Company', value: 'Kangri, kahwa, winter' },
    ],
    art: {
      base: 'urn',
      stem: 'carved',
      tray: 'none',
      colors: {
        body: '#6f4726',
        bodyDark: '#432a14',
        stem: '#8a5c31',
        stemDark: '#513a19',
        bowl: '#8d4b2a',
        tray: '#b87333',
        hose: '#5c3a1d',
        accent: '#c98b4b',
      },
    },
  },
  {
    slug: 'mughal-jade',
    name: 'Mughal Jade',
    tagline: 'After Jahangir\'s hookah',
    blurb: 'Carved jade · gold leaf',
    region: 'Mughal court — Fatehpur Sikri to Delhi',
    era: '16th–17th century',
    material: 'Nephrite jade · gold · ruby settings',
    rarity: 'museum',
    story: [
      'The hookah was invented inside the Mughal court. Hakim Abu\'l-Fath Gilani, a Persian physician to Akbar at Fatehpur Sikri, was uneasy about tobacco arriving with European visitors, so he designed a system that pulled the smoke through water to "purify" it first.',
      'Once the nobility took it up, the object turned into jewellery. Jahangir\'s jade hookah — now in the National Museum, New Delhi — is the famous survivor: carved nephrite, gold mounts, gem settings, made to be looked at as much as used.',
      'This piece is a tribute, not a replica: pale green jade body, gold collars, and a bowl shaped like the lotus-bud finials of Mughal metalwork.',
    ],
    facts: [
      { label: 'Invented by', value: "Hakim Abu'l-Fath Gilani, court of Akbar" },
      { label: 'Where', value: 'Fatehpur Sikri, Mughal India' },
      { label: 'Famous piece', value: "Jahangir's jade hookah, National Museum" },
      { label: 'Spread', value: 'India → Persia → Ottoman empire' },
    ],
    art: {
      base: 'urn',
      stem: 'inlay',
      tray: 'brass',
      colors: {
        body: '#8fb79a',
        bodyDark: '#5b8468',
        stem: '#d9c07a',
        stemDark: '#a3853f',
        bowl: '#3f6b4f',
        tray: '#e0c884',
        hose: '#7a6a3c',
        accent: '#f3e2ae',
      },
    },
  },
  {
    slug: 'rajasthani-kali',
    name: 'Rajasthani Kali',
    tagline: 'The small brass kali',
    blurb: 'Solid brass · oval village body',
    region: 'Rajasthan & the Haryana border belt',
    era: 'Village standard',
    material: 'Cast brass',
    rarity: 'heritage',
    story: [
      'Rajasthan and Gujarat are where the very first recognisable hookahs appeared in the 16th century, and the state never stopped making them. The kali is the compact brass version — about eleven inches, oval bodied, sold by the same bartan workshops in Jaipur and Jodhpur that make everything else in brass.',
      'It is the personal-sized piece. One person, a small charge of tambaku, a short session. Big enough to pass, small enough to carry between rooms.',
      'Everything is the same golden metal: body, stem, bowl and mouthpiece, rubbed bright with tamarind or ash until it glows.',
    ],
    facts: [
      { label: 'Size', value: 'Roughly 11 inches' },
      { label: 'Material', value: 'Cast brass, polished' },
      { label: 'Also called', value: 'Kali · village hookah · vintage desi' },
      { label: 'Origin belt', value: 'Rajasthan / Gujarat, 16th c.' },
    ],
    art: {
      base: 'melon',
      stem: 'plain',
      tray: 'small',
      colors: {
        body: '#c9992f',
        bodyDark: '#8a6417',
        stem: '#d8ab45',
        stemDark: '#93691c',
        bowl: '#8a6417',
        tray: '#e5c46e',
        hose: '#a87c28',
        accent: '#f5dd9b',
      },
    },
  },
  {
    slug: 'sheesham-hookti',
    name: 'Sheesham Hookti',
    tagline: 'The hookhi at home',
    blurb: 'Small sheesham pipe · meethi draw',
    region: 'Haryana households',
    era: 'Quiet, indoor, generational',
    material: 'Sheesham wood · brass rings',
    rarity: 'heritage',
    story: [
      'The big hookah sits outside at the chaupal. The small one — hookhi, hookti or kali — stayed inside the house, and in Haryana it was the women\'s pipe: smoked sitting on a patadi after a meal, in their own circles, away from the public gathering.',
      'The mix leaned sweet. More lada, less leaf, a meethi hookhi, often justified as a remedy for digestion rather than a pleasure. One documented piece was carved from sheesham twenty-five years before it was recorded and smoked twice a day, every day, by the same woman.',
      'It is the quietest object in this collection and the one with the most life in it.',
    ],
    facts: [
      { label: 'Names', value: 'Hookhi · hookti · kali' },
      { label: 'Smoked by', value: 'Elderly women, indoors, in groups' },
      { label: 'Mix', value: 'Meetha — jaggery heavy' },
      { label: 'Wood', value: 'Sheesham' },
    ],
    art: {
      base: 'pot',
      stem: 'carved',
      tray: 'none',
      colors: {
        body: '#6b4226',
        bodyDark: '#3f2413',
        stem: '#7d5130',
        stemDark: '#472a15',
        bowl: '#8a4a28',
        tray: '#b8913f',
        hose: '#5a361b',
        accent: '#cfa25c',
      },
    },
  },
  {
    slug: 'crystal',
    name: 'Crystal',
    tagline: 'Clear teardrop',
    blurb: 'Glass teardrop · steel tray, marbled stem',
    region: 'Modern lounges',
    era: 'Contemporary',
    material: 'Borosilicate glass · steel',
    rarity: 'modern',
    story: [
      'A clear teardrop jar with nothing hidden: you watch the water spin, the bubbles stack and the flavour colour move. Popular in newer Indian lounges because it photographs well and washes easily.',
      'The stem is marbled resin over steel, the tray is a thin brushed disc. Draw is airy — it wakes up fast and clouds heavy.',
    ],
    facts: [
      { label: 'Jar', value: 'Teardrop borosilicate' },
      { label: 'Draw', value: 'Airy, fast' },
      { label: 'Best for', value: 'Ice and mint blends' },
    ],
    art: {
      base: 'teardrop',
      stem: 'slim',
      tray: 'steel',
      glass: true,
      colors: {
        body: '#dfe6f5',
        bodyDark: '#a7b3cf',
        stem: '#eef1f8',
        stemDark: '#a2acc4',
        bowl: '#4a5573',
        tray: '#f0f3f9',
        hose: '#8f9dc4',
        accent: '#cfd6e6',
      },
    },
  },
  {
    slug: 'crimson',
    name: 'Crimson',
    tagline: 'Modern flare',
    blurb: 'Slim stem · trumpet base',
    region: 'Design-led lounges',
    era: 'Contemporary',
    material: 'Anodised aluminium · tinted glass',
    rarity: 'modern',
    story: [
      'A single flared column: trumpet base, slim anodised stem, minimal hardware. The whole piece reads as one curve from the floor to the bowl.',
      'Narrow throat means a tighter, slower draw — it suits heavy dessert flavours that you want to sip rather than gulp.',
    ],
    facts: [
      { label: 'Silhouette', value: 'Trumpet / flare' },
      { label: 'Draw', value: 'Tight, slow' },
      { label: 'Best for', value: 'Dessert and syrup flavours' },
    ],
    art: {
      base: 'teardrop',
      stem: 'slim',
      tray: 'small',
      colors: {
        body: '#b5455c',
        bodyDark: '#7b2438',
        stem: '#c9536b',
        stemDark: '#82293c',
        bowl: '#5e1a2a',
        tray: '#d9788c',
        hose: '#8f3448',
        accent: '#f0b3c0',
      },
    },
  },
  {
    slug: 'kohl',
    name: 'Kohl',
    tagline: 'Matte black, rose gold',
    blurb: 'Blacked-out body · rose gold stem, wide tray',
    region: 'Rooftop bars',
    era: 'Contemporary',
    material: 'Matte-coated steel · rose gold plate',
    rarity: 'modern',
    story: [
      'Everything blacked out except the stem. A wide tray, three coals, and a body that disappears in low light so only the rose gold line stays visible.',
      'Heavy jar, deep water column, long bubbling note — the loudest hookah in the rack, acoustically.',
    ],
    facts: [
      { label: 'Finish', value: 'Matte black + rose gold' },
      { label: 'Tray', value: 'Wide, three-coal' },
      { label: 'Sound', value: 'Deep bubble' },
    ],
    art: {
      base: 'round',
      stem: 'ribbed',
      tray: 'wide',
      colors: {
        body: '#1f1f24',
        bodyDark: '#0b0b0e',
        stem: '#c58a6a',
        stemDark: '#8a5a41',
        bowl: '#17171b',
        tray: '#2a2a31',
        hose: '#3a3a42',
        accent: '#e0a985',
      },
    },
  },
  {
    slug: 'baithak',
    name: 'Baithak',
    tagline: 'Sit down, stay long',
    blurb: 'Squat cut crystal · jade bowl, hose on the right',
    region: 'The house floor-seat',
    era: 'Contemporary heritage mix',
    material: 'Cut glass · steel · jade-glazed bowl',
    rarity: 'house',
    story: [
      'Low, squat and wide — built for a floor seat rather than a table. Cut-crystal jar, a fluted steel stem and a deep green glazed bowl, with the hose slung to the right so the pipe passes naturally around a circle.',
      'It is the piece this site is named after. Baithak means the sitting: the room, the circle, the hours. The hookah is just the excuse.',
    ],
    facts: [
      { label: 'Stance', value: 'Squat, floor height' },
      { label: 'Bowl', value: 'Jade-glazed clay' },
      { label: 'Hose', value: 'Right side' },
    ],
    art: {
      base: 'squat',
      stem: 'ribbed',
      tray: 'wide',
      glass: true,
      colors: {
        body: '#d5dced',
        bodyDark: '#9aa5c2',
        stem: '#e8ebf3',
        stemDark: '#99a2b8',
        bowl: '#1f5c3a',
        tray: '#eef1f7',
        hose: '#7d6a4a',
        accent: '#2f7a4e',
      },
      hoseSide: 'right',
    },
  },
];

export const HOOKAH_BY_SLUG = Object.fromEntries(HOOKAHS.map((h) => [h.slug, h])) as Record<
  string,
  Hookah
>;

export const getHookah = (slug: string): Hookah => HOOKAH_BY_SLUG[slug] ?? HOOKAHS[0];

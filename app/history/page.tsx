import type { Metadata } from 'next';
import Link from 'next/link';
import LoungeLauncher from '@/components/LoungeLauncher';

export const metadata: Metadata = {
  title: 'The hookah in India — a short history',
  description:
    'The hookah was invented in Mughal India by Hakim Abu’l-Fath Gilani. From Fatehpur Sikri to the Haryanvi chaupal, Koyilandy’s Moosharis, Bidri workshops and today’s lounges — how the waterpipe became Indian.',
  alternates: { canonical: '/history' },
  openGraph: {
    title: 'The hookah in India — a short history',
    description:
      'Invented at Akbar’s court, exported from Koyilandy, and still passed around the chaupal. The Indian story of the waterpipe.',
    url: '/history',
  },
};

export default function HistoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'The hookah in India — a short history',
            inLanguage: 'en-IN',
            about: ['Hookah', 'Indian culture', 'Mughal India', 'Haryana', 'Koyilandy'],
          }),
        }}
      />
      <div className="wrap page-head">
        <div className="eyebrow">Reading room</div>
        <h1>
          The hookah is an <em>Indian invention.</em>
        </h1>
        <p className="lede">
          Everything on this site is a drawing, but the objects it draws are real. Here is where
          they come from, told in the order it happened.
        </p>
      </div>

      <div className="wrap prose" style={{ maxWidth: 760, paddingBottom: 20 }}>
        <h2>Fatehpur Sikri, late 1500s</h2>
        <p>
          Jesuit missionaries brought tobacco to Emperor Akbar’s court, and the nobility took to it
          immediately. Akbar’s physician, Hakim Abu’l-Fath Gilani — a Persian from Gilan working in
          the Mughal court — was uneasy about what the new habit was doing to people, and designed
          a device that pulled the smoke through a bowl of water before it reached the smoker.
          That water pipe is the hookah.
        </p>
        <p>
          The earliest versions used what India had lying around: a coconut shell for the base, a
          bamboo stem, whole tobacco leaf in the bowl, charcoal on top. The form travelled to
          Persia, where it was refined into the shape we recognise as <em>ghalyan</em>, then on to
          the Ottoman empire as the <em>nargile</em>. The Sanskrit-rooted word for gourd and the
          Persian word for glass both survive in the names we still use — nargile, shisha.
        </p>
        <p>
          When the court took it up it stopped being a medical idea and became jewellery. Jahangir’s
          carved jade hookah sits in the National Museum in New Delhi: nephrite, gold mounts, gem
          settings. See the{' '}
          <Link href="/hookahs/mughal-jade">Mughal Jade</Link> in the rack for the tribute version.
        </p>

        <h2>Koyilandy, and 500 years of export</h2>
        <p>
          On the Malabar coast, the small fishing town of Koyilandy in Kozhikode district became a
          hookah factory for the Indian Ocean. Yemeni merchants carried the pieces out around five
          centuries ago, and they are still known as Malabar or Koyilandy hookahs. They were made
          by the Moosharis — metalworkers of the Vishwakarma community, named after the{' '}
          <em>moosha</em>, the mud crucible used to melt the metal. A wax model is coated in clay,
          cast, then chased by hand until the whole surface carries pattern. Older bases hide a
          coconut shell inside the metal, a direct line back to the first design.
        </p>
        <p>
          Today only a handful of families still do this work. Stainless steel, aluminium and
          silicone replaced copper, brass and leather, and an original Koyilandy hookah is hard to
          find even in Koyilandy. <Link href="/hookahs/koyilandy-malabar">Read more →</Link>
        </p>

        <h2>Haryana: panchon ka pyaala</h2>
        <p>
          Nowhere did the hookah root deeper than the Haryanvi village. “Panchon ka pyaala” — the
          cup of five — is the phrase for the four or five men who sit at the chaupal around one
          pipe and talk the village through its day. The pipe goes to the eldest first. Losing
          access to it, <em>hookah paani band</em>, is a social sentence, not a figure of speech:
          you are out of the circle, and the circle is the community.
        </p>
        <p>
          The build is village engineering. A <em>chillum</em> of terracotta, wood or mud-lined
          metal holds tobacco and coal. The <em>tanki</em> at the bottom holds water, changed often
          so the taste stays clean. Two wooden pipes wired together — the <em>necha</em> — run into
          it, cloth-wrapped so the chillum sits tight; a bent <em>kulfi</em> leads to the{' '}
          <em>neh</em> you draw from, and thin <em>gajj</em> rods brace the frame. In Badhra
          village, Charkhi Dadri district, craftspeople prefer rohida (tecomella) wood, and the
          finished hookah gets a rub of mustard oil every fortnight.
        </p>
        <p>
          What burns in it is not café mu’assel. Tobacco leaf is pounded with <em>lada</em> — molten
          jaggery — usually 1:1 in a household mortar kept only for this. More jaggery makes{' '}
          <em>meetha hookah</em>; more leaf makes <em>kauda</em>, bitter and hard. Sizes have names:
          the big one is the hookah, the medium is the <em>hookti</em>, the small one the{' '}
          <em>kali</em>. The small <em>hookhi</em> stayed indoors and was the women’s pipe, smoked
          in their own circles after meals, usually meetha, often explained as a remedy rather than
          a pleasure. <Link href="/hookahs/haryanvi-desi">See the Haryanvi Desi →</Link>
        </p>

        <h2>Kashmir, Rajasthan, Bidar</h2>
        <p>
          In Kashmiri the hookah is <em>jajeer</em>, a winter object of walnut wood and copper,
          smoked with <em>tumbak</em>, the coarse unflavoured leaf that rural South Asia has always
          used. Rajasthan and Gujarat — where the first recognisable hookahs appeared in the 16th
          century — still turn out brass kalis from the same bartan workshops that make everything
          else in brass. And in Bidar, Karnataka, the hookah base became a canvas for Bidriware:
          zinc alloy engraved, inlaid with silver wire, then blackened with fort soil so only the
          silver stays bright.
        </p>

        <h2>The lounge years</h2>
        <p>
          Flavoured mu’assel and café culture turned the hookah into a nightlife object in Indian
          cities — glass jars, steel stems, washable hoses, double apple and mint on a laminated
          menu. Regulation followed: several states and cities have banned or restricted hookah
          bars, and tobacco-free “herbal” shisha filled part of the gap. The object kept moving,
          as it always has.
        </p>

        <h2>And then, this</h2>
        <p>
          Hookah Baithak is the next silly step in that line: a hookah with no water, no coal and
          no leaf, that you pick up with your hand through a camera. It exists because the ritual —
          the passing, the sitting, the slowness — was always the interesting part. The health
          damage is not. Real hookah smoke carries carbon monoxide, tar and heavy metals, and one
          session can equal a long run of cigarettes. Smoke pixels instead.
        </p>

        <div style={{ marginTop: 26 }}>
          <LoungeLauncher label="Sit down in the baithak" />
        </div>
      </div>
    </>
  );
}

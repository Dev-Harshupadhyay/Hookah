# Hookah Baithak 🪔

**A camera-based virtual hookah lounge.** Turn on your camera, close your fist around the pipe,
bring it to your mouth and hold — then take it away and watch the cloud leave your face.

Twelve hookahs drawn from real Indian traditions, twenty desi flavours you can blend two at a
time, and zero tobacco, nicotine or smoke. Everything is drawn with SVG and canvas; the tracking
runs entirely on your own device.

> 18+ · simulation only · **Smoking is injurious to health.**

---

## What makes it work

| Piece | Tech |
| --- | --- |
| Hand tracking | [MediaPipe Tasks Vision](https://ai.google.dev/edge/mediapipe) `HandLandmarker` — 21 landmarks, GPU delegate, `VIDEO` running mode |
| Mouth position | MediaPipe `FaceDetector` (BlazeFace short-range), sampled every 3rd frame |
| Grab detection | Fingertip-to-wrist spread **and** thumb/index pinch, normalised by hand span, with hysteresis so the pipe doesn't flicker |
| Hookahs | One parametric SVG component (8 jar shapes × 6 stem styles × tray/inlay/glass options) |
| Smoke | Canvas 2D particle field, additive blending, turbulence + buoyancy |
| Water | The jar takes the colour of your flavour blend, with animated bubbles while you inhale |
| Sound | A bubbling bed synthesised live with WebAudio (no audio assets) |
| Framework | Next.js 15 App Router, React 19, TypeScript, zero UI libraries |

**No frame ever leaves the browser.** There is no upload, no recording, no analytics on the video.
If the camera is refused, the whole thing falls back to drag mode with a mouse or finger.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

Requires Node 18.18+.

### Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

That URL drives canonicals, Open Graph, `sitemap.xml` and `robots.txt`.

### Self-hosting the models (optional)

By default the MediaPipe runtime comes from jsDelivr and the two models from Google's model CDN,
so the repo stays small. To serve everything yourself:

```bash
npm run vendor:models
```

then uncomment `NEXT_PUBLIC_MP_WASM`, `NEXT_PUBLIC_HAND_MODEL` and `NEXT_PUBLIC_FACE_MODEL` in
`.env.local`. Adds ~42 MB to `public/`.

## Deploy

**Vercel** (recommended): import the repo, set `NEXT_PUBLIC_SITE_URL`, deploy. Nothing else to
configure — no server state, no database.

Camera access requires **HTTPS** (or `localhost`). Inside an `<iframe>` the embed needs
`allow="camera"`, so prefer opening the site in a real tab.

## Map of the code

```
app/
  layout.tsx          fonts, global metadata, JSON-LD (WebSite + WebApplication)
  page.tsx            landing page + FAQPage schema
  hookahs/            the rack index and 12 statically generated detail pages
  flavours/           the menu, grouped by family
  history/            long-form: the hookah in India
  privacy/            exactly what happens to the camera feed
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx
components/
  Experience.tsx      the lounge: state machine, render loop, HUD, pickers
  HookahArt.tsx       parametric hookah SVG
  LoungeLauncher.tsx  age gate + portal into the fullscreen stage
lib/
  tracking.ts         MediaPipe wrapper + video→screen mapping
  smoke.ts            particle field
  hookahs.ts          the 12 pieces, with their histories
  flavours.ts         the 20 flavours + colour blending
```

## SEO

Per-route metadata and canonicals, Open Graph + Twitter cards, a generated OG image,
`WebSite` / `WebApplication` / `ItemList` / `Article` / `FAQPage` JSON-LD, a real sitemap,
semantic headings and long-form written content on every route (the hookah pages are genuine
research, not filler).

## Sources for the writing

Haryanvi hookah craft and vocabulary — DICRC, CEPT University (*Hookahs from Haryana: Panchon ka
Pyaala*) and Asia InCH. Koyilandy / Malabar hookahs and the Mooshari metalworkers — Wikipedia and
Photomail. Invention of the hookah by Hakim Abu'l-Fath Gilani at Akbar's court, and Jahangir's
jade hookah — Wikipedia, National Museum New Delhi. Kashmiri *jajeer* and *tumbak* — Wikipedia.

## Health

This is a toy. Real hookah smoke carries carbon monoxide, tar and heavy metals; the water filters
far less than people assume, and a single session can be equivalent to a long run of cigarettes.
Shared mouthpieces spread infections. Nothing here is an encouragement to smoke.

## Licence

MIT — see `LICENSE`.

'use client';

/**
 * Smoke v2 — sprite based.
 *
 * Instead of one radial gradient per particle (flat, blobby, expensive) each
 * particle draws a pre-rendered soft puff texture: a radial falloff multiplied
 * by a handful of offset lobes, so every sprite has an irregular edge. Rotate
 * them, let them grow, drift them through a cheap curl-ish noise field, and
 * a cloud reads as smoke rather than as a glowing ball.
 *
 * Exhales are *streams*, not single bursts: a jet keeps emitting for a few
 * hundred milliseconds, which is what makes it look like breath.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  grow: number;
  rot: number;
  spin: number;
  life: number;
  maxLife: number;
  alpha: number;
  seed: number;
  tint: string | null;
}

interface Jet {
  x: number;
  y: number;
  angle: number;
  spread: number;
  speed: number;
  size: number;
  alpha: number;
  grow: number;
  life: number;
  perFrame: number;
  frames: number;
  tint: string | null;
}

const SPRITE_SIZE = 192;

function buildSprite(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE_SIZE;
  const x = c.getContext('2d')!;
  const mid = SPRITE_SIZE / 2;

  // base falloff
  const g = x.createRadialGradient(mid, mid, 0, mid, mid, mid);
  g.addColorStop(0, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.38)');
  g.addColorStop(0.78, 'rgba(255,255,255,0.09)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  // irregular lobes so the edge is never a clean circle
  for (let i = 0; i < 7; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = mid * (0.18 + Math.random() * 0.36);
    const lx = mid + Math.cos(a) * d;
    const ly = mid + Math.sin(a) * d;
    const lr = mid * (0.3 + Math.random() * 0.32);
    const lg = x.createRadialGradient(lx, ly, 0, lx, ly, lr);
    lg.addColorStop(0, 'rgba(255,255,255,0.3)');
    lg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = lg;
    x.beginPath();
    x.arc(lx, ly, lr, 0, Math.PI * 2);
    x.fill();
  }
  return c;
}

export class SmokeField {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private sprites: HTMLCanvasElement[] = [];
  private parts: Particle[] = [];
  private jets: Jet[] = [];
  private raf = 0;
  private dpr = 1;
  private t = 0;
  private running = false;
  /** 0 = pure white smoke, 1 = fully flavour coloured */
  tintAmount = 0.1;
  /** flavour colour laid over the white, very lightly */
  tintColor: string | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.sprites = [buildSprite(), buildSprite(), buildSprite(), buildSprite()];
    this.resize();
  }

  resize() {
    const { canvas } = this;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor((r.width || window.innerWidth) * this.dpr));
    canvas.height = Math.max(1, Math.floor((r.height || window.innerHeight) * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /* ── emitters ─────────────────────────────────────────── */

  private spawn(j: Jet) {
    const a = j.angle + (Math.random() - 0.5) * j.spread * 2;
    const sp = j.speed * (0.5 + Math.random() * 1.1);
    this.parts.push({
      x: j.x + (Math.random() - 0.5) * j.size * 0.6,
      y: j.y + (Math.random() - 0.5) * j.size * 0.5,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      r: j.size * (0.5 + Math.random() * 0.7),
      grow: j.grow * (0.7 + Math.random() * 0.8),
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.012,
      life: 0,
      maxLife: j.life * (0.7 + Math.random() * 0.7),
      alpha: j.alpha * (0.65 + Math.random() * 0.6),
      seed: Math.random() * 1000,
      tint: j.tint,
    });
  }

  /** a breath: keeps streaming for `frames` frames instead of popping at once */
  private jet(j: Jet) {
    this.jets.push(j);
    this.ensure();
  }

  /** the big one: a cloud rolling out of an open mouth */
  mouthPuff(x: number, y: number, tint: string | null, strength = 1, hard = false) {
    const s = Math.max(0.35, Math.min(1.8, strength));
    this.jet({
      x,
      y,
      angle: -Math.PI / 2 + 0.12,
      spread: hard ? 0.5 : 0.38,
      speed: (hard ? 3.6 : 2.5) * (0.75 + s * 0.35),
      size: (hard ? 30 : 22) * (0.8 + s * 0.3),
      alpha: hard ? 0.3 : 0.24,
      grow: hard ? 1.15 : 0.9,
      life: hard ? 190 : 150,
      perFrame: hard ? 3 : 2,
      frames: Math.round((hard ? 34 : 26) * (0.6 + s * 0.5)),
      tint,
    });
    // slow trailing body so the cloud has weight behind the jet
    this.jet({
      x,
      y,
      angle: -Math.PI / 2,
      spread: 1.1,
      speed: 0.6,
      size: (hard ? 44 : 34) * (0.8 + s * 0.25),
      alpha: 0.13,
      grow: 1.3,
      life: 260,
      perFrame: 1,
      frames: Math.round((hard ? 30 : 22) * (0.6 + s * 0.5)),
      tint,
    });
  }

  /** two thin streams from the nostrils */
  noseJets(x: number, y: number, tint: string | null, strength = 1, hard = false) {
    const s = Math.max(0.3, Math.min(1.6, strength));
    const dx = hard ? 10 : 8;
    for (const side of [-1, 1]) {
      this.jet({
        x: x + side * dx,
        y,
        angle: Math.PI / 2 + side * 0.2,
        spread: 0.1,
        speed: (hard ? 3.4 : 2.6) * (0.8 + s * 0.3),
        size: hard ? 11 : 8,
        alpha: hard ? 0.26 : 0.2,
        grow: 0.55,
        life: hard ? 140 : 110,
        perFrame: 2,
        frames: Math.round((hard ? 24 : 18) * (0.6 + s * 0.5)),
        tint,
      });
    }
  }

  /**
   * A continuous breath. Call this every frame while the mouth is open:
   * `amount` (0..1) is how wide the mouth is, `power` (0..1) is how much is
   * left in the lungs. The stream thins out as the lungs empty.
   */
  breathe(
    mouth: { x: number; y: number },
    nose: { x: number; y: number } | null,
    amount: number,
    power: number,
    hard = false,
  ) {
    const a = Math.max(0, Math.min(1, amount));
    const p = Math.max(0, Math.min(1, power));
    if (a <= 0.02 || p <= 0.01) return;

    const push = (hard ? 4.2 : 3.0) * (0.35 + a * 0.75) * (0.35 + p * 0.75);
    const count = Math.max(1, Math.round((hard ? 3.4 : 2.4) * (0.35 + a) * (0.4 + p)));

    for (let i = 0; i < count; i++) {
      this.spawn({
        x: mouth.x,
        y: mouth.y + 2,
        angle: -Math.PI / 2 + 0.1 + (Math.random() - 0.5) * 0.25,
        spread: 0.22 + a * 0.3,
        speed: push,
        size: (hard ? 20 : 15) * (0.6 + a * 0.7),
        alpha: (hard ? 0.26 : 0.21) * (0.5 + p * 0.6),
        grow: hard ? 1.0 : 0.82,
        life: (hard ? 165 : 135) * (0.7 + p * 0.5),
        perFrame: 0,
        frames: 0,
        tint: this.tintColor,
      });
    }

    // body of the cloud, slow and wide, a little behind the jet
    if (Math.random() < 0.7) {
      this.spawn({
        x: mouth.x,
        y: mouth.y + 6,
        angle: -Math.PI / 2,
        spread: 1.2,
        speed: 0.55 + a * 0.5,
        size: (hard ? 34 : 26) * (0.7 + a * 0.5),
        alpha: 0.1 * (0.5 + p * 0.6),
        grow: 1.25,
        life: 230,
        perFrame: 0,
        frames: 0,
        tint: this.tintColor,
      });
    }

    // nostrils only really go when the lungs are full and the mouth is open
    if (nose && p > 0.25 && Math.random() < 0.55 + a * 0.25) {
      for (const side of [-1, 1]) {
        this.spawn({
          x: nose.x + side * (hard ? 9 : 7),
          y: nose.y + 4,
          angle: Math.PI / 2 + side * 0.18,
          spread: 0.09,
          speed: (hard ? 3.0 : 2.3) * (0.5 + p * 0.6),
          size: hard ? 9 : 7,
          alpha: (hard ? 0.2 : 0.16) * (0.5 + p * 0.5),
          grow: 0.5,
          life: hard ? 120 : 100,
          perFrame: 0,
          frames: 0,
          tint: this.tintColor,
        });
      }
    }
    this.ensure();
  }

  /** thin wisp off the coals */
  wisp(x: number, y: number, tint: string | null) {
    this.parts.push({
      x: x + (Math.random() - 0.5) * 14,
      y,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.5 - Math.random() * 0.5,
      r: 7 + Math.random() * 9,
      grow: 0.34,
      rot: Math.random() * 6.28,
      spin: (Math.random() - 0.5) * 0.01,
      life: 0,
      maxLife: 170 + Math.random() * 90,
      alpha: 0.1,
      seed: Math.random() * 1000,
      tint,
    });
    this.ensure();
  }

  private ensure() {
    if (!this.running) {
      this.running = true;
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  /* ── loop ─────────────────────────────────────────────── */

  private tick = () => {
    const { ctx, canvas } = this;
    const w = canvas.width / this.dpr;
    const h = canvas.height / this.dpr;
    this.t += 0.016;
    ctx.clearRect(0, 0, w, h);

    // streams
    for (let i = this.jets.length - 1; i >= 0; i--) {
      const j = this.jets[i];
      for (let k = 0; k < j.perFrame; k++) this.spawn(j);
      j.frames--;
      // the stream slows as the breath runs out
      j.speed *= 0.965;
      if (j.frames <= 0) this.jets.splice(i, 1);
    }

    if (this.parts.length > 1600) this.parts.splice(0, this.parts.length - 1600);

    ctx.globalCompositeOperation = 'source-over';
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.life++;
      const k = p.life / p.maxLife;
      if (k >= 1) {
        this.parts.splice(i, 1);
        continue;
      }

      // cheap curl-ish turbulence + buoyancy + drag
      const n = this.t * 0.7 + p.seed;
      p.vx += Math.sin(n + p.y * 0.01) * 0.035;
      p.vy += Math.cos(n * 0.8 + p.x * 0.011) * 0.02 - 0.012;
      p.vx *= 0.982;
      p.vy *= 0.984;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.grow;
      p.rot += p.spin;

      // fade in fast, out slow
      const fade = (k < 0.12 ? k / 0.12 : 1 - (k - 0.12) / 0.88) ** 1.25 * p.alpha;
      if (fade <= 0.002) continue;

      const sprite = this.sprites[(p.seed | 0) & 3];
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.drawImage(sprite, -p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    }

    // one cheap pass tints only the smoke that was drawn — white stays the base
    if (this.tintColor && this.tintAmount > 0 && this.parts.length) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.globalAlpha = this.tintAmount;
      ctx.fillStyle = this.tintColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    if (this.parts.length === 0 && this.jets.length === 0) {
      this.running = false;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  clear() {
    this.parts = [];
    this.jets = [];
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.parts = [];
    this.jets = [];
    this.running = false;
  }
}

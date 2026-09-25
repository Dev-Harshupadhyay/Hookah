'use client';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  grow: number;
  life: number;
  maxLife: number;
  alpha: number;
  color: string;
  drag: number;
}

export interface EmitOptions {
  x: number;
  y: number;
  color: string;
  /** particle count multiplier */
  strength?: number;
  /** cone half-angle in radians */
  spread?: number;
  /** direction in radians (0 = right, -PI/2 = up) */
  angle?: number;
  speed?: number;
  size?: number;
  alpha?: number;
  life?: number;
  grow?: number;
}

const WHITE = { r: 255, g: 255, b: 255 };

export class SmokeField {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private parts: Particle[] = [];
  private raf = 0;
  private dpr = 1;
  private t = 0;
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
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

  emit(o: EmitOptions) {
    const strength = o.strength ?? 1;
    const spread = o.spread ?? 0.75;
    const angle = o.angle ?? -Math.PI / 2;
    const speed = o.speed ?? 2.2;
    const size = o.size ?? 26;
    const alpha = o.alpha ?? 0.12;
    const life = o.life ?? 150;
    const grow = o.grow ?? 0.7;
    const n = Math.round(12 + 22 * strength);

    for (let i = 0; i < n; i++) {
      const a = angle + (Math.random() - 0.5) * spread * 2;
      const sp = speed * (0.45 + Math.random() * 1.15) * (0.7 + strength * 0.5);
      this.parts.push({
        x: o.x + (Math.random() - 0.5) * size * 1.6,
        y: o.y + (Math.random() - 0.5) * size * 1.1,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: size * (0.45 + Math.random() * 0.9) * (0.75 + strength * 0.35),
        grow: grow * (0.6 + Math.random() * 0.9),
        life: 0,
        maxLife: life * (0.7 + Math.random() * 0.8) * (0.8 + strength * 0.4),
        alpha: alpha * (0.6 + Math.random() * 0.7),
        color: o.color,
        drag: 0.975 + Math.random() * 0.016,
      });
    }
    this.ensure();
  }

  /** the big one: a cloud rolling out of an open mouth */
  mouthPuff(x: number, y: number, color: string, strength = 1, hard = false) {
    this.emit({
      x,
      y,
      color,
      strength: strength * (hard ? 1.7 : 1),
      spread: hard ? 0.95 : 0.7,
      angle: -Math.PI / 2 + 0.15,
      speed: hard ? 3.4 : 2.2,
      size: hard ? 40 : 28,
      alpha: hard ? 0.3 : 0.22,
      life: hard ? 210 : 160,
      grow: hard ? 1.05 : 0.75,
    });
    // a slow inner core so the cloud has body
    this.emit({
      x,
      y,
      color,
      strength: strength * 0.5,
      spread: 1.5,
      angle: -Math.PI / 2,
      speed: 0.7,
      size: hard ? 52 : 38,
      alpha: 0.14,
      life: 260,
      grow: 1.2,
    });
  }

  /** two thin streams from the nostrils */
  noseJets(x: number, y: number, color: string, strength = 1, hard = false) {
    const dx = hard ? 9 : 7;
    for (const s of [-1, 1]) {
      this.emit({
        x: x + s * dx,
        y,
        color,
        strength: strength * (hard ? 0.55 : 0.38),
        spread: 0.16,
        angle: Math.PI / 2 + s * 0.24, // downward, splayed
        speed: hard ? 3.2 : 2.3,
        size: hard ? 15 : 11,
        alpha: hard ? 0.26 : 0.2,
        life: hard ? 150 : 115,
        grow: 0.62,
      });
    }
  }

  /** thin wisp off the coals */
  wisp(x: number, y: number, color: string) {
    this.parts.push({
      x: x + (Math.random() - 0.5) * 12,
      y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.45 - Math.random() * 0.5,
      r: 6 + Math.random() * 10,
      grow: 0.3,
      life: 0,
      maxLife: 150 + Math.random() * 80,
      alpha: 0.07 + Math.random() * 0.05,
      color,
      drag: 0.99,
    });
    this.ensure();
  }

  private ensure() {
    if (!this.running) {
      this.running = true;
      this.raf = requestAnimationFrame(this.tick);
    }
  }

  private tick = () => {
    const { ctx, canvas } = this;
    const w = canvas.width / this.dpr;
    const h = canvas.height / this.dpr;
    this.t += 0.016;
    ctx.clearRect(0, 0, w, h);

    if (this.parts.length > 1400) this.parts.splice(0, this.parts.length - 1400);

    ctx.globalCompositeOperation = 'source-over';
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.life++;
      const k = p.life / p.maxLife;
      if (k >= 1) {
        this.parts.splice(i, 1);
        continue;
      }
      p.vx += Math.sin(this.t * 1.2 + p.y * 0.012) * 0.02;
      p.vy -= 0.008; // buoyancy
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.grow;

      const fade = Math.sin(Math.min(1, k) * Math.PI) ** 0.75 * p.alpha;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grd.addColorStop(0, tint(p.color, fade, 0.65));
      grd.addColorStop(0.4, tint(p.color, fade * 0.5, 0.45));
      grd.addColorStop(1, tint(p.color, 0, 0));
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    if (this.parts.length === 0) {
      this.running = false;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  clear() {
    this.parts = [];
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.parts = [];
    this.running = false;
  }
}

/** flavour colour pushed towards white so it reads as smoke, not paint */
function tint(hex: string, a: number, white: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number, w: number) => Math.round(c + (w - c) * white);
  return `rgba(${mix(r, WHITE.r)},${mix(g, WHITE.g)},${mix(b, WHITE.b)},${a.toFixed(3)})`;
}

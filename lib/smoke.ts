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
  spin: number;
}

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
    canvas.width = Math.floor(r.width * this.dpr);
    canvas.height = Math.floor(r.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /** big exhale from the mouth */
  puff(x: number, y: number, color: string, strength = 1, dir = -1) {
    const n = Math.round(16 + 26 * strength);
    for (let i = 0; i < n; i++) {
      const a = (Math.random() - 0.5) * 0.9;
      const speed = (0.7 + Math.random() * 2.2) * (0.6 + strength);
      this.parts.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.sin(a) * speed * 2.1 * dir * -1,
        vy: -Math.abs(Math.cos(a)) * speed * 0.55 - 0.25,
        r: 12 + Math.random() * 26 * (0.6 + strength),
        grow: 0.45 + Math.random() * 0.75,
        life: 0,
        maxLife: 120 + Math.random() * 120 * strength,
        alpha: 0.1 + Math.random() * 0.16 * (0.5 + strength),
        color,
        spin: (Math.random() - 0.5) * 0.02,
      });
    }
    this.ensure();
  }

  /** thin wisp off the coals */
  wisp(x: number, y: number, color: string) {
    this.parts.push({
      x: x + (Math.random() - 0.5) * 10,
      y,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.35 - Math.random() * 0.4,
      r: 5 + Math.random() * 8,
      grow: 0.24,
      life: 0,
      maxLife: 130 + Math.random() * 70,
      alpha: 0.05 + Math.random() * 0.05,
      color,
      spin: 0,
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

    if (this.parts.length > 900) this.parts.splice(0, this.parts.length - 900);

    ctx.globalCompositeOperation = 'lighter';
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.life++;
      const k = p.life / p.maxLife;
      if (k >= 1) {
        this.parts.splice(i, 1);
        continue;
      }
      // drift + turbulence
      p.vx += Math.sin(this.t * 1.3 + p.y * 0.01) * 0.012;
      p.vy -= 0.004;
      p.vx *= 0.985;
      p.vy *= 0.987;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.grow;

      const fade = Math.sin(Math.min(1, k) * Math.PI) * p.alpha;
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grd.addColorStop(0, hexA(p.color, fade));
      grd.addColorStop(0.45, hexA(p.color, fade * 0.45));
      grd.addColorStop(1, hexA(p.color, 0));
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

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a.toFixed(3)})`;
}

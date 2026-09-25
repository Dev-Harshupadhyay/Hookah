'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import HookahArt from './HookahArt';
import { HOOKAHS, getHookah } from '@/lib/hookahs';
import { FLAVOURS, getFlavour, mixHex } from '@/lib/flavours';
import { SmokeField } from '@/lib/smoke';
import { Tracker, videoToScreen, type TrackerStatus } from '@/lib/tracking';

type Mode = 'camera' | 'touch';

interface Live {
  held: boolean;
  docked: boolean;
  intensity: number;
  bubbling: boolean;
  charge: number;
}

const STEPS = [
  'Close your hand around the pipe to pick it up.',
  'Bring it to your mouth — it locks on. Hold and breathe in.',
  'Open your mouth and let the cloud out.',
];

export default function Experience({
  onExit,
  autoCamera = false,
}: {
  onExit: () => void;
  autoCamera?: boolean;
}) {
  const [mode, setMode] = useState<Mode>('touch');
  const [status, setStatus] = useState<TrackerStatus>('idle');
  const [statusDetail, setStatusDetail] = useState('');
  const [hookahSlug, setHookahSlug] = useState('classic');
  const [fa, setFa] = useState('classic');
  const [fb, setFb] = useState<string | null>(null);
  const [balance, setBalance] = useState(50);
  const [modal, setModal] = useState<null | 'hookah' | 'flavour' | 'menu'>(null);
  const [puffs, setPuffs] = useState(0);
  const [step, setStep] = useState(0);
  const [live, setLive] = useState<Live>({
    held: false,
    docked: false,
    intensity: 0,
    bubbling: false,
    charge: 0,
  });
  const [sound, setSound] = useState(true);
  const [hard, setHard] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const smokeCanvasRef = useRef<HTMLCanvasElement>(null);
  const portRef = useRef<SVGCircleElement | null>(null);
  const hoseRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGGElement>(null);

  const trackerRef = useRef<Tracker | null>(null);
  const smokeRef = useRef<SmokeField | null>(null);
  const audioRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null);
  const hardRef = useRef(hard);
  hardRef.current = hard;

  const hookah = getHookah(hookahSlug);
  const flavA = getFlavour(fa);
  const flavB = fb ? getFlavour(fb) : null;
  const t = flavB ? balance / 100 : 0;
  const waterColor = useMemo(
    () => (flavB ? mixHex(flavA.color, flavB.color, t) : flavA.color),
    [flavA, flavB, t],
  );
  const glowColor = useMemo(
    () => (flavB ? mixHex(flavA.glow, flavB.glow, t) : flavA.glow),
    [flavA, flavB, t],
  );
  const glowRef = useRef(glowColor);
  glowRef.current = glowColor;

  /* ── engine state, kept out of React for 60fps ──────────── */
  const eng = useRef({
    mp: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    held: false,
    docked: false,
    pointerHeld: false,
    charge: 0,
    intensity: 0,
    lastEmit: 0,
    lastSync: 0,
    noHandSince: 0,
    started: false,
    puffs: 0,
    step: 0,
    exhaleLock: 0,
  });

  /* ── share / restore state from the URL ─────────────────── */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const h = q.get('h');
    const f = q.get('f');
    const b = q.get('b');
    if (h && HOOKAHS.some((x) => x.slug === h)) setHookahSlug(h);
    if (f) {
      const [one, two] = f.split(',');
      if (FLAVOURS.some((x) => x.slug === one)) setFa(one);
      if (two && FLAVOURS.some((x) => x.slug === two)) setFb(two);
    }
    if (b) setBalance(Math.min(100, Math.max(0, Number(b) || 50)));
  }, []);

  /* ── smoke canvas ───────────────────────────────────────── */
  useEffect(() => {
    if (!mounted || !smokeCanvasRef.current) return;
    const field = new SmokeField(smokeCanvasRef.current);
    smokeRef.current = field;
    const onResize = () => field.resize();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    const id = setTimeout(onResize, 120); // after layout settles
    return () => {
      clearTimeout(id);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      field.destroy();
      smokeRef.current = null;
    };
  }, [mounted]);

  /* ── bubbling audio, synthesised ────────────────────────── */
  const bubble = useCallback(
    (on: boolean) => {
      if (!sound && !audioRef.current) return;
      if (!audioRef.current) {
        try {
          const Ctx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new Ctx();
          const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          let last = 0;
          for (let i = 0; i < data.length; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.035 * white) / 1.035;
            data[i] = last * 3.2 * (0.6 + 0.4 * Math.sin(i / 900));
          }
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 420;
          filter.Q.value = 1.4;
          const gain = ctx.createGain();
          gain.gain.value = 0;
          src.connect(filter).connect(gain).connect(ctx.destination);
          src.start();
          audioRef.current = { ctx, gain };
        } catch {
          return;
        }
      }
      const a = audioRef.current;
      if (!a) return;
      if (a.ctx.state === 'suspended') a.ctx.resume();
      a.gain.gain.setTargetAtTime(on && sound ? 0.22 : 0, a.ctx.currentTime, 0.12);
    },
    [sound],
  );

  useEffect(() => {
    if (!sound) bubble(false);
  }, [sound, bubble]);

  /* ── camera + tracking ──────────────────────────────────── */
  const startCamera = useCallback(async () => {
    if (!videoRef.current || trackerRef.current) return;
    const tr = new Tracker(videoRef.current);
    tr.onStatus = (s, d) => {
      setStatus(s);
      setStatusDetail(d ?? '');
      if (s === 'running') setMode('camera');
      if (s === 'denied' || s === 'error' || s === 'unsupported') setMode('touch');
    };
    trackerRef.current = tr;
    await tr.start();
  }, []);

  const stopCamera = useCallback(() => {
    trackerRef.current?.stop();
    trackerRef.current = null;
    setMode('touch');
    setStatus('idle');
  }, []);

  // straight into the camera prompt when we came from the age gate
  useEffect(() => {
    if (!autoCamera || !mounted) return;
    const id = setTimeout(() => void startCamera(), 350);
    return () => clearTimeout(id);
  }, [autoCamera, mounted, startCamera]);

  useEffect(() => () => trackerRef.current?.stop(), []);

  /* ── the exhale ─────────────────────────────────────────── */
  const exhale = useCallback(
    (mouth: { x: number; y: number }, nose: { x: number; y: number }, open: number, charge: number) => {
      const smoke = smokeRef.current;
      if (!smoke) return;
      const isHard = hardRef.current;
      const strength = Math.min(1.6, 0.5 + charge) * (isHard ? 1.35 : 1);
      const colour = glowRef.current;
      // mouth: wide open → a real cloud, closed → a thin escape
      smoke.mouthPuff(mouth.x, mouth.y + 4, colour, strength * (0.45 + open * 0.9), isHard);
      // nostrils always leak a little; open mouth pushes more through
      smoke.noseJets(nose.x, nose.y + 6, colour, strength * (0.5 + open * 0.6), isHard);
      eng.current.puffs += 1;
      eng.current.step = 2;
      setPuffs(eng.current.puffs);
    },
    [],
  );

  /* ── main animation loop ────────────────────────────────── */
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const stage = stageRef.current;
      const port = portRef.current;
      if (!stage || !port) return;

      const rect = stage.getBoundingClientRect();
      const pr = port.getBoundingClientRect();
      const px = pr.left - rect.left + pr.width / 2;
      const py = pr.top - rect.top + pr.height / 2;

      const e = eng.current;
      const rest = { x: px + rect.width * 0.16, y: py + rect.height * 0.14 };
      if (!e.started) {
        e.mp = { ...rest };
        e.target = { ...rest };
        e.started = true;
      }

      const tracker = trackerRef.current;
      const f = tracker?.frame;
      const video = videoRef.current;
      const camLive = tracker?.status === 'running' && !!video?.videoWidth;

      let handPt: { x: number; y: number } | null = null;
      let mouthPt: { x: number; y: number } | null = null;
      let nosePt: { x: number; y: number } | null = null;
      let grabbing = false;
      let mouthOpen = 0;
      let faceR = Math.min(rect.width, rect.height) * 0.13;

      if (camLive && f && video) {
        if (f.handPresent) {
          handPt = videoToScreen(f.hand, rect, video.videoWidth, video.videoHeight);
          grabbing = f.grabbing;
        }
        if (f.facePresent) {
          mouthPt = videoToScreen(f.mouth, rect, video.videoWidth, video.videoHeight);
          nosePt = videoToScreen(f.nose, rect, video.videoWidth, video.videoHeight);
          mouthOpen = f.mouthOpen;
          faceR = Math.max(55, f.faceScale * rect.height * 0.42);
        }
      }
      if (!mouthPt) mouthPt = { x: rect.width * 0.5, y: rect.height * 0.4 };
      if (!nosePt) nosePt = { x: mouthPt.x, y: mouthPt.y - faceR * 0.42 };

      const grabR = Math.max(80, Math.min(rect.width, rect.height) * 0.16);
      const dockR = faceR * 0.85;
      const undockR = dockR * 2.1;

      /* pick up / drop */
      if (camLive) {
        if (handPt) {
          const d = Math.hypot(handPt.x - e.mp.x, handPt.y - e.mp.y);
          if (grabbing && (e.held || d < grabR)) {
            e.held = true;
            e.target = handPt;
          } else if (!grabbing) {
            e.held = false;
          }
        } else if (!e.docked) {
          e.held = false;
        }
      } else {
        e.held = e.pointerHeld;
        if (e.pointerHeld) {
          // target already set by pointer handlers
        }
      }

      /* dock to the mouth, and stay docked until pulled away */
      const handOrTip = handPt && camLive ? handPt : e.target;
      const dTipMouth = Math.hypot(e.target.x - mouthPt.x, e.target.y - mouthPt.y);
      const dHandMouth = Math.hypot(handOrTip.x - mouthPt.x, handOrTip.y - mouthPt.y);

      // hand left the frame while docked → treat it as taking the pipe away
      if (camLive) {
        if (handPt) e.noHandSince = 0;
        else if (!e.noHandSince) e.noHandSince = now;
      }
      const handLost = camLive && !!e.noHandSince && now - e.noHandSince > 550;

      if (!e.docked && e.held && dTipMouth < dockR) {
        e.docked = true;
      } else if (e.docked && (dHandMouth > undockR || handLost || (!e.held && !camLive))) {
        e.docked = false;
        e.held = false;
        if (e.charge > 0.3 && now - e.exhaleLock > 400) {
          e.exhaleLock = now;
          exhale(mouthPt, nosePt, mouthOpen, e.charge);
        }
        e.charge = 0;
      }

      if (e.docked) {
        // pinned to the lips — small offset so the pipe touches the mouth
        e.target = { x: mouthPt.x - faceR * 0.04, y: mouthPt.y + faceR * 0.1 };
      } else if (!e.held) {
        e.target = rest;
      }

      const ease = e.docked ? 0.42 : e.held ? 0.35 : 0.1;
      e.mp.x += (e.target.x - e.mp.x) * ease;
      e.mp.y += (e.target.y - e.mp.y) * ease;

      /* inhale while docked */
      const inhaling = e.docked;
      if (inhaling) {
        e.charge = Math.min(1.8, e.charge + dt);
        e.intensity = Math.min(1, e.intensity + dt * 1.8);
        if (e.step < 1) e.step = 1;
        // an open mouth while docked also releases (mid-session puff)
        if (mouthOpen > 0.55 && e.charge > 0.5 && now - e.exhaleLock > 900) {
          e.exhaleLock = now;
          exhale(mouthPt, nosePt, mouthOpen, e.charge);
          e.charge = 0.15;
        }
      } else {
        e.intensity = Math.max(0, e.intensity - dt * 1.1);
      }

      /* coal wisps */
      if (now - e.lastEmit > (e.intensity > 0.3 ? 110 : 480)) {
        e.lastEmit = now;
        const ar = port.ownerSVGElement?.getBoundingClientRect();
        if (ar) {
          smokeRef.current?.wisp(
            ar.left - rect.left + ar.width * 0.5,
            ar.top - rect.top + ar.height * 0.12,
            glowRef.current,
          );
        }
      }

      /* draw hose + mouthpiece straight into the DOM */
      const dx = e.mp.x - px;
      const dy = e.mp.y - py;
      const dist = Math.hypot(dx, dy);
      const sag = 40 + dist * 0.28;
      const side = hookah.art.hoseSide === 'right' ? 1 : -1;
      hoseRef.current?.setAttribute(
        'd',
        `M ${px} ${py} C ${px + side * 70} ${py + sag}, ${e.mp.x - dx * 0.25} ${e.mp.y + sag * 0.9}, ${e.mp.x} ${e.mp.y}`,
      );

      const ang =
        (Math.atan2(e.mp.y - (e.mp.y + sag * 0.9), e.mp.x - (e.mp.x - dx * 0.25)) * 180) / Math.PI;
      tipRef.current?.setAttribute('transform', `translate(${e.mp.x} ${e.mp.y}) rotate(${ang})`);

      if (ringRef.current) {
        const showRing = camLive && !!handPt && !e.held && !e.docked;
        ringRef.current.setAttribute('cx', String(e.mp.x));
        ringRef.current.setAttribute('cy', String(e.mp.y));
        ringRef.current.setAttribute('r', String(grabR));
        ringRef.current.setAttribute('opacity', showRing ? '0.35' : '0');
      }
      if (handRef.current) {
        handRef.current.setAttribute(
          'transform',
          handPt ? `translate(${handPt.x} ${handPt.y})` : 'translate(-999 -999)',
        );
        handRef.current.setAttribute('opacity', grabbing ? '0.9' : '0.4');
      }
      if (mouthRef.current) {
        mouthRef.current.setAttribute('transform', `translate(${mouthPt.x} ${mouthPt.y})`);
        mouthRef.current.setAttribute(
          'opacity',
          e.docked ? '0.55' : e.held ? '0.45' : camLive ? '0.12' : '0.2',
        );
        const c = mouthRef.current.querySelector('circle');
        c?.setAttribute('r', String(dockR));
        const arc = mouthRef.current.querySelector('path');
        if (arc) {
          const frac = Math.min(1, e.charge / 1.4);
          const r = dockR;
          const a0 = -Math.PI / 2;
          const a1 = a0 + frac * Math.PI * 2;
          const large = frac > 0.5 ? 1 : 0;
          arc.setAttribute(
            'd',
            frac < 0.01
              ? ''
              : `M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 ${large} 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`,
          );
        }
      }

      /* throttled React sync (10fps) */
      if (now - e.lastSync > 100) {
        e.lastSync = now;
        setLive((p) => {
          const next = {
            held: e.held,
            docked: e.docked,
            intensity: Math.round(e.intensity * 10) / 10,
            bubbling: inhaling,
            charge: Math.round(e.charge * 5) / 5,
          };
          return p.held === next.held &&
            p.docked === next.docked &&
            p.intensity === next.intensity &&
            p.bubbling === next.bubbling &&
            p.charge === next.charge
            ? p
            : next;
        });
        bubble(inhaling);
        setStep(Math.floor(e.step));
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, hookah.art.hoseSide, bubble, exhale]);

  /* ── pointer fallback ───────────────────────────────────── */
  const onPointerDown = (ev: React.PointerEvent) => {
    if (mode === 'camera') return;
    const rect = stageRef.current!.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const e = eng.current;
    if (Math.hypot(x - e.mp.x, y - e.mp.y) < 130) {
      e.pointerHeld = true;
      e.target = { x, y };
      (ev.target as Element).setPointerCapture?.(ev.pointerId);
    }
  };
  const onPointerMove = (ev: React.PointerEvent) => {
    const e = eng.current;
    if (!e.pointerHeld) return;
    const rect = stageRef.current!.getBoundingClientRect();
    e.target = { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };
  const onPointerUp = () => {
    eng.current.pointerHeld = false;
  };

  const share = async () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('h', hookahSlug);
    url.searchParams.set('f', fb ? `${fa},${fb}` : fa);
    if (fb) url.searchParams.set('b', String(balance));
    const text = `My baithak: ${hookah.name} + ${flavA.name}${flavB ? ' × ' + flavB.name : ''}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Hookah Baithak', text, url: url.toString() });
      else {
        await navigator.clipboard.writeText(url.toString());
        alert('Link copied — bhej de dosto ko.');
      }
    } catch {
      /* cancelled */
    }
  };

  const statusLine =
    status === 'requesting-camera'
      ? 'Allow the camera to smoke with your hand…'
      : status === 'loading-models'
        ? 'Loading hand tracking…'
        : status === 'denied'
          ? 'Camera blocked — drag the pipe with your finger instead.'
          : status === 'unsupported'
            ? 'This browser has no camera API — drag mode on.'
            : status === 'error'
              ? statusDetail || 'Camera trouble — drag mode on.'
              : mode === 'touch'
                ? 'Drag mode — or turn the camera on.'
                : '';

  const stage = (
    <div
      className="stage"
      ref={stageRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <video ref={videoRef} playsInline muted autoPlay />
      {mode !== 'camera' && (
        <div
          className="layer"
          style={{
            background: 'radial-gradient(90% 70% at 50% 25%, #2a2620 0%, #15130f 55%, #0a0907 100%)',
          }}
        />
      )}
      <canvas ref={smokeCanvasRef} />
      <div className="vignette" />

      <div className="hookah-anchor">
        <HookahArt
          hookah={hookah}
          waterColor={waterColor}
          glowColor={glowColor}
          intensity={live.intensity}
          bubbling={live.bubbling}
          portRef={(el) => (portRef.current = el)}
        />
      </div>

      {/* hose + pipe layer */}
      <svg className="layer" aria-hidden="true">
        <path
          ref={hoseRef}
          d=""
          fill="none"
          stroke={hookah.art.colors.hose}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.95"
        />
        <circle ref={ringRef} cx="-99" cy="-99" r="80" fill="none" stroke="#fbf6e4" strokeWidth="1.5" opacity="0" />
        <g ref={mouthRef} opacity="0">
          <circle r="70" fill="none" stroke="#fbf6e4" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="" fill="none" stroke={glowColor} strokeWidth="4" strokeLinecap="round" />
        </g>
        <g ref={tipRef}>
          <rect x="-14" y="-7" width="64" height="14" rx="7" fill={hookah.art.colors.accent} />
          <rect x="-26" y="-6" width="20" height="12" rx="6" fill={hookah.art.colors.hose} />
          <rect x="34" y="-9" width="12" height="18" rx="5" fill="#f4eedb" />
        </g>
        <g ref={handRef} opacity="0">
          <circle r="16" fill="none" stroke="#fbf6e4" strokeWidth="2" />
          <circle r="3" fill="#fbf6e4" />
        </g>
      </svg>

      {/* ── HUD ───────────────────────────────────────────── */}
      <div className="hud">
        <div className="hud-row">
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="glass-card" onClick={() => setModal('hookah')}>
              <span style={{ width: 26, height: 40, display: 'grid', placeItems: 'center' }}>
                <HookahArt hookah={hookah} waterColor={waterColor} glowColor={glowColor} />
              </span>
              <span>
                <small>Pick your hookah</small>
                <b>{hookah.name}</b>
              </span>
            </button>
            <button className="glass-card" onClick={() => setModal('flavour')}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: `linear-gradient(140deg, ${glowColor}, ${waterColor})`,
                  boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
                }}
              />
              <span>
                <small>Pick your flavour</small>
                <b>
                  {flavA.name}
                  {flavB ? ` × ${flavB.name}` : ''}
                </b>
              </span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div className="step-note">
              <div className="eyebrow">Step {Math.min(3, step + 1)} of 3</div>
              <div>{STEPS[Math.min(2, step)]}</div>
              <div className="progress">
                <i style={{ width: `${((Math.min(2, step) + 1) / 3) * 100}%` }} />
              </div>
              {statusLine && <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>{statusLine}</div>}
            </div>
            <button
              className="burger"
              onClick={() => setModal('menu')}
              aria-label="Menu"
              title="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className="hud-row" style={{ alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {mode === 'camera' ? (
              <button className="btn ghost" onClick={stopCamera}>
                Camera off
              </button>
            ) : (
              <button className="btn ghost" onClick={startCamera}>
                Turn on my camera
              </button>
            )}
            <button
              className="btn ghost"
              onClick={() => setHard((h) => !h)}
              title="How heavy the clouds are"
            >
              {hard ? 'Hard kash' : 'Simple kash'}
            </button>
            <button className="btn ghost" onClick={() => setSound((s) => !s)}>
              {sound ? 'Sound on' : 'Sound off'}
            </button>
            <button className="btn ghost" onClick={share}>
              Share
            </button>
          </div>
          <div className="step-note" style={{ textAlign: 'right', fontSize: 12.5, opacity: 0.85 }}>
            <b style={{ fontSize: 22, fontFamily: 'var(--font-serif)' }}>{puffs}</b> puffs this
            session
            <div style={{ opacity: 0.7 }}>Nothing is recorded. The camera stays on your device.</div>
          </div>
        </div>
      </div>

      {/* ── hamburger menu ────────────────────────────────── */}
      {modal === 'menu' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal menu-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setModal(null)} aria-label="Close">
              ✕
            </button>
            <div className="eyebrow">Hookah Baithak</div>
            <h2>
              Explore, or <em>keep smoking.</em>
            </h2>
            <div className="menu-links">
              <button className="menu-link" onClick={() => setModal(null)}>
                <b>← Back to the hookah</b>
                <small>Carry on with your session</small>
              </button>
              <Link className="menu-link" href="/hookahs" onClick={onExit}>
                <b>The rack</b>
                <small>12 Indian hookahs and where they come from</small>
              </Link>
              <Link className="menu-link" href="/flavours" onClick={onExit}>
                <b>Flavours</b>
                <small>The 20-flavour menu, and how blending works</small>
              </Link>
              <Link className="menu-link" href="/history" onClick={onExit}>
                <b>History</b>
                <small>The hookah was invented in Mughal India</small>
              </Link>
              <Link className="menu-link" href="/privacy" onClick={onExit}>
                <b>Camera &amp; privacy</b>
                <small>Nothing leaves your device — here is the detail</small>
              </Link>
              <button className="menu-link" onClick={onExit}>
                <b>Leave the baithak</b>
                <small>Close the lounge and read the site</small>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── pickers ───────────────────────────────────────── */}
      {modal === 'hookah' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setModal(null)} aria-label="Close">
              ✕
            </button>
            <div className="eyebrow">The rack / {HOOKAHS.length} hookahs</div>
            <h2>
              Pick your <em>hookah.</em>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
              Same smoke, same flavours. A different piece to smoke them from — from a Haryanvi
              chaupal pipe to a Bidri museum base.
            </p>
            <div className="pick-grid">
              {HOOKAHS.map((h) => (
                <button
                  key={h.slug}
                  className="pick"
                  data-on={h.slug === hookahSlug ? '1' : '0'}
                  onClick={() => {
                    setHookahSlug(h.slug);
                    setModal(null);
                  }}
                >
                  <span className="swatch">
                    <HookahArt hookah={h} waterColor={waterColor} glowColor={glowColor} />
                  </span>
                  <strong>{h.name}</strong>
                  <small>{h.blurb}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {modal === 'flavour' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setModal(null)} aria-label="Close">
              ✕
            </button>
            <div className="eyebrow">The house collection / {FLAVOURS.length} flavours</div>
            <h2>
              Pick your <em>atmosphere.</em>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
              Pick one to keep it classic. Pick a second to make it yours — then set the balance.
            </p>
            <div className="pick-grid">
              {FLAVOURS.map((f) => {
                const on = f.slug === fa || f.slug === fb;
                return (
                  <button
                    key={f.slug}
                    className="pick"
                    data-on={on ? '1' : '0'}
                    onClick={() => {
                      if (f.slug === fa) {
                        if (fb) {
                          setFa(fb);
                          setFb(null);
                        }
                      } else if (f.slug === fb) {
                        setFb(null);
                      } else if (!fb && f.slug !== fa) {
                        setFb(f.slug);
                      } else {
                        setFa(f.slug);
                        setFb(null);
                      }
                    }}
                  >
                    <span
                      className="swatch"
                      style={{
                        background: `radial-gradient(90% 80% at 50% 20%, ${f.glow} 0%, ${f.color} 70%, #14120f 140%)`,
                      }}
                    />
                    <strong>{f.name}</strong>
                    <small>{f.note}</small>
                  </button>
                );
              })}
            </div>
            {flavB && (
              <div style={{ marginTop: 18 }}>
                <div className="eyebrow">
                  Make it your balance — {balance} / {100 - balance}
                </div>
                <input
                  className="slider"
                  type="range"
                  min={0}
                  max={100}
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  aria-label="Flavour balance"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span>{flavA.name}</span>
                  <span>{flavB.name}</span>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <button
                className="btn"
                onClick={() => {
                  const pool = FLAVOURS.filter((f) => f.slug !== fa);
                  const pick = pool[Math.floor(Math.random() * pool.length)];
                  const second = Math.random() > 0.45;
                  setFa(pick.slug);
                  setFb(
                    second
                      ? FLAVOURS.filter((f) => f.slug !== pick.slug)[
                          Math.floor(Math.random() * (FLAVOURS.length - 1))
                        ].slug
                      : null,
                  );
                  setBalance(30 + Math.floor(Math.random() * 40));
                }}
              >
                Surprise me ↗
              </button>
              <button className="btn primary" onClick={() => setModal(null)}>
                Light it up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return mounted ? createPortal(stage, document.body) : null;
}

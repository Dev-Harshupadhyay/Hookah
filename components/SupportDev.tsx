'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AMOUNTS, DEFAULT_AMOUNT, DEV, UPI_APPS, isLikelyMobile, upiLink } from '@/lib/support';

type Props = {
  open: boolean;
  onClose: () => void;
  /** seconds before it slips away on its own; 0 = stays until dismissed */
  autoHide?: number;
};

const SNOOZE_KEY = 'hb-support-snoozed';

/** Don't nag: once dismissed, the automatic popup stays away for a week. */
export function snoozeSupport(days = 7) {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + days * 864e5));
  } catch {
    /* private mode — fine, it just shows again next session */
  }
}

export function supportSnoozed(): boolean {
  try {
    const until = Number(localStorage.getItem(SNOOZE_KEY) || 0);
    return Number.isFinite(until) && Date.now() < until;
  } catch {
    return false;
  }
}

export default function SupportDev({ open, onClose, autoHide = 16 }: Props) {
  const [amount, setAmount] = useState<number>(DEFAULT_AMOUNT);
  const [custom, setCustom] = useState('');
  const [copied, setCopied] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const [apps, setApps] = useState(false);
  const [left, setLeft] = useState(autoHide);
  const cardRef = useRef<HTMLDivElement>(null);

  const value = custom.trim() ? Math.max(1, Math.round(Number(custom) || 0)) : amount;
  const link = upiLink(value);

  /* ── close with the exit animation ─────────────────────────────── */
  const dismiss = useCallback(
    (snooze: boolean) => {
      if (snooze) snoozeSupport();
      setLeaving(true);
      window.setTimeout(() => {
        setLeaving(false);
        onClose();
      }, 320);
    },
    [onClose],
  );

  /* ── reset + focus whenever it opens ───────────────────────────── */
  useEffect(() => {
    if (!open) return;
    setLeft(autoHide);
    setCopied(false);
    setApps(false);
    setPaused(false);
    const t = window.setTimeout(() => cardRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [open, autoHide]);

  /* ── the countdown: it fades away on its own, but never mid-tap ── */
  useEffect(() => {
    if (!open || !autoHide || paused || leaving) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 0.1) {
          window.clearInterval(id);
          dismiss(false);
          return 0;
        }
        return s - 0.1;
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [open, autoHide, paused, leaving, dismiss]);

  /* ── escape closes ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dismiss]);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DEV.upi);
    } catch {
      const el = document.createElement('textarea');
      el.value = DEV.upi;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    setCopied(true);
    setPaused(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const pay = (scheme = 'upi') => {
    setPaused(true);
    window.location.href = upiLink(value, scheme);
  };

  const pct = autoHide ? Math.max(0, Math.min(1, left / autoHide)) : 1;

  return (
    <div
      className={`sd-wrap${leaving ? ' leaving' : ''}`}
      role="dialog"
      aria-label="Support Dev Harsh"
      onMouseEnter={() => setPaused(true)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="sd-card" ref={cardRef} tabIndex={-1}>
        {/* a little smoke drifting behind the card, because of course */}
        <span className="sd-puff p1" />
        <span className="sd-puff p2" />
        <span className="sd-puff p3" />

        <button className="sd-x" onClick={() => dismiss(true)} aria-label="Close">
          ✕
        </button>

        <div className="sd-head">
          <span className="sd-avatar" aria-hidden>
            H
          </span>
          <div>
            <div className="sd-eyebrow">Creator support</div>
            <div className="sd-title">
              Support <em>Dev Harsh</em> <span className="sd-heart">❤</span>
            </div>
          </div>
        </div>

        <p className="sd-blurb">{DEV.blurb}</p>

        <div className="sd-amounts">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              className={`sd-chip${!custom.trim() && amount === a ? ' on' : ''}`}
              onClick={() => {
                setAmount(a);
                setCustom('');
                setPaused(true);
              }}
            >
              ₹{a}
            </button>
          ))}
          <input
            className="sd-custom"
            inputMode="numeric"
            placeholder="Custom"
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, '').slice(0, 5))}
            onFocus={() => setPaused(true)}
            aria-label="Custom amount in rupees"
          />
        </div>

        <div className="sd-actions">
          <button className="sd-pay" onClick={() => pay()}>
            <span className="sd-heart">❤</span> Pay ₹{value} via UPI
          </button>
          <button className="sd-ghost" onClick={() => dismiss(true)}>
            Not now
          </button>
        </div>

        <button className="sd-copy" onClick={copy}>
          {copied ? '✓ UPI ID copied' : `Copy UPI ID · ${DEV.upi}`}
        </button>

        {!isLikelyMobile() && (
          <button className="sd-more" onClick={() => setApps((v) => !v)}>
            {apps ? 'Hide apps' : 'Open a specific app'}
          </button>
        )}
        {apps && (
          <div className="sd-apps">
            {UPI_APPS.map((a) => (
              <button key={a.scheme} className="sd-chip" onClick={() => pay(a.scheme)}>
                {a.label}
              </button>
            ))}
          </div>
        )}

        <p className="sd-fine">
          Tapping pay just opens your own UPI app with the amount filled in. Hookah Baithak never
          sees, processes or stores a payment — only your UPI app or bank can confirm one. On a
          laptop, copy the ID and pay from your phone.
        </p>

        <div className="sd-links">
          {DEV.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label} ↗
            </a>
          ))}
        </div>

        {autoHide > 0 && (
          <div className="sd-timer" aria-hidden>
            <i style={{ transform: `scaleX(${pct})`, opacity: paused ? 0.25 : 1 }} />
          </div>
        )}
      </div>
    </div>
  );
}

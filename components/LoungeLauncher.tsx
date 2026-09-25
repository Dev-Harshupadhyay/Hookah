'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const Experience = dynamic(() => import('./Experience'), { ssr: false });

const KEY = 'hb-age-ok';

export default function LoungeLauncher({
  label = 'Enter the baithak',
  variant = 'primary',
  /** open the gate (and then the lounge) as soon as the page loads */
  autoOpen = false,
}: {
  label?: string;
  variant?: 'primary' | 'ghost' | 'plain';
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [gate, setGate] = useState(false);
  const [denied, setDenied] = useState(false);
  /** ask for the camera the moment the lounge opens */
  const [autoCamera, setAutoCamera] = useState(false);
  /** stream captured inside the click itself — browsers trust that far more */
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open || gate ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, gate]);

  const enter = useCallback((withCamera: boolean) => {
    const ok = typeof window !== 'undefined' && window.localStorage.getItem(KEY) === '1';
    setAutoCamera(withCamera);
    if (ok) setOpen(true);
    else setGate(true);
  }, []);

  // Esc closes the gate for people who only want to read
  useEffect(() => {
    if (!gate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGate(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gate]);

  // straight in on first paint: what this is → 18+ → camera → hookah
  useEffect(() => {
    if (!autoOpen) return;
    const id = setTimeout(() => enter(false), 120);
    return () => clearTimeout(id);
  }, [autoOpen, enter]);

  return (
    <>
      {!autoOpen && (
        <button
          className={`btn ${variant === 'plain' ? '' : variant}`}
          onClick={() => enter(true)}
          data-analytics="enter-lounge"
        >
          {label} ↗
        </button>
      )}

      {gate && (
        <div className="age-gate" role="dialog" aria-modal="true" aria-label="Age check">
          <div style={{ maxWidth: 660 }}>
            <div className="eyebrow" style={{ color: 'rgba(251,246,228,.55)' }}>
              Hookah Baithak · the online hookah lounge · 18+
            </div>
            {denied ? (
              <>
                <h1>
                  Come back <em>later.</em>
                </h1>
                <p>This lounge is for adults only. Nothing to see here yet.</p>
                <button
                  className="btn ghost"
                  onClick={() => {
                    setGate(false);
                    setDenied(false);
                  }}
                >
                  Back to the site
                </button>
              </>
            ) : (
              <>
                <h1>
                  Are you <em>18 or older?</em>
                </h1>
                <p>
                  This is a virtual hookah you smoke with your own hand. Say yes, allow the camera,
                  and the pipe follows your fist — bring it to your mouth, hold, then open your
                  mouth and blow the cloud out. No tobacco, no nicotine, no real smoke. Nothing is
                  recorded; the camera never leaves your device. Smoking is injurious to health.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn"
                    disabled={asking}
                    onClick={async () => {
                      window.localStorage.setItem(KEY, '1');
                      setAsking(true);
                      // the permission prompt must come straight out of this click
                      let s: MediaStream | null = null;
                      try {
                        s = await navigator.mediaDevices.getUserMedia({
                          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
                          audio: false,
                        });
                      } catch {
                        s = null;
                      }
                      setStream(s);
                      setAutoCamera(!!s);
                      setAsking(false);
                      setGate(false);
                      setOpen(true);
                    }}
                  >
                    {asking ? 'Waiting for the camera…' : 'Yes, I am 18 — allow camera & smoke'}
                  </button>
                  <button
                    className="btn ghost"
                    onClick={() => {
                      window.localStorage.setItem(KEY, '1');
                      setGate(false);
                      setAutoCamera(false);
                      setOpen(true);
                    }}
                  >
                    Yes, but without the camera
                  </button>
                  <button className="btn ghost" onClick={() => setDenied(true)}>
                    No
                  </button>
                </div>
                <p style={{ fontSize: 12.5, opacity: 0.55, marginTop: 20 }}>
                  Just browsing? Press Esc or “No” to read the site instead.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {open && (
        <Experience
          onExit={() => {
            setOpen(false);
            setStream(null);
          }}
          autoCamera={autoCamera}
          initialStream={stream}
        />
      )}
    </>
  );
}

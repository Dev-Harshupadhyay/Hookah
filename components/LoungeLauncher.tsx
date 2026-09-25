'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';

const Experience = dynamic(() => import('./Experience'), { ssr: false });

const KEY = 'hb-age-ok';

export default function LoungeLauncher({
  label = 'Enter the baithak',
  variant = 'primary',
}: {
  label?: string;
  variant?: 'primary' | 'ghost' | 'plain';
}) {
  const [open, setOpen] = useState(false);
  const [gate, setGate] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open || gate ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, gate]);

  const enter = useCallback(() => {
    const ok = typeof window !== 'undefined' && window.localStorage.getItem(KEY) === '1';
    if (ok) setOpen(true);
    else setGate(true);
  }, []);

  return (
    <>
      <button
        className={`btn ${variant === 'plain' ? '' : variant}`}
        onClick={enter}
        data-analytics="enter-lounge"
      >
        {label} ↗
      </button>

      {gate && (
        <div className="age-gate" role="dialog" aria-modal="true" aria-label="Age check">
          <div style={{ maxWidth: 640 }}>
            <div className="eyebrow" style={{ color: 'rgba(251,246,228,.55)' }}>
              Hookah Baithak · 18+
            </div>
            {denied ? (
              <>
                <h1>
                  Come back <em>later.</em>
                </h1>
                <p>This lounge is for adults only. Nothing to see here yet.</p>
                <button className="btn ghost" onClick={() => setGate(false)}>
                  Back to the site
                </button>
              </>
            ) : (
              <>
                <h1>
                  Are you <em>18 or older?</em>
                </h1>
                <p>
                  Hookah Baithak is a virtual hookah lounge that runs in your browser. No tobacco,
                  no nicotine, no real smoke — a simulation made for adults, and not an invitation
                  to smoke. Smoking is injurious to health.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn"
                    onClick={() => {
                      window.localStorage.setItem(KEY, '1');
                      setGate(false);
                      setOpen(true);
                    }}
                  >
                    Yes, I am 18 or older
                  </button>
                  <button className="btn ghost" onClick={() => setDenied(true)}>
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {open && <Experience onExit={() => setOpen(false)} />}
    </>
  );
}

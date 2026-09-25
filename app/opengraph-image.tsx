import { ImageResponse } from 'next/og';

export const alt = 'Hookah Baithak — smoke a virtual hookah with your hands';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #241f19 0%, #131210 55%, #0b0a08 100%)',
          color: '#fbf6e4',
          padding: 72,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 680 }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: 'rgba(251,246,228,.55)', display: 'flex' }}>
            THE ONLINE HOOKAH LOUNGE · 18+
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.03, marginTop: 20, display: 'flex', flexDirection: 'column' }}>
            <span>Smoke a hookah</span>
            <span>
              with your&nbsp;<span style={{ color: '#d9ad5c', fontStyle: 'italic' }}>hands.</span>
            </span>
          </div>
          <div style={{ fontSize: 26, color: 'rgba(251,246,228,.7)', marginTop: 26, display: 'flex' }}>
            Real hand tracking · 12 Indian hookahs · 20 desi flavours · no tobacco
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            right: 90,
            bottom: 0,
            width: 340,
            height: 520,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <svg width="340" height="520" viewBox="0 0 280 576">
            <ellipse cx="140" cy="528" rx="100" ry="10" fill="#000" opacity="0.4" />
            <path
              d="M140 316 C 198 316 232 360 232 418 C 232 480 194 520 140 520 C 86 520 48 480 48 418 C 48 360 82 316 140 316 Z"
              fill="#ffffff"
              fillOpacity="0.14"
              stroke="#ffffff"
              strokeOpacity="0.5"
              strokeWidth="2"
            />
            <path
              d="M48 424 L232 424 L232 470 C 232 500 190 520 140 520 C 90 520 48 500 48 470 Z"
              fill="#6b74c9"
            />
            <rect x="133" y="150" width="14" height="184" rx="7" fill="#dfe3ef" />
            <ellipse cx="140" cy="208" rx="58" ry="13" fill="#e6e9f2" />
            <path d="M114 150 L120 116 L160 116 L166 150 Z" fill="#3d4670" />
            <circle cx="131" cy="110" r="7" fill="#ff7a2f" />
            <circle cx="149" cy="110" r="7" fill="#ff7a2f" />
            <path
              d="M116 268 C 60 330 60 400 150 400"
              fill="none"
              stroke="#6b7ac4"
              strokeWidth="9"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ),
    size,
  );
}

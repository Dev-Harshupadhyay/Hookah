import type { Metadata } from 'next';
import LoungeLauncher from '@/components/LoungeLauncher';

export const metadata: Metadata = {
  title: 'Camera & privacy — nothing leaves your device',
  description:
    'How Hookah Baithak uses your camera: MediaPipe hand and face tracking runs entirely on-device, no frames are uploaded, recorded or stored, and the site works without a camera at all.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="wrap prose" style={{ maxWidth: 760, paddingBottom: 20 }}>
      <div className="page-head" style={{ paddingBottom: 10 }}>
        <div className="eyebrow">Camera &amp; privacy</div>
        <h1>
          Your face stays <em>on your phone.</em>
        </h1>
        <p className="lede">
          The whole point of this site is that it watches your hand. That makes it fair to explain
          exactly what happens to the video.
        </p>
      </div>

      <h2>What the camera is used for</h2>
      <p>
        When you tap <em>Turn on my camera</em>, the browser asks your permission and gives the page
        a live video stream. Each frame goes into two Google MediaPipe models that run inside your
        browser tab, compiled to WebAssembly and accelerated by your GPU:
      </p>
      <ul>
        <li>
          <strong>Hand Landmarker</strong> — 21 points on one hand, used to work out where the pipe
          is and whether your fist is closed.
        </li>
        <li>
          <strong>Face Detector (BlazeFace)</strong> — a handful of keypoints, used only to find
          where your mouth is so the pipe knows when it has arrived.
        </li>
      </ul>

      <h2>What leaves your device</h2>
      <p>
        Nothing. There is no server that receives video, no recording, no screenshot, no upload, no
        analytics on the frames. The stream is never written to disk. When you tap{' '}
        <em>Camera off</em> or close the tab, the track is stopped and the models are released.
      </p>
      <p>
        The only network requests the experience makes are for the model files themselves (a
        one-time download, cached by your browser) and the page assets.
      </p>

      <h2>If you would rather not</h2>
      <p>
        Then don’t. Decline the permission — or never ask for it — and the lounge falls back to
        drag mode: touch or mouse the pipe to your face and hold. Everything else, including
        flavours, blending and sharing, works the same.
      </p>

      <h2>What we do store</h2>
      <p>
        One key in your browser’s localStorage (<code>hb-age-ok</code>) to remember that you
        confirmed you are 18 or older, and whatever you put in the share link. No cookies, no
        account, no email.
      </p>

      <h2>Health</h2>
      <p>
        This is a simulation with no tobacco, nicotine or smoke, and it is not an encouragement to
        smoke. Real hookah is not a soft option: the smoke carries carbon monoxide, tar and heavy
        metals, the water filters far less than people assume, and shared mouthpieces spread
        infections. Smoking is injurious to health.
      </p>

      <div style={{ marginTop: 26 }}>
        <LoungeLauncher label="Understood, open the lounge" />
      </div>
    </div>
  );
}

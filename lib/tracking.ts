'use client';

/**
 * Hand + face tracking built on Google MediaPipe Tasks Vision.
 *
 *  · HandLandmarker  → 21 landmarks, used for grab detection + pipe position
 *  · FaceLandmarker  → 478 landmarks, used for the mouth, the nose and how
 *                      wide the mouth is open (that drives the exhale)
 *
 * Everything runs on-device in WASM/WebGL. No frame ever leaves the browser.
 */

export const MEDIAPIPE_WASM =
  process.env.NEXT_PUBLIC_MP_WASM ?? 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';

export const HAND_MODEL =
  process.env.NEXT_PUBLIC_HAND_MODEL ??
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export const FACE_MODEL =
  process.env.NEXT_PUBLIC_FACE_MODEL ??
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export interface Point {
  x: number; // normalised 0..1 in *video* space (not mirrored)
  y: number;
}

export interface TrackingFrame {
  handPresent: boolean;
  /** centre of the palm/pinch, normalised video space */
  hand: Point;
  /** 0 = wide open, 1 = fist */
  closure: number;
  grabbing: boolean;
  facePresent: boolean;
  mouth: Point;
  nose: Point;
  /** 0 = closed lips, 1 = wide open mouth */
  mouthOpen: number;
  /** face height in normalised units, used to scale distances */
  faceScale: number;
  fps: number;
}

export type TrackerStatus =
  | 'idle'
  | 'requesting-camera'
  | 'loading-models'
  | 'running'
  | 'denied'
  | 'unsupported'
  | 'error';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class Tracker {
  frame: TrackingFrame = {
    handPresent: false,
    hand: { x: 0.5, y: 0.6 },
    closure: 0,
    grabbing: false,
    facePresent: false,
    mouth: { x: 0.5, y: 0.5 },
    nose: { x: 0.5, y: 0.44 },
    mouthOpen: 0,
    faceScale: 0.3,
    fps: 0,
  };

  status: TrackerStatus = 'idle';
  onStatus?: (s: TrackerStatus, detail?: string) => void;
  detail = '';

  private video: HTMLVideoElement;
  private stream: MediaStream | null = null;
  private hand: any = null;
  private face: any = null;
  private raf = 0;
  private lastVideoTime = -1;
  private lastTs = 0;
  private stopped = false;
  private faceEvery = 0;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  private set(s: TrackerStatus, detail = '') {
    this.status = s;
    this.detail = detail;
    this.onStatus?.(s, detail);
  }

  /**
   * @param existing a MediaStream already obtained inside a user gesture.
   *        Browsers (especially mobile Safari) are far happier with that than
   *        with a getUserMedia call fired from a timer.
   */
  async start(existing?: MediaStream | null) {
    this.stopped = false;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      this.set('unsupported', 'This browser cannot open a camera.');
      return;
    }
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      this.set('error', 'Cameras only work on https:// — open the secure link.');
      return;
    }

    // 1. camera
    if (existing && existing.getVideoTracks().some((t) => t.readyState === 'live')) {
      this.stream = existing;
    } else {
      this.set('requesting-camera');
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (err: any) {
        const name = err?.name ?? '';
        this.set(
          name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error',
          name === 'NotFoundError'
            ? 'No camera found on this device.'
            : name === 'NotReadableError'
              ? 'Another app is using the camera — close it and try again.'
              : err?.message ?? 'Camera failed.',
        );
        return;
      }
    }

    this.video.srcObject = this.stream;
    this.video.muted = true;
    this.video.playsInline = true;
    await this.video.play().catch(() => {});

    // 2. models
    this.set('loading-models');
    try {
      const vision = await import('@mediapipe/tasks-vision');
      const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM);

      this.hand = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: HAND_MODEL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      this.face = await vision.FaceLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
      });
    } catch (err: any) {
      this.set('error', err?.message ?? 'Could not load the tracking models.');
      return;
    }

    if (this.stopped) return;
    this.set('running');
    this.loop();
  }

  private loop = () => {
    if (this.stopped) return;
    this.raf = requestAnimationFrame(this.loop);

    const v = this.video;
    if (!v.videoWidth || v.currentTime === this.lastVideoTime) return;
    this.lastVideoTime = v.currentTime;
    const ts = performance.now();
    const f = this.frame;

    if (this.lastTs) f.fps = lerp(f.fps, 1000 / Math.max(1, ts - this.lastTs), 0.1);
    this.lastTs = ts;

    // ── hands ────────────────────────────────────────────────
    try {
      const res = this.hand?.detectForVideo(v, ts);
      const lm = res?.landmarks?.[0];
      if (lm) {
        const wrist = lm[0];
        const mcp = lm[9];
        const tips = [lm[8], lm[12], lm[16], lm[20]];
        const thumb = lm[4];
        const index = lm[8];

        const span = Math.hypot(wrist.x - mcp.x, wrist.y - mcp.y) || 0.001;
        const avgTip =
          tips.reduce((s, t) => s + Math.hypot(t.x - wrist.x, t.y - wrist.y), 0) / tips.length;
        const openness = avgTip / span; // ~1.2 fist, ~2.4 open
        const fist = Math.min(1, Math.max(0, (2.05 - openness) / 0.75));

        const pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y) / span;
        const pinch = Math.min(1, Math.max(0, (0.95 - pinchDist) / 0.55));

        const closure = Math.max(fist, pinch);
        const cx = (thumb.x + index.x + mcp.x) / 3;
        const cy = (thumb.y + index.y + mcp.y) / 3;

        f.handPresent = true;
        f.hand.x = lerp(f.hand.x, cx, 0.45);
        f.hand.y = lerp(f.hand.y, cy, 0.45);
        f.closure = lerp(f.closure, closure, 0.4);
        f.grabbing = f.closure > (f.grabbing ? 0.38 : 0.58); // hysteresis
      } else {
        f.handPresent = false;
        f.grabbing = false;
        f.closure = lerp(f.closure, 0, 0.2);
      }
    } catch {
      /* frame skipped */
    }

    // ── face (every other frame) ─────────────────────────────
    if (this.faceEvery++ % 2 === 0) {
      try {
        const res = this.face?.detectForVideo(v, ts);
        const lm = res?.faceLandmarks?.[0];
        if (lm) {
          const upper = lm[13]; // inner top lip
          const lower = lm[14]; // inner bottom lip
          const top = lm[10]; // forehead
          const chin = lm[152];
          const noseTip = lm[1];
          const faceH = Math.hypot(top.x - chin.x, top.y - chin.y) || 0.001;
          const gap = Math.hypot(upper.x - lower.x, upper.y - lower.y) / faceH;

          f.facePresent = true;
          f.mouth.x = lerp(f.mouth.x, (upper.x + lower.x) / 2, 0.45);
          f.mouth.y = lerp(f.mouth.y, (upper.y + lower.y) / 2, 0.45);
          f.nose.x = lerp(f.nose.x, noseTip.x, 0.45);
          f.nose.y = lerp(f.nose.y, noseTip.y, 0.45);
          f.faceScale = lerp(f.faceScale, faceH, 0.2);
          // gap ≈ 0.01 closed, ≈ 0.14 wide open
          f.mouthOpen = lerp(f.mouthOpen, Math.min(1, Math.max(0, (gap - 0.025) / 0.1)), 0.5);
        } else {
          f.facePresent = false;
          f.mouthOpen = lerp(f.mouthOpen, 0, 0.3);
        }
      } catch {
        /* frame skipped */
      }
    }
  };

  stop() {
    this.stopped = true;
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    try {
      this.hand?.close();
      this.face?.close();
    } catch {
      /* noop */
    }
    this.hand = null;
    this.face = null;
    this.video.srcObject = null;
    this.set('idle');
  }
}

/**
 * Maps a normalised video point to on-screen pixels for a mirrored,
 * object-fit:cover <video> filling `rect`.
 */
export function videoToScreen(
  p: Point,
  rect: { width: number; height: number },
  videoW: number,
  videoH: number,
  mirrored = true,
): { x: number; y: number } {
  if (!videoW || !videoH) return { x: p.x * rect.width, y: p.y * rect.height };
  const scale = Math.max(rect.width / videoW, rect.height / videoH);
  const dw = videoW * scale;
  const dh = videoH * scale;
  const ox = (rect.width - dw) / 2;
  const oy = (rect.height - dh) / 2;
  const nx = mirrored ? 1 - p.x : p.x;
  return { x: ox + nx * dw, y: oy + p.y * dh };
}

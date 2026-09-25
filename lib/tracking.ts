'use client';

/**
 * Hand + face tracking built on Google MediaPipe Tasks Vision.
 *
 *  · HandLandmarker  → 21 landmarks, used for grab detection + pipe position
 *  · FaceDetector    → BlazeFace keypoints, used to find the mouth
 *
 * Everything runs on-device in a WebGL/WASM worker. No frame ever leaves the browser.
 */

export const MEDIAPIPE_WASM =
  process.env.NEXT_PUBLIC_MP_WASM ?? 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm';

export const HAND_MODEL =
  process.env.NEXT_PUBLIC_HAND_MODEL ??
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

export const FACE_MODEL =
  process.env.NEXT_PUBLIC_FACE_MODEL ??
  'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite';

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
  /** face box width, used to scale the pipe */
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
    faceScale: 0.25,
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

  async start() {
    this.stopped = false;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      this.set('unsupported', 'This browser cannot open a camera.');
      return;
    }

    // 1. camera
    this.set('requesting-camera');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
    } catch (err: any) {
      const name = err?.name ?? '';
      this.set(
        name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error',
        name === 'NotFoundError' ? 'No camera found on this device.' : err?.message ?? 'Camera failed.',
      );
      return;
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

      this.face = await vision.FaceDetector.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: FACE_MODEL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        minDetectionConfidence: 0.4,
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
        const mcp = lm[9]; // middle finger base
        const tips = [lm[8], lm[12], lm[16], lm[20]];
        const thumb = lm[4];
        const index = lm[8];

        // hand size used to normalise distances
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
        f.grabbing = f.closure > (f.grabbing ? 0.4 : 0.6); // hysteresis
      } else {
        f.handPresent = false;
        f.grabbing = false;
        f.closure = lerp(f.closure, 0, 0.2);
      }
    } catch {
      /* frame skipped */
    }

    // ── face (every 3rd frame is plenty) ─────────────────────
    if (this.faceEvery++ % 3 === 0) {
      try {
        const res = this.face?.detectForVideo(v, ts);
        const det = res?.detections?.[0];
        if (det) {
          const kp = det.keypoints ?? [];
          const box = det.boundingBox;
          // BlazeFace keypoint 3 = mouth centre
          const mouth = kp[3] ?? {
            x: (box.originX + box.width / 2) / v.videoWidth,
            y: (box.originY + box.height * 0.78) / v.videoHeight,
          };
          f.facePresent = true;
          f.mouth.x = lerp(f.mouth.x, mouth.x, 0.35);
          f.mouth.y = lerp(f.mouth.y, mouth.y, 0.35);
          if (box) f.faceScale = lerp(f.faceScale, box.width / v.videoWidth, 0.2);
        } else {
          f.facePresent = false;
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

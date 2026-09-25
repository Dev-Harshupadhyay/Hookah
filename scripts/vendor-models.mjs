/**
 * Copies the MediaPipe WASM runtime out of node_modules and downloads the two
 * model files into /public, so the app can run with zero third-party requests.
 *   node scripts/vendor-models.mjs
 * Then set NEXT_PUBLIC_MP_WASM / NEXT_PUBLIC_HAND_MODEL / NEXT_PUBLIC_FACE_MODEL.
 */
import { cp, mkdir, writeFile } from 'node:fs/promises';

const MODELS = {
  'public/models/hand_landmarker.task':
    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  'public/models/blaze_face_short_range.tflite':
    'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
};

await mkdir('public/mediapipe', { recursive: true });
await mkdir('public/models', { recursive: true });
await cp('node_modules/@mediapipe/tasks-vision/wasm', 'public/mediapipe/wasm', { recursive: true });
console.log('✓ wasm runtime copied to public/mediapipe/wasm');

for (const [dest, url] of Object.entries(MODELS)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log('✓', dest);
}

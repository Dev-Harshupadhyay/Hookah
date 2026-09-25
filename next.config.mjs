/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allows the sandbox/live-preview host to talk to the dev server
  allowedDevOrigins: ['*.e2b.app', '*.vercel.app', 'localhost'],
  experimental: {
    optimizePackageImports: ['@mediapipe/tasks-vision'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.DEPLOY_TARGET === 'static',
  },
};

// Static export configuration for GitHub Pages fallback
if (process.env.DEPLOY_TARGET === 'static') {
  nextConfig.output = 'export';
  nextConfig.trailingSlash = true;
  nextConfig.images.unoptimized = true;
}

export default nextConfig;
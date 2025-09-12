/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better performance
  reactStrictMode: true,

  // Improve build performance
  swcMinify: true,

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
}

export default nextConfig;
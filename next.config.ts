import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),

  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    // Remove console logs in production (except errors and warnings)
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', '@iconify/react'],
  },

  webpack: (config, { isServer }) => {
    // Simple alias only
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };

    // Production optimizations
    if (config.mode === 'production') {
      config.optimization = {
        ...config.optimization,
        // Better code splitting
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...(config.optimization.splitChunks as any)?.cacheGroups,
            // Separate vendor chunks for better caching
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    return config;
  },

  images: {
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },

  // Enable compression
  compress: true,

  // Power optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security
};

export default nextConfig;

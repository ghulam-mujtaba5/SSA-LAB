/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  reactStrictMode: true, // Enable React Strict Mode
  // Next.js 16: Turbopack is enabled by default. Since this project also customizes webpack,
  // provide an explicit Turbopack config to avoid build errors about mixed configurations.
  turbopack: {},

  // Next.js Image Optimization — allow external image sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "www.freepik.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "lahore.comsats.edu.pk",
      },
      {
        protocol: "https",
        hostname: "*.comsats.edu.pk",
      },
    ],
    // Serve modern formats, fallback to original
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 30 days
    minimumCacheTTL: 2592000,
    // Allow SVG with content disposition
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async redirects() {
    return [
      {
        source: "/resume",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/advance-learning",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/research-projects",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/project-portfolio",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/alumni",
        destination: "/supervision",
        permanent: true,
      },
      {
        source: "/alumni/case-study/:slug*",
        destination: "/supervision/projects/:slug*",
        permanent: true,
      },
      {
        source: "/dsa-visualization",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/our-team",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/gallery",
        destination: "/events",
        permanent: true,
      },
      {
        source: "/projects/:slug*",
        destination: "/supervision/projects/:slug*",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/insights",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/insights/:slug*",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/uses",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/search",
        destination: "/research",
        permanent: true,
      },
      // Consolidate /portfolio to / — prevents duplicate content
      {
        source: "/portfolio",
        destination: "/",
        permanent: true,
      },
      {
        source: "/portfolio/resume",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/portfolio/search",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/articles",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/articles/:slug*",
        destination: "/publications",
        permanent: true,
      },
      {
        source: "/fyp",
        destination: "/supervision",
        permanent: true,
      },
      // Redirect old static sitemap URL to the canonical sitemap
      {
        source: "/sitemap-0.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
    ];
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    return config;
  },
  async headers() {
    return [
      // Cache public pages (exclude admin and API)
      {
        source: "/((?!admin|api).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      // Prevent search engines from indexing API routes
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Prevent indexing of RSS feed as an HTML page
      {
        source: "/feed.xml",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      // Long-lived cache for static image/font/icon assets served from /public
      {
        source: "/:path*\\.(png|jpg|jpeg|webp|avif|svg|ico|woff|woff2|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy (CSP)
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https: http:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.googletagmanager.com https://res.cloudinary.com https://*.cloudinary.com; frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com; frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://*.ampproject.org https://sites.google.com; object-src 'none'; base-uri 'self';",
          },
          // Report-Only CSP to capture violations without breaking pages
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.googletagmanager.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https: http:; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.googletagmanager.com https://res.cloudinary.com https://*.cloudinary.com; frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com; frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://*.ampproject.org https://sites.google.com; object-src 'none'; base-uri 'self'; report-uri /api/csp-report; report-to csp-endpoint;",
          },
          // Reporting API endpoint mapping
          {
            key: "Reporting-Endpoints",
            value: "csp-endpoint=\"/api/csp-report\"",
          },
          // HTTP Strict Transport Security (HSTS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Cross-Origin-Opener-Policy (COOP)
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          // X-Frame-Options (XFO)
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);

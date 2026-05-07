/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external domains (company logos, profile pictures)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
    ],
  },

  // Compression for better Hostinger performance
  compress: true,

  // For Hostinger Node.js deployment (standalone output)
  // Uncomment the line below when deploying to production:
  // output: 'standalone',

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return []
  },

  // Security and Caching headers
  async headers() {
    return [
      {
        // Apply security headers to all pages, excluding static files, APIs, and next assets
        source: '/((?!_next|api|static|favicon.ico).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        // Enforce revalidation on pages to prevent browsers caching old static HTML pointing to deleted CSS
        source: '/((?!_next|api|static|.*\\..*).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      }
    ]
  },
}

export default nextConfig

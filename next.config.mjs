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

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig

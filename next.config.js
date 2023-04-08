/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return [
      {
        source: '/api/rpc/:path*',
        destination: `${process.env.NEXT_PUBLIC_RPC_ENDPOINT}/:path*`,
      },
      {
        source: '/api/rest/:path*',
        destination: `${process.env.NEXT_PUBLIC_REST_ENDPOINT}/:path*`,
      },
    ]
  }
}

module.exports = nextConfig

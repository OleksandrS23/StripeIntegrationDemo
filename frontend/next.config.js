/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Para Docker build otimizado
}

module.exports = nextConfig


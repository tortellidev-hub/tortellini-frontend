// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pino-pretty': false,
      colorette: false,
      'sonic-boom': false,
      'thread-stream': false,
      fs: false,
      path: false,
      bufferutil: false,
      'utf-8-validate': false,
    };
    return config;
  },
  transpilePackages: [
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-wallets',
    '@solana/wallet-adapter-phantom',
    '@solana/wallet-adapter-solflare',
    '@solana/wallet-adapter-walletconnect',
  ],
};

export default nextConfig;

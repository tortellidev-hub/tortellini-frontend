// components/WalletMultiButton.tsx
'use client';

import dynamic from 'next/dynamic';

// Ensure this renders client-side only to avoid hydration mismatches.
export const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

// components/ClientHeader.tsx
'use client';

import Link from 'next/link';
import { WalletMultiButton } from './WalletMultiButton';

export default function ClientHeader() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/" className="font-semibold">Tortellini</Link>
          <Link href="/buy" className="opacity-80 hover:opacity-100">Buy</Link>
          <Link href="/claim" className="opacity-80 hover:opacity-100">Claim</Link>
          <Link href="/faq" className="opacity-80 hover:opacity-100">FAQ</Link>
        </nav>
        <div>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}

"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export function TopNav() {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold">Tortellini</Link>
        <Link href="/buy" className="text-sm hover:underline">Buy</Link>
        <Link href="/claim" className="text-sm hover:underline">Claim</Link>
        <Link href="/admin" className="text-sm hover:underline">Admin</Link>
        <Link href="/faq" className="text-sm hover:underline">FAQ</Link>
      </div>
      <WalletMultiButton />
    </div>
  );
}

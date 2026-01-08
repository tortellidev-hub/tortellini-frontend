"use client";

import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";

// Client-only WalletMultiButton to avoid SSR hydration mismatches
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function WalletSection() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton className="!rounded-xl" />
      <div className="text-sm">
        <div>
          <span className="text-muted-foreground">Connection:</span>{" "}
          {process.env.NEXT_PUBLIC_CLUSTER || "devnet"}
        </div>
        <div className="truncate max-w-[260px]">
          <span className="text-muted-foreground">Connected:</span>{" "}
          {connected && publicKey ? publicKey.toBase58() : "—"}
        </div>
      </div>
    </div>
  );
}

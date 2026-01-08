"use client";

import React, { useMemo, type ReactNode } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { ENV } from "@/env";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-nightly";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-ledger";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function SolanaWalletProviders({ children }: { children: ReactNode }) {
  const endpoint = ENV.RPC_URL || "https://api.devnet.solana.com";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new NightlyWalletAdapter(),
      new LedgerWalletAdapter(),
      // Se vuoi aggiungerne altri, importa e inserisci qui:
      // new BackpackWalletAdapter(), new GlowWalletAdapter(), new ExodusWalletAdapter(), new BraveWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

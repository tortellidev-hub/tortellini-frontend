// frontend/env.ts


import type { Commitment } from "@solana/web3.js";

function must(name: string, val?: string) {
  if (val && val.trim()) return val.trim();
  throw new Error(`[env] Missing ${name} in .env.local`);
}

export const ENV = {
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",
  COMMITMENT: (process.env.NEXT_PUBLIC_COMMITMENT || "confirmed") as Commitment,

  // Opzionale: se non lo imposti, resta “devnet”
  CLUSTER: (process.env.NEXT_PUBLIC_CLUSTER || "devnet") as "devnet" | "testnet" | "mainnet-beta",

  // Accetta sia NEXT_PUBLIC_PROGRAM_ID che (in fallback) NEXT_PUBLIC_PROGRAM
  PROGRAM_ID: must(
    "NEXT_PUBLIC_PROGRAM_ID (or NEXT_PUBLIC_PROGRAM)",
    process.env.NEXT_PUBLIC_PROGRAM_ID || process.env.NEXT_PUBLIC_PROGRAM
  ),

  MINT: must("NEXT_PUBLIC_MINT", process.env.NEXT_PUBLIC_MINT),

  // Accetta qualsiasi alias già presente nel tuo progetto senza rinominare nulla
  TREASURY:
    process.env.NEXT_PUBLIC_TREASURY ||
    process.env.NEXT_PUBLIC_TREASURY_SOL ||
    process.env.NEXT_PUBLIC_WALLET_TREASURY_SOL ||
    (() => {
      throw new Error("[env] Missing NEXT_PUBLIC_TREASURY (or *_TREASURY_SOL / NEXT_PUBLIC_WALLET_TREASURY_SOL)");
    })(),
} as const;

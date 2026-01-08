// src/env.ts
import { PublicKey, type Commitment } from "@solana/web3.js";

function must(name: string, v?: string) {
  if (v && v.trim()) return v.trim();
  throw new Error(`[env] Missing ${name} in .env.local`);
}

export const ENV = {
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com",
  COMMITMENT: (process.env.NEXT_PUBLIC_COMMITMENT ?? "confirmed") as Commitment,
  PROGRAM_ID: new PublicKey(must("NEXT_PUBLIC_PROGRAM_ID", process.env.NEXT_PUBLIC_PROGRAM_ID)),
  MINT:       new PublicKey(must("NEXT_PUBLIC_MINT", process.env.NEXT_PUBLIC_MINT)),
  TREASURY:   new PublicKey(must("NEXT_PUBLIC_TREASURY_SOL", process.env.NEXT_PUBLIC_TREASURY_SOL)),
};

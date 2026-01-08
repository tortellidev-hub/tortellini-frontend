// src/env.ts

const ENV_DIRECT = {
  // Network (public)
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com",
  CLUSTER: process.env.NEXT_PUBLIC_CLUSTER ?? "devnet",
  COMMITMENT: process.env.NEXT_PUBLIC_COMMITMENT ?? "confirmed",

  // Program/Mint (public)
  PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID ?? undefined,
  MINT: process.env.NEXT_PUBLIC_MINT ?? "",
  TREASURY: process.env.NEXT_PUBLIC_TREASURY ?? "",

  // Presale UI (public)
  TORT_PHASE: process.env.NEXT_PUBLIC_TORT_PHASE ?? "Phase 1",
  TORT_PER_SOL: Number(process.env.NEXT_PUBLIC_TORT_PER_SOL ?? "1000000"),
} as const;

// In dev/SSR, verifichiamo i required. Sul client NON tiriamo eccezioni.
if (typeof window === "undefined") {
  if (!ENV_DIRECT.MINT) throw new Error("Missing required environment variable: NEXT_PUBLIC_MINT");
  if (!ENV_DIRECT.TREASURY) throw new Error("Missing required environment variable: NEXT_PUBLIC_TREASURY");
}

export const ENV = ENV_DIRECT;

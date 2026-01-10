// src/env.ts

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

export const ENV = {
  // Network
  RPC_URL: required("NEXT_PUBLIC_RPC_URL"),
  CLUSTER: required("NEXT_PUBLIC_CLUSTER"),
  COMMITMENT: required("NEXT_PUBLIC_COMMITMENT"),

  // Program / Token
  PROGRAM_ID: required("NEXT_PUBLIC_PROGRAM_ID"),
  MINT: required("NEXT_PUBLIC_MINT"),
  TREASURY: required("NEXT_PUBLIC_TREASURY"),

  // Presale UI
  TORT_PHASE: process.env.NEXT_PUBLIC_TORT_PHASE ?? "Phase 1",
  TORT_PER_SOL: Number(process.env.NEXT_PUBLIC_TORT_PER_SOL ?? "1000000"),
} as const;

// lib/config.ts
import { PublicKey, Commitment } from "@solana/web3.js";

// NOTE: in client, Next sostituisce SOLO i letterali process.env.NEXT_PUBLIC_*
const RPC_URL_RAW = process.env.NEXT_PUBLIC_RPC_URL;
const COMMITMENT_RAW = process.env.NEXT_PUBLIC_COMMITMENT as Commitment | undefined;
const PROGRAM_ID_RAW = process.env.NEXT_PUBLIC_PROGRAM_ID;
const MINT_RAW = process.env.NEXT_PUBLIC_MINT;
const TREASURY_SOL_RAW = process.env.NEXT_PUBLIC_TREASURY_SOL;

function must(name: string, v: string | undefined): string {
  if (v && v.trim()) return v.trim();
  throw new Error(
    `[config] Missing required env ${name}. Create frontend/.env.local and set ${name}.`
  );
}

function fallback(name: string, v: string | undefined, fb: string): string {
  if (v && v.trim()) return v.trim();
  console.warn(`[config] Missing ${name}; using fallback: ${fb}`);
  return fb;
}

// Pubbliche (OK anche in client)
export const RPC_URL = fallback("NEXT_PUBLIC_RPC_URL", RPC_URL_RAW, "https://api.devnet.solana.com");
export const COMMITMENT: Commitment = (COMMITMENT_RAW ?? "confirmed") as Commitment;

// Chiavi di programma (devono esserci sempre, niente fallback)
export const PROGRAM_ID = new PublicKey(must("NEXT_PUBLIC_PROGRAM_ID", PROGRAM_ID_RAW));
export const MINT = new PublicKey(must("NEXT_PUBLIC_MINT", MINT_RAW));
export const TREASURY_SOL = new PublicKey(must("NEXT_PUBLIC_TREASURY_SOL", TREASURY_SOL_RAW));

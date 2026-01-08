// lib/constants.ts
import { PublicKey } from "@solana/web3.js";

/**
 * Safe parser: returns PublicKey or null if undefined/invalid.
 */
function parsePubkey(s?: string): PublicKey | null {
  try {
    return s ? new PublicKey(s) : null;
  } catch {
    return null;
  }
}

export const PROGRAM_ID = parsePubkey(process.env.NEXT_PUBLIC_PROGRAM_ID);
export const MINT = parsePubkey(process.env.NEXT_PUBLIC_MINT);
export const TREASURY_SOL = parsePubkey(process.env.NEXT_PUBLIC_TREASURY_SOL);

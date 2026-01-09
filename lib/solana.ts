// lib/solana.ts
import { Connection, PublicKey } from "@solana/web3.js";
import { ENV } from "@/env";

// ─────────────────────────────────────────────
// Core on-chain constants (single source of truth)
// ─────────────────────────────────────────────

export const PROGRAM_ID = new PublicKey(ENV.PROGRAM_ID);
export const TREASURY_SOL = new PublicKey(ENV.TREASURY);
export const MINT = new PublicKey(ENV.MINT);

// ─────────────────────────────────────────────
// Snapshot helpers (read-only)
// ─────────────────────────────────────────────

export type SnapshotAccount = {
  pubkey: PublicKey;
  data: any; // tipizzabile quando riattivi il claim UI
};

export async function listSnapshots(
  connection: Connection,
  programId: PublicKey = PROGRAM_ID,
): Promise<SnapshotAccount[]> {
  const accounts = await connection.getProgramAccounts(programId, {
    filters: [
      // discriminator (8) + fixed fields (~52) + almeno 1 pubkey
      { dataSize: 52 + 32 },
    ],
  });

  const out: SnapshotAccount[] = [];

  for (const a of accounts) {
    try {
      // ⚠️ decodeSnapshot NON incluso finché non serve davvero
      // const data = decodeSnapshot(Buffer.from(a.account.data));
      // out.push({ pubkey: a.pubkey, data });

      out.push({ pubkey: a.pubkey, data: a.account.data });
    } catch {
      continue;
    }
  }

  return out;
}

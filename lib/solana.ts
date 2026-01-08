// lib/solana.ts (solo la parte listSnapshots)
export async function listSnapshots(
  connection: Connection,
  programId: PublicKey,
): Promise<SnapshotAccount[]> {
  // account discriminator: 8 bytes skip; you can also filter by size, seeds, etc.
  const accounts = await connection.getProgramAccounts(programId, {
    filters: [
      // reasonable min size: 8 (disc) + fixed fields (44) = 52 bytes
      { dataSize: 52 + 32 }, // allow at least 1 Pubkey in claimed vec; tweak if needed
    ],
  });

  const out: SnapshotAccount[] = [];
  for (const a of accounts) {
    try {
      const data = decodeSnapshot(Buffer.from(a.account.data)); // tua decodeSnapshot
      // filtra con una condizione sensata: opened_at/claim_window_secs non nulli ecc.
      if (
        typeof data.cycle === "number" &&
        typeof data.opened_at === "number" &&
        typeof data.claim_window_secs === "number"
      ) {
        out.push({ pubkey: a.pubkey, data });
      }
    } catch {
      // ignora account che non matchano lo schema (evita eccezioni che romperebbero la pagina)
      continue;
    }
  }
  return out;
}

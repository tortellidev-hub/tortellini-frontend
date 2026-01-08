// frontend/src/components/ClaimPanel.tsx
import React, { useMemo, useState } from "react";
import { usePresaleState } from "../hooks/usePresaleState";
import { getProgram } from "../lib/anchorClient";

// Nota: senza i dettagli precisi degli account per claim_airdrop,
// lasciamo un bottone “wire-ready” con try/catch e TODO per il mapping.
export default function ClaimPanel() {
  const { loading, error, state } = usePresaleState();
  const [tx, setTx] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const disabled = loading || !!error;

  const handleClaim = async () => {
    setTx(null); setErr(null);
    try {
      const { program } = await getProgram();
      const m = (program.methods as any);
      const methodName = m.claimAirdrop ? "claimAirdrop" : (m.claim_airdrop ? "claim_airdrop" : null);
      if (!methodName) throw new Error("claim_airdrop non presente nell’IDL");

      // TODO: mappare gli accounts esatti (dipende dal tuo IDL).
      // Qui mettiamo un errore esplicito per ricordarlo.
      throw new Error("TODO: collega gli account per claim_airdrop (state, utente, user ATA, mint, vault auth, token program, ecc.)");

      // Esempio (quando sapremo gli account):
      // const sig = await m[methodName]().accounts({...}).rpc();
      // setTx(sig);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    }
  };

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="text-lg font-semibold">Claim Airdrop</div>
      {loading && <div>Reading on-chain state…</div>}
      {error && <div className="text-red-600">Errore: {error}</div>}
      {state && <div className="text-sm text-gray-600">Stato on-chain caricato. Premi “Claim” se sei eleggibile.</div>}
      <div className="flex gap-2">
        <button
          onClick={handleClaim}
          disabled={disabled}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
        >
          Claim
        </button>
        {tx && <a className="text-indigo-700 underline" target="_blank" href={`https://explorer.solana.com/tx/${tx}?cluster=devnet`}>Vedi TX</a>}
      </div>
      {err && <div className="text-red-600 text-sm">{err}</div>}
    </div>
  );
}

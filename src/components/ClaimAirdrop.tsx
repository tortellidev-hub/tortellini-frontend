import React, { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { getProgram, deriveStatePda } from "../lib/anchorClient";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { TORT } from "../config/tort";

function toCamel(s: string) { return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase()); }

export function ClaimAirdrop() {
  const [cycle, setCycle] = useState("0");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onClaim() {
    setBusy(true); setMsg(null);
    try {
      const { program, idl, provider, programId } = await getProgram();
      const wallet = provider.wallet.publicKey;
      const state = deriveStatePda(programId);

      const name = (idl.instructions || []).find((i:any)=> i.name.toLowerCase()==="claim_airdrop")?.name;
      if (!name) throw new Error("claim_airdrop non presente nell'IDL");
      const ixDef = (idl.instructions || []).find((i:any) => i.name === name)!;

      // mappa accounts
      const accounts: Record<string, PublicKey> = {};
      for (const a of ixDef.accounts ?? []) {
        const n = String(a.name).toLowerCase();
        if (["state","presale","config","settings"].some(k => n.includes(k))) accounts[a.name] = state;
        else if (["user","claimer","recipient","owner","authority"].some(k => n.includes(k))) accounts[a.name] = wallet;
        else if (n.includes("mint")) accounts[a.name] = new PublicKey(TORT.MINT);
        else if (n.includes("treasury")) accounts[a.name] = new PublicKey(TORT.TREASURY);
        else if (n.includes("user") && n.includes("ata")) {
          accounts[a.name] = await getAssociatedTokenAddress(new PublicKey(TORT.MINT), wallet, false);
        } else if (n.includes("token_program")) accounts[a.name] = TOKEN_PROGRAM_ID;
        else if (n.includes("associated_token_program")) accounts[a.name] = ASSOCIATED_TOKEN_PROGRAM_ID;
        else {
          const anyWin = window as any;
          const override = anyWin?.__TORT__?.[`ACCOUNT_${a.name.toUpperCase()}`];
          if (!override) throw new Error(`Account '${a.name}' non mappato. Imposta window.__TORT__.ACCOUNT_${a.name.toUpperCase()}`);
          accounts[a.name] = new PublicKey(override);
        }
      }

      const methodKey = (program.methods as any)[toCamel(name)] ? toCamel(name) : name;

      // argomento: spesso u8/u16 "cycle"
      const args = ixDef.args || [];
      const call =
        args.length === 1
          ? (program.methods as any)[methodKey](new anchor.BN(Number(cycle)))
          : (program.methods as any)[methodKey]();

      const sig = await call.accounts(accounts).rpc();
      setMsg(`✅ Claim inviato: ${sig}`);
    } catch (e:any) {
      setMsg(`❌ ${e?.message ?? String(e)}`);
    } finally { setBusy(false); }
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="text-sm font-medium">Claim Airdrop</div>
      <label className="block text-sm">Cycle</label>
      <input
        className="w-full border rounded px-3 py-2"
        type="number"
        min="0"
        value={cycle}
        onChange={e => setCycle(e.target.value)}
      />
      <button
        disabled={busy}
        onClick={onClaim}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {busy ? "Claiming…" : "Claim"}
      </button>
      {msg && <div className="text-xs">{msg}</div>}
    </div>
  );
}

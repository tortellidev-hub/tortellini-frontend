// src/app/claim/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// provider/program/env
import { getAnchorProvider, programId } from "@/lib/solana";
import { useProgram } from "@/lib/anchorProgram";
import { ENV } from "@/env";

// ---- styling helpers (stesso look delle altre pagine) ----
const border = "1px solid #2a2a2a";
const gradient = "linear-gradient(180deg,#101010 0%, #000 100%)";
const panelBg = "#0f0f0f";

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border,
        background: gradient,
        color: "white",
        padding: 12,
      }}
    >
      <div style={{ fontSize: 12, color: "#a3a3a3" }}>{label}</div>
      <div style={{ marginTop: 6, fontWeight: 900, fontSize: 18 }}>{value}</div>
    </div>
  );
}

function short(a?: string) {
  if (!a) return "—";
  return a.slice(0, 6) + "…" + a.slice(-6);
}

// ---- PDA helpers (tuoi, invariati) ----
function u64le(n: bigint) {
  const b = Buffer.alloc(8);
  b.writeBigUInt64LE(n);
  return b;
}
function pdaSnapshot(cycle: bigint) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("snapshot_v1"), u64le(cycle)],
    programId()
  )[0];
}
function vaultAuthForSnapshot(snap: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("snapshot_vault_v1"), snap.toBuffer()],
    programId()
  )[0];
}

export default function ClaimPage() {
  const { publicKey, signTransaction } = useWallet();
  const [cycleInput, setCycleInput] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [busy, setBusy] = useState(false);

  const provider = useMemo(() => {
    if (!publicKey || !signTransaction) return null;
    const wallet: anchor.Wallet = {
      publicKey,
      signAllTransactions: async (txs) => Promise.all(txs.map(signTransaction)),
      signTransaction: async (tx) => signTransaction(tx),
    };
    return getAnchorProvider(wallet);
  }, [publicKey, signTransaction]);

  const program = useProgram(provider);

  // qualche check rapido per abilitare/disabilitare il bottone
  const cycleOk = useMemo(() => {
    try {
      if (!cycleInput) return false;
      const c = BigInt(cycleInput);
      return c >= 0n;
    } catch {
      return false;
    }
  }, [cycleInput]);

  const amountOk = useMemo(() => {
    try {
      if (!amount) return false;
      const a = BigInt(amount);
      return a > 0n;
    } catch {
      return false;
    }
  }, [amount]);

  const canClaim = !!publicKey && !!provider && !!program && cycleOk && amountOk && !busy;

  const claim = async () => {
    if (!provider || !program || !publicKey) return;
    setBusy(true);
    try {
      const cycle = BigInt(cycleInput);
      const snap = pdaSnapshot(cycle);
      const vaultAuth = vaultAuthForSnapshot(snap);
      const mint = new PublicKey(ENV.MINT);

      // calcolo ATA
      const destAta = await getAssociatedTokenAddress(mint, publicKey);
      const vaultAta = await getAssociatedTokenAddress(mint, vaultAuth, true);

      // (1) Pre-flight: crea l'ATA dell'utente se non esiste
      const destInfo = await provider.connection.getAccountInfo(destAta);
      if (!destInfo) {
        const ix = createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey, // payer
          destAta,                   // ATA da creare
          publicKey,                 // owner
          mint,                      // mint
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        await provider.sendAndConfirm(new Transaction().add(ix), []);
      }

      // (2) Accounts tolleranti: passo sia snake_case che camelCase
      const statePda = PublicKey.findProgramAddressSync(
        [Buffer.from("state")],
        program.programId
      )[0];

      const accounts: Record<string, any> = {
        // richiesti dall'IDL (variazioni snake/camel incluse)
        snapshot: snap,
        vault_authority: vaultAuth,
        vaultAuthority: vaultAuth,
        vault_ata: vaultAta,
        vaultAta: vaultAta,
        token_mint: mint,
        tokenMint: mint,
        token_program: TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        destination: destAta,
        userDestination: destAta,
        claimer: publicKey,
        // alcuni IDL includono anche lo state
        state: statePda,
        associated_token_program: ASSOCIATED_TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      };

      // (3) Chiamata al metodo
      const method =
        (program.methods as any).claimAirdrop ??
        (program.methods as any)["claimAirdrop"];
      if (!method) throw new Error("Metodo 'claimAirdrop' non disponibile nell'IDL.");

      await method(new anchor.BN(amount)).accounts(accounts).rpc();
      alert("Claim completed");
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ display: "grid", gap: 16 }}>
      {/* HEADER */}
      <section
        style={{
          borderRadius: 16,
          border,
          background: gradient,
          color: "white",
          padding: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Claim Airdrop</h1>
        <p style={{ marginTop: 6, color: "#a3a3a3", fontSize: 14 }}>
          Claim within the active window if you’re eligible.
        </p>
      </section>

      {/* BODY GRID */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 16,
        }}
      >
        {/* LEFT: form/azione */}
        <div
          style={{
            borderRadius: 16,
            border,
            background: gradient,
            color: "white",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          {/* wallet info */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#a3a3a3" }}>Connected wallet</div>
              <div style={{ fontFamily: "monospace", fontSize: 12 }}>
                {short(publicKey?.toBase58())}
              </div>
            </div>
          </div>

          {/* inputs */}
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: "#a3a3a3" }}>Cycle (u64)</label>
              <input
                value={cycleInput}
                onChange={(e) => setCycleInput(e.target.value)}
                placeholder="e.g. 1"
                inputMode="numeric"
                style={{
                  marginTop: 6,
                  width: "100%",
                  borderRadius: 12,
                  border,
                  background: "#0b0b0b",
                  color: "white",
                  padding: "10px 12px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#a3a3a3" }}>
                Amount to claim (raw mint units)
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 100000 (base units)"
                inputMode="numeric"
                style={{
                  marginTop: 6,
                  width: "100%",
                  borderRadius: 12,
                  border,
                  background: "#0b0b0b",
                  color: "white",
                  padding: "10px 12px",
                }}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: "#8b8b8b" }}>
                Tip: amount is in <b>raw units</b> (base units of the mint), not in UI decimals.
              </div>
            </div>
          </div>

          {/* KPI placeholders */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            <Kpi label="Eligible" value="—" />
            <Kpi label="Window" value="—" />
            <Kpi label="Mint" value="TORT" />
          </div>

          {/* CTA */}
          <button
            onClick={claim}
            disabled={!canClaim}
            style={{
              marginTop: 4,
              padding: "12px 18px",
              borderRadius: 16,
              background: canClaim ? "#2dd4bf" : "#1f766d",
              color: "black",
              fontWeight: 700,
              border: "none",
              opacity: canClaim ? 1 : 0.6,
              cursor: canClaim ? "pointer" : "not-allowed",
            }}
            title={
              !publicKey
                ? "Connect your wallet"
                : !cycleOk
                ? "Enter a valid cycle (u64)"
                : !amountOk
                ? "Enter a valid positive amount (raw units)"
                : undefined
            }
          >
            {busy ? "Claiming..." : "Claim"}
          </button>

          <div style={{ fontSize: 12, color: "#a3a3a3" }}>
            After claiming, tokens will arrive in your wallet SPL account.
          </div>
        </div>

        {/* RIGHT: status/tips */}
        <aside style={{ display: "grid", gap: 12, alignSelf: "start" }}>
          <div
            style={{
              borderRadius: 16,
              border,
              background: panelBg,
              color: "white",
              padding: 14,
            }}
          >
            <div style={{ fontSize: 12, color: "#a3a3a3" }}>Status</div>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18, lineHeight: 1.5, fontSize: 14 }}>
              <li>Connect wallet to check eligibility</li>
              <li>Claim within the active window</li>
              <li>Unclaimed tokens are swept after close</li>
            </ul>
          </div>

          <div
            style={{
              borderRadius: 16,
              border,
              background: panelBg,
              color: "white",
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>A bit of joy 😊</div>
            <p style={{ margin: 0, color: "#d4d4d4", fontSize: 14 }}>
              $TORT is engineered to increase your <em>happiness per click</em>. Friendly fees,
              fast claims, community rewards.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

// frontend/src/app/buy/page.tsx

"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletModalButton,
  useWalletModal,
} from "@solana/wallet-adapter-react-ui";

import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";

import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import { BN } from "bn.js";

import { ENV } from "@/env";
import BuyDisclaimer from "@/components/BuyDisclaimer";
import { TORT } from "@/config/tort";
import { fetchTortState, uiPerSol } from "@/lib/tortState";

// ─────────────────────────────────────────────────────────────
// Program / constants
// ─────────────────────────────────────────────────────────────

const TORT_PROGRAM_ID = new PublicKey(
  ENV.PROGRAM_ID || "GhkrgU47GmoNwr4ufpASzNb9aGZSyq6hA3jJrhM81zi5"
);

const BUY_PRESALE_DISCRIMINATOR = Uint8Array.from([
  113, 18, 193, 68, 35, 36, 215, 8,
]);

const TREASURY_SOL =
  ENV.TREASURY || "8x5jqfcN1iH9reUt1isfidJRV8EpxpTAKPKSuZZPkXVa";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatNumber(n: number | string) {
  const val = typeof n === "string" ? Number(n) : n;
  if (!isFinite(val)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 }).format(val);
}

function short(a?: string | null) {
  if (!a) return "—";
  return a.slice(0, 4) + "…" + a.slice(-4);
}

function makeSolanaUri(address: string, amountSol: string) {
  const amt = amountSol.replace(",", ".").trim();
  const params = new URLSearchParams();
  if (amt && !isNaN(Number(amt)) && Number(amt) > 0) {
    params.set("amount", amt);
  }
  params.set("label", "TORTELLINI Presale");
  params.set(
    "message",
    "Thank you for supporting $TORT presale on Solana!"
  );
  const qs = params.toString();
  return `solana:${address}${qs ? "?" + qs : ""}`;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function BuyPage() {
  const { publicKey, connected, disconnect, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible: openWalletModal } = useWalletModal();

  const [amountSolRaw, setAmountSolRaw] = useState("0.01");
  const [ack, setAck] = useState(false);

  const [chainTortPerSol, setChainTortPerSol] = useState<number | null>(null);
  const [currPhase, setCurrPhase] = useState<number | null>(null);
  const [currSold, setCurrSold] = useState<bigint | null>(null);
  const [currCap, setCurrCap] = useState<bigint | null>(null);

  const [lastError, setLastError] = useState<string | null>(null);

  const amountSolStr = amountSolRaw.replace(",", ".").trim();
  const sol = Number(amountSolStr);
  const isAmountValid = isFinite(sol) && sol > 0;

  const solanaUri = useMemo(
    () => makeSolanaUri(TREASURY_SOL, amountSolRaw),
    [amountSolRaw]
  );

  const qrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
        solanaUri
      )}`,
    [solanaUri]
  );

  useEffect(() => {
    (async () => {
      try {
        if (!connection) return;
        const mintPk = new PublicKey(ENV.MINT);
        const state = await fetchTortState(connection, TORT_PROGRAM_ID, mintPk);

        const phaseIndex = Number(state.currentPhase);
        const phase = state.phases[phaseIndex];
        const rate = phase?.ratePerLamport ?? 0n;

        setChainTortPerSol(Number(uiPerSol(state.decimals, rate)));
        setCurrPhase(phaseIndex);
        setCurrSold(phase?.sold ?? 0n);
        setCurrCap(phase?.cap ?? 0n);
      } catch {}
    })();
  }, [connection]);

  const tortPerSol = chainTortPerSol ?? TORT.PRESALE.TORT_PER_SOL;
  const estTort = isAmountValid ? sol * tortPerSol : 0;

  const progressPct = useMemo(() => {
    if (currSold == null || currCap == null || currCap === 0n) return 0;
    return Number((currSold * 10000n) / currCap) / 100;
  }, [currSold, currCap]);

  let disabledReason = "";
  if (!ack) disabledReason = "Please accept the disclaimer first.";
  else if (!connected || !publicKey)
    disabledReason = "Connect your wallet to continue.";
  else if (!isAmountValid) disabledReason = "Enter a positive SOL amount.";

  const canBuy = !disabledReason;

  const buy = useCallback(async () => {
    setLastError(null);

    if (!connected || !publicKey) {
      openWalletModal(true);
      return;
    }

    if (!canBuy) {
      alert(disabledReason);
      return;
    }

    if (!connection) return;

    try {
      const mintPk = new PublicKey(ENV.MINT);
      const treasuryPk = new PublicKey(ENV.TREASURY);

      const lamportsNumber = Math.floor(sol * LAMPORTS_PER_SOL);
      const lamportsBn = new BN(lamportsNumber);

      const [statePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("state")],
        TORT_PROGRAM_ID
      );

      const [vaultAuth] = PublicKey.findProgramAddressSync(
        [Buffer.from("presale_vault_auth_v1"), statePda.toBuffer()],
        TORT_PROGRAM_ID
      );

      const vaultAta = await getAssociatedTokenAddress(mintPk, vaultAuth, true);
      const userAta = await getAssociatedTokenAddress(mintPk, publicKey);

      const amountBytes = lamportsBn.toArrayLike(Uint8Array, "le", 8);
      const data = new Uint8Array(16);
      data.set(BUY_PRESALE_DISCRIMINATOR, 0);
      data.set(amountBytes, 8);

      const keys = [
        { pubkey: statePda, isSigner: false, isWritable: true },
        { pubkey: treasuryPk, isSigner: false, isWritable: true },
        { pubkey: mintPk, isSigner: false, isWritable: true },
        { pubkey: vaultAuth, isSigner: false, isWritable: false },
        { pubkey: vaultAta, isSigner: false, isWritable: true },
        { pubkey: publicKey, isSigner: true, isWritable: true },
        { pubkey: userAta, isSigner: false, isWritable: true },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ];

      const ix = new TransactionInstruction({
        programId: TORT_PROGRAM_ID,
        keys,
        data,
      });

      const tx = new Transaction().add(ix);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      alert(`Purchase complete ✅\nTx: ${sig}`);
    } catch (e: any) {
      setLastError(e?.message ?? "Unknown error");
      alert(e?.message ?? "Transaction failed");
    }
  }, [connected, publicKey, sol, canBuy, connection]);

  const purpleBtn: React.CSSProperties = {
    width: "100%",
    height: 64,
    borderRadius: 16,
    fontWeight: 800,
    fontSize: 18,
    color: "white",
    background: "linear-gradient(90deg,#8b5cf6,#6d28d9)",
    border: "none",
    cursor: canBuy ? "pointer" : "not-allowed",
    opacity: canBuy ? 1 : 0.5,
  };

  return (
    <div style={{ display: "grid", gap: 16, padding: "0 8px" }}>
      <h1 className="font-bold text-xl">
        Buy ≈ {formatNumber(estTort)} TORT for {formatNumber(amountSolStr)} SOL
      </h1>

      {/* Wallet */}
      <div className="rounded-2xl border p-3 bg-black">
        {!connected ? (
          <WalletModalButton>Connect Wallet</WalletModalButton>
        ) : (
          <div>
            Connected: <b>{short(publicKey?.toBase58())}</b>{" "}
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        )}
      </div>

      {/* Phase */}
      <div className="rounded-2xl border p-4 bg-neutral-900">
        Phase {currPhase ?? "—"} • Sold{" "}
        {currSold && currCap
          ? `${Number(currSold).toLocaleString()} / ${Number(currCap).toLocaleString()}`
          : "- / -"}
        <div className="mt-2 h-2 bg-neutral-800 rounded">
          <div
            className="h-2 rounded"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg,#22d3ee,#14b8a6)",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 720 }}>
        <BuyDisclaimer checked={ack} onChange={setAck} />
      </div>

      {/* Buy + QR */}
      <div
        style={{
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          padding: 16,
          borderRadius: 16,
          background: "#020617",
        }}
      >
        {/* Buy */}
        <div>
          <label>You pay (SOL)</label>
          <input
            value={amountSolRaw}
            onChange={(e) => setAmountSolRaw(e.target.value)}
          />
          <div style={{ marginTop: 8 }}>
            You receive ≈ <b>{formatNumber(estTort)} TORT</b>
          </div>
          <button style={purpleBtn} onClick={buy}>
            {connected ? "Buy now" : "Connect wallet to buy"}
          </button>
        </div>

        {/* QR */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 800 }}>Buy from your phone</div>
          <p style={{ fontSize: 13 }}>
            Scan the QR with your Solana wallet to buy TORT in seconds.
          </p>
          <img src={qrUrl} alt="QR" />
          <p style={{ fontSize: 12 }}>
            Works with Phantom, Solflare and most Solana wallets.
          </p>
          <a href={solanaUri}>Open in wallet app</a>
        </div>
      </div>

      {lastError && <pre>{lastError}</pre>}
    </div>
  );
}

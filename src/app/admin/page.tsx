// src/app/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

import { ENV } from "../../env";
import { TORT, type Phase } from "../../config/tort";

type Kpi = {
  treasurySol: number | null;
  adminRemaining: number | null;
  sold: number | null;
  estSolCollected: number | null;
  errors: string[];
};

const border = "1px solid #2a2a2a";
const gradient = "linear-gradient(180deg,#101010 0%, #000 100%)";

function fmt(n: number | null | undefined, max = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: max }).format(n);
}
function shortAddr(a: string) {
  if (!a) return "—";
  return a.slice(0, 4) + "…" + a.slice(-4);
}

export default function AdminPage() {
  const { publicKey } = useWallet();
  const [kpi, setKpi] = useState<Kpi>({
    treasurySol: null,
    adminRemaining: null,
    sold: null,
    estSolCollected: null,
    errors: [],
  });

  // ---- per-phase (manuale/off-chain) ----
  const [soldByPhase, setSoldByPhase] = useState<Record<string, number>>({}); // ui units

  const connection = useMemo(
    () => new Connection(ENV.RPC_URL, ENV.COMMITMENT as any),
    []
  );

  // load/save manual sold per phase
  useEffect(() => {
    try {
      const raw = localStorage.getItem("tort_sold_by_phase");
      if (raw) setSoldByPhase(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("tort_sold_by_phase", JSON.stringify(soldByPhase));
    } catch {}
  }, [soldByPhase]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const errs: string[] = [];
      try {
        // 1) Treasury SOL
        const treasuryPub = new PublicKey(ENV.TREASURY);
        const lamports = await connection.getBalance(treasuryPub);
        const treasurySol = lamports / LAMPORTS_PER_SOL;

        // 2) Admin remaining (ATA del wallet connesso)
        let adminRemaining: number | null = null;
        if (publicKey) {
          const mint = new PublicKey(ENV.MINT);
          const ata = await getAssociatedTokenAddress(mint, publicKey, false);
          try {
            const bal = await connection.getTokenAccountBalance(ata);
            adminRemaining = bal.value.uiAmount ?? 0;
          } catch {
            adminRemaining = 0;
          }
        } else {
          errs.push("Connect the admin wallet to read remaining presale tokens.");
        }

        // 3) Sold & SOL (stima semplice)
        const alloc = TORT.PRESALE.ALLOCATION ?? 0;
        const sold = adminRemaining !== null ? Math.max(0, alloc - adminRemaining) : null;
        const estSolCollected =
          sold !== null && TORT.PRESALE.TORT_PER_SOL > 0
            ? sold / TORT.PRESALE.TORT_PER_SOL
            : null;

        if (!alive) return;
        setKpi({ treasurySol, adminRemaining, sold, estSolCollected, errors: errs });
      } catch (e: any) {
        if (!alive) return;
        setKpi((prev) => ({ ...prev, errors: [...prev.errors, e?.message || String(e)] }));
      }
    })();
    return () => { alive = false; };
  }, [connection, publicKey]);

  // derive totals from per-phase manual data

const phaseRows = useMemo(() => {
  const perPhaseAllocation =
    TORT.PRESALE.ALLOCATION / TORT.PRESALE.PHASES.length;

  return TORT.PRESALE.PHASES.map((ph: Phase) => {
    const sold = Number(soldByPhase[ph] ?? 0);
    const remaining = Math.max(0, perPhaseAllocation - sold);
    const sol =
      TORT.PRESALE.TORT_PER_SOL > 0
        ? sold / TORT.PRESALE.TORT_PER_SOL
        : 0;

    return {
      name: ph,
      allocation: perPhaseAllocation,
      tortPerSol: TORT.PRESALE.TORT_PER_SOL,
      sold,
      remaining,
      sol,
    };
  });
}, [soldByPhase]);


  const totals = useMemo(() => {
    const sum = <T extends keyof (typeof phaseRows)[number]>(key: T) =>
      phaseRows.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
return {
  allocation: TORT.PRESALE.ALLOCATION,
  sold: sum("sold"),
  remaining: sum("remaining"),
  sol: sum("sol"),
};

  }, [phaseRows]);

  return (
    <main style={{ display: "grid", gap: 16 }}>
      {/* Header */}
      <section style={cardHeader}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Admin — Presale Dashboard</h1>
        <p style={{ marginTop: 6, color: "#a3a3a3", fontSize: 14 }}>
          Live metrics + per-phase summary (manual for now).
        </p>
      </section>

      {/* KPI live */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 12,
        }}
      >
        <KpiCard label="Treasury (SOL)" value={`${fmt(kpi.treasurySol, 4)} SOL`} hint={`Address: ${shortAddr(ENV.TREASURY)}`} />

<KpiCard
  label="Presale Phases"
  value={`${TORT.PRESALE.PHASES.length} phases`}
  hint={`1 SOL = ${fmt(TORT.PRESALE.TORT_PER_SOL, 0)} ${TORT.SYMBOL}`}
/>
        <KpiCard label="Allocation (total presale)" value={`${fmt(TORT.PRESALE.ALLOCATION, 0)} ${TORT.SYMBOL}`} hint="Configured in /config/tort.ts" />
        <KpiCard label="Remaining (admin ATA)" value={`${fmt(kpi.adminRemaining, 0)} ${TORT.SYMBOL}`} hint={publicKey ? "Connected wallet ATA" : "Connect admin wallet"} />
        <KpiCard label="Sold (est.)" value={`${fmt(kpi.sold, 0)} ${TORT.SYMBOL}`} hint="Alloc − Remaining (estimate)" />
        <KpiCard label="SOL collected (est.)" value={`${fmt(kpi.estSolCollected, 4)} SOL`} hint="Sold ÷ current rate" />
      </section>

      {/* Per-phase summary (manual/off-chain) */}
      <section style={cardBody}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Per-phase Summary</h2>
          <small style={{ color: "#a3a3a3" }}>Manual “sold” values are saved to this browser (localStorage).</small>
        </div>

        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                {["Phase", "Allocation", "Rate (TORT/SOL)", "Sold (edit)", "Remaining", "SOL (from sold)"].map((h, i) => (
                  <th key={i} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {phaseRows.map((r) => (
                <tr key={r.name}>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={tdStyle}>{fmt(r.allocation, 0)}</td>
                  <td style={tdStyle}>{fmt(r.tortPerSol, 0)}</td>
                  <td style={tdStyle}>
                    <input
                      value={Number.isFinite(r.sold) ? String(r.sold) : "0"}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value || 0));
                        setSoldByPhase((prev) => ({ ...prev, [r.name]: v }));
                      }}
                      inputMode="numeric"
                      style={{
                        width: 140,
                        borderRadius: 10,
                        border,
                        background: "#0b0b0b",
                        color: "white",
                        padding: "6px 10px",
                      }}
                    />
                  </td>
                  <td style={tdStyle}>{fmt(r.remaining, 0)}</td>
                  <td style={tdStyle}>{fmt(r.sol, 4)} SOL</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={tfStyle}>Totals</td>
                <td style={tfStyle}>{fmt(totals.allocation, 0)}</td>
                <td style={tfStyle}>—</td>
                <td style={tfStyle}>{fmt(totals.sold, 0)}</td>
                <td style={tfStyle}>{fmt(totals.remaining, 0)}</td>
                <td style={tfStyle}>{fmt(totals.sol, 4)} SOL</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, color: "#a3a3a3" }}>
          To make this automatic and precise, we can add per-phase counters to the on-chain state and fetch them from the program IDL.
        </div>
      </section>

      {/* Errori / Note */}
      {kpi.errors.length > 0 && (
        <section style={noteStyle}>
          <strong>Notes:</strong>
          <ul style={{ marginTop: 8 }}>
            {kpi.errors.map((e, i) => (
              <li key={i} style={{ color: "#eab308" }}>{e}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={cardStyle}>
      <div style={kLabel}>{label}</div>
      <div style={kValue}>{value}</div>
      {hint && <div style={kHint}>{hint}</div>}
    </div>
  );
}

const cardHeader: React.CSSProperties = {
  borderRadius: 16,
  border,
  background: gradient,
  color: "white",
  padding: 16,
};
const cardBody: React.CSSProperties = { ...cardHeader, padding: 16 };

const cardStyle: React.CSSProperties = {
  borderRadius: 16,
  border,
  background: gradient,
  color: "white",
  padding: 16,
};
const kLabel: React.CSSProperties = { color: "#a3a3a3", fontSize: 12 };
const kValue: React.CSSProperties = { marginTop: 4, fontWeight: 900, fontSize: 22 };
const kHint: React.CSSProperties  = { marginTop: 6, color: "#8b8b8b", fontSize: 12 };

const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "8px 10px", borderBottom: border, color: "#a3a3a3", fontWeight: 700,
};
const tdStyle: React.CSSProperties = {
  padding: "8px 10px", borderBottom: "1px solid #1e1e1e", color: "white",
};
const tfStyle: React.CSSProperties = {
  padding: "10px", borderTop: border, fontWeight: 800, color: "white",
};
const noteStyle: React.CSSProperties = {
  borderRadius: 12, border, background: "#0f0f0f", color: "white", padding: 12,
};

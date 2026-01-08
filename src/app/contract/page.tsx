// src/app/contract/page.tsx
"use client";

import AddressQR from "../../components/AddressQR";
import { ENV } from "../../env";

const border = "1px solid #2a2a2a";
const gradient = "linear-gradient(180deg,#101010 0%, #000 100%)";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12, alignItems: "center" }}>
      <div style={{ color: "#a3a3a3", fontSize: 12 }}>{label}</div>
      <div style={{ fontFamily: "monospace", fontSize: 14, wordBreak: "break-all" }}>{value}</div>
    </div>
  );
}

// Helper to shorten long addresses for display
function short(a: string) {
  return a.length > 16 ? a.slice(0, 6) + "…" + a.slice(-6) : a;
}

export default function ContractPage() {
  // Read optional public wallets from env; show only those that exist.
  // We intentionally DO NOT read/show any Team wallet here.
  const OPTIONAL = [
    {
      label: "Presale stock (tokens source)",
      value: process.env.NEXT_PUBLIC_WALLET_PRESALE_STOCK,
      note:
        "This address holds the token inventory used during presale. It is not used to receive SOL.",
    },
    {
      label: "Rewards (holders/airdrop)",
      value: process.env.NEXT_PUBLIC_WALLET_REWARDS,
      note:
        "Reserve for holders’ airdrops and community rewards.",
    },
    {
      label: "LP (Liquidity / holders pool)",
      value: process.env.NEXT_PUBLIC_WALLET_LP,
      note:
        "Pool intended for liquidity provisioning and long-term distribution to holders.",
    },
    {
      label: "Treasury reserve",
      value: process.env.NEXT_PUBLIC_WALLET_TREASURY_RESERVE,
      note:
        "Long-term reserve (treasury/charity/burn policy).",
    },
  ].filter((w) => !!w.value) as { label: string; value: string; note: string }[];

  return (
    <main style={{ display: "grid", gap: 16 }}>
      {/* Header */}
      <section style={cardHeader}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Contract</h1>
        <p style={{ marginTop: 6, color: "#a3a3a3", fontSize: 14 }}>
          Public addresses for verification (devnet preview).
        </p>
      </section>

      {/* Core addresses */}
      <section style={cardBody}>
        <div style={{ display: "grid", gap: 12 }}>
          <Row label="Program ID" value={ENV.PROGRAM_ID || "—"} />
          <Row label="Token mint" value={ENV.MINT} />
          <Row label="Presale treasury (SOL)" value={ENV.TREASURY} />
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 12, color: "#a3a3a3", marginBottom: 6 }}>Mint QR</div>
            <AddressQR value={ENV.MINT} size={140} />
            <p style={qrNote}>
              Scan to add/verify the <b>official token mint</b> in your wallet or explorer. Helps avoid fake tokens.
            </p>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#a3a3a3", marginBottom: 6 }}>Presale treasury (SOL) QR</div>
            <AddressQR value={ENV.TREASURY} size={140} />
            <p style={qrNote}>
              Scan to <b>send SOL to the presale treasury</b> manually (e.g., from mobile). Using the <b>Buy</b> page is recommended so the token transfer is handled for you.
            </p>
          </div>
        </div>
      </section>

      {/* Optional public wallets (team intentionally omitted) */}
      {OPTIONAL.length > 0 && (
        <section style={cardBody}>
          <h2 style={{ marginTop: 0, fontSize: 18, fontWeight: 800 }}>Project wallets (public)</h2>
          <div style={{ display: "grid", gap: 16 }}>
            {OPTIONAL.map((w) => (
              <div key={w.label} style={{ display: "grid", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{w.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
                  <div style={{ fontFamily: "monospace", fontSize: 14, wordBreak: "break-all" }}>{w.value}</div>
                  <div style={{ justifySelf: "end" }}>
                    <AddressQR value={w.value} size={120} />
                  </div>
                </div>
                <div style={{ color: "#a3a3a3", fontSize: 12 }}>{w.note}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Small privacy note */}
      <section style={cardBody}>
        <div style={{ fontSize: 12, color: "#a3a3a3" }}>
          We disclose only the addresses necessary for public verification. Operational and team wallets are intentionally not listed here for security reasons.
        </div>
      </section>
    </main>
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
const qrNote: React.CSSProperties = { maxWidth: 360, fontSize: 12, color: "#a3a3a3", marginTop: 8 };

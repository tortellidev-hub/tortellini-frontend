// frontend/src/components/BuyDisclaimer.tsx
"use client";

import React from "react";

export default function BuyDisclaimer({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const purpleBtn: React.CSSProperties = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    borderRadius: 16,
    fontWeight: 800,
    fontSize: 18,
    border: "none",
    color: "white",
    background: "linear-gradient(90deg,#8b5cf6 0%, #6d28d9 100%)",
    boxShadow: "0 10px 30px rgba(139,92,246,0.35)",
    cursor: "pointer",
  };
  const purpleBtnGhost: React.CSSProperties = {
    ...purpleBtn,
    background: "transparent",
    color: "#e5e7eb",
    border: "1px solid #6d28d9",
    boxShadow: "none",
  };

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid #2a2a2a",
        background: "linear-gradient(180deg,#101010 0%, #000 100%)",
        color: "white",
        padding: 16,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Disclaimer & Risks</h2>
      <p style={{ marginTop: 8, color: "#d1d5db", lineHeight: 1.6, fontSize: 14 }}>
        By proceeding you acknowledge that this is an experimental presale on Solana Devnet
        for testing purposes only. Tokens have no monetary value, smart contracts can contain
        bugs, and on-chain parameters may change during testing.
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        {!checked ? (
          <button
            type="button"
            onClick={() => onChange(true)}
            style={purpleBtn}
            title="Accept Disclaimer Before Buying"
          >
            Accept Disclaimer Before Buying
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onChange(false)}
            style={purpleBtnGhost}
            title="Revoke acceptance"
          >
            Revoke
          </button>
        )}
      </div>
    </div>
  );
}

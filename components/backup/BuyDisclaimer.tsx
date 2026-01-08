"use client";

import React from "react";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
};

export default function BuyDisclaimer({ checked, onChange }: Props) {
  const phantomCtaStyle: React.CSSProperties = {
    background: "linear-gradient(90deg, #ab68ff 0%, #8b5cf6 50%, #7c3aed 100%)",
    color: "#fff",
    border: "1px solid rgba(171,104,255,0.25)",
    borderRadius: 18,
    minHeight: 90, // ~ three lines tall
    fontWeight: 900,
    fontSize: 18,
    letterSpacing: 0.2,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
    padding: "0 28px",
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 space-y-4">
      <h2 className="text-lg font-extrabold">Disclaimer & Risks</h2>
      <div className="text-sm text-neutral-300 leading-relaxed">
        Buying $TORT is highly speculative. Prices can be volatile and you may
        lose some or all of your funds. Do your own research and only spend
        what you can afford to lose.
      </div>

      {!checked ? (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => onChange(true)}
            style={phantomCtaStyle}
            aria-label="Accept Disclaimer Before Buying"
            title="Accept Disclaimer Before Buying"
          >
            Accept Disclaimer Before Buying
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <div className="text-emerald-400 text-sm font-semibold">
            ✓ Disclaimer accepted — you can buy now.
          </div>
          <button
            type="button"
            onClick={() => onChange(false)}
            className="text-xs text-neutral-400 hover:text-neutral-200 underline"
            title="Revoke acceptance"
          >
            Revoke
          </button>
        </div>
      )}
    </div>
  );
}

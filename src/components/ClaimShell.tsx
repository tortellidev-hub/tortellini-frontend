// src/components/ClaimShell.tsx
"use client";

import type { ReactNode } from "react";

const border = "1px solid #2a2a2a";
const gradient = "linear-gradient(180deg,#101010 0%, #000 100%)";
const panelBg = "#0f0f0f";

export default function ClaimShell({
  title = "Claim Airdrop",
  subtitle = "Claim within the active window if you’re eligible.",
  children,
  side,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  side?: ReactNode;
}) {
  return (
    <main style={{ display: "grid", gap: 16 }}>
      {/* Header */}
      <section
        style={{
          borderRadius: 16,
          border,
          background: gradient,
          color: "white",
          padding: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{title}</h1>
        <p style={{ marginTop: 6, color: "#a3a3a3", fontSize: 14 }}>{subtitle}</p>
      </section>

      {/* Body grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 16,
        }}
      >
        {/* Left: your existing form / logic */}
        <div
          style={{
            borderRadius: 16,
            border,
            background: gradient,
            color: "white",
            padding: 16,
          }}
        >
          {children}
        </div>

        {/* Right: tips / status / marketing */}
        <aside
          style={{
            display: "grid",
            gap: 12,
            alignSelf: "start",
          }}
        >
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
              <li>Claim within the window</li>
              <li>Unclaimed tokens are swept after close</li>
            </ul>
          </div>

          {side ?? (
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
                $TORT is engineered to increase your <em>happiness per click</em>.
                Friendly fees, fast claims, community rewards.
              </p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

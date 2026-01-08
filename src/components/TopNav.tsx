// src/components/TopNav.tsx
"use client";

import Link from "next/link";
import { WalletSection } from "./WalletSection";

export default function TopNav() {
  return (
    <header
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "16px 20px 8px",
      }}
    >
      {/* centered inner wrap */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="brand"
          style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}
        >
          <img
            src="/icon.jpg"
            alt="Tortellini"
            width={28}
            height={28}
            style={{ borderRadius: 8, border: "1px solid var(--border)" }}
          />
          <span>Tortellini</span>
        </Link>

        {/* Right side: menu + wallet */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <nav
            className="links"
            style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}
          >
            <Link className="pill" href="/buy">Buy</Link>
            <Link className="pill" href="/claim">Claim</Link>
            <Link className="pill" href="/faq">FAQ</Link>
            <Link className="pill" href="/contract">Contract</Link>
            <Link className="pill" href="/admin">Admin</Link>
            <Link className="pill" href="/logout">Logout</Link>
          </nav>

          {/* 👇 Pulsante Phantom + info wallet */}
          <WalletSection />
        </div>
      </div>
    </header>
  );
}

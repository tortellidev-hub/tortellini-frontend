// components/TopNav.tsx
"use client";

import Link from "next/link";

export default function TopNav() {
  return (
    <header
      className="wrap"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingTop: 16,
        paddingBottom: 8,
      }}
    >
      {/* Brand */}
      <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
        <img
          src="/icon.jpg"
          alt="Tortellini"
          width={28}
          height={28}
          style={{ borderRadius: 8, border: "1px solid var(--border)" }}
        />
        <span>Tortellini</span>
      </Link>

      {/* Main menu */}
      <nav className="links" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link className="pill" href="/buy">Buy</Link>
        <Link className="pill" href="/claim">Claim</Link>
        <Link className="pill" href="/faq">FAQ</Link>
        <Link className="pill" href="/contract">Contract</Link>
        <Link className="pill" href="/admin">Admin</Link>
        <Link className="pill" href="/logout">Logout</Link>
      </nav>
    </header>
  );
}

// src/app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  const border = "1px solid #2a2a2a";
  const darkBg = "linear-gradient(180deg,#101010 0%, #000 100%)";
  const panelBg = "#0b0b0b";

  return (
    <main style={{ display: "grid", gap: 28 }}>
      {/* === HERO SCURO (testo + visual + preview) === */}
      <section
        style={{
          borderRadius: 24,
          border,
          background: darkBg,
          color: "white",
          overflow: "hidden",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gap: 28,
          }}
        >
          {/* Headline + CTA */}
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: 999,
                border,
                background: "rgba(255,255,255,0.06)",
              }}
            >
              Built on Solana • Fast & low fees
            </span>

            <h1
              style={{
                marginTop: 18,
                fontWeight: 900,
                fontSize: 42,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              The delicious token you can actually{" "}
              <span style={{ color: "#67e8f9" }}>taste</span> in rewards
            </h1>

            <p style={{ marginTop: 10, color: "#cfcfcf", fontSize: 18 }}>
              Join the presale, collect airdrops at key milestones and enjoy community-driven rewards.
              Transparent tokenomics, clear roadmap, no fluff.
            </p>

            <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/buy"
                style={{
                  padding: "12px 20px",
                  borderRadius: 16,
                  background: "#2dd4bf",
                  color: "black",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Join Presale
              </Link>
              <Link
                href="/claim"
                style={{
                  padding: "12px 20px",
                  borderRadius: 16,
                  border,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Claim Airdrop
              </Link>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "12px 20px",
                  borderRadius: 16,
                  border,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                Follow on X
              </a>
            </div>

            <p style={{ marginTop: 8, color: "#9a9a9a", fontSize: 12 }}>
              Devnet preview • No investment advice
            </p>
          </div>

          {/* Visual + testo marketing affiancati */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: 18,
            }}
          >
            {/* Visual */}
            <div
              style={{
                borderRadius: 16,
                border,
                background: panelBg,
                padding: 10,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "5 / 4",
                  overflow: "hidden",
                  borderRadius: 12,
                }}
              >
                <Image
                  src="/tortellini.jpg"
                  alt="Tortellini"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>

            {/* Preview marketing */}
            <aside
              style={{
                alignSelf: "center",
                display: "grid",
                gap: 12,
                padding: 6,
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Why $TORT?</h3>
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5, color: "#d6d6d6" }}>
                <li><strong>Presale perks</strong>: early supporters get more $TORT per SOL.</li>
                <li><strong>Claimable airdrops</strong>: milestones → snapshots → rewards.</li>
                <li><strong>Low fees</strong>: Solana fast finality, tiny tx costs.</li>
                <li><strong>Made for joy</strong>: a token that increases <em>happiness per click</em>.</li>
              </ul>
              <div style={{ fontSize: 12, color: "#9a9a9a" }}>
                1 SOL = dynamic $TORT (phase-based). See FAQ for details.
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* === 3 cards info — TEMA SCURO MATCH === */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 16,
        }}
      >
        {[
          {
            title: "Tokenomics",
            subtitle: "How it works",
            text: "Transparent supply split for presale, airdrops and growth.",
            href: "/faq",
            cta: "Read FAQ →",
          },
          {
            title: "Airdrops",
            subtitle: "Claim",
            text: "Claimable tokens after snapshots and milestones.",
            href: "/claim",
            cta: "Claim airdrop →",
          },
          {
            title: "Buy $TORT",
            subtitle: "Presale",
            text: "Fast checkout with your Solana wallet.",
            href: "/buy",
            cta: "Buy now →",
          },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              borderRadius: 16,
              border,
              background: darkBg,     // 👈 stesso gradiente scuro
              color: "white",
              padding: 20,
            }}
          >
            <div style={{ color: "#a3a3a3", fontSize: 14 }}>{c.subtitle}</div>
            <div style={{ marginTop: 6, fontWeight: 800, fontSize: 18 }}>{c.title}</div>
            <p style={{ marginTop: 8, color: "#d4d4d4", fontSize: 14 }}>{c.text}</p>
            <Link
              href={c.href}
              style={{
                marginTop: 12,
                display: "inline-block",
                fontSize: 14,
                textDecoration: "underline",
                color: "#67e8f9",
              }}
            >
              {c.cta}
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}

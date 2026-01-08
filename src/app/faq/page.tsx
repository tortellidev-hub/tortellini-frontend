// frontend/src/app/faq/page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold">TORTELLINI Presale – FAQ</h1>
        <p className="text-neutral-400">
          Clear answers, no jargon. If something is still unclear, read it twice — this page is designed to be idiot‑proof 🙂
        </p>
      </header>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">What is TORTELLINI ($TORT)?</h2>
        <p className="text-neutral-300">
          TORTELLINI ($TORT) is a Solana token currently in presale. During the presale you can buy TORT using SOL
          before public listing on a DEX.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">How do I buy TORT from my computer?</h2>
        <ol className="list-decimal list-inside text-neutral-300 space-y-2">
          <li>Open the <Link href="/buy" className="underline">Buy page</Link></li>
          <li>Connect your wallet (Phantom or Solflare on browser)</li>
          <li>Enter the amount of SOL you want to spend</li>
          <li>Accept the disclaimer</li>
          <li>Click <b>Buy</b> and confirm the transaction in your wallet</li>
        </ol>
        <p className="text-neutral-300">
          After on‑chain confirmation, your TORT tokens are <b>automatically sent to your wallet</b>.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Is buying from browser the recommended method?</h2>
        <p className="text-neutral-300">
          Yes. Buying from a desktop or laptop browser is the <b>simplest, fastest and safest</b> way to participate
          in the presale.
        </p>
        <p className="text-neutral-300">
          This method gives the best user experience and immediate token delivery to your wallet.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Can I buy TORT from my phone?</h2>
        <p className="text-neutral-300">
          Yes — but with some limitations.
        </p>
        <p className="text-neutral-300">
          Mobile wallets (Phantom, Solflare) do not currently support custom presale flows as smoothly as browser
          wallets. For this reason, mobile buying works differently.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">I paid using the QR code. What happens next?</h2>
        <p className="text-neutral-300">
          When you scan the QR code and send SOL:
        </p>
        <ol className="list-decimal list-inside text-neutral-300 space-y-2">
          <li>Your SOL is sent to the official presale treasury</li>
          <li>The transaction is confirmed on the Solana blockchain</li>
          <li>Your TORT tokens are <b>automatically distributed to the same wallet</b> that sent the SOL</li>
        </ol>
        <p className="text-neutral-300">
          In short: <b>your TORT tokens will reach your wallet</b>. There is no manual claim required.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Do I need to trust anyone manually?</h2>
        <p className="text-neutral-300">
          No. Everything is handled by on‑chain logic. Once your payment is confirmed, the distribution rules
          are applied automatically.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Why doesn’t Phantom mobile have a “Buy TORT” button?</h2>
        <p className="text-neutral-300">
          Phantom mobile is designed mainly for swaps on large DEXs and NFT interactions. It does not currently
          support custom presale purchase flows on devnet.
        </p>
        <p className="text-neutral-300">
          This is a wallet limitation — not an issue with the TORTELLINI presale.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Will my tokens be locked or vested?</h2>
        <p className="text-neutral-300">
          No. TORT tokens purchased during the presale are <b>fully unlocked</b> and usable as soon as they reach
          your wallet.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">What if something goes wrong?</h2>
        <p className="text-neutral-300">
          If you used the browser buy flow and your transaction was confirmed, your tokens will arrive.
        </p>
        <p className="text-neutral-300">
          If you paid via QR, simply wait for confirmation — the distribution is automatic and on‑chain.
        </p>
      </section>

      {/* ───────────────────────────── */}
      <footer className="pt-6 border-t border-neutral-800 text-sm text-neutral-500">
        This FAQ is part of the TORTELLINI presale. Always double‑check URLs and never trust private messages.
      </footer>
    </div>
  );
}

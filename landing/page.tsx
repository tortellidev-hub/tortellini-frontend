// app/landing/page.tsx
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Tortellini Token — Presale, airdrop & reward",
  description:
    "Tortellini Token: semplice, trasparente, con presale e airdrop automatici al raggiungimento di milestone on-chain.",
  openGraph: {
    title: "Tortellini Token",
    description:
      "Tokenomics chiare, roadmap a milestone, presale e airdrop non custodial su Solana.",
    images: [{ url: "/tortellini.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tortellini Token",
    description:
      "Tokenomics chiare, roadmap a milestone, presale e airdrop su Solana.",
    images: ["/tortellini.jpg"],
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/tortellini.jpg"
              alt="Tortellini logo"
              width={36}
              height={36}
              className="rounded-md object-cover"
            />
            <span className="font-semibold tracking-wide">Tortellini Token</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-300">
            <a href="#how">Come funziona</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/buy"
              className="inline-flex items-center rounded-md bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200 transition"
            >
              Join Presale
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Il token che <span className="text-emerald-400">premia</span> la community
            </h1>
            <p className="text-zinc-300 text-lg">
              Presale trasparente, airdrop automatici al superamento di soglie di capitalizzazione,
              e una roadmap guidata da milestone on-chain. Costruito su <b>Solana</b>.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/buy"
                className="inline-flex items-center rounded-md bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-3 text-sm font-semibold transition"
              >
                Partecipa ora
              </Link>
              <a
                href="https://x.com/TortelliMaker"
                target="_blank"
                className="inline-flex items-center rounded-md border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
                rel="noreferrer"
              >
                X (Twitter)
              </a>
              <a
                href="https://www.reddit.com/user/Tortelli-Maker/"
                target="_blank"
                className="inline-flex items-center rounded-md border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
                rel="noreferrer"
              >
                Reddit
              </a>
            </div>
            <p className="text-xs text-zinc-500">
              Non è un consiglio finanziario. Fai sempre le tue ricerche.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-emerald-500/20 blur-lg" />
              <Image
                src="/tortellini.jpg"
                alt="Tortellini"
                width={320}
                height={320}
                className="relative rounded-xl object-cover ring-1 ring-white/10 shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Come funziona</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Presale",
              desc:
                "Acquisti una quota iniziale. I fondi vanno nel treasury e il mint è pubblico e verificabile.",
            },
            {
              title: "Milestone",
              desc:
                "Al raggiungimento di soglie (es. 10×, 100×, 1000×) si registra uno snapshot on-chain.",
            },
            {
              title: "Airdrop",
              desc:
                "Si aprono finestre di claim per gli aventi diritto, con regole chiare e trasparenti.",
            },
          ].map((x) => (
            <div
              key={x.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="text-emerald-400 font-semibold">{x.title}</div>
              <p className="text-sm text-zinc-300 mt-2">{x.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Tokenomics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { k: "Supply totale", v: "1,000,000,000" },
            { k: "Tasse", v: "0%" },
            { k: "Presale", v: "XX%" },
            { k: "Treasury/Liquidity", v: "YY%" },
          ].map((i) => (
            <div
              key={i.k}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm text-center"
            >
              <div className="text-sm text-zinc-400">{i.k}</div>
              <div className="mt-1 text-2xl font-bold">{i.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-zinc-400">
          Numeri indicativi: sostituiscili con i valori definitivi quando pronti.
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Roadmap</h2>
        <ol className="relative border-l border-white/10 ml-3 space-y-8">
          {[
            {
              phase: "Fase 1",
              title: "Presale + setup",
              text:
                "Deployment contratto, configurazione treasury e apertura presale.",
            },
            {
              phase: "Fase 2",
              title: "Milestone 10×",
              text:
                "Primo snapshot e finestra claim airdrop; espansione community.",
            },
            {
              phase: "Fase 3",
              title: "Milestone 100×/1000×",
              text:
                "Airdrop progressivi con parametri e finestre di validità pubblici.",
            },
          ].map((s, idx) => (
            <li key={idx} className="ml-6">
              <span className="absolute -left-3 mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black text-xs font-bold">
                {idx + 1}
              </span>
              <h3 className="font-semibold">{s.phase} — {s.title}</h3>
              <p className="text-sm text-zinc-300 mt-1">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Link
            href="/admin/milestones"
            className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            Vista tecnica (snapshot & claim)
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Chi gestisce l’airdrop?",
              a: "È non-custodial: le regole sono nel contratto e gli snapshot vengono registrati on-chain.",
            },
            {
              q: "Serve KYC?",
              a: "No. Connetti il wallet e interagisci.",
            },
            {
              q: "Che rete usate?",
              a: "Solana. Costi bassi, finalità rapida e tooling maturo.",
            },
            {
              q: "Dove trovo aggiornamenti?",
              a: "Su X e Reddit. I link sono nella hero in alto.",
            },
          ].map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className="font-semibold">{f.q}</div>
              <p className="text-sm text-zinc-300 mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Tortellini Token</div>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/TortelliMaker"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-200"
            >
              X
            </a>
            <a
              href="https://www.reddit.com/user/Tortelli-Maker/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-200"
            >
              Reddit
            </a>
            <Link href="/buy" className="hover:text-zinc-200">
              Presale
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

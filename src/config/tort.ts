// frontend/src/config/tort.ts  — Next.js friendly (no import.meta.env)
export const TORT = {
  RPC: process.env.NEXT_PUBLIC_RPC || "https://api.devnet.solana.com",

  PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID ?? "GhkrgU47GmoNwr4ufpASzNb9aGZSyq6hA3jJrhM81zi5",
  MINT:       process.env.NEXT_PUBLIC_MINT       ?? "B6RRamdJmX4QdgUxjL8Y63UkGaM27fPRqExU9Y2EReLs",
  TREASURY:   process.env.NEXT_PUBLIC_TREASURY   ?? "8x5jqfcN1iH9reUt1isfidJRV8EpxpTAKPKSuZZPkXVa",

  SYMBOL: "TORT",
  PRESALE: {
    PHASE: "Phase",
    // usato solo come fallback visuale se la lettura on-chain fallisce
    TORT_PER_SOL: 50000,
  },
};

// src/config/tort.ts

export type Phase =
  | "Phase 1"
  | "Phase 2"
  | "Phase 3";

export const TORT = {
  SYMBOL: "TORT",

  PRESALE: {
    PHASES: ["Phase 1", "Phase 2", "Phase 3"] as Phase[],

    // ⚠️ SOLO UI / KPI — non on-chain
    ALLOCATION: 420_690_000_000, // ← metti qui il totale presale corretto
    TORT_PER_SOL: 50000,
  },
};

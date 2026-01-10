// src/config/tort.ts

export type Phase =
  | "Phase 1"
  | "Phase 2"
  | "Phase 3";

export const TORT = {
  SYMBOL: "TORT",

  PRESALE: {
    PHASES: ["Phase 1", "Phase 2", "Phase 3"] as Phase[],
    DEFAULT_TORT_PER_SOL: 50000,
  },
};

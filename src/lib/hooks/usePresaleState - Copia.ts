// frontend/src/hooks/usePresaleState.ts
import { useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getProgram, deriveStatePda } from "../lib/anchorClient";

// Proviamo a individuare dinamicamente il nome dell'account (es. "state", "presaleState", ecc.)
function pickAccountName(program: any): string | null {
  const names = Object.keys(program.account ?? {});
  const lc = names.map((n) => n.toLowerCase());
  const prefer = ["state", "presale", "presalestate", "config", "settings"];
  for (const p of prefer) {
    const i = lc.indexOf(p);
    if (i >= 0) return names[i];
  }
  // fallback: primo account disponibile
  return names[0] ?? null;
}

export type PresaleState = {
  // campi minimi che ci interessano per UI; gli altri restano any
  currentPhase?: number;
  phases?: Array<{ rate_per_lamport: bigint; cap: bigint; sold: bigint }>;
  frozen?: boolean;
  raw?: any;
};

export function usePresaleState() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<PresaleState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { program, programId } = await getProgram();
        const accountName = pickAccountName(program);
        if (!accountName) throw new Error("No accounts in IDL");

        const statePda: PublicKey = deriveStatePda(programId);
        const accClient = (program.account as any)[accountName];
        const fetched = await accClient.fetch(statePda);

        // Proviamo a mappare i campi più comuni
        const currentPhase =
          Number(fetched.currentPhase ?? fetched.current_phase ?? fetched.phase ?? 0);

        const phasesArr =
          (fetched.phases as any[]) ??
          (fetched.phase ?? []);

        const phases = (phasesArr || []).map((p: any) => ({
          rate_per_lamport: BigInt(p.rate_per_lamport ?? p.rate ?? 0),
          cap: BigInt(p.cap ?? 0),
          sold: BigInt(p.sold ?? 0),
        }));

        const frozen = Boolean(fetched.frozen ?? fetched.paused ?? false);

        if (!mounted) return;
        setState({ currentPhase, phases, frozen, raw: fetched });
        setError(null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? String(e));
        setState(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const phase = useMemo(() => {
    if (!state?.phases || state.currentPhase == null) return null;
    return state.phases[state.currentPhase] ?? null;
  }, [state]);

  return { loading, error, state, phase };
}

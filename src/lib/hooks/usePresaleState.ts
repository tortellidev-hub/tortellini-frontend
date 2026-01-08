import { useEffect, useState } from "react";
import { getProgram, deriveStatePda } from "../lib/anchorClient";
import { PublicKey } from "@solana/web3.js";

type Phase = { rate_per_lamport: bigint; cap: bigint; sold: bigint };
type PresaleState = {
  currentPhase: number;
  phases: Phase[];
  decimals: number;
  lamportsRaised?: bigint;
};

export function usePresale() {
  const [state, setState] = useState<PresaleState | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { program, idl, programId } = await getProgram();
        const statePda: PublicKey = deriveStatePda(programId);

        // Trova account "state"/"presale" nell'IDL
        const accName =
          idl.accounts?.find(a =>
            a.name.toLowerCase().includes("state") ||
            a.name.toLowerCase().includes("presale")
          )?.name || "state";

        const camel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        const accNs = (program.account as any)[camel(accName)];
        if (!accNs?.fetch) throw new Error("Impossibile leggere l'account di stato");

        const raw = await accNs.fetch(statePda);

        // estrai fields in modo flessibile
        const currentPhase =
          Number(raw.currentPhase ?? raw.currPhase ?? raw.phase ?? 0);

        const decimals = Number(raw.decimals ?? 5);

        const lamportsRaised = raw.lamportsRaised
          ? BigInt(raw.lamportsRaised.toString())
          : undefined;

        // phases: array; ogni item {rate_per_lamport, cap, sold}
        const pArr: Phase[] = (raw.phases ?? raw.phaseConfigs ?? []).map((p: any) => ({
          rate_per_lamport: BigInt((p.rate_per_lamport ?? p.rate ?? 0).toString()),
          cap: BigInt((p.cap ?? 0).toString()),
          sold: BigInt((p.sold ?? 0).toString()),
        }));

        setState({ currentPhase, phases: pArr, decimals, lamportsRaised });
      } catch (e: any) {
        setErr(e?.message ?? String(e));
      } finally { setLoading(false); }
    })();
  }, []);

  return { state, loading, err };
}

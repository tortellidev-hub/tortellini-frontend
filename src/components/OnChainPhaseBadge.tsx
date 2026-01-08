// frontend/src/components/OnChainPhaseBadge.tsx
import React from "react";
import { usePresaleState } from "../hooks/usePresaleState";

export default function OnChainPhaseBadge() {
  const { loading, error, state, phase } = usePresaleState();

  if (loading) return <span className="inline-block px-2 py-1 rounded bg-gray-200 text-gray-700">Loading…</span>;
  if (error)   return <span className="inline-block px-2 py-1 rounded bg-red-200 text-red-700">Error</span>;
  if (!state)  return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-block px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-medium">
        On-chain phase: #{state.currentPhase}
      </span>
      {phase && (
        <>
          <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800">
            Rate: {phase.rate_per_lamport.toString()} UI / lamport
          </span>
          <span className="inline-block px-2 py-1 rounded bg-amber-100 text-amber-800">
            Cap: {phase.cap.toString()}
          </span>
          <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-800">
            Sold: {phase.sold.toString()}
          </span>
        </>
      )}
      {state.frozen && (
        <span className="inline-block px-2 py-1 rounded bg-gray-300 text-gray-700">
          Presale paused
        </span>
      )}
    </div>
  );
}

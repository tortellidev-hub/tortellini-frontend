import React from "react";
import { usePresale } from "../hooks/usePresale";

export function PhaseBadge() {
  const { state, loading, err } = usePresale();

  if (loading) return <div className="text-sm opacity-70">Loading on-chain…</div>;
  if (err) return <div className="text-sm text-red-600">Error: {err}</div>;
  if (!state) return null;

  const idx = state.currentPhase ?? 0;
  const ph = state.phases[idx] ?? state.phases[0];
  const sold = Number(ph.sold ?? 0n);
  const cap  = Number(ph.cap ?? 1n);
  const pct  = Math.min(100, Math.floor((sold / cap) * 100));

  // 1 SOL ≈ rate_per_lamport * 1_000_000_000 (lamports per SOL)
  const uiPerSol = Number(ph.rate_per_lamport ?? 0n) * 1_000_000_000;

  return (
    <div className="rounded-xl border p-3 shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-black text-white">
          On-chain phase: #{idx}
        </span>
        <span className="text-xs opacity-70">1 SOL ≈ {uiPerSol.toLocaleString()} UI</span>
      </div>
      <div className="text-xs mb-1">Progress: {sold.toLocaleString()} / {cap.toLocaleString()} UI</div>
      <div className="h-2 w-full bg-gray-200 rounded">
        <div className="h-2 bg-black rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

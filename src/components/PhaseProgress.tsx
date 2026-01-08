// frontend/src/components/PhaseProgress.tsx
import React from "react";
import { usePresaleState } from "../hooks/usePresaleState";

export default function PhaseProgress() {
  const { loading, error, phase } = usePresaleState();
  if (loading || error || !phase) return null;

  const cap = Number(phase.cap);
  const sold = Number(phase.sold);
  const pct = cap > 0 ? Math.min(100, Math.round((sold / cap) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>Progress</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
        <div className="h-2 bg-green-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs text-gray-600">
        {sold.toLocaleString()} / {cap.toLocaleString()} UI venduti nella fase corrente
      </div>
    </div>
  );
}

"use client";

import { Lightbulb, Loader2 } from "lucide-react";

type Props = {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
};

export function HintButton({ onClick, loading, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.625rem] md:text-xs font-bold uppercase transition-all
        ${
          loading
            ? "bg-amber-500/30 text-amber-400 border border-amber-500/50 cursor-wait"
            : disabled
              ? "bg-slate-800/50 text-slate-600 border border-slate-700/50 cursor-not-allowed"
              : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400/50 active:bg-amber-500/30"
        }
      `}
      title="Obtener sugerencia de jugada"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Lightbulb className="w-3 h-3" />
      )}
      {loading ? "Pensando..." : "Pista"}
    </button>
  );
}

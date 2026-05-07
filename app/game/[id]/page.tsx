"use client";

import React, { useState, useCallback } from "react";
import { Chess, Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { ArrowLeft, RotateCcw, Languages, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation"; // Añadido
import { useQuery } from "@tanstack/react-query"; // Añadido
import { createBrowserClient } from '@supabase/ssr'// Añadido
import { Profile } from "@/types/index";

export default function ChessGame() {
  // 1. Incisión Quirúrgica: Traer los datos del GM usando el ID de la URL
  const params = useParams();
  const id = params?.id;

  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

  const { data: master, isLoading } = useQuery({
    queryKey: ["gm", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!id,
  });

  const [game, setGame] = useState(new Chess());

  // 2. Verificación de seguridad
  const isGM = master?.role === "gm";

  const makeAMove = useCallback(
    (move: { from: string; to: string; promotion?: string }) => {
      try {
        const gameCopy = new Chess(game.fen());
        const result = gameCopy.move(move);
        setGame(gameCopy);
        return result;
      } catch {
        return null;
      }
    },
    [game],
  );

  function onDrop(sourceSquare: Square, targetSquare: Square): boolean {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    return move !== null;
  }

  function resetGame() {
    setGame(new Chess());
  }

  // 3. Estado de carga sutil para no romper el renderizado
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-mono">
        PREPARANDO TABLERO...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Salir de la sala
        </Link>

        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* TABLERO */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="relative w-full max-w-[600px] mx-auto shadow-2xl shadow-black/60 rounded-xl overflow-hidden border-[12px] border-slate-900 bg-slate-900">
            <Chessboard
              id="MainBoard"
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation="white"
              customDarkSquareStyle={{ backgroundColor: "#1e293b" }}
              customLightSquareStyle={{ backgroundColor: "#94a3b8" }}
              animationDuration={200}
            />
          </div>
        </div>

        {/* INFO DEL MAESTRO */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-900/20 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-amber-500/30 bg-slate-800 shadow-inner">
                <Image
                  src={master?.avatar_url || "/placeholder-user.png"}
                  alt={master?.name || "Maestro"}
                  fill
                  sizes="64px"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded border border-amber-500/30 uppercase tracking-tighter">
                    {master?.title || "GM"}
                  </span>
                  {isGM && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                  <span className="text-slate-500 text-[11px] font-mono">
                    ELO {master?.elo || "---"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {master?.name || "Maestro"}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

              <div className="bg-slate-950/50 rounded-xl p-4 h-72 border border-slate-800/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest text-[10px]">
                    Chat de Feedback
                  </p>
                  <p className="text-slate-600 text-xs italic">
                    Analizando jugadas con {master?.name?.split(" ")[0] || "el Maestro"}...
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Languages className="w-4 h-4 text-amber-400" />
                  <span>{master?.languages?.join(", ") || "Español"}</span>
                </div>
                {master?.is_available && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-slate-500 font-medium uppercase text-[10px]">
                      En línea
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
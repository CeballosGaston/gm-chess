"use client";

import { Chessboard } from "react-chessboard";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";

import { Profile } from "@/types";
import { useChessGame } from "@/features/game/hooks/useChessGame";

import {
  ArrowLeft,
  Languages,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChessGamePage() {
  const { id } = useParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: master, isLoading } = useQuery({
    queryKey: ["gm", id],
    queryFn: async () => {
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

  const {
    fen,
    onDrop,
    resetGame,
    turn,
    isCheck,
    isCheckmate,
    isDraw,
    moves,
  } = useChessGame();

  const isGM = master?.role === "gm";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500">
        PREPARANDO TABLERO...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between">
          <Link href="/" className="text-amber-400 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Salir
          </Link>

          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* BOARD */}
          <div className="lg:col-span-7 space-y-3">

            <div className="text-sm text-slate-400 flex justify-between">
              <span>Turno: {turn === "w" ? "Blancas" : "Negras"}</span>

              {isCheck && !isCheckmate && (
                <span className="text-red-400">Jaque</span>
              )}

              {isCheckmate && (
                <span className="text-red-500">Mate</span>
              )}

              {isDraw && (
                <span className="text-amber-400">Tablas</span>
              )}
            </div>

            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              animationDuration={200}
            />
          </div>

          {/* GM */}
          <div className="lg:col-span-5 space-y-4">

            <div className="flex gap-4 items-center">
              <Image
                src={master?.avatar_url || "/placeholder.png"}
                alt=""
                width={60}
                height={60}
                className="rounded"
              />

              <div>
                <div className="flex gap-2 items-center">
                  <span className="text-amber-400 text-xs">
                    {master?.title || "GM"}
                  </span>

                  {isGM && (
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                  )}
                </div>

                <h2 className="text-white font-bold">
                  {master?.name}
                </h2>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Moves: {moves.join(" ")}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
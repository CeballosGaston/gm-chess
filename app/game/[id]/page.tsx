"use client";

import { Chessboard } from "react-chessboard";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";

import { Profile } from "@/types";
import { useChessGame } from "@/features/game/hooks/useChessGame";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ChessGamePage() {
  const { id } = useParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // =========================
  // USER ACTUAL (SIN ANY)
  // =========================
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };

    getUser();
  }, [supabase]);

  // =========================
  // GAME + GM DATA
  // =========================
  const { data: gameData, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (gameError) throw gameError;

      const { data: gm, error: gmError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", game.gm_id)
        .single();

      if (gmError) throw gmError;

      return {
        game,
        gm: gm as Profile,
      };
    },
    enabled: !!id,
  });

  const master = gameData?.gm;

  // =========================
  // COLOR LOGIC (CLAVE)
  // =========================
  const playerColor =
    userId && gameData?.game
      ? userId === gameData.game.student_id
        ? "w"
        : "b"
      : "w";

  // =========================
  // CHESS HOOK
  // =========================
  const { fen, onDrop, turn, isCheck, isCheckmate, isDraw, moves } =
    useChessGame({
      gameId: id as string,
      playerColor,
    });

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
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* BOARD */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-sm text-slate-400 flex justify-between">
              <span>Turno: {turn === "w" ? "Blancas" : "Negras"}</span>

              {isCheck && !isCheckmate && (
                <span className="text-red-400">Jaque</span>
              )}

              {isCheckmate && <span className="text-red-500">Mate</span>}

              {isDraw && <span className="text-amber-400">Tablas</span>}
            </div>

            <Chessboard
              position={fen}
              onPieceDrop={(source, target) => {
                onDrop(source, target);

                return true;
              }}
              animationDuration={200}
              boardOrientation={playerColor === "b" ? "black" : "white"}
            />
          </div>

          {/* GM PANEL */}
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

                  {isGM && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                </div>

                <h2 className="text-white font-bold">{master?.name}</h2>
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

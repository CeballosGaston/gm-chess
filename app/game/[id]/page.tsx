"use client";

import { Chessboard } from "react-chessboard";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";
import { Profile } from "@/types";
import { useChessGame } from "@/features/game/hooks/useChessGame";
import { ArrowLeft, ShieldCheck, Swords} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import GameMessages from "../../../features/messages/components/GameMessages";

export default function ChessGamePage() {
  const { id } = useParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    getUser();
  }, [supabase]);

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

      return { game, gm: gm as Profile };
    },
    enabled: !!id,
  });

  const master = gameData?.gm;
  const playerColor = userId && gameData?.game
      ? userId === gameData.game.student_id ? "w" : "b"
      : "w";

  const { fen, onDrop, turn, isCheck, isCheckmate, isDraw, moves } =
    useChessGame({
      gameId: id as string,
      playerColor,
    });

  const isGM = userId === gameData?.game.gm_id;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-mono tracking-tighter animate-pulse">
        CARGANDO PARTIDA...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
    
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-3 lg:p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 text-xs md:text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al panel</span>
            <span className="sm:hidden">Salir</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-none">Instructor</p>
              <p className="text-xs text-white font-medium">{master?.name}</p>
            </div>
            <Image
              src={master?.avatar_url || "/placeholder.png"}
              alt="GM Avatar"
              width={32}
              height={32}
              className="rounded-full border border-slate-700 md:w-10 md:h-10"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-3 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
       
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          
         
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
            <div className="flex gap-2 items-center">
              <div className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase transition-all
                ${turn === playerColor 
                  ? "bg-amber-500 text-slate-950" 
                  : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                <Swords className="w-3 h-3" />
                {turn === playerColor ? "Tu Turno" : "Esperando..."}
              </div>

              {isCheck && !isCheckmate && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-500 px-3 py-1.5 rounded-md text-[10px] md:text-xs font-bold animate-pulse">
                  JAQUE
                </div>
              )}
            </div>

            {isCheckmate ? (
              <div className="bg-amber-500/20 border border-amber-500 text-amber-500 px-3 py-1.5 rounded-md text-[10px] md:text-xs font-black">
                🏆 JAQUE MATE
              </div>
            ) : (
              <div className="text-[10px] font-mono text-slate-500">
                Último mov: {moves[moves.length - 1] || "None"}
              </div>
            )}
          </div>

         
          <div className="w-full max-w-[600px] mx-auto lg:mx-0 shadow-2xl shadow-black ring-1 ring-slate-800 rounded-sm overflow-hidden aspect-square">
            <Chessboard
              position={fen}
              onPieceDrop={(source, target) => {
                onDrop(source, target);
                return true;
              }}
              animationDuration={300}
              boardOrientation={playerColor === "b" ? "black" : "white"}
              customDarkSquareStyle={{ backgroundColor: "#1e293b" }}
              customLightSquareStyle={{ backgroundColor: "#475569" }}
            />
          </div>
        </div>

     
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[500px] lg:h-auto min-h-[400px]">
          <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-inner">
            <div className="bg-slate-800/50 p-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Feedback del Maestro
              </h3>
            </div>
            
         
            <div className="flex-1 overflow-y-auto">
              <GameMessages gameId={id as string} isGM={isGM} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
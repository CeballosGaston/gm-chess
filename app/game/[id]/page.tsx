"use client";

import { useGetGame } from "@/features/game/hooks/useGetGame";
import { ChessGameView } from "@/features/game/components/ChessGameView";

export default function ChessGamePage() {
  const { id, gameData, isLoading, userId, isGM } = useGetGame();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 font-mono tracking-tighter animate-pulse">
        CARGANDO PARTIDA...
      </div>
    );
  }

  return (
    <ChessGameView 
      id={id} 
      gameData={gameData} 
      userId={userId} 
      isGM={isGM} 
    />
  );
}
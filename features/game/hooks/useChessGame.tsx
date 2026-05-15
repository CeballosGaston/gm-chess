"use client";

import { useCallback } from "react";
import { Chess, Square, Color } from "chess.js";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/features/auth/hooks/useUser";
import { useChessLogic } from "./useChessLogic";
import { useChessRealtime } from "./useChessRealtime";

type Props = {
  gameId: string;
  playerColor: Color;
};

export function useChessGame({ gameId, playerColor }: Props) {
  const { data: user } = useUser();
  const START_FEN = new Chess().fen();

  // Lógica de estado
  const { 
    fen, setFen, turn, setTurn, moves, isCheck, isCheckmate, isDraw 
  } = useChessLogic(START_FEN);

  // Lógica de Red/Realtime
  useChessRealtime(gameId, setFen, setTurn);

  const onDrop = useCallback(
    async (source: Square, target: Square): Promise<boolean> => {
      const game = new Chess(fen);

      if (game.turn() !== playerColor) return false;

      const move = game.move({
        from: source,
        to: target,
        promotion: "q",
      });

      if (!move) return false;

      const newFen = game.fen();
      const nextTurn = game.turn();

      let newStatus = "active";
      let winnerId = null;

      if (game.isCheckmate()) {
        newStatus = "finished";
        winnerId = user?.role || null;
      } else if (game.isGameOver()) {
        newStatus = "finished";
        winnerId = "draw";
      }

      setFen(newFen);
      setTurn(nextTurn);

      const { error } = await supabase
        .from("games")
        .update({
          fen: newFen,
          turn: nextTurn,
          status: newStatus,
          winner: winnerId,
          finished_at:
            newStatus === "finished" ? new Date().toISOString() : null,
        })
        .eq("id", gameId);

      if (error) {
        console.error("Error:", error.message);
        return false;
      }

      return true;
    },
    [fen, gameId, playerColor, user, setFen, setTurn],
  );

  return {
    fen,
    turn,
    onDrop,
    moves,
    isCheck,
    isCheckmate,
    isDraw,
  };
}
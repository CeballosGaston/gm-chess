"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Chess, Square, Color } from "chess.js";
import { supabase } from "@/lib/supabase";

import { useUser } from "@/features/auth/hooks/useUser";

type Props = {
  gameId: string;
  playerColor: Color;
};

type GamePayload = {
  new: {
    fen: string;
    turn: Color;
  };
};

export function useChessGame({ gameId, playerColor }: Props) {
  const { data: user } = useUser();
  const START_FEN = new Chess().fen();
  const [fen, setFen] = useState<string>(START_FEN);
  const [turn, setTurn] = useState<Color>("w");

  const chess = useMemo(() => new Chess(fen || undefined), [fen]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("games")
        .select("fen, turn")
        .eq("id", gameId)
        .single();

      if (data) {
        setFen(data.fen);
        setTurn(data.turn as Color);
      }
    };
    load();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`game-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        (payload: GamePayload) => {
          setFen(payload.new.fen);
          setTurn(payload.new.turn);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

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

    [fen, gameId, playerColor, user],
  );

  return {
    fen,
    turn,
    onDrop,
    moves: chess.history(),
    isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isDraw: chess.isDraw(),
  };
}

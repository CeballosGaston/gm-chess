"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Chess, Square, Color } from "chess.js";
import { supabase } from "@/lib/supabase";

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
  const START_FEN = new Chess().fen();
  const [fen, setFen] = useState<string>(START_FEN);
  const [turn, setTurn] = useState<Color>("w");

  const chess = useMemo(() => new Chess(fen || undefined), [fen]);

  // LOAD GAME
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
  }, [gameId]); // Aquí gameId es vital para recargar si cambias de partida

  // REALTIME
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]); // Solo gameId. Supabase no es necesario por ser import externo.

  // MOVE
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

      setFen(newFen);
      setTurn(nextTurn);
      

      const { error } = await supabase
        .from("games")
        .update({ fen: newFen, turn: nextTurn })
        .eq("id", gameId);

      if (error) {
  console.error("CÓDIGO ERROR:", error.code);
  console.error("MENSAJE ERROR:", error.message);
  console.error("DETALLES:", error.details);
  return false;
}
      return true;
    },
    [fen, gameId, playerColor] // Estas tres son las que hacen que la lógica sea correcta
  );

  return { fen, turn, onDrop, moves: chess.history(),
     isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isDraw: chess.isDraw(),};
}
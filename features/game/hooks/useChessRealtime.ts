import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Color } from "chess.js";

type GamePayload = {
  new: {
    fen: string;
    turn: Color;
  };
};

export function useChessRealtime(
  gameId: string, 
  setFen: (fen: string) => void, 
  setTurn: (turn: Color) => void
) {
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
  }, [gameId, setFen, setTurn]);

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
  }, [gameId, setFen, setTurn]);
}
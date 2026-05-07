"use client";

import { useCallback, useState } from "react";
import { Chess } from "chess.js";

export function useChessGame() {
  const [fen, setFen] = useState(() => new Chess().fen());

  const getGame = useCallback((fenValue: string) => {
    return new Chess(fenValue);
  }, []);

  const onDrop = useCallback(
    (source: string, target: string) => {
      const game = getGame(fen);

      const move = game.move({
        from: source,
        to: target,
        promotion: "q",
      });

      if (!move) return false;

      setFen(game.fen());
      return true;
    },
    [fen, getGame]
  );

  const resetGame = useCallback(() => {
    setFen(new Chess().fen());
  }, []);

  const game = getGame(fen);

  return {
    fen,
    onDrop,
    resetGame,

   
    turn: game.turn(),
    isCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    moves: game.history(),
  };
}
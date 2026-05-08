"use client";

import { useState } from "react";
import { Chess } from "chess.js";

export function useChessGame() {
  const [game, setGame] = useState(() => new Chess());

  function onDrop(source: string, target: string) {
    try {
      const gameCopy = new Chess();

      gameCopy.loadPgn(game.pgn());

      const move = gameCopy.move({
        from: source,
        to: target,
        promotion: "q",
      });

      if (!move) return false;

      setGame(gameCopy);

      return true;
    } catch {
      return false;
    }
  }

  function resetGame() {
    setGame(new Chess());
  }

  return {
    fen: game.fen(),
    onDrop,
    resetGame,

    turn: game.turn(),
    isCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    moves: game.history(),
  };
}
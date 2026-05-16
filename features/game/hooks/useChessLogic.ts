import { useState, useMemo } from "react";
import { Chess, Color } from "chess.js";

export function useChessLogic(initialFen: string) {
  const [fen, setFen] = useState<string>(initialFen);
  const [turn, setTurn] = useState<Color>("w");

  const chess = useMemo(() => new Chess(fen || undefined), [fen]);

  return {
    fen,
    setFen,
    turn,
    setTurn,
    chess,
    moves: chess.history(),
    isCheck: chess.inCheck(),
    isCheckmate: chess.isCheckmate(),
    isDraw: chess.isDraw(),
  };
}
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { Profile } from "@/types";
import { useChessGame } from "@/features/game/hooks/useChessGame";
import { useStockfish } from "@/features/game/hooks/useStockfish";
import { HintButton } from "@/features/game/components/HintButton";
import { ArrowLeft, ShieldCheck, Swords } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import GameMessages from "../../../features/messages/components/GameMessages";

interface GameRecord {
  id: string;
  gm_id: string;
  student_id: string;
  fen: string;
  turn: string;
  status: string;
  winner: string | null;
}

type Props = {
  id: string;
  gameData: {
    game: GameRecord;
    gm: Profile;
  } | undefined;
  userId: string | null;
  isGM: boolean;
};

export function ChessGameView({ id, gameData, userId, isGM }: Props) {
  const master = gameData?.gm;

  const playerColor = userId && gameData?.game
    ? userId === gameData.game.student_id ? "w" : "b"
    : "w";

  const { fen, onDrop, turn, isCheck, isCheckmate, moves } = useChessGame({
    gameId: id,
    playerColor,
  });

  const { getBestMove, loading, cancel } = useStockfish();
  const [hintMove, setHintMove] = useState<{ from: Square; to: Square } | null>(null);

  const isMyTurn = turn === playerColor && !isCheckmate;

  const handleHint = useCallback(async () => {
    cancel();
    setHintMove(null);
    const result = await getBestMove(fen);
    if (result) {
      setHintMove({ from: result.from as Square, to: result.to as Square });
    }
  }, [fen, getBestMove, cancel]);

  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState(0);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => setBoardSize(el.offsetWidth);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleDrop = useCallback(
    (source: Square, target: Square): boolean => {
      setHintMove(null);
      onDrop(source, target);
      return true;
    },
    [onDrop],
  );

  const squareSize = boardSize / 8;
  const files = "abcdefgh";

  const getSquareCenter = (sq: Square) => {
    const fileIdx = files.indexOf(sq[0]);
    const rankIdx = parseInt(sq[1]) - 1;
    const isBlack = playerColor === "b";
    const x = (isBlack ? 7 - fileIdx : fileIdx) * squareSize + squareSize / 2;
    const y = (isBlack ? rankIdx : 7 - rankIdx) * squareSize + squareSize / 2;
    return { x, y };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-3 lg:p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" aria-label="Volver al panel principal" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 text-xs md:text-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Volver al panel</span>
            <span className="sm:hidden">Salir</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right hidden xs:block">
              <p className="text-[0.625rem] text-amber-500 font-bold uppercase tracking-widest leading-none">Instructor</p>
              <p className="text-xs text-white font-medium">{master?.name}</p>
            </div>
            <Image
              src={master?.avatar_url || "/placeholder.png"}
              alt={master?.name ? `Avatar de ${master.name}` : "Avatar del Gran Maestro"}
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
              <div className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-[0.625rem] md:text-xs font-bold uppercase transition-all
                ${turn === playerColor 
                  ? "bg-amber-500 text-slate-950" 
                  : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                <Swords className="w-3 h-3" />
                {turn === playerColor ? "Tu Turno" : "Esperando..."}
              </div>

              {isCheck && !isCheckmate && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-500 px-3 py-1.5 rounded-md text-[0.625rem] md:text-xs font-bold animate-pulse">
                  JAQUE
                </div>
              )}

              {isMyTurn && !isGM && (
                <HintButton
                  onClick={handleHint}
                  loading={loading}
                  disabled={!isMyTurn}
                />
              )}
            </div>

            {isCheckmate ? (
              <div className="bg-amber-500/20 border border-amber-500 text-amber-500 px-3 py-1.5 rounded-md text-[0.625rem] md:text-xs font-black">
                🏆 JAQUE MATE
              </div>
            ) : (
              <div className="text-[0.625rem] font-mono text-slate-400">
                Último mov: {moves[moves.length - 1] || "None"}
              </div>
            )}
          </div>

          <div
            ref={boardRef}
            className="relative w-full max-w-[37.5rem] mx-auto lg:mx-0 shadow-2xl shadow-black ring-1 ring-slate-800 rounded-sm overflow-hidden aspect-square"
          >
            <Chessboard
              position={fen}
              onPieceDrop={handleDrop}
              animationDuration={300}
              boardOrientation={playerColor === "b" ? "black" : "white"}
              customDarkSquareStyle={{ backgroundColor: "#1e293b" }}
              customLightSquareStyle={{ backgroundColor: "#475569" }}
            />
            {hintMove && boardSize > 0 && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={boardSize}
                height={boardSize}
                viewBox={`0 0 ${boardSize} ${boardSize}`}
              >
                <circle
                  cx={getSquareCenter(hintMove.from).x}
                  cy={getSquareCenter(hintMove.from).y}
                  r={squareSize * 0.4}
                  fill="rgba(251, 191, 36, 0.35)"
                  stroke="rgb(251, 191, 36)"
                  strokeWidth={2}
                />
                <circle
                  cx={getSquareCenter(hintMove.to).x}
                  cy={getSquareCenter(hintMove.to).y}
                  r={squareSize * 0.4}
                  fill="rgba(251, 191, 36, 0.25)"
                  stroke="rgb(251, 191, 36)"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
                <line
                  x1={getSquareCenter(hintMove.from).x}
                  y1={getSquareCenter(hintMove.from).y}
                  x2={getSquareCenter(hintMove.to).x}
                  y2={getSquareCenter(hintMove.to).y}
                  stroke="rgb(251, 191, 36)"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  opacity={0.6}
                />
              </svg>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[31.25rem] lg:h-auto min-h-[25rem]">
          <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-inner">
            <div className="bg-slate-800/50 p-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Feedback del Maestro
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <GameMessages gameId={id} isGM={isGM} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
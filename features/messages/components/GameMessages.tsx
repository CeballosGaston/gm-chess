"use client";

import { useState } from "react";
import { useGameMessages } from "../hooks/useGameMessages";

export type GameMessage = {
  id: string;
  game_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type Props = {
  gameId: string;
  isGM: boolean;
};

export default function GameMessages({ gameId, isGM }: Props) {
  const { messages, sendMessage, isSending } = useGameMessages(gameId);

  const [content, setContent] = useState("");

  // =========================
  // SEND
  // =========================
  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      await sendMessage(content);

      setContent("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* HEADER */}
      <div>
        <h3 className="text-sm font-semibold text-amber-400">
          Comentarios de la partida
        </h3>

        <p className="text-xs text-slate-400">
          {isGM
            ? "Deja comentarios para el alumno"
            : "Comentarios del Gran Maestro"}
        </p>
      </div>

      {/* GM INPUT */}
      {isGM && (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe un comentario..."
            aria-label="Escribe un comentario para el alumno"
            className="w-full min-h-[100px] rounded-lg bg-slate-950 border border-slate-700 p-3 text-sm text-white resize-none focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500"
          />

          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded-lg transition disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
          >
            Enviar comentario
          </button>
        </div>
      )}

      {/* MESSAGES */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-xs text-slate-400">
            Todavía no hay comentarios.
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-slate-950 border border-slate-800 rounded-lg p-3"
          >
            <p className="text-sm text-slate-200 whitespace-pre-wrap">
              {message.content}
            </p>

            <div className="mt-2 text-[10px] text-slate-400">
              {new Date(message.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

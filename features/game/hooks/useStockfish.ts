"use client";

import { useCallback, useRef, useState } from "react";

type HintMove = {
  from: string;
  to: string;
  san: string;
  eval: number;
} | null;

const API_URL = "https://chess-api.com/v1";

export function useStockfish() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getBestMove = useCallback(async (fen: string): Promise<HintMove> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fen, depth: 12 }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();

      if (!data.move) throw new Error("No move returned");

      return {
        from: data.move.slice(0, 2),
        to: data.move.slice(2, 4),
        san: data.san || data.move,
        eval: data.eval ?? 0,
      };
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  return { getBestMove, loading, error, cancel };
}

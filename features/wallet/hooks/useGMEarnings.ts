"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { GAME_COST } from "@/features/game/config/gameConfig";

export function useGMEarnings(gmId: string | undefined) {
  return useQuery({
    queryKey: ["gm-earnings", gmId],
    queryFn: async () => {
      if (!gmId) return 0;

      const { count, error } = await supabase
        .from("games")
        .select("*", { count: "exact", head: true })
        .eq("gm_id", gmId);

      if (error) {
        console.error("Error fetching GM earnings:", error);
        return 0;
      }

          return (count ?? 0) * GAME_COST;
    },
    enabled: !!gmId,
    refetchInterval: 10_000,
  });
}

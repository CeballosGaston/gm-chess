import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { GameMessage } from "../components/GameMessages";

export function useGameMessages(gameId: string) {
  const queryClient = useQueryClient();

  // =========================
  // FETCH MESSAGES
  // =========================
  const messagesQuery = useQuery<GameMessage[]>({
    queryKey: ["messages", gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
  });

  // =========================
  // REALTIME
  // =========================
  useEffect(() => {
    if (!gameId) return;

    const channel = supabase
      .channel(`messages-${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newMessage = payload.new as GameMessage;

          queryClient.setQueryData(
            ["messages", gameId],
            (old: GameMessage[] = []) => [...old, newMessage],
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId, queryClient]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async (content: string) => {
    const { error } = await supabase.from("messages").insert({
      game_id: gameId,
      content,
      // sender_id lo puedes sacar del user hook luego
    });

    if (error) throw error;
  };

  return {
    messages: messagesQuery.data ?? [],
    sendMessage,
    isSending: messagesQuery.isLoading,
  };
}

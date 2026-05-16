import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";
import { Profile } from "@/types";
import { useEffect, useState } from "react";

export function useGetGame() {
  const { id } = useParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
    };
    getUser();
  }, [supabase]);

  const { data: gameData, isLoading } = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

      if (gameError) throw gameError;

      const { data: gm, error: gmError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", game.gm_id)
        .single();

      if (gmError) throw gmError;

      return { game, gm: gm as Profile };
    },
    enabled: !!id,
  });

  return {
    id: id as string,
    gameData,
    isLoading,
    userId,
    isGM: userId === gameData?.game.gm_id,
  };
}
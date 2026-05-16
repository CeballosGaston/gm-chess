"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Chess } from "chess.js";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { GAME_COST } from "@/features/game/config/gameConfig";
import { Profile } from "../../../types/index";

export function useGMGame(gm: Profile) {
  const router = useRouter();
  const { coins, spendCoins } = useWallet();

  const goTo = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(path);
  };

  const startGame = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("games")
      .insert({
        student_id: user.id,
        gm_id: gm.id,
        status: "waiting",
        fen: new Chess().fen(),
        turn: "w",
      })
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      return;
    }

    router.push(`/game/${data.id}`);
  };

  const handlePlayClick = async (e: React.MouseEvent) => {
    if (coins < GAME_COST) {
      console.error("No tienes suficientes fichas");
      return;
    }

    try {
      await startGame(e);
      await spendCoins(GAME_COST);
    } catch (error) {
      console.error("Error iniciando partida:", error);
    }
  };

  return {
    coins,
    GAME_COST,
    goTo,
    handlePlayClick,
  };
}
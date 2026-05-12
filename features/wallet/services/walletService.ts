import { supabase } from "@/lib/supabase";

export const walletService = {
  // =========================
  // ADD COINS
  // =========================
  addCoins: async (userId: string, amount: number) => {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;
    if (!profile) throw new Error("User not found");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        coins: profile.coins + amount,
      })
      .eq("id", userId)
      .select("coins")
      .single();

    if (error) throw error;

    return data;
  },

  // =========================
  // SPEND COINS
  // =========================
  spendCoins: async (userId: string, amount: number) => {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;
    if (!profile) throw new Error("User not found");

    if (profile.coins < amount) {
      throw new Error("Not enough coins");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        coins: profile.coins - amount,
      })
      .eq("id", userId)
      .select("coins")
      .single();

    if (error) throw error;

    return data;
  },
};
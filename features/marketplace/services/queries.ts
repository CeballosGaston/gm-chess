// features/marketplace/services/queries.ts
import { supabase } from "@/lib/supabase";
import { Profile } from "../../../types/index";

export const profileService = {
  getGMs: async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "gm")
      .order("elo", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  getGmById: async (id: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
     console.error('❌ Error de Supabase:', error.message, error.details);
      return null;
    }
    return data;
  },
};

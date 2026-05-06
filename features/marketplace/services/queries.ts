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
      console.error("Supabase error:", error.message, error.details);
      return null;
    }
    return data;
  },
async getCurrentUser(): Promise<Profile | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
console.log("1. Usuario Auth:", user);
 if (authError || !user) {
    console.log("Error de Auth o no hay usuario:", authError);
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
    console.log("2. Perfil en DB:", profile); // ¿Existe la fila en la tabla profiles?
  console.log("3. Error de DB:", error);

  if (error || !profile) {
   
    const fallbackUser = {
      id: user.id,
      name: user.user_metadata?.full_name || user.user_metadata?.name || "Usuario",
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      role: "user",
      elo: 0,
      bio: "",
      title: "",
      rating_avg: 0,
      languages: [], 
      is_available: true, 
      created_at: new Date().toISOString(),
    };

   
    return fallbackUser as unknown as Profile;
  }

  return {
    ...profile,
    avatar_url: profile.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
    name: profile.name || user.user_metadata?.full_name || "Usuario"
  } as unknown as Profile;
},
};

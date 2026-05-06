import { supabase } from "@/lib/supabase";

export const authService = {
 
  signIn: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
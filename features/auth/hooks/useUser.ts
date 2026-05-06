// features/auth/hooks/useUser.ts
"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { profileService } from "../../marketplace/services/queries";

export function useUser() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => profileService.getCurrentUser(),
    staleTime: 1000 * 60 * 10,
  });
}

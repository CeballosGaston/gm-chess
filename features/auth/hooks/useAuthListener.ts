"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAuthListener() {
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
}
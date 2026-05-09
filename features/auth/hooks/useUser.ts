"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { profileService } from "../../marketplace/services/queries";
import { authService } from "../services/authService";
import { useRouter } from "next/navigation";
import { Profile } from "@/types";

export function useUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ======================
  // AUTH LISTENER
  // ======================
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

  // ======================
  // USER QUERY
  // ======================
  const userQuery = useQuery<Profile | null>({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<Profile | null> => {
      return profileService.getCurrentUser();
    },
    staleTime: 1000 * 60 * 10,
  });

  // ======================
  // REDIRECT POR ROL
  // ======================
  useEffect(() => {
    const user = userQuery.data;

    if (!user) return;

    if (user.role === "gm") {
      router.push("/gm");
    } else {
      router.push("/");
    }
  }, [userQuery.data, router]);

  // ======================
  // LOGOUT
  // ======================
  const logout = async () => {
    try {
      await authService.signOut();
      queryClient.setQueryData(["currentUser"], null);
      router.push("/login");
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return {
    ...userQuery,
    logout,
  };
}
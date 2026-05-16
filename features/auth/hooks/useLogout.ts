"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      await authService.signOut();

      queryClient.setQueryData(["currentUser"], null);
      router.push("/login");
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return { logout };
}

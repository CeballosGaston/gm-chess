"use client";

import { useQuery } from "@tanstack/react-query";

import { profileService } from "../../marketplace/services/queries";

import { Profile } from "@/types";

export function useUser() {
  const userQuery = useQuery<Profile | null>({
    queryKey: ["currentUser"],
    queryFn: async (): Promise<Profile | null> => {
      return profileService.getCurrentUser();
    },
    staleTime: 0,
  });

  return {
    ...userQuery,
  };
}

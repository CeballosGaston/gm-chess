"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";
import { useUser } from "@/features/auth/hooks/useUser";

const LANGUAGE_OPTIONS = [
  "Español",
  "Inglés",
  "Francés",
  "Alemán",
  "Portugués",
  "Italiano",
  "Ruso",
  "Chino",
] as const;

type UpdateProfileData = {
  bio?: string | null;
  languages?: string[];
  is_available?: boolean;
};

function useSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export function useProfile() {
  const supabase = useSupabase();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: async (updates: UpdateProfileData) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    save: mutation.mutate,
    saveAsync: mutation.mutateAsync,
    isSuccess: mutation.isSuccess,
    LANGUAGE_OPTIONS,
    isGM: user?.role === "gm",
    userId: user?.id,
  };
}

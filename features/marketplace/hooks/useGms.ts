import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { profileService } from "../services/queries";

export function useGms() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("gms-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["gms"],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["gms"],
    queryFn: () => profileService.getGMs(),

    staleTime: 0,
  });
}
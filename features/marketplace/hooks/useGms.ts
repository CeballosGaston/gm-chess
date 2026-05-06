// features/marketplace/hooks/useGms.ts
import { useQuery } from "@tanstack/react-query";
import { profileService } from "../services/queries";

export function useGms() {
  return useQuery({
    queryKey: ["gms"],
    queryFn: () => profileService.getGMs(),

    staleTime: 1000 * 60 * 5,
  });
}

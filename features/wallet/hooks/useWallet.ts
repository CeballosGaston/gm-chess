import { useQueryClient } from "@tanstack/react-query";
import { walletService } from "../services/walletService";
import { useUser } from "@/features/auth/hooks/useUser";

export function useWallet() {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  
  const buyCoins = async (amount: number) => {
    if (!user) throw new Error("No user");

    await walletService.addCoins(user.id, amount);

   
    queryClient.invalidateQueries({
      queryKey: ["currentUser"],
    });
  };

  
  const spendCoins = async (amount: number) => {
    if (!user) throw new Error("No user");

    await walletService.spendCoins(user.id, amount);

    queryClient.invalidateQueries({
      queryKey: ["currentUser"],
    });
  };

  return {
    coins: user?.coins ?? 0,
    buyCoins,
    spendCoins,
  };
}
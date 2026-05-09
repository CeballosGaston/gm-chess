"use client";

import { useQuery } from "@tanstack/react-query";
import { createBrowserClient } from "@supabase/ssr";

import { useRouter } from "next/navigation";

export default function GMLobbyPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: games, isLoading } = useQuery({
  queryKey: ["waiting-games"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("status", "waiting")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  },
  refetchInterval: 2000, // 
});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-amber-400 flex items-center justify-center">
        CARGANDO PARTIDAS...
      </div>
    );
  }

  const joinGame = async (gameId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("games")
      .update({
        gm_id: user.id,
        status: "active",
      })
      .eq("id", gameId);

    router.push(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <h1 className="text-2xl font-bold text-amber-400 mb-6">
        Lobby del Gran Maestro
      </h1>

      {games?.length === 0 ? (
        <p className="text-slate-400">No hay partidas disponibles</p>
      ) : (
        <div className="space-y-3">
          {games?.map((game) => (
            <button
              key={game.id}
              onClick={() => joinGame(game.id)}
              className="w-full p-4 bg-slate-900 rounded hover:bg-slate-800 transition text-left"
            >
              <div className="flex justify-between items-center">
                <span>Partida {game.id.slice(0, 8)}</span>
                <span className="text-xs text-slate-400">Entrar →</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

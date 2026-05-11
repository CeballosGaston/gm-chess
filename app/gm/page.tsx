"use client";

import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { toggleAvailability } from "@/helpers/toggleAvailability";
import { useQueryClient } from "@tanstack/react-query";

export default function GMHomePage() {
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const handleToggle = async () => {
    if (!user) return;

    await toggleAvailability(user.id, user.is_available);

    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      }),

      queryClient.invalidateQueries({
        queryKey: ["gms"],
      }),
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-amber-400">
          Panel del Gran Maestro
        </h1>

        <p className="text-slate-400">
          Gestiona tus partidas y entra al tablero
        </p>

        <button
          onClick={handleToggle}
          className="block bg-amber-500 text-black px-6 py-3 rounded font-semibold w-full"
        >
          {user?.is_available
            ? "Desactivar disponibilidad"
            : "Activar disponibilidad"}
        </button>

        <div className="space-y-3">
          <Link
            href="/gm/lobby"
            className="block bg-amber-500 text-black px-6 py-3 rounded font-semibold"
          >
            Ver partidas disponibles
          </Link>

          <Link href="/" className="block text-slate-400 hover:text-white">
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}

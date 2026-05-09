"use client";

import Link from "next/link";

export default function GMHomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
      <div className="text-center space-y-6">

        <h1 className="text-3xl font-bold text-amber-400">
          Panel del Gran Maestro
        </h1>

        <p className="text-slate-400">
          Gestiona tus partidas y entra al tablero
        </p>

        <div className="space-y-3">
          <Link
            href="/gm/lobby"
            className="block bg-amber-500 text-black px-6 py-3 rounded font-semibold"
          >
            Ver partidas disponibles
          </Link>

          <Link
            href="/"
            className="block text-slate-400 hover:text-white"
          >
            Volver
          </Link>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useGms } from "@/features/marketplace/hooks/useGms";
import { GMCard } from "@/features/marketplace/components/GMCard";
import { useUser } from "@/features/auth/hooks/useUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: gms, isLoading, error } = useGms();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && user?.role === "gm") {
      router.push("/gm");
    }
  }, [user, userLoading, router]);


  

  if (!userLoading && user?.role === "gm") {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center text-amber-400">
        Redirigiendo al panel del GM...
      </div>
    );
  }

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <div className="text-[#F59E0B] text-xl animate-pulse font-medium">
          Preparando el tablero...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <p className="text-red-400">
          Error al cargar maestros: {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#060B18] text-white">
      {/* Hero Section - Basado en Captura de pantalla 2026-05-05 120352.jpg */}
      <section className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-[#F59E0B] mb-6 tracking-tight">
          Aprende de los Mejores
        </h1>
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
          Juega y recibe coaching personalizado de grandes maestros de ajedrez
          de élite mundial
        </p>
      </section>

      {/* Grid de Maestros */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {gms?.map((gm) => (
            <GMCard key={gm.id} gm={gm} />
          ))}
        </div>
      </section>
    </main>
  );
}

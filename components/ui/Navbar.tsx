// components/Navbar.tsx
"use client";
import { Coins, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import Image from "next/image";

export default function Navbar() {
  const { data: user, isLoading, isError,logout } = useUser();
  if (isError) {
    console.error("Error cargando el usuario");
  }
  const avatarSrc =
    user?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Guest"}`;
console.log("URL del Avatar:", avatarSrc);
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-background border-b border-white/10 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tighter text-white uppercase">
          GM <span className="text-primary font-light">Grandmasters</span>
        </span>
      </Link>

      {/* Acciones */}
      <div className="flex items-center gap-6">
        {/* Fichas */}
        <div className="hidden md:flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-primary/20">
          <Coins className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            <span className="text-primary">25</span> fichas
          </span>
        </div>

        {/* Botón Comprar */}
        <button className="bg-primary hover:opacity-90 text-black px-5 py-2 rounded-full font-bold text-sm transition-transform active:scale-95">
          Comprar Fichas
        </button>

        {/* User Profile Placeholder */}
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-amber-900/20">
          <div className="relative w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden">
            {user?.avatar_url ? (
              <Image
                src={avatarSrc}
                alt={user?.name || "Avatar de usuario"}
                fill
                className="object-cover"
                sizes="40px"
                priority
                unoptimized
              />
            ) : (
              <User className="w-4 h-4 text-amber-500" />
            )}
          </div>

          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500 leading-none mb-1">
              Bienvenido
            </p>
            <p className="text-sm font-bold text-white leading-none">
              {isLoading ? "Cargando..." : user?.name || "Invitado"}
            </p>
            {user && (
              <button 
                onClick={logout}
                className="text-[10px] text-slate-500 hover:text-red-400 transition-colors font-medium"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

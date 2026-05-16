"use client";

import { Coins, User, Wallet } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useGMEarnings } from "@/features/wallet/hooks/useGMEarnings";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: user, isLoading, isError } = useUser();
  const { data: earnings = 0 } = useGMEarnings(user?.id);
  const { logout } = useLogout();
  const router = useRouter();

  if (isError) {
    console.error("Error cargando el usuario");
  }

  const avatarSrc =
    user?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || "Guest"}`;

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-background border-b border-white/10 sticky top-0 z-50">
    
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tighter text-white uppercase">
          GM <span className="text-primary font-light">Grandmasters</span>
        </span>
      </Link>

   
      <div className="flex items-center gap-6">
        {user?.role === "student" && (
          <>
           
            <div className="hidden md:flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-primary/20">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                <span className="text-primary">{user?.coins}</span> fichas
              </span>
            </div>

           
            <button
              onClick={() => router.push("/wallet")}
              aria-label="Comprar fichas"
              className="bg-primary hover:opacity-90 text-black px-5 py-2 rounded-full font-bold text-sm transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none"
            >
              Comprar Fichas
            </button>
          </>
        )}

        {user?.role === "gm" && (
          <button aria-label="Ganancias del GM" className="hidden md:flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-primary/20 hover:border-primary transition focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-none">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white">
              <span className="text-primary">{earnings}</span> Ganancias
            </span>
          </button>
        )}

       
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/50 rounded-full border border-amber-900/20">
          <Link
            href="/profile"
            className="relative w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
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
          </Link>

          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-400 leading-none mb-1">
              Bienvenido
            </p>

            <Link
              href="/profile"
              className="text-sm font-bold text-white leading-none hover:text-amber-400 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded"
            >
              {isLoading ? "Cargando..." : user?.name || "Invitado"}
            </Link>

            {user && (
              <button
                onClick={logout}
                aria-label="Cerrar sesión"
                className="block text-[0.625rem] text-slate-400 hover:text-red-400 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none mt-1"
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

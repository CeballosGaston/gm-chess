// components/Navbar.tsx
import { Coins, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
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
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <span className="text-sm font-medium hidden sm:inline">Juan Pérez</span>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </nav>
  );
}
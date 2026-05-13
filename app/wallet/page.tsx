"use client";

import { useWallet } from "@/features/wallet/hooks/useWallet";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const PACKAGES = [
  { amount: 100, label: "Pack Básico" },
  { amount: 200, label: "Pack Pro" },
  { amount: 300, label: "Pack Master" },
];

export default function WalletPage() {
  const { coins, buyCoins } = useWallet();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-10">

 <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Maestros
      </Link>

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-amber-400">
          Wallet
        </h1>

        <p className="text-slate-400 mt-2">
          Tu saldo actual:
          <span className="text-amber-400 font-bold ml-2">
            {coins}
          </span>{" "}
          fichas
        </p>
      </div>

      {/* PACKS */}
      <div className="grid md:grid-cols-3 gap-6">

        {PACKAGES.map((pkg) => (
          <div
            key={pkg.amount}
            className="relative group bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all"
          >

            {/* glow hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative p-6 space-y-4 pointer-events-none">

              {/* HEADER VISUAL */}
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <span className="text-xl font-bold text-amber-400">
                    {pkg.amount}
                  </span>
                </div>

                <div>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30 uppercase">
                    Pack
                  </span>

                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                    {pkg.label}
                  </h3>
                </div>

              </div>

              {/* DESCRIPTION */}
              <p className="text-slate-400 text-sm">
                Obtén {pkg.amount} fichas para jugar partidas.
              </p>

              {/* BUTTON */}
              <div className="pt-2 relative z-20 pointer-events-auto">
                <button
                  onClick={() => buyCoins(pkg.amount)}
                  className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-900/30 active:scale-95 transition-all"
                >
                  Comprar
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
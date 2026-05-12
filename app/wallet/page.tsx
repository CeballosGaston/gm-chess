"use client";

import { useWallet } from "@/features/wallet/hooks/useWallet";

const PACKAGES = [
  { amount: 100, label: "Pack Básico" },
  { amount: 200, label: "Pack Pro" },
  { amount: 300, label: "Pack Master" },
];

export default function WalletPage() {
  const { coins, buyCoins, spendCoins } = useWallet();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-10">
      
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
            className="bg-black/40 border border-white/10 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-white">
              {pkg.label}
            </h2>

            <p className="text-slate-400">
              Obtén {pkg.amount} fichas
            </p>

            {/* BUY */}
            <button
              onClick={() => buyCoins(pkg.amount)}
              className="w-full bg-primary text-black font-bold py-2 rounded hover:opacity-90 transition"
            >
              Comprar
            </button>

            {/* OPTIONAL: test spend (puedes quitarlo luego) */}
            <button
              onClick={() => spendCoins(pkg.amount)}
              className="w-full border border-red-500 text-red-400 py-2 rounded hover:bg-red-500/10 transition"
            >
              Test gastar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
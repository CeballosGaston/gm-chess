import { Star, Languages, Circle } from "lucide-react";
import Link from "next/link";
import { Profile } from "../../../types/index";
import Image from "next/image";
import { useState } from "react";

interface MasterCardProps {
  gm: Profile;
}

export function GMCard({ gm }: MasterCardProps) {
 const [imgSrc, setImgSrc] = useState(gm.avatar_url ? gm.avatar_url : "/placeholder-user.png");
  const fullStars = Math.floor(gm.rating_avg);
  const hasHalfStar = gm.rating_avg % 1 !== 0;

  return (
    <Link href={`/gm/${gm.id}`}>
      <div className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur border border-amber-900/20 rounded-2xl overflow-hidden hover:border-amber-600/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Image
                src={imgSrc}
                alt={gm.name || "Avatar"}
                width={96}
                height={96}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/30 group-hover:ring-amber-400/60 transition-all"
              onError={() => setImgSrc("/placeholder-user.png")}
              unoptimized={true}
              />
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                  gm.is_available ? "bg-green-500" : "bg-slate-600"
                } ring-2 ring-slate-900`}
              >
                <Circle className="w-3 h-3 fill-current text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30">
                  {gm.title}
                </span>
                <span className="text-slate-500 text-sm">ELO {gm.elo}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                {gm.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
            ))}
            {hasHalfStar && (
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 opacity-50" />
            )}
            {[...Array(5 - Math.ceil(gm.rating_avg))].map((_, i) => (
              <Star key={`empty-${i}`} className="w-4 h-4 text-slate-600" />
            ))}
            <span className="ml-2 text-sm text-slate-400 font-medium">
              {gm.rating_avg}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Languages className="w-4 h-4" />
            <span>{gm.languages.join(", ")}</span>
          </div>

          <div className="pt-2">
            <button
              className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                gm.is_available
                  ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-900/30"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
              disabled={!gm.is_available}
            >
              {gm.is_available ? "Jugar Ahora" : "No Disponible"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

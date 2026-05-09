"use client";

import { Star, Languages, Circle, Play } from "lucide-react";
import { Profile } from "../../../types/index";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Chess } from "chess.js";

interface MasterCardProps {
  gm: Profile;
}

export function GMCard({ gm }: MasterCardProps) {
  const [imgSrc, setImgSrc] = useState(gm.avatar_url ? gm.avatar_url : "/placeholder-user.png");
  const fullStars = Math.floor(gm.rating_avg);
  const hasHalfStar = gm.rating_avg % 1 !== 0;
  const router = useRouter();

const goTo = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(path);
  };


const startGame = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // crear partida REAL
  const { data, error } = await supabase
    .from("games")
    .insert({
      student_id: user.id,
      gm_id: gm.id,
      status: "waiting",
      fen: new Chess().fen(),
      turn: "white",
    })
    .select()
    .single();

  if (error || !data) {
    console.error(error);
    return;
  }

  // entrar a la partida real
  router.push(`/game/${data.id}`);
};


  return (
    <div onClick={(e) => goTo(e, `/gm/${gm.id}`)} className="group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur border border-amber-900/20 rounded-2xl overflow-hidden hover:border-amber-600/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1">
      
   
      <div className="relative p-6 space-y-4 pointer-events-none">
        {/* pointer-events-none arriba hace que los clics pasen a través del texto hacia el Link invisible */}
        
        <div className="flex items-start gap-4">
          <div className="relative pointer-events-auto"> 
            {/* pointer-events-auto permite interactuar con elementos específicos si fuera necesario */}
            <Image
              src={imgSrc}
              alt={gm.name || "Avatar"}
              width={96}
              height={96}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-500/30 group-hover:ring-amber-400/60 transition-all"
              onError={() => setImgSrc("/placeholder-user.png")}
              unoptimized={true}
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${gm.is_available ? "bg-green-500" : "bg-slate-600"} ring-2 ring-slate-900`}>
              <Circle className="w-3 h-3 fill-current text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 font-medium">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-bold rounded border border-amber-500/30 uppercase">
                {gm.title}
              </span>
              <span className="text-slate-500 text-sm italic">ELO {gm.elo}</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
              {gm.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < fullStars ? "fill-amber-500 text-amber-500" : (i === fullStars && hasHalfStar ? "fill-amber-500 text-amber-500 opacity-50" : "text-slate-600")}`} />
          ))}
          <span className="ml-2 text-sm text-slate-400 font-medium">{gm.rating_avg}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Languages className="w-4 h-4" />
          <span>{gm.languages.join(", ")}</span>
        </div>

        {/* 2. BOTÓN DE JUEGO: Con z-20 y pointer-events-auto para "flotar" sobre el link invisible */}
        <div className="pt-2 relative z-20 pointer-events-auto">
          <button
           onClick={startGame}
            disabled={!gm.is_available}
            className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              gm.is_available
                ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-900/40 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
            }`}
          >
            <Play className={`w-4 h-4 ${gm.is_available ? "fill-current" : ""}`} />
            {gm.is_available ? "Jugar Ahora" : "No Disponible"}
          </button>
        </div>
      </div>
    </div>
  );
}
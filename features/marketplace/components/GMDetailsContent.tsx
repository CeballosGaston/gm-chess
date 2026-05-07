import { profileService } from "../../../features/marketplace/services/queries";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, Languages, Star } from "lucide-react";

export default async function GMDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gm = await profileService.getGmById(id);
if (!gm) {
    return (
      <div className="min-h-screen bg-[#060B18] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-amber-500 text-3xl font-black mb-4 uppercase tracking-tighter">
          Maestro no encontrado
        </h2>
        <p className="text-slate-400 mb-8 max-w-md">
          Lo sentimos, no pudimos encontrar el perfil del Gran Maestro
          solicitado.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors"
        >
          VOLVER AL MARKETPLACE
        </Link>
      </div>
    );
  }

  const fullStars = Math.floor(gm.rating_avg);
  const hasHalfStar = gm.rating_avg % 1 !== 0;

 return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Maestros
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur border border-amber-900/20 rounded-2xl p-6 space-y-6">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden ring-4 ring-amber-500/30 bg-slate-800">
              <Image
                src={gm.avatar_url || "/placeholder-user.png"}
                sizes="(max-width: 768px) 100vw, 33vw"
                fill
                alt={gm.name || "Avatar"}
                priority
                className="object-cover"
                unoptimized
              />
              {gm.is_available && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Disponible
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-bold rounded border border-amber-500/30">
                  {gm.title}
                </span>
                <span className="text-slate-400">ELO {gm.elo}</span>
              </div>

              <h1 className="text-3xl font-bold text-white">{gm.name}</h1>

              <div className="flex items-center gap-2">
                {[...Array(fullStars)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-500 text-amber-500"
                  />
                ))}
                {hasHalfStar && (
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500 opacity-50" />
                )}
                {[...Array(5 - Math.ceil(gm.rating_avg))].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-5 h-5 text-slate-600" />
                ))}
                <span className="ml-2 text-lg text-slate-300 font-medium">
                  {gm.rating_avg}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Languages className="w-5 h-5 text-amber-400" />
                <span>{gm.languages.join(", ")}</span>
              </div>
            </div>

            <Link
              href={`/game/${gm.id}`}
              className="block w-full py-3 rounded-lg font-bold text-center bg-gradient-to-r from-amber-600 to-yellow-600 text-black hover:from-amber-500 hover:to-yellow-500 shadow-lg shadow-amber-900/30 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Comenzar Sesión
              </div>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur border border-amber-900/20 rounded-2xl p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Biografía</h2>
              <p className="text-slate-300 leading-relaxed">{gm.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
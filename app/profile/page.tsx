"use client";

import { useProfile } from "@/features/profile/hooks/useProfile";
import {
  User,
  Star,
  Languages,
  ShieldCheck,
  Coins,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = NonNullable<ReturnType<typeof useProfile>["profile"]>;

function ProfileForm({
  profile,
  LANGUAGE_OPTIONS,
  isGM,
  isSaving,
  save,
}: {
  profile: Profile;
  LANGUAGE_OPTIONS: readonly string[];
  isGM: boolean;
  isSaving: boolean;
  save: ReturnType<typeof useProfile>["save"];
}) {
  const [bio, setBio] = useState(profile.bio ?? "");
  const [languages, setLanguages] = useState<string[]>(profile.languages ?? []);
  const [isAvailable, setIsAvailable] = useState(profile.is_available ?? false);
  const [pageLang, setPageLang] = useState("es");
  const [showToast, setShowToast] = useState(false);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const handleSave = () => {
    const updates: Record<string, unknown> = { bio };

    if (isGM) {
      updates.languages = languages;
      updates.is_available = isAvailable;
    }

    save(updates as Parameters<typeof save>[0], {
      onSuccess: () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      },
    });
  };

  const hasChanges = () => {
    if (bio !== (profile.bio ?? "")) return true;
    if (isGM) {
      if (JSON.stringify(languages) !== JSON.stringify(profile.languages ?? []))
        return true;
      if (isAvailable !== profile.is_available) return true;
    }
    return false;
  };

  const fullStars = Math.floor(profile.rating_avg);
  const hasHalfStar = profile.rating_avg % 1 !== 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
            Mi Perfil
          </h1>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded px-2 py-1"
          >
            &larr; Volver
          </Link>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-amber-500/30 overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.name ?? "Avatar"}
                  fill
                  className="object-cover"
                  sizes="96px"
                  unoptimized
                />
              ) : (
                <User className="w-10 h-10 text-amber-500" />
              )}
            </div>

            <div className="text-center sm:text-left space-y-1.5">
              <h2 className="text-xl font-bold text-white">
                {profile.name ?? "Sin nombre"}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge size="sm">{profile.title ?? "—"}</Badge>
                <span className="text-sm text-slate-400 italic">
                  ELO {profile.elo}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < fullStars
                          ? "fill-amber-500 text-amber-500"
                          : i === fullStars && hasHalfStar
                            ? "fill-amber-500 text-amber-500 opacity-50"
                            : "text-slate-600",
                      )}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {profile.rating_avg}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  {profile.role === "gm" ? "Gran Maestro" : "Estudiante"}
                </span>
                {profile.role === "student" && (
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    {profile.coins ?? 0} fichas
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Miembro desde{" "}
                  {new Date(profile.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          <div className="space-y-6">
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Biografía
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Cuéntanos sobre ti..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 resize-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              />
              <p className="text-xs text-slate-500 mt-1.5 text-right">
                {bio.length} caracteres
              </p>
            </div>

            {isGM && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  <Languages className="w-4 h-4 inline mr-1.5 text-amber-500" />
                  Idiomas
                </label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none",
                        languages.includes(lang)
                          ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600",
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isGM && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Disponibilidad
                </label>
                <button
                  type="button"
                  onClick={() => setIsAvailable(!isAvailable)}
                  role="switch"
                  aria-checked={isAvailable}
                  aria-label="Alternar disponibilidad"
                  className={cn(
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none",
                    isAvailable ? "bg-green-500" : "bg-slate-700",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                      isAvailable ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "ml-3 text-sm",
                    isAvailable ? "text-green-400" : "text-slate-500",
                  )}
                >
                  {isAvailable ? "Disponible" : "No disponible"}
                </span>
              </div>
            )}
          </div>

          <hr className="border-slate-800" />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Idioma de la página
            </label>
            <select
              value={pageLang}
              onChange={(e) => setPageLang(e.target.value)}
              className="w-full sm:w-48 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges() || isSaving}
            variant="primary"
            className={cn(
              "w-full sm:w-auto px-8",
              !hasChanges() && "opacity-50 cursor-not-allowed",
            )}
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse">
          Perfil actualizado
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLoading, isSaving, save, LANGUAGE_OPTIONS, isGM } =
    useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 md:p-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-24 h-24 rounded-full bg-slate-800" />
          <Skeleton className="h-6 w-48 bg-slate-800" />
          <Skeleton className="h-4 w-32 bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <ProfileForm
      key={profile.id}
      profile={profile}
      LANGUAGE_OPTIONS={LANGUAGE_OPTIONS}
      isGM={isGM}
      isSaving={isSaving}
      save={save}
    />
  );
}

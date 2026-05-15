"use client";

import { Mail } from "lucide-react";
import { authService } from "@/features/auth/services/authService";
import { useEffect } from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (user.role === "gm") {
      router.push("/gm")
    }

   else if (user.role === "student") {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async () => {
    const { error } = await authService.signIn();
    if (error) console.error("Error en login:", error.message);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-white/10 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Bienvenido a <span className="text-primary uppercase">GM</span>
        </h1>
        <p className="text-slate-400 mb-8">
          Inicia sesión para jugar contra los mejores Grandes Maestros del
          mundo.
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-black font-bold py-3 px-6 rounded-xl transition-all transform active:scale-95"
        >
          <Mail className="w-5 h-5" />
          Continuar con Google
        </button>

        <p className="mt-6 text-xs text-slate-400">
          Al continuar, aceptas nuestros términos de servicio y política de
          privacidad.
        </p>
      </div>
    </div>
  );
}

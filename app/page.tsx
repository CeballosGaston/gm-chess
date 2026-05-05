export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Test de color de fondo (debe ser azul muy oscuro) */}
      
      <div className="bg-card p-8 rounded-2xl border border-white/10 shadow-2xl text-center">
        {/* Test de color de card (debe ser un gris azulado oscuro) */}
        
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Tailwind <span className="text-primary">v4</span>
        </h1>
        {/* Test de color primario (debe ser el naranja/dorado) */}
        
        <p className="text-slate-400 mb-8 max-w-md">
          Si ves el fondo casi negro, esta caja gris oscura y este texto naranja, 
          entonces la configuración es <span className="font-bold text-white">correcta</span>.
        </p>

        <button className="bg-primary hover:scale-105 transition-transform text-black font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/20">
          ¡Funciona perfectamente!
        </button>
      </div>
    </div>
  );
}
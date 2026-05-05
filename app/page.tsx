// app/page.tsx
'use client'
import { useGms } from '@/features/marketplace/hooks/useGms'

export default function HomePage() {
  const { data: gms, isLoading, error } = useGms()

  if (isLoading) return <div className="p-10 text-white">Cargando maestros...</div>
  if (error) return <div className="p-10 text-red-500">Error: {(error as Error).message}</div>

  return (
    <main className="p-10 bg-[#060B18] min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Master Marketplace</h1>
      
      {/* Esto es solo para debugear que los datos llegan */}
      <pre className="text-xs text-green-400 bg-black p-4 rounded border border-green-900 overflow-auto max-h-96">
        {JSON.stringify(gms, null, 2)}
      </pre>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {gms?.map((gm) => (
          <div key={gm.id} className="border border-slate-700 p-4 text-white rounded">
            {gm.full_name} - ELO: {gm.elo}
          </div>
        ))}
      </div>
    </main>
  )
}
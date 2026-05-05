// app/providers.tsx
'use client' // ¡Vital! React Query usa hooks, debe ser un Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Creamos el QueryClient dentro de un estado para que sea persistente
  // y no se resetee si el componente se vuelve a renderizar.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configuraciones globales útiles para un MVP
        staleTime: 60 * 1000, // Los datos se consideran "frescos" por 1 minuto
        retry: 1,            // Si falla, reintenta solo una vez
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
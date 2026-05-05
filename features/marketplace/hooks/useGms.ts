// features/marketplace/hooks/useGms.ts
import { useQuery } from '@tanstack/react-query'
import { getGMs } from '../services/queries'

export function useGms() {
  return useQuery({
    queryKey: ['gms'],
    queryFn: getGMs,
    // En un MVP, esto ayuda a que no pida datos a cada rato mientras codeas
    staleTime: 1000 * 60 * 5, 
  })
}
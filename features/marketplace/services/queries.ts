// features/marketplace/services/queries.ts
import { supabase } from '@/lib/supabase'

export const getGMs = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'gm')
    .order('elo', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // No lances error en build; solo avisa en dev
  // console.warn para evitar romper la app si aún no se configuró .env
  console.warn('VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no definidos')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see .env.example). */
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = createClient(url ?? 'https://placeholder.supabase.co', anonKey ?? 'placeholder')

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://<project-ref>.supabase.co'
const supabaseAnonKey = '<your-anon-key>'

// Exporta el cliente de Supabase para usarlo en otras partes de tu app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

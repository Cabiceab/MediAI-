import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase con tu project-ref y anon-key correctos
const supabaseUrl = 'https://itrtgoozuuygamciugrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cnRnb296dXV5Z2FtY2l1Z3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzYzNTIsImV4cCI6MjA0MTg1MjM1Mn0.sGWSOYHfflAXDmQUJp4ngx4Z0K4_YUhYU_hku77-B1Q'

// Exporta el cliente de Supabase para usarlo en otras partes de tu app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

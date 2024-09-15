import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://<project-ref>.supabase.co'
const supabaseAnonKey = '<your-anon-key>'

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para iniciar sesión con GitHub
export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  });
  if (error) {
    console.error('Error al iniciar sesión con GitHub:', error);
  } else {
    console.log('Sesión iniciada:', data);
  }
}

// Función para cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
  } else {
    console.log('Sesión cerrada exitosamente');
  }
}


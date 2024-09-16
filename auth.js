import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase con las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para iniciar sesión con GitHub
export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin + '/auth/callback' // Redirigir después del login
    }
  });
  if (error) {
    console.error('Error al iniciar sesión con GitHub:', error.message);
  } else {
    console.log('Sesión iniciada con GitHub:', data);
  }
}

// Función para iniciar sesión con Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback' // Redirigir después del login
    }
  });
  if (error) {
    console.error('Error al iniciar sesión con Google:', error.message);
  } else {
    console.log('Sesión iniciada con Google:', data);
  }
}

// Función para cerrar sesión
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    console.log('Sesión cerrada exitosamente');
  }
}

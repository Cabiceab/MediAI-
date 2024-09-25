iimport { createClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://itrtgoozuuygamciugrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cnRnb296dXV5Z2FtY2l1Z3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzYzNTIsImV4cCI6MjA0MTg1MjM1Mn0.sGWSOYHfflAXDmQUJp4ngx4Z0K4_YUhYU_hku77-B1Q'
// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
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
    console.error('Error al iniciar sesión con GitHub:', error);
    console.error('Error al iniciar sesión con GitHub:', error.message);
  } else {
    console.log('Sesión iniciada con GitHub:', data);
  }
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback' // Redirigir después del login
    }
  });
  if (error) {
    console.error('Error al iniciar sesión con Google:', error);
    console.error('Error al iniciar sesión con Google:', error.message);
  } else {
    console.log('Sesión iniciada con Google:', data);
  }
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error);
    console.error('Error al cerrar sesión:', error.message);
  } else {
    console.log('Sesión cerrada exitosamente');
  }

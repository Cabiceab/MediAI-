import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para iniciar sesión con Google
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        }
    });

    if (error) {
        console.error('Error durante el inicio de sesión con Google:', error.message);
        alert('Hubo un error al iniciar sesión con Google, intenta nuevamente.');
    } else {
        console.log('Sesión iniciada con Google:', data);
    }
}

// Función para iniciar sesión con GitHub
export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        }
    });

    if (error) {
        console.error('Error durante el inicio de sesión con GitHub:', error.message);
        alert('Hubo un error al iniciar sesión con GitHub, intenta nuevamente.');
    } else {
        console.log('Sesión iniciada con GitHub:', data);
    }
}

// Función para cerrar sesión
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error al cerrar sesión:', error.message);
    } else {
        console.log('Sesión cerrada exitosamente');
        window.location.href = '/';  // Redirige a la página de inicio
    }
}

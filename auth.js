import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase con tu project-ref y anon-key correctos
const supabaseUrl = 'https://itrtgoozuuygamciugrk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cnRnb296dXV5Z2FtY2l1Z3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzYzNTIsImV4cCI6MjA0MTg1MjM1Mn0.sGWSOYHfflAXDmQUJp4ngx4Z0K4_YUhYU_hku77-B1Q'

// Crea el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Función para iniciar sesión con GitHub
export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`, // Redirige a la ruta de callback en tu servidor
        }
    });

    if (error) {
        console.error('Error al iniciar sesión con GitHub:', error.message);
        alert('Hubo un error al iniciar sesión con GitHub, intenta nuevamente.');
    } else {
        console.log('Sesión iniciada con GitHub:', data);
        // Redirigir a dashboard u otra página después del login
        window.location.href = '/dashboard'; // Cambia esta ruta según sea necesario
    }
}

// Función para iniciar sesión con Google
export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`, // Redirige a la ruta de callback en tu servidor
        }
    });

    if (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
        alert('Hubo un error al iniciar sesión con Google, intenta nuevamente.');
    } else {
        console.log('Sesión iniciada con Google:', data);
        // Redirigir a dashboard u otra página después del login
        window.location.href = '/dashboard'; // Cambia esta ruta según sea necesario
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

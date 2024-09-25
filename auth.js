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
        // Aquí no necesitas redirigir manualmente. Supabase lo hace automáticamente con la opción redirectTo
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
        // Aquí no necesitas redirigir manualmente. Supabase lo hace automáticamente con la opción redirectTo
    }
}

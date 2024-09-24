// Función para iniciar sesión con GitHub
export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        }
    });

    if (error) {
        console.error('Error al iniciar sesión con GitHub:', error.message);
        // Aquí podrías mostrar un mensaje al usuario
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
            redirectTo: `${window.location.origin}/auth/callback`,
        }
    });

    if (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
        // Aquí podrías mostrar un mensaje al usuario
        alert('Hubo un error al iniciar sesión con Google, intenta nuevamente.');
    } else {
        console.log('Sesión iniciada con Google:', data);
        // Redirigir a dashboard u otra página después del login
        window.location.href = '/dashboard'; // Cambia esta ruta según sea necesario
    }
}

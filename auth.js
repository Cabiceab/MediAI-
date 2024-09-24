export async function signInWithGitHub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });

    if (error) {
        console.error('Error al iniciar sesión con GitHub:', error.message);
    } else {
        console.log('Sesión iniciada con GitHub:', data);
    }
}

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });

    if (error) {
        console.error('Error al iniciar sesión con Google:', error.message);
    } else {
        console.log('Sesión iniciada con Google:', data);
    }
}

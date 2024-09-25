const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
dotenv.config(); // Cargar variables de entorno

// Crear cliente de Supabase
const supabaseUrl = 'https://itrtgoozuuygamciugrk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cnRnb296dXV5Z2FtY2l1Z3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYyNzYzNTIsImV4cCI6MjA0MTg1MjM1Mn0.sGWSOYHfflAXDmQUJp4ngx4Z0K4_YUhYU_hku77-B1Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
app.use(express.json()); // Para leer los datos JSON del cuerpo de la petición

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar el token de autenticación con Supabase
const checkAuth = async (req, res, next) => {
    const token = req.query.access_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Acceso no autorizado. Por favor, inicia sesión.');
    }
    // Validar token con Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data) {
        return res.status(401).send('Token inválido o expirado.');
    }
    req.user = data.user; // Añadir la información del usuario al request
    next(); // Si el token es válido, continúa con la ruta protegida
};

// Supabase Auth middleware para manejar el callback de OAuth
app.get('/auth/callback', (req, res) => {
    const accessToken = req.query.access_token; // Obtenemos el token de acceso
    if (accessToken) {
        console.log('Access Token:', accessToken); // Log para verificar si llega el token
        // Redirigimos al cliente pasando el token como parámetro en la URL
        res.redirect(`/dashboard?access_token=${accessToken}`);
    } else {
        res.status(401).send('Error al autenticar. No se recibió un token.');
    }
});

// Ruta para la página principal o cualquier otra ruta necesaria
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta protegida: dashboard (protección con middleware)
app.get('/dashboard', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html')); // Una página protegida
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

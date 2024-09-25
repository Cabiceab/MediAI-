const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { supabase } = require('./db');  // Importa el cliente de Supabase
dotenv.config(); // Cargar variables de entorno

const app = express();
app.use(express.json()); // Para leer los datos JSON del cuerpo de la petición

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar el token de autenticación
const checkAuth = async (req, res, next) => {
    const token = req.query.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Acceso no autorizado. Por favor, inicia sesión.');
    }

    try {
        const { data: session, error } = await supabase.auth.getUser(token);

        if (error || !session) {
            return res.status(401).send('Token inválido o sesión no encontrada.');
        }

        req.user = session.user;
        next();  // Si el token es válido, continúa con la ruta protegida
    } catch (error) {
        return res.status(500).send('Error en la validación del token');
    }
};

// Supabase Auth middleware para manejar el callback de OAuth
app.get('/auth/callback', (req, res) => {
    const accessToken = req.query.access_token; // Obtenemos el token de acceso
    if (accessToken) {
        console.log('Access Token:', accessToken); // Log para verificar si llega el token
        // Guardamos el token en la sesión o lo enviamos al cliente
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

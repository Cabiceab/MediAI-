const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno

const app = express();

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Supabase Auth middleware para manejar el callback de OAuth
app.get('/auth/callback', (req, res) => {
    const accessToken = req.query.access_token; // Obtenemos el token de acceso
    if (accessToken) {
        // Redirigimos al cliente pasando el token como parámetro en la URL
        res.redirect(`/dashboard?access_token=${accessToken}`);
    } else {
        res.send('Error al autenticar');
    }
});

// Ruta para la página principal o cualquier otra ruta necesaria
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta protegida: dashboard
app.get('/dashboard', (req, res) => {
    const token = req.query.access_token;
    if (token) {
        res.sendFile(path.join(__dirname, 'public/dashboard.html')); // Una página protegida
    } else {
        res.redirect('/'); // Si no hay token, redirige al login
    }
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

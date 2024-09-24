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
// Agregar rutas de login y signup

let users = []; // Lista de usuarios (simulación de base de datos)

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Ruta de sign up
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { username, email, password };
    users.push(newUser);

    // Guardar usuarios en archivo JSON
    fs.writeFileSync('users.json', JSON.stringify(users));

    res.status(201).json({ message: 'Sign up successful' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

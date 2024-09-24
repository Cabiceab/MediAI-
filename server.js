const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs'); // Importar fs para manejar archivos
dotenv.config(); // Cargar variables de entorno

const app = express();
app.use(express.json()); // Para leer los datos JSON del cuerpo de la petición

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

// Simulación de base de datos de usuarios (en memoria o JSON)
let users = [];

// Leer usuarios desde el archivo JSON al iniciar el servidor
if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json'));
}

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.status(200).json({ message: 'Login exitoso' });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

// Ruta de sign up
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = { username, email, password };
    users.push(newUser);

    // Guardar usuarios en archivo JSON
    fs.writeFileSync('users.json', JSON.stringify(users));

    res.status(201).json({ message: 'Registro exitoso' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


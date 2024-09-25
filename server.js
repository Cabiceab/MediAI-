const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs'); // Importar fs para manejar archivos
const { createClient } = require('@supabase/supabase-js'); // Importar Supabase
dotenv.config(); // Cargar variables de entorno

const app = express();
app.use(express.json()); // Para leer los datos JSON del cuerpo de la petición

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// Simulación de base de datos de usuarios (en memoria o JSON)
let users = [];

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para verificar el token de autenticación
const checkAuth = (req, res, next) => {
// Middleware para verificar el token de autenticación con Supabase
const checkAuth = async (req, res, next) => {
    const token = req.query.access_token;
    // Validar que se envió un token
    if (!token) {
        return res.status(401).send('Acceso no autorizado. Por favor, inicia sesión.');
        return res.status(401).send('Acceso no autorizado. No se proporcionó un token.');
    }
    try {
        // Validar el token con Supabase
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            console.error('Error al validar el token con Supabase:', error.message);
            return res.status(401).send('Token inválido o expirado. Por favor, inicia sesión nuevamente.');
        }
        // Si el token es válido, continuar con la solicitud
        console.log('Token válido:', data);
        next();
    } catch (err) {
        console.error('Error interno al validar el token:', err);
        res.status(500).send('Error interno del servidor.');
    }
    // Aquí podrías validar el token con Supabase si fuera necesario
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

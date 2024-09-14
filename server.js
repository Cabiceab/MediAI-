const mysql = require('mysql2');
const express = require('express');
const app = express();
app.use(express.json());

// Conectar a la base de datos
const db = mysql.createConnection({
  host: 'localhost',       // Cambia esto si tu MySQL está en otro servidor
  user: 'root',            // Tu usuario de MySQL
  password: '',            // Tu contraseña de MySQL
  database: 'proyecto_login' // Tu base de datos
});

// Verificar la conexión
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para registrar usuario (Signup)
app.post('/signup', (req, res) => {
  const { nombre, email, password } = req.body;
  
  const query = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
  db.query(query, [nombre, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  });
});

// Ruta para autenticar usuario (Login)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
    if (result.length > 0) {
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

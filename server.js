const express = require('express');
const app = express();
const authRoutes = require('./auth');
const verifyToken = require('./verifyToken');
require('dotenv').config();  // Cargar las variables de entorno

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/profile', verifyToken, (req, res) => {
    res.send(`Este es el perfil del usuario con ID ${req.userId}`);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

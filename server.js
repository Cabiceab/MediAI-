const express = require('express')
const path = require('path')
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express()
dotenv.config(); // Cargar variables de entorno
const app = express();

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')));

// Supabase Auth middleware para manejar el callback de OAuth
app.get('/auth/callback', (req, res) => {
  // Aquí puedes añadir la lógica para manejar los datos del callback si es necesario
  res.send('Autenticación completada')
})
  // Aquí se recibe el callback de Supabase OAuth
  res.send('Autenticación completada. Puedes cerrar esta ventana.');
});

// Ruta para la página principal o cualquier otra ruta necesaria
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Configuración del puerto
const PORT = process.env.PORT || 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

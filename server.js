const express = require('express')
const path = require('path')

const app = express()

// Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')))

// Supabase Auth middleware para manejar el callback de OAuth
app.get('/auth/callback', (req, res) => {
  // Aquí puedes añadir la lógica para manejar los datos del callback si es necesario
  res.send('Autenticación completada')
})

// Ruta para la página principal o cualquier otra ruta necesaria
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Configuración del puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})

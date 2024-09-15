const express = require('express')
const app = express()

// Sirve archivos estáticos
app.use(express.static('public'))

// Supabase Auth middleware (puedes añadir la lógica aquí)
app.get('/auth/callback', (req, res) => {
  res.send('Autenticación completada')
})

// Configuración del puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})

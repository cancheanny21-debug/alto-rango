// server/index.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes       from './routes/auth.js'
import usersRoutes      from './routes/users.js'
import clientsRoutes    from './routes/clients.js'
import plansRoutes      from './routes/plans.js'
import productsRoutes   from './routes/products.js'
import attendanceRoutes from './routes/attendance.js'
import gymRoutes        from './routes/gym.js'

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json({ limit: '10mb' }))  // 10mb para soportar fotos en base64

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

// Rutas
app.use('/api/auth',       authRoutes)
app.use('/api/users',      usersRoutes)
app.use('/api/clients',    clientsRoutes)
app.use('/api/plans',      plansRoutes)
app.use('/api/products',   productsRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api',            gymRoutes)       // /api/payments, /api/sales, /api/promotions, etc.

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 API servidor corriendo en http://localhost:${PORT}/api`)
})

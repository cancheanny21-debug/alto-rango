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
import promotionsRoutes from './routes/promotions.js'
import paymentsRoutes   from './routes/payments.js'
import salesRoutes      from './routes/sales.js'
import routinesRoutes   from './routes/routines.js'

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
app.use('/api/promotions', promotionsRoutes)
app.use('/api/payments',   paymentsRoutes)
app.use('/api/sales',      salesRoutes)
app.use('/api/routines',   routinesRoutes)
app.use('/api',            gymRoutes)       // /api/payments, /api/sales, /api/promotions, etc.

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

// Importar el pool de base de datos para la migración
import pool from './db.js'

app.listen(PORT, async () => {
  // Asegurar que la columna direct_access existe
  try {
    await pool.execute('ALTER TABLE clients ADD COLUMN direct_access BOOLEAN DEFAULT FALSE')
    console.log('✅ Migración DB: Columna direct_access añadida a la tabla clients')
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.error('⚠️ Advertencia en migración DB (direct_access):', err.message)
    }
  }

  // Asegurar que la columna password existe en clients
  try {
    await pool.execute('ALTER TABLE clients ADD COLUMN password VARCHAR(255) DEFAULT NULL')
    console.log('✅ Migración DB: Columna password añadida a la tabla clients')
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.error('⚠️ Advertencia en migración DB (password):', err.message)
    }
  }

  // Asegurar que la columna facial_access existe en clients
  try {
    await pool.execute('ALTER TABLE clients ADD COLUMN facial_access BOOLEAN DEFAULT TRUE')
    console.log('✅ Migración DB: Columna facial_access añadida a la tabla clients')
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.error('⚠️ Advertencia en migración DB (facial_access):', err.message)
    }
  }

  // Asegurar que la columna face_descriptor existe en clients
  try {
    await pool.execute('ALTER TABLE clients ADD COLUMN face_descriptor TEXT DEFAULT NULL')
    console.log('✅ Migración DB: Columna face_descriptor añadida a la tabla clients')
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') {
      console.error('⚠️ Advertencia en migración DB (face_descriptor):', err.message)
    }
  }

  console.log(`🚀 API servidor corriendo en http://localhost:${PORT}/api`)
})

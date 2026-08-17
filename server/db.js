// server/db.js
// Pool de conexiones MySQL2 — lee variables del .env
import 'dotenv/config'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'alto_rango_saas',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
})

// Verificar conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log(`✅ MySQL conectado → ${process.env.DB_NAME || 'alto_rango_saas'}`)
    conn.release()
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err.message)
    process.exit(1)
  })

export default pool

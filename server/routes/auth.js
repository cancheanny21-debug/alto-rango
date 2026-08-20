// server/routes/auth.js
import { Router } from 'express'
import pool from '../db.js'
import { ROLE_LABELS, ROLE_SQL } from '../roles.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' })

  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.tenant_id, u.role_id, u.name, u.email, u.profile_image_url,
              ${ROLE_SQL.replaceAll('role_id', 'u.role_id')} AS role,
              g.name AS gym_name
       FROM users u
       LEFT JOIN gyms g ON g.id = u.tenant_id
       WHERE LOWER(TRIM(u.email)) = ? AND u.password = ? AND (u.status = 'active' OR u.status IS NULL)
       LIMIT 1`,
      [email.toLowerCase().trim(), password]
    )
    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const u = rows[0]

    try {
      await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [u.id])
    } catch { /* last_login puede no existir en esquemas antiguos */ }

    res.json({
      id:           u.id,
      tenant_id:    u.tenant_id,
      role_id:      u.role_id,
      name:         u.name,
      email:        u.email,
      role:         u.role,
      position:     ROLE_LABELS[u.role] || u.role,
      photoUrl:     u.profile_image_url || null,
      avatar:       (u.name || 'U').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(),
      gym:          u.gym_name ? { id: u.tenant_id, name: u.gym_name } : null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// POST /api/auth/register
// RF-021: Registro exclusivo para clientes (Usuario)
router.post('/register', async (req, res) => {
  const { tenant_id, name, email, password } = req.body
  if (!tenant_id || !name || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Insertar como rol 3 (Usuario)
    const [result] = await pool.execute(
      'INSERT INTO users (tenant_id, role_id, name, email, password, status) VALUES (?, 3, ?, ?, ?, "active")',
      [tenant_id, name, email, password]
    )

    // Crear entrada en clients
    await pool.execute(
      'INSERT INTO clients (tenant_id, name, email) VALUES (?, ?, ?)',
      [tenant_id, name, email]
    )

    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', userId: result.insertId })
  } catch (err) {
    console.error('Error al registrar usuario:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router

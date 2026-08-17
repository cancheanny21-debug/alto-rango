// server/routes/auth.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' })

  try {
    const [rows] = await pool.execute(
      `SELECT id, tenant_id, role_id, name, email, profile_image_url,
              CASE role_id WHEN 1 THEN 'admin' WHEN 2 THEN 'empleado' ELSE 'usuario' END AS role
       FROM users
       WHERE email = ? AND password = ? AND status = 'active'
       LIMIT 1`,
      [email.toLowerCase().trim(), password]
    )
    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const u = rows[0]
    const ROLE_LABELS = { admin: 'Administrador', empleado: 'Empleado/Encargado', usuario: 'Usuario' }

    // Actualizar lastLogin
    await pool.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [u.id])

    res.json({
      id:           u.id,
      tenant_id:    u.tenant_id,
      name:         u.name,
      email:        u.email,
      role:         u.role,
      position:     ROLE_LABELS[u.role] || u.role,
      photoUrl:     u.profile_image_url || null,
      avatar:       (u.name || 'U').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

export default router

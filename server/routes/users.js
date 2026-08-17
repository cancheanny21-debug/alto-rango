// server/routes/users.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

const ROLE_LABELS = { admin: 'Administrador', empleado: 'Empleado/Encargado', usuario: 'Usuario' }
const ROLE_ID = { admin: 1, empleado: 2, usuario: 3 }

// GET /api/users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, tenant_id, role_id, name, email, profile_image_url,
              status, last_login, created_at,
              CASE role_id WHEN 1 THEN 'admin' WHEN 2 THEN 'empleado' ELSE 'usuario' END AS role
       FROM users ORDER BY id`
    )
    const users = rows.map(u => ({
      ...u,
      avatar:   (u.name || 'U').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase(),
      photoUrl: u.profile_image_url || null,
      lastLogin: u.last_login || 'Nunca',
      createdAt: u.created_at?.toISOString?.().split('T')[0] || u.created_at,
      position: ROLE_LABELS[u.role] || u.role,
    }))
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// POST /api/users
router.post('/', async (req, res) => {
  const { tenant_id = 1, name, email, password, role = 'empleado', status = 'active' } = req.body
  const roleId = ROLE_ID[role] || 3
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (tenant_id, role_id, name, email, password, status) VALUES (?,?,?,?,?,?)',
      [tenant_id, roleId, name, email, password || 'cambiar123', status]
    )
    res.status(201).json({ id: result.insertId, name, email, role, status })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email ya registrado' })
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const { name, email, role, status, password, photoUrl } = req.body
  const id = parseInt(req.params.id)
  try {
    const sets = []
    const vals = []
    if (name)    { sets.push('name = ?');               vals.push(name) }
    if (email)   { sets.push('email = ?');              vals.push(email) }
    if (role)    { sets.push('role_id = ?');            vals.push(ROLE_ID[role] || 3) }
    if (status)  { sets.push('status = ?');             vals.push(status) }
    if (password){ sets.push('password = ?');           vals.push(password) }
    if (photoUrl !== undefined) { sets.push('profile_image_url = ?'); vals.push(photoUrl) }

    if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' })
    vals.push(id)
    await pool.execute(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, vals)
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

export default router

// server/routes/clients.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/clients
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients ORDER BY id')
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// GET /api/clients/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Cliente no encontrado' })
    res.json(rows[0])
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// POST /api/clients
router.post('/', async (req, res) => {
  console.log('[POST /api/clients] body recibido:', JSON.stringify(req.body))
  const { tenant_id = 1, name, email, phone, status = 'active', plan, plan_end, photo = '👤',
          weight, height, bmi, join_date, visits = 0, visits_remaining, direct_access = 0, password, facial_access = 1, face_descriptor = null } = req.body
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [result] = await conn.execute(
      `INSERT INTO clients (tenant_id, name, email, phone, status, plan, plan_end, photo,
        weight, height, bmi, join_date, visits, visits_remaining, direct_access, password, facial_access, face_descriptor)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [tenant_id, name, email, phone, status, plan, plan_end, photo,
       weight, height, bmi, join_date || new Date().toISOString().split('T')[0],
       visits, visits_remaining ?? null, direct_access, password || null, facial_access, face_descriptor]
    )
    console.log('[POST /api/clients] cliente insertado, id:', result.insertId, 'password recibido:', password ? 'SÍ' : 'NO')

    if (password) {
      // INSERT IGNORE evita fallo si el email ya existe en users
      const [uRows] = await conn.execute('SELECT id FROM users WHERE email = ?', [email])
      if (uRows.length) {
        // Ya existe → actualizar contraseña
        await conn.execute('UPDATE users SET password = ?, name = ? WHERE email = ?', [password, name, email])
      } else {
        await conn.execute(
          `INSERT INTO users (tenant_id, role_id, name, email, password) VALUES (?, ?, ?, ?, ?)`,
          [tenant_id, 3, name, email, password]
        )
      }
    }
    await conn.commit()
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { 
    await conn.rollback()
    console.error('[POST /api/clients] ERROR:', err.message)
    res.status(500).json({ error: err.message || 'Error del servidor' })
  } finally {
    conn.release()
  }
})

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  const allowed = ['name','email','phone','status','plan','plan_end','photo',
                   'weight','height','bmi','visits','visits_remaining','direct_access', 'password', 'facial_access', 'face_descriptor']
  const sets = []; const vals = []
  for (const key of allowed) {
    if (req.body[key] !== undefined && req.body[key] !== '') {
      sets.push(`${key} = ?`)
      // Convertir boolean a 1 o 0 para direct_access y facial_access
      vals.push(key === 'direct_access' || key === 'facial_access' ? (req.body[key] ? 1 : 0) : req.body[key])
    }
  }
  if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' })
  
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    
    vals.push(parseInt(req.params.id))
    await conn.execute(`UPDATE clients SET ${sets.join(', ')} WHERE id = ?`, vals)
    
    if (req.body.password && req.body.email) {
      const [uRows] = await conn.execute('SELECT id FROM users WHERE email = ?', [req.body.email])
      if (uRows.length) {
        await conn.execute('UPDATE users SET password = ? WHERE email = ?', [req.body.password, req.body.email])
      } else {
        await conn.execute(
          `INSERT INTO users (tenant_id, role_id, name, email, password) VALUES (?, ?, ?, ?, ?)`,
          [1, 3, req.body.name || 'Cliente', req.body.email, req.body.password]
        )
      }
    }
    
    await conn.commit()
    res.json({ ok: true })
  } catch (err) { 
    await conn.rollback()
    console.error(err); 
    res.status(500).json({ error: 'Error del servidor' }) 
  } finally {
    conn.release()
  }
})

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM clients WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

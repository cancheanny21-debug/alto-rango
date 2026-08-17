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
  const { tenant_id = 1, name, email, phone, status = 'active', plan, plan_end, photo = '👤',
          weight, height, bmi, join_date, visits = 0, visits_remaining } = req.body
  try {
    const [result] = await pool.execute(
      `INSERT INTO clients (tenant_id, name, email, phone, status, plan, plan_end, photo,
        weight, height, bmi, join_date, visits, visits_remaining)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [tenant_id, name, email, phone, status, plan, plan_end, photo,
       weight, height, bmi, join_date || new Date().toISOString().split('T')[0], visits, visits_remaining ?? null]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// PUT /api/clients/:id
router.put('/:id', async (req, res) => {
  const allowed = ['name','email','phone','status','plan','plan_end','photo',
                   'weight','height','bmi','visits','visits_remaining']
  const sets = []; const vals = []
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      sets.push(`${key} = ?`)
      vals.push(req.body[key])
    }
  }
  if (!sets.length) return res.status(400).json({ error: 'Nada que actualizar' })
  vals.push(parseInt(req.params.id))
  try {
    await pool.execute(`UPDATE clients SET ${sets.join(', ')} WHERE id = ?`, vals)
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// DELETE /api/clients/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM clients WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

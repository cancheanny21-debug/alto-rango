// server/routes/attendance.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

// GET /api/attendance
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM attendance ORDER BY id DESC')
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// POST /api/attendance — registrar entrada
router.post('/', async (req, res) => {
  const { client_id, client_name, date, checkin, status = 'pending' } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO attendance (client_id, client_name, date, checkin, status) VALUES (?,?,?,?,?)',
      [client_id, client_name, date, checkin, status]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// PUT /api/attendance/:id — verificar o cancelar
router.put('/:id', async (req, res) => {
  const { status, checkout, duration } = req.body
  try {
    await pool.execute(
      'UPDATE attendance SET status=?, checkout=?, duration=? WHERE id=?',
      [status, checkout ?? null, duration ?? null, parseInt(req.params.id)]
    )
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

// server/routes/routines.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM routines ORDER BY id')
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, name, description, difficulty } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO routines (tenant_id, name, description, difficulty) VALUES (?,?,?,?)',
      [tenant_id, name, description, difficulty]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.put('/:id', async (req, res) => {
  const { name, description, difficulty } = req.body
  try {
    await pool.execute(
      'UPDATE routines SET name=?, description=?, difficulty=? WHERE id=?',
      [name, description, difficulty, parseInt(req.params.id)]
    )
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM routines WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

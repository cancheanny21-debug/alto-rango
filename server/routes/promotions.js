// server/routes/promotions.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM promotions ORDER BY id')
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, name, discount_percentage = 0, discount_amount = 0, start_date, end_date, is_active = true } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO promotions (tenant_id, name, discount_percentage, discount_amount, start_date, end_date, is_active) VALUES (?,?,?,?,?,?,?)',
      [tenant_id, name, discount_percentage, discount_amount, start_date || null, end_date || null, is_active]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.put('/:id', async (req, res) => {
  const { name, discount_percentage, discount_amount, start_date, end_date, is_active } = req.body
  try {
    await pool.execute(
      'UPDATE promotions SET name=?, discount_percentage=?, discount_amount=?, start_date=?, end_date=?, is_active=? WHERE id=?',
      [name, discount_percentage || 0, discount_amount || 0, start_date || null, end_date || null, is_active, parseInt(req.params.id)]
    )
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM promotions WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

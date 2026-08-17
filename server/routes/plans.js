// server/routes/plans.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM plans ORDER BY id')
    const plans = rows.map(p => ({ ...p, features: JSON.parse(p.features || '[]') }))
    res.json(plans)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, name, type, duration, price, limit_visits, features = [], color } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO plans (tenant_id, name, type, duration, price, limit_visits, features, color) VALUES (?,?,?,?,?,?,?,?)',
      [tenant_id, name, type, duration, price, limit_visits ?? null, JSON.stringify(features), color]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.put('/:id', async (req, res) => {
  const { name, type, duration, price, limit_visits, features, color } = req.body
  try {
    await pool.execute(
      'UPDATE plans SET name=?, type=?, duration=?, price=?, limit_visits=?, features=?, color=? WHERE id=?',
      [name, type, duration, price, limit_visits ?? null, JSON.stringify(features || []), color, parseInt(req.params.id)]
    )
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM plans WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

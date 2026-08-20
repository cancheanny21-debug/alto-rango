// server/routes/payments.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, p.client_name as client
      FROM payments p 
      ORDER BY p.date DESC
    `)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, client_id, client_name, concept, amount, method, discount = 0, promo = null } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO payments (tenant_id, client_id, client_name, concept, amount, method, discount, promo) VALUES (?,?,?,?,?,?,?,?)',
      [tenant_id, client_id || null, client_name || 'Cliente', concept || 'Cobro general', amount, method, discount, promo]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

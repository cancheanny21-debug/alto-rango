// server/routes/payments.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.personal_data 
      FROM payments p 
      LEFT JOIN clients c ON p.client_id = c.id 
      ORDER BY p.payment_date DESC
    `)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, client_id, membership_id, amount, method } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO payments (tenant_id, client_id, membership_id, amount, method) VALUES (?,?,?,?,?)',
      [tenant_id, client_id, membership_id || null, amount, method]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

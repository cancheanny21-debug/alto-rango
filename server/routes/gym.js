// server/routes/gym.js — pagos, ventas, promociones, equipamiento, rutinas, notificaciones
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

/* ─── PAYMENTS ─── */
router.get('/payments', async (req, res) => {
  try { const [r] = await pool.execute('SELECT * FROM payments ORDER BY id DESC'); res.json(r) }
  catch (err) { res.status(500).json({ error: err.message }) }
})
router.post('/payments', async (req, res) => {
  const { tenant_id=1, client_id, client_name, concept, amount, method, discount=0, promo } = req.body
  try {
    const [r] = await pool.execute(
      'INSERT INTO payments (tenant_id, client_id, client_name, concept, amount, method, discount, promo) VALUES (?,?,?,?,?,?,?,?)',
      [tenant_id, client_id, client_name, concept, amount, method, discount, promo ?? null]
    )
    res.status(201).json({ id: r.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

/* ─── SALES ─── */
router.get('/sales', async (req, res) => {
  try {
    const [sales] = await pool.execute('SELECT * FROM sales ORDER BY id DESC')
    const [items] = await pool.execute('SELECT * FROM sale_items')
    const result = sales.map(s => ({ ...s, items: items.filter(i => i.sale_id === s.id) }))
    res.json(result)
  } catch (err) { res.status(500).json({ error: err.message }) }
})
router.post('/sales', async (req, res) => {
  const { tenant_id=1, client_name, items=[], total, method, date } = req.body
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()
    const [r] = await conn.execute(
      'INSERT INTO sales (tenant_id, client_name, total, method, date) VALUES (?,?,?,?,?)',
      [tenant_id, client_name, total, method, date || new Date().toISOString().split('T')[0]]
    )
    const saleId = r.insertId
    for (const item of items) {
      await conn.execute(
        'INSERT INTO sale_items (sale_id, name, qty, price) VALUES (?,?,?,?)',
        [saleId, item.name, item.qty, item.price]
      )
      await conn.execute('UPDATE products SET stock = stock - ? WHERE name = ?', [item.qty, item.name])
    }
    await conn.commit()
    res.status(201).json({ id: saleId, ...req.body })
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ error: err.message })
  } finally { conn.release() }
})

/* ─── PROMOTIONS ─── */
router.get('/promotions', async (req, res) => {
  try { const [r] = await pool.execute('SELECT * FROM promotions ORDER BY id'); res.json(r) }
  catch (err) { res.status(500).json({ error: err.message }) }
})
router.post('/promotions', async (req, res) => {
  const { tenant_id=1, name, type, value, active=true, applies_to, description } = req.body
  try {
    const [r] = await pool.execute(
      'INSERT INTO promotions (tenant_id, name, type, value, active, applies_to, description) VALUES (?,?,?,?,?,?,?)',
      [tenant_id, name, type, value, active ? 1 : 0, applies_to, description]
    )
    res.status(201).json({ id: r.insertId, ...req.body })
  } catch (err) { res.status(500).json({ error: err.message }) }
})
router.put('/promotions/:id', async (req, res) => {
  const { active, name, type, value, applies_to, description } = req.body
  try {
    await pool.execute(
      'UPDATE promotions SET name=?, type=?, value=?, active=?, applies_to=?, description=? WHERE id=?',
      [name, type, value, active ? 1 : 0, applies_to, description, parseInt(req.params.id)]
    )
    res.json({ ok: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})
router.delete('/promotions/:id', async (req, res) => {
  try { await pool.execute('DELETE FROM promotions WHERE id=?', [parseInt(req.params.id)]); res.json({ ok: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

/* ─── EQUIPMENT ─── */
router.get('/equipment', async (req, res) => {
  try { const [r] = await pool.execute('SELECT * FROM equipment ORDER BY id'); res.json(r) }
  catch (err) { res.status(500).json({ error: err.message }) }
})
router.delete('/equipment/:id', async (req, res) => {
  try { await pool.execute('DELETE FROM equipment WHERE id=?', [parseInt(req.params.id)]); res.json({ ok: true }) }
  catch (err) { res.status(500).json({ error: err.message }) }
})

/* ─── ROUTINES ─── */
router.get('/routines', async (req, res) => {
  try {
    const [routines] = await pool.execute('SELECT * FROM routines ORDER BY id')
    const [exercises] = await pool.execute('SELECT * FROM routine_exercises')
    const result = routines.map(r => ({
      ...r,
      exercises: exercises.filter(e => e.routine_id === r.id).map(e => e.description)
    }))
    res.json(result)
  } catch (err) { res.status(500).json({ error: err.message }) }
})

export default router

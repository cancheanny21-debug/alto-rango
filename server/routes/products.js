// server/routes/products.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products ORDER BY id')
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, name, category, price, stock, emoji, desc, rating = 0, sold = 0 } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO products (tenant_id, name, category, price, stock, emoji, description, rating, sold) VALUES (?,?,?,?,?,?,?,?,?)',
      [tenant_id, name, category, price, stock, emoji, desc, rating, sold]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.put('/:id', async (req, res) => {
  const { name, category, price, stock, emoji, desc, rating, sold } = req.body
  try {
    await pool.execute(
      'UPDATE products SET name=?, category=?, price=?, stock=?, emoji=?, description=?, rating=?, sold=? WHERE id=?',
      [name, category, price, stock, emoji, desc, rating, sold, parseInt(req.params.id)]
    )
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.delete('/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

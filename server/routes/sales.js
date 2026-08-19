// server/routes/sales.js
import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT s.*, u.name as employee_name, c.personal_data 
      FROM sales s 
      LEFT JOIN users u ON s.user_id = u.id 
      LEFT JOIN clients c ON s.client_id = c.id
      ORDER BY s.sale_date DESC
    `)
    res.json(rows)
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.post('/', async (req, res) => {
  const { tenant_id = 1, user_id, client_id, total, items } = req.body
  // items: [{ inventory_id, quantity, price_unit }]
  
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [saleResult] = await connection.execute(
      'INSERT INTO sales (tenant_id, user_id, client_id, total) VALUES (?,?,?,?)',
      [tenant_id, user_id || null, client_id || null, total]
    )
    const saleId = saleResult.insertId

    for (const item of items) {
      await connection.execute(
        'INSERT INTO sale_items (sale_id, inventory_id, quantity, price_unit) VALUES (?,?,?,?)',
        [saleId, item.inventory_id, item.quantity, item.price_unit]
      )
      // Actualizar stock
      await connection.execute(
        'UPDATE inventory SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.inventory_id]
      )
    }

    await connection.commit()
    res.status(201).json({ success: true, saleId })
  } catch (err) { 
    await connection.rollback()
    console.error(err); res.status(500).json({ error: 'Error del servidor' }) 
  } finally {
    connection.release()
  }
})

export default router

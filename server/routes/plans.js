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
  const { tenant_id = 1, name, duration_days = 30, price, features = [] } = req.body
  try {
    const [result] = await pool.execute(
      'INSERT INTO plans (tenant_id, name, duration_days, price, features) VALUES (?,?,?,?,?)',
      [tenant_id, name, duration_days, price, JSON.stringify(features)]
    )
    res.status(201).json({ id: result.insertId, ...req.body })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

router.put('/:id', async (req, res) => {
  const { name, duration_days, price, features } = req.body
  try {
    await pool.execute(
      'UPDATE plans SET name=?, duration_days=?, price=?, features=? WHERE id=?',
      [name, duration_days, price, JSON.stringify(features || []), parseInt(req.params.id)]
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

// POST /api/plans/change-membership
// RF-006: Cambio de plan de membresía
router.post('/change-membership', async (req, res) => {
  const { client_id, new_plan_id } = req.body
  if (!client_id || !new_plan_id) return res.status(400).json({ error: 'client_id y new_plan_id son requeridos' })
  
  try {
    const [planRows] = await pool.execute('SELECT duration_days, name FROM plans WHERE id = ?', [new_plan_id])
    if (!planRows.length) return res.status(404).json({ error: 'Plan no encontrado' })
    const plan = planRows[0]

    let remaining = null
    if (plan.name.toLowerCase().includes('pospago')) {
      remaining = 30
    }
    
    await pool.execute(
      `UPDATE memberships 
       SET plan_id = ?, 
           start_date = CURRENT_DATE, 
           end_date = DATE_ADD(CURRENT_DATE, INTERVAL ? DAY),
           remaining_accesses = ?
       WHERE client_id = ?`,
      [new_plan_id, plan.duration_days, remaining, client_id]
    )
    
    res.json({ ok: true, message: 'Plan actualizado exitosamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router

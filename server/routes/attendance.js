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

// POST /api/attendance
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

// PUT /api/attendance/:id
router.put('/:id', async (req, res) => {
  const { status } = req.body
  try {
    await pool.execute('UPDATE attendance SET status = ? WHERE id = ?', [status, parseInt(req.params.id)])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// POST /api/attendance/check-access (RF-007, RF-010)
// Verifica la membresía y descuenta si es plan pospago
router.post('/check-access', async (req, res) => {
  const { client_id } = req.body
  try {
    // 1. Validar que el control de acceso esté activo
    const [stateRows] = await pool.execute('SELECT is_active FROM access_control_state ORDER BY id DESC LIMIT 1')
    if (stateRows.length && !stateRows[0].is_active) {
      // Si está desactivado, abre libremente pero registra la entrada
      return res.json({ allowed: true, message: 'Acceso libre temporalmente' })
    }

    // 2. Verificar membresía activa
    const [memberships] = await pool.execute(`
      SELECT m.id, m.remaining_accesses, p.name as plan_name, c.name, c.email
      FROM memberships m
      JOIN plans p ON m.plan_id = p.id
      JOIN clients c ON m.client_id = c.id
      WHERE m.client_id = ? AND m.start_date <= CURRENT_DATE AND m.end_date >= CURRENT_DATE
    `, [client_id])

    if (!memberships.length) {
      return res.json({ allowed: false, message: 'Membresía vencida o inactiva' })
    }

    const membership = memberships[0]

    // RF-010: Control del plan pospago por tarjeta (30 asistencias)
    if (membership.remaining_accesses !== null) {
      if (membership.remaining_accesses <= 0) {
        return res.json({ allowed: false, message: 'Plan de asistencias agotado' })
      }
      // Descontar asistencia
      await pool.execute('UPDATE memberships SET remaining_accesses = remaining_accesses - 1 WHERE id = ?', [membership.id])
    }

    // RF-008: Registrar asistencia
    await pool.execute(
      'INSERT INTO attendance (client_id, client_name, date, checkin, status) VALUES (?,?,CURRENT_DATE,CURRENT_TIME,?)',
      [client_id, membership.name || 'Cliente', 'completed']
    )

    res.json({ allowed: true, message: 'Acceso concedido. Puerta abierta.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// POST /api/attendance/direct-open (RF-018)
// Apertura directa por Administrador
router.post('/direct-open', async (req, res) => {
  const { admin_id } = req.body
  try {
    // Registramos en un log interno que el admin abrió manualmente
    console.log(`Admin ${admin_id} abrió la puerta manualmente.`)
    res.json({ success: true, message: 'Puerta abierta manualmente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error del servidor' })
  }
})

// GET /api/attendance/control-state
router.get('/control-state', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT is_active FROM access_control_state ORDER BY id DESC LIMIT 1')
    res.json({ is_active: rows.length ? rows[0].is_active : true })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

// POST /api/attendance/control-state (RF-009)
router.post('/control-state', async (req, res) => {
  const { is_active, tenant_id = 1 } = req.body
  try {
    const [rows] = await pool.execute('SELECT id FROM access_control_state ORDER BY id DESC LIMIT 1')
    if (rows.length) {
      await pool.execute('UPDATE access_control_state SET is_active = ? WHERE id = ?', [is_active, rows[0].id])
    } else {
      await pool.execute('INSERT INTO access_control_state (tenant_id, is_active) VALUES (?,?)', [tenant_id, is_active])
    }
    res.json({ success: true, is_active })
  } catch (err) { console.error(err); res.status(500).json({ error: 'Error del servidor' }) }
})

export default router

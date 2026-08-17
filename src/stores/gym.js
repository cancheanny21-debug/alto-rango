import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function nowTime() {
  return new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
}

export const useGymStore = defineStore('gym', () => {
  const clients      = ref([])
  const plans        = ref([])
  const products     = ref([])
  const equipment    = ref([])
  const payments     = ref([])
  const promotions   = ref([])
  const attendance   = ref([])
  const routines     = ref([])
  const sales        = ref([])
  const notifications = ref([])
  const accessControlEnabled = ref(true)
  const loading      = ref(false)
  const error        = ref(null)

  // ─── Cargar todos los datos desde la API ───────────────
  async function loadAll() {
    loading.value = true
    error.value = null
    try {
      const [c, pl, pr, eq, pay, prom, att, rot, sal] = await Promise.all([
        api('/clients'),
        api('/plans'),
        api('/products'),
        api('/equipment'),
        api('/payments'),
        api('/promotions'),
        api('/attendance'),
        api('/routines'),
        api('/sales'),
      ])
      clients.value    = c
      plans.value      = pl
      products.value   = pr
      equipment.value  = eq
      payments.value   = pay
      promotions.value = prom
      attendance.value = att
      routines.value   = rot
      sales.value      = sal
    } catch (err) {
      console.error('loadAll error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // ─── Computeds ─────────────────────────────────────────
  const activePromo = computed(() =>
    promotions.value.find(p => p.active && p.applies_to === 'membresias') || null
  )
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length)

  // ─── Descuentos y planes ───────────────────────────────
  function applyMembershipDiscount(amount) {
    const promo = activePromo.value
    if (!promo) return { final: amount, discount: 0, promoName: null }
    const discount = promo.type === 'percent'
      ? +(amount * promo.value / 100).toFixed(2)
      : Math.min(promo.value, amount)
    return { final: +(amount - discount).toFixed(2), discount, promoName: promo.name }
  }

  function getPlanByName(name) {
    return plans.value.find(p => p.name === name)
  }

  // ─── Control de acceso ─────────────────────────────────
  function canOpenDoor(client) {
    if (!accessControlEnabled.value) return { ok: false, reason: 'Control de acceso desactivado' }
    if (!client) return { ok: false, reason: 'Cliente no encontrado' }
    if (client.status === 'frozen')   return { ok: false, reason: 'Membresía congelada' }
    if (client.status === 'expired' || client.status === 'completed') return { ok: false, reason: 'Membresía vencida o cumplida' }
    if (client.status !== 'active')   return { ok: false, reason: 'Membresía inactiva' }
    if (client.plan_end && client.plan_end < todayStr() && client.plan !== 'Pospago por Tarjeta') {
      return { ok: false, reason: 'Membresía vencida por fecha' }
    }
    if (client.plan === 'Pospago por Tarjeta') {
      if (client.visits_remaining == null || client.visits_remaining <= 0)
        return { ok: false, reason: 'Plan pospago cumplido (0 asistencias)' }
    }
    return { ok: true, reason: '' }
  }

  async function registerCheckin(clientId) {
    const client = clients.value.find(c => c.id === clientId)
    const gate = canOpenDoor(client)
    if (!gate.ok) return { success: false, doorOpen: false, message: gate.reason }

    try {
      // Actualizar visitas en BD
      const updates = { visits: (client.visits || 0) + 1 }
      if (client.plan === 'Pospago por Tarjeta') {
        updates.visits_remaining = Math.max(0, (client.visits_remaining || 0) - 1)
        if (updates.visits_remaining === 0) updates.status = 'completed'
      }
      await api(`/clients/${clientId}`, { method: 'PUT', body: updates })
      Object.assign(client, updates)

      // Registrar asistencia
      const record = await api('/attendance', {
        method: 'POST',
        body: { client_id: clientId, client_name: client.name, date: todayStr(), checkin: nowTime() }
      })
      attendance.value.unshift(record)

      return {
        success: true,
        doorOpen: true,
        message: client.plan === 'Pospago por Tarjeta'
          ? `Entrada OK. Quedan ${updates.visits_remaining} asistencias`
          : `Entrada registrada: ${client.name}`,
        remaining: updates.visits_remaining,
      }
    } catch (err) {
      return { success: false, doorOpen: false, message: err.message }
    }
  }

  async function verifyAttendance(id) {
    await api(`/attendance/${id}`, { method: 'PUT', body: { status: 'verified' } })
    const r = attendance.value.find(a => a.id === id)
    if (r) r.status = 'verified'
  }

  async function cancelAttendance(id) {
    const r = attendance.value.find(a => a.id === id)
    if (!r || r.status === 'cancelled') return
    await api(`/attendance/${id}`, { method: 'PUT', body: { status: 'cancelled' } })
    r.status = 'cancelled'
    // Revertir visitas pospago
    const client = clients.value.find(c => c.id === r.client_id)
    if (client?.plan === 'Pospago por Tarjeta') {
      const updates = {
        visits_remaining: (client.visits_remaining || 0) + 1,
        visits: Math.max(0, (client.visits || 0) - 1),
        status: 'active',
      }
      await api(`/clients/${client.id}`, { method: 'PUT', body: updates })
      Object.assign(client, updates)
    }
  }

  function setAccessControl(enabled) {
    accessControlEnabled.value = enabled
  }

  // ─── Pagos ─────────────────────────────────────────────
  async function addPayment({ clientId, concept, amount, method }) {
    const client = clients.value.find(c => c.id === clientId)
    const priced = applyMembershipDiscount(amount)
    const payment = await api('/payments', {
      method: 'POST',
      body: {
        client_id: clientId,
        client_name: client?.name || 'Cliente',
        concept,
        amount: priced.final,
        method,
        discount: priced.discount,
        promo: priced.promoName,
      }
    })
    payments.value.unshift(payment)
    return payment
  }

  async function changeClientPlan(clientId, planName, { registerPayment = true, method = 'Efectivo' } = {}) {
    const client = clients.value.find(c => c.id === clientId)
    const plan   = getPlanByName(planName)
    if (!client || !plan) return null

    const end = new Date()
    end.setDate(end.getDate() + (plan.duration === 999 ? 365 : plan.duration))
    const updates = {
      plan: plan.name,
      plan_end: end.toISOString().split('T')[0],
      status: 'active',
      visits_remaining: plan.limit_visits ?? null,
    }
    await api(`/clients/${clientId}`, { method: 'PUT', body: updates })
    Object.assign(client, updates)

    if (registerPayment) {
      await addPayment({ clientId, concept: `Cambio/renovación: ${plan.name}`, amount: plan.price, method })
    }
    return client
  }

  async function renewMembership(clientId) {
    const client = clients.value.find(c => c.id === clientId)
    if (client) await changeClientPlan(clientId, client.plan, { registerPayment: true })
  }

  async function freezeMembership(clientId) {
    await api(`/clients/${clientId}`, { method: 'PUT', body: { status: 'frozen' } })
    const client = clients.value.find(c => c.id === clientId)
    if (client) client.status = 'frozen'
  }

  async function unfreezeMembership(clientId) {
    await api(`/clients/${clientId}`, { method: 'PUT', body: { status: 'active' } })
    const client = clients.value.find(c => c.id === clientId)
    if (client) client.status = 'active'
  }

  // ─── Promociones ───────────────────────────────────────
  async function togglePromotion(id) {
    const p = promotions.value.find(x => x.id === id)
    if (!p) return
    const newActive = !p.active
    if (newActive) promotions.value.forEach(x => { if (x.applies_to === p.applies_to) x.active = false })
    p.active = newActive
    await api(`/promotions/${id}`, { method: 'PUT', body: { ...p, active: newActive } })
  }

  async function addPromotion(data) {
    const created = await api('/promotions', { method: 'POST', body: { ...data } })
    promotions.value.push({ ...data, ...created })
  }

  async function deletePromotion(id) {
    await api(`/promotions/${id}`, { method: 'DELETE' })
    promotions.value = promotions.value.filter(p => p.id !== id)
  }

  // ─── Notificaciones (locales) ──────────────────────────
  function addNotification(notification) {
    notifications.value.unshift({ id: Date.now(), read: false, createdAt: new Date().toISOString(), ...notification })
  }

  function markNotificationsRead() {
    notifications.value.forEach(n => { n.read = true })
  }

  // ─── Ventas ────────────────────────────────────────────
  async function recordSale(sale) {
    const created = await api('/sales', { method: 'POST', body: sale })
    sales.value.unshift({ ...sale, id: created.id })
    addNotification({
      type: 'sale',
      title: 'Nueva venta registrada',
      message: `${sale.client_name} · $${sale.total.toFixed(2)} · ${sale.method}`,
      detail: sale.items.map(i => `${i.name} x${i.qty}`).join(', '),
    })
    // Actualizar stock localmente (la API ya lo hizo en BD)
    sale.items.forEach(item => {
      const p = products.value.find(p => p.name === item.name)
      if (p) { p.stock = Math.max(0, p.stock - item.qty); p.sold = (p.sold || 0) + item.qty }
    })
  }

  // ─── CRUD simples ──────────────────────────────────────
  async function deletePlan(id) {
    await api(`/plans/${id}`, { method: 'DELETE' })
    plans.value = plans.value.filter(p => p.id !== id)
  }

  async function deleteClient(id) {
    await api(`/clients/${id}`, { method: 'DELETE' })
    clients.value = clients.value.filter(c => c.id !== id)
  }

  async function deleteProduct(id) {
    await api(`/products/${id}`, { method: 'DELETE' })
    products.value = products.value.filter(p => p.id !== id)
  }

  async function deleteEquipmentItem(id) {
    await api(`/equipment/${id}`, { method: 'DELETE' })
    equipment.value = equipment.value.filter(e => e.id !== id)
  }

  // Guardar clientes y productos (para compatibilidad con vistas que llaman save*)
  async function saveClients() { /* No-op: las mutaciones ya persisten via API */ }
  async function savePlans()   { /* No-op */ }
  async function saveProducts(){ /* No-op */ }
  async function saveEquipment(){ /* No-op */ }
  async function savePayments(){ /* No-op */ }
  async function savePromotions(){ /* No-op */ }
  async function saveAttendance(){ /* No-op */ }
  async function saveRoutines(){ /* No-op */ }
  async function saveSales()  { /* No-op */ }

  return {
    clients, plans, products, equipment, payments, promotions, attendance,
    routines, sales, notifications, accessControlEnabled, loading, error,
    activePromo, unreadNotifications,
    loadAll,
    saveClients, savePlans, saveProducts, saveEquipment, savePayments,
    savePromotions, saveAttendance, saveRoutines, saveSales,
    applyMembershipDiscount, getPlanByName, canOpenDoor, registerCheckin,
    verifyAttendance, cancelAttendance, setAccessControl,
    addPayment, changeClientPlan, renewMembership, freezeMembership, unfreezeMembership,
    togglePromotion, addPromotion, deletePromotion,
    addNotification, markNotificationsRead, recordSale,
    deletePlan, deleteClient, deleteProduct, deleteEquipmentItem,
  }
})

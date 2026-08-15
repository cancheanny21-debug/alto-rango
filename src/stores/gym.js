import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  seedClients, seedPlans, seedProducts, seedEquipment,
  seedPayments, seedPromotions, seedAttendance, seedRoutines, seedSales,
} from '../data/seed'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Evitar arrays vacíos / datos corruptos que dejen la UI rota
      if (Array.isArray(fallback)) {
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
        return structuredClone(fallback)
      }
      if (parsed !== null && parsed !== undefined) return parsed
    }
  } catch { /* ignore */ }
  return structuredClone(fallback)
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function nowTime() {
  return new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
}

export const useGymStore = defineStore('gym', () => {
  const clients = ref(load('ar_clients', seedClients))
  const plans = ref(load('ar_plans', seedPlans))
  const products = ref(load('ar_products', seedProducts))
  const equipment = ref(load('ar_equipment', seedEquipment))
  const payments = ref(load('ar_payments', seedPayments))
  const promotions = ref(load('ar_promotions', seedPromotions))
  const attendance = ref(load('ar_attendance', seedAttendance))
  const routines = ref(load('ar_routines', seedRoutines))
  const sales = ref(load('ar_sales', seedSales))
  const notifications = ref(load('ar_notifications', []))
  const accessControlEnabled = ref(load('ar_access_control', true))

  function persist(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  function saveClients() { persist('ar_clients', clients.value) }
  function savePlans() { persist('ar_plans', plans.value) }
  function saveProducts() { persist('ar_products', products.value) }
  function saveEquipment() { persist('ar_equipment', equipment.value) }
  function savePayments() { persist('ar_payments', payments.value) }
  function savePromotions() { persist('ar_promotions', promotions.value) }
  function saveAttendance() { persist('ar_attendance', attendance.value) }
  function saveRoutines() { persist('ar_routines', routines.value) }
  function saveSales() { persist('ar_sales', sales.value) }
  function saveNotifications() { persist('ar_notifications', notifications.value) }
  function saveAccessControl() { persist('ar_access_control', accessControlEnabled.value) }

  const activePromo = computed(() => promotions.value.find(p => p.active && p.appliesTo === 'membresias') || null)
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.read).length)

  function applyMembershipDiscount(amount) {
    const promo = activePromo.value
    if (!promo) return { final: amount, discount: 0, promoName: null }
    const discount = promo.type === 'percent' ? +(amount * promo.value / 100).toFixed(2) : Math.min(promo.value, amount)
    return { final: +(amount - discount).toFixed(2), discount, promoName: promo.name }
  }

  function getPlanByName(name) {
    return plans.value.find(p => p.name === name)
  }

  function canOpenDoor(client) {
    if (!accessControlEnabled.value) return { ok: false, reason: 'Control de acceso desactivado' }
    if (!client) return { ok: false, reason: 'Cliente no encontrado' }
    if (client.status === 'frozen') return { ok: false, reason: 'Membresía congelada' }
    if (client.status === 'expired' || client.status === 'completed') return { ok: false, reason: 'Membresía vencida o cumplida' }
    if (client.status !== 'active') return { ok: false, reason: 'Membresía inactiva' }
    if (client.planEnd && client.planEnd < todayStr() && client.plan !== 'Pospago por Tarjeta') {
      return { ok: false, reason: 'Membresía vencida por fecha' }
    }
    if (client.plan === 'Pospago por Tarjeta') {
      if (client.visitsRemaining == null || client.visitsRemaining <= 0) {
        return { ok: false, reason: 'Plan pospago cumplido (0 asistencias)' }
      }
    }
    return { ok: true, reason: '' }
  }

  function registerCheckin(clientId) {
    const client = clients.value.find(c => c.id === clientId)
    const gate = canOpenDoor(client)
    if (!gate.ok) return { success: false, doorOpen: false, message: gate.reason }

    if (client.plan === 'Pospago por Tarjeta') {
      client.visitsRemaining = Math.max(0, (client.visitsRemaining || 0) - 1)
      client.visits = (client.visits || 0) + 1
      if (client.visitsRemaining === 0) {
        client.status = 'completed'
      }
      saveClients()
    } else {
      client.visits = (client.visits || 0) + 1
      saveClients()
    }

    const record = {
      id: Date.now(),
      clientId: client.id,
      client: client.name,
      date: todayStr(),
      checkin: nowTime(),
      checkout: null,
      duration: null,
      status: 'pending',
    }
    attendance.value.unshift(record)
    saveAttendance()

    return {
      success: true,
      doorOpen: true,
      message: client.plan === 'Pospago por Tarjeta'
        ? `Entrada OK. Quedan ${client.visitsRemaining} asistencias`
        : `Entrada registrada: ${client.name}`,
      remaining: client.visitsRemaining,
    }
  }

  function verifyAttendance(id) {
    const r = attendance.value.find(a => a.id === id)
    if (r) { r.status = 'verified'; saveAttendance() }
  }

  function cancelAttendance(id) {
    const r = attendance.value.find(a => a.id === id)
    if (!r || r.status === 'cancelled') return
    r.status = 'cancelled'
    // Revert pospago visit if needed
    const client = clients.value.find(c => c.id === r.clientId)
    if (client?.plan === 'Pospago por Tarjeta' && client.status === 'completed') {
      client.status = 'active'
      client.visitsRemaining = (client.visitsRemaining || 0) + 1
      client.visits = Math.max(0, (client.visits || 0) - 1)
      saveClients()
    } else if (client?.plan === 'Pospago por Tarjeta') {
      client.visitsRemaining = (client.visitsRemaining || 0) + 1
      client.visits = Math.max(0, (client.visits || 0) - 1)
      saveClients()
    }
    saveAttendance()
  }

  function setAccessControl(enabled) {
    accessControlEnabled.value = enabled
    saveAccessControl()
  }

  function addPayment({ clientId, concept, amount, method }) {
    const client = clients.value.find(c => c.id === clientId)
    const priced = applyMembershipDiscount(amount)
    const payment = {
      id: Date.now(),
      date: todayStr(),
      clientId,
      client: client?.name || 'Cliente',
      concept,
      amount: priced.final,
      method,
      discount: priced.discount,
      promo: priced.promoName,
    }
    payments.value.unshift(payment)
    savePayments()
    return payment
  }

  function changeClientPlan(clientId, planName, { registerPayment = true, method = 'Efectivo' } = {}) {
    const client = clients.value.find(c => c.id === clientId)
    const plan = getPlanByName(planName)
    if (!client || !plan) return null

    client.plan = plan.name
    const end = new Date()
    end.setDate(end.getDate() + (plan.duration === 999 ? 365 : plan.duration))
    client.planEnd = end.toISOString().split('T')[0]
    client.status = 'active'
    if (plan.limit) {
      client.visitsRemaining = plan.limit
    } else {
      client.visitsRemaining = null
    }
    saveClients()

    if (registerPayment) {
      addPayment({
        clientId,
        concept: `Cambio/renovación: ${plan.name}`,
        amount: plan.price,
        method,
      })
    }
    return client
  }

  function renewMembership(clientId) {
    const client = clients.value.find(c => c.id === clientId)
    if (!client) return
    changeClientPlan(clientId, client.plan, { registerPayment: true })
  }

  function freezeMembership(clientId) {
    const client = clients.value.find(c => c.id === clientId)
    if (!client) return
    client.status = 'frozen'
    saveClients()
  }

  function unfreezeMembership(clientId) {
    const client = clients.value.find(c => c.id === clientId)
    if (!client) return
    client.status = 'active'
    saveClients()
  }

  function togglePromotion(id) {
    const p = promotions.value.find(x => x.id === id)
    if (!p) return
    if (!p.active) {
      promotions.value.forEach(x => {
        if (x.appliesTo === p.appliesTo) x.active = false
      })
      p.active = true
    } else {
      p.active = false
    }
    savePromotions()
  }

  function addPromotion(data) {
    promotions.value.push({ ...data, id: Date.now(), active: !!data.active })
    savePromotions()
  }

  function deletePromotion(id) {
    promotions.value = promotions.value.filter(p => p.id !== id)
    savePromotions()
  }

  function addNotification(notification) {
    notifications.value.unshift({
      id: Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    })
    saveNotifications()
  }

  function markNotificationsRead() {
    notifications.value.forEach(n => { n.read = true })
    saveNotifications()
  }

  function recordSale(sale) {
    sales.value.unshift(sale)
    saveSales()
    addNotification({
      type: 'sale',
      title: 'Nueva venta registrada',
      message: `${sale.client} · $${sale.total.toFixed(2)} · ${sale.method}`,
      detail: sale.items.map(i => `${i.name} x${i.qty}`).join(', '),
    })
  }

  function deletePlan(id) {
    plans.value = plans.value.filter(p => p.id !== id)
    savePlans()
  }

  function deleteClient(id) {
    clients.value = clients.value.filter(c => c.id !== id)
    saveClients()
  }

  function deleteProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
    saveProducts()
  }

  function deleteEquipmentItem(id) {
    equipment.value = equipment.value.filter(e => e.id !== id)
    saveEquipment()
  }

  return {
    clients, plans, products, equipment, payments, promotions, attendance,
    routines, sales, notifications, accessControlEnabled,
    activePromo, unreadNotifications,
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

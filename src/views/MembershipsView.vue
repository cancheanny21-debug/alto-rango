<template>
  <div>
    <div class="page-header">
      <div><h1>Membresías y Planes</h1><p class="page-subtitle">Administra los planes y membresías del gimnasio</p></div>
      <button class="btn btn-primary" @click="showPlanModal = true">➕ Nuevo Plan</button>
    </div>

    <h3 style="margin-bottom:16px">📋 Planes Disponibles</h3>
    <div class="plans-grid">
      <div v-for="p in plans" :key="p.id" class="plan-card" :style="{ borderColor: p.color + '40' }">
        <div class="plan-badge" :style="{ background: p.color }">{{ p.name }}</div>
        <div class="plan-price"><span class="plan-amount">${{ p.price }}</span><span class="plan-period">/ {{ p.duration }} días</span></div>
        <ul class="plan-features"><li v-for="f in p.features" :key="f">✓ {{ f }}</li></ul>
        <div style="display:flex;gap:8px;margin-top:auto">
          <button class="btn btn-secondary btn-sm" style="flex:1" @click="editPlan(p)">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" @click="deletePlan(p.id)">🗑️</button>
        </div>
      </div>
    </div>

    <h3 style="margin:32px 0 16px">👥 Membresías Activas</h3>
    <div class="table-container">
      <table>
        <thead><tr><th>Cliente</th><th>Plan</th><th>Inicio</th><th>Vence</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="m in memberships" :key="m.id">
            <td><strong>{{ m.client }}</strong></td>
            <td>{{ m.plan }}</td>
            <td>{{ m.start }}</td>
            <td>{{ m.end }}</td>
            <td><span class="badge" :class="m.status === 'Activa' ? 'badge-success' : m.status === 'Vencida' ? 'badge-danger' : 'badge-warning'">{{ m.status }}</span></td>
            <td>
              <button v-if="m.status !== 'Activa'" class="btn btn-success btn-sm">🔄 Renovar</button>
              <button v-else class="btn btn-secondary btn-sm">❄️ Congelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPlanModal" class="modal-overlay" @click.self="showPlanModal = false">
      <div class="modal-content">
        <div class="modal-header"><h2>{{ editingPlan ? 'Editar' : 'Nuevo' }} Plan</h2><button class="btn-icon" @click="showPlanModal = false">✕</button></div>
        <form @submit.prevent="savePlan">
          <div class="form-group"><label>Nombre</label><input v-model="planForm.name" required /></div>
          <div class="form-row">
            <div class="form-group"><label>Precio ($)</label><input v-model.number="planForm.price" type="number" required /></div>
            <div class="form-group"><label>Duración (días)</label><input v-model.number="planForm.duration" type="number" required /></div>
            <div class="form-group"><label>Asistencias</label><input v-model.number="planForm.limit" type="number" placeholder="Ilimitado" /></div>
          </div>
          <div class="form-group"><label>Color</label><input v-model="planForm.color" type="color" style="height:40px;padding:4px" /></div>
          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { seedPlans, seedClients } from '../data/seed'
import { useToastStore } from '../stores/toast'
const toast = useToastStore()

const plans = ref([...seedPlans])
const showPlanModal = ref(false)
const editingPlan = ref(null)
const planForm = ref({ name: '', price: 0, duration: 30, color: '#3b82f6', features: ['Acceso a máquinas'] })

const memberships = ref(seedClients.map((c, i) => ({
  id: i + 1, client: c.name, plan: c.plan,
  start: new Date(new Date(c.planEnd).getTime() - 30 * 86400000).toISOString().split('T')[0],
  end: c.planEnd, status: c.status === 'active' ? 'Activa' : c.status === 'expired' ? 'Vencida' : 'Congelada'
})))

function editPlan(p) { editingPlan.value = p.id; planForm.value = { ...p }; showPlanModal.value = true }
function deletePlan(id) { plans.value = plans.value.filter(p => p.id !== id); toast.success('Plan eliminado') }
function savePlan() {
  if (editingPlan.value) {
    const idx = plans.value.findIndex(p => p.id === editingPlan.value)
    if (idx >= 0) plans.value[idx] = { ...plans.value[idx], ...planForm.value }
    toast.success('Plan actualizado')
  } else {
    plans.value.push({ ...planForm.value, id: Date.now(), features: ['Acceso a máquinas'] })
    toast.success('Plan creado')
  }
  showPlanModal.value = false; editingPlan.value = null
}
</script>

<style scoped>
.plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
.plan-card {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: var(--radius-md); padding: 24px;
  display: flex; flex-direction: column; gap: 16px;
  transition: var(--transition);
}
.plan-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-glow); }
.plan-badge { padding: 4px 14px; border-radius: 50px; font-size: 0.8rem; font-weight: 700; color: white; align-self: flex-start; }
.plan-price { display: flex; align-items: baseline; gap: 4px; }
.plan-amount { font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; }
.plan-period { color: var(--text-muted); font-size: 0.85rem; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: var(--text-secondary); }
.plan-features li { padding-left: 4px; }
</style>

<template>
  <div>
    <div class="page-header">
      <div><h1>Clientes</h1><p class="page-subtitle">Gestiona los clientes del gimnasio</p></div>
      <button class="btn btn-primary" @click="showModal = true">➕ Nuevo Cliente</button>
    </div>

    <div class="filter-bar">
      <div class="search-bar" style="flex:1;max-width:360px">
        <span>🔍</span>
        <input v-model="search" placeholder="Buscar cliente..." />
      </div>
      <button v-for="f in ['Todos','Activos','Vencidos','Congelados']" :key="f" class="filter-chip" :class="{ active: filter === f }" @click="filter = f">{{ f }}</button>
    </div>

    <div class="table-container">
      <table>
        <thead><tr><th>Cliente</th><th>Email</th><th>Plan</th><th>Vence</th><th>Estado</th><th>Visitas</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.5rem">{{ c.photo }}</span><strong>{{ c.name }}</strong></div></td>
            <td>{{ c.email }}</td>
            <td>{{ c.plan }}</td>
            <td>{{ c.planEnd }}</td>
            <td><span class="badge" :class="statusClass(c.status)">{{ statusLabel(c.status) }}</span></td>
            <td>{{ c.visits }}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-secondary btn-sm" @click="viewClient(c)">👁️</button>
                <button class="btn btn-secondary btn-sm" @click="editClient(c)">✏️</button>
                <button class="btn btn-danger btn-sm" @click="deleteClient(c.id)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filtered.length" class="empty-state"><div class="empty-icon">👥</div><p>No se encontraron clientes</p></div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editing ? 'Editar' : 'Nuevo' }} Cliente</h2>
          <button class="btn-icon" @click="showModal = false">✕</button>
        </div>
        <form @submit.prevent="saveClient">
          <div class="form-row">
            <div class="form-group"><label>Nombre</label><input v-model="form.name" required /></div>
            <div class="form-group"><label>Email</label><input v-model="form.email" type="email" required /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Teléfono</label><input v-model="form.phone" /></div>
            <div class="form-group"><label>Plan</label>
              <select v-model="form.plan"><option v-for="p in plans" :key="p">{{ p }}</option></select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Peso (kg)</label><input v-model.number="form.weight" type="number" /></div>
            <div class="form-group"><label>Altura (cm)</label><input v-model.number="form.height" type="number" /></div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px">{{ editing ? 'Guardar Cambios' : 'Registrar Cliente' }}</button>
        </form>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div v-if="showDetail" class="modal-overlay" @click.self="showDetail = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalle del Cliente</h2>
          <button class="btn-icon" @click="showDetail = false">✕</button>
        </div>
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:4rem">{{ detailClient.photo }}</div>
          <h3>{{ detailClient.name }}</h3>
          <span class="badge" :class="statusClass(detailClient.status)">{{ statusLabel(detailClient.status) }}</span>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><span class="detail-label">Email</span><span>{{ detailClient.email }}</span></div>
          <div class="detail-item"><span class="detail-label">Teléfono</span><span>{{ detailClient.phone }}</span></div>
          <div class="detail-item"><span class="detail-label">Plan</span><span>{{ detailClient.plan }}</span></div>
          <div class="detail-item"><span class="detail-label">Vence</span><span>{{ detailClient.planEnd }}</span></div>
          <div class="detail-item"><span class="detail-label">Peso</span><span>{{ detailClient.weight }} kg</span></div>
          <div class="detail-item"><span class="detail-label">Altura</span><span>{{ detailClient.height }} cm</span></div>
          <div class="detail-item"><span class="detail-label">IMC</span><span>{{ detailClient.bmi }}</span></div>
          <div class="detail-item"><span class="detail-label">Visitas</span><span>{{ detailClient.visits }}</span></div>
          <div class="detail-item"><span class="detail-label">Miembro desde</span><span>{{ detailClient.joinDate }}</span></div>
        </div>
        <div style="text-align:center;margin-top:20px;padding:20px;background:var(--bg-card);border-radius:var(--radius-sm);font-family:monospace;font-size:1.2rem;letter-spacing:4px">
          QR: {{ detailClient.name.replace(/\s/g,'').toUpperCase().slice(0,6) }}-{{ detailClient.id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { seedClients, seedPlans } from '../data/seed'
import { useToastStore } from '../stores/toast'
const toast = useToastStore()

const clients = ref([...seedClients])
const search = ref('')
const filter = ref('Todos')
const showModal = ref(false)
const showDetail = ref(false)
const editing = ref(null)
const detailClient = ref({})
const plans = seedPlans.map(p => p.name)

const emptyForm = { name: '', email: '', phone: '', plan: plans[0], weight: 70, height: 170 }
const form = ref({ ...emptyForm })

const filtered = computed(() => {
  let list = clients.value
  if (filter.value === 'Activos') list = list.filter(c => c.status === 'active')
  else if (filter.value === 'Vencidos') list = list.filter(c => c.status === 'expired')
  else if (filter.value === 'Congelados') list = list.filter(c => c.status === 'frozen')
  if (search.value) { const s = search.value.toLowerCase(); list = list.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s)) }
  return list
})

function statusClass(s) { return s === 'active' ? 'badge-success' : s === 'expired' ? 'badge-danger' : 'badge-warning' }
function statusLabel(s) { return s === 'active' ? 'Activo' : s === 'expired' ? 'Vencido' : 'Congelado' }

function viewClient(c) { detailClient.value = c; showDetail.value = true }
function editClient(c) { editing.value = c.id; form.value = { ...c }; showModal.value = true }
function deleteClient(id) { clients.value = clients.value.filter(c => c.id !== id); toast.success('Cliente eliminado') }

function saveClient() {
  if (editing.value) {
    const idx = clients.value.findIndex(c => c.id === editing.value)
    if (idx >= 0) clients.value[idx] = { ...clients.value[idx], ...form.value }
    toast.success('Cliente actualizado')
  } else {
    const newC = { ...form.value, id: Date.now(), status: 'active', photo: '👤', planEnd: '2026-07-01', bmi: (form.value.weight / ((form.value.height / 100) ** 2)).toFixed(1), joinDate: new Date().toISOString().split('T')[0], visits: 0 }
    clients.value.unshift(newC)
    toast.success('Cliente registrado')
  }
  showModal.value = false; editing.value = null; form.value = { ...emptyForm }
}
</script>

<style scoped>
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.detail-item { display: flex; flex-direction: column; padding: 8px 12px; background: var(--bg-card); border-radius: var(--radius-sm); }
.detail-label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 2px; }
</style>

<template>
  <div>
    <div class="page-header">
      <div><h1>🏋️ Entrenadores</h1><p class="page-subtitle">Gestión del equipo de entrenadores</p></div>
      <button class="btn btn-primary" @click="showModal = true">➕ Nuevo Entrenador</button>
    </div>
    <div class="product-grid">
      <div v-for="t in trainers" :key="t.id" class="card trainer-card">
        <div style="text-align:center">
          <div style="font-size:3rem;margin-bottom:8px">{{ t.emoji }}</div>
          <h3>{{ t.name }}</h3>
          <span class="badge badge-info">{{ t.specialty }}</span>
        </div>
        <div class="trainer-stats">
          <div><span class="detail-label">Clientes</span><strong>{{ t.clients }}</strong></div>
          <div><span class="detail-label">Rating</span><strong>⭐ {{ t.rating }}</strong></div>
        </div>
        <div style="font-size:0.85rem;color:var(--text-secondary)">
          <p>📞 {{ t.phone }}</p><p>📧 {{ t.email }}</p><p>🕐 {{ t.schedule }}</p>
        </div>
        <div style="display:flex;gap:8px;margin-top:auto">
          <button class="btn btn-secondary btn-sm" style="flex:1" @click="editTrainer(t)">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" @click="removeTrainer(t.id)">🗑️</button>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header"><h2>{{ editing ? 'Editar' : 'Nuevo' }} Entrenador</h2><button class="btn-icon" @click="showModal = false">✕</button></div>
        <form @submit.prevent="save">
          <div class="form-row"><div class="form-group"><label>Nombre</label><input v-model="form.name" required /></div><div class="form-group"><label>Especialidad</label><input v-model="form.specialty" required /></div></div>
          <div class="form-row"><div class="form-group"><label>Teléfono</label><input v-model="form.phone" /></div><div class="form-group"><label>Email</label><input v-model="form.email" type="email" /></div></div>
          <div class="form-group"><label>Horario</label><input v-model="form.schedule" /></div>
          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { seedTrainers } from '../data/seed'
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
const trainers = ref([...seedTrainers])
const showModal = ref(false)
const editing = ref(null)
const form = ref({ name: '', specialty: '', phone: '', email: '', schedule: '' })
function editTrainer(t) { editing.value = t.id; form.value = { ...t }; showModal.value = true }
function removeTrainer(id) { trainers.value = trainers.value.filter(t => t.id !== id); toast.success('Entrenador eliminado') }
function save() {
  if (editing.value) { const i = trainers.value.findIndex(t => t.id === editing.value); if (i >= 0) trainers.value[i] = { ...trainers.value[i], ...form.value }; toast.success('Entrenador actualizado') }
  else { trainers.value.push({ ...form.value, id: Date.now(), emoji: '🏋️‍♂️', clients: 0, rating: 5.0 }); toast.success('Entrenador agregado') }
  showModal.value = false; editing.value = null; form.value = { name: '', specialty: '', phone: '', email: '', schedule: '' }
}
</script>

<style scoped>
.trainer-card { display: flex; flex-direction: column; gap: 14px; }
.trainer-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: center; }
.trainer-stats > div { background: var(--bg-input); padding: 8px; border-radius: var(--radius-sm); }
.detail-label { font-size: 0.75rem; color: var(--text-muted); display: block; }
</style>

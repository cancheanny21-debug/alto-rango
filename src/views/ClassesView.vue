<template>
  <div>
    <div class="page-header">
      <div><h1>📅 Clases y Horarios</h1><p class="page-subtitle">Programa de clases semanales</p></div>
      <button class="btn btn-primary" @click="showModal = true">➕ Nueva Clase</button>
    </div>
    <div class="filter-bar">
      <button v-for="d in days" :key="d" class="filter-chip" :class="{ active: selectedDay === d }" @click="selectedDay = d">{{ d }}</button>
    </div>
    <div class="classes-grid">
      <div v-for="c in filtered" :key="c.id" class="card class-card" :style="{ borderLeftColor: c.color }">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <span style="font-size:1.5rem">{{ c.emoji }}</span>
            <h3 style="margin-top:4px">{{ c.name }}</h3>
            <span style="font-size:0.8rem;color:var(--text-muted)">{{ c.trainer }}</span>
          </div>
          <span class="badge" :class="c.enrolled >= c.capacity ? 'badge-danger' : c.enrolled >= c.capacity * 0.8 ? 'badge-warning' : 'badge-success'">
            {{ c.enrolled }}/{{ c.capacity }}
          </span>
        </div>
        <div class="class-meta">
          <span>🕐 {{ c.time }} · {{ c.duration }} min</span>
          <span>📅 {{ c.day }}</span>
        </div>
        <div style="background:var(--bg-input);border-radius:var(--radius-sm);height:6px;overflow:hidden">
          <div :style="{ width: (c.enrolled/c.capacity*100)+'%', height:'100%', background: c.color, borderRadius: 'var(--radius-sm)', transition: 'width 0.5s ease' }"></div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" style="flex:1" :disabled="c.enrolled >= c.capacity" @click="reserve(c)">{{ c.enrolled >= c.capacity ? 'Lleno' : '📝 Reservar' }}</button>
          <button class="btn btn-danger btn-sm" @click="removeClass(c.id)">🗑️</button>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header"><h2>Nueva Clase</h2><button class="btn-icon" @click="showModal = false">✕</button></div>
        <form @submit.prevent="addClass">
          <div class="form-row"><div class="form-group"><label>Nombre</label><input v-model="form.name" required /></div><div class="form-group"><label>Entrenador</label><input v-model="form.trainer" required /></div></div>
          <div class="form-row"><div class="form-group"><label>Día</label><select v-model="form.day"><option v-for="d in days.slice(1)" :key="d">{{ d }}</option></select></div><div class="form-group"><label>Hora</label><input v-model="form.time" type="time" required /></div></div>
          <div class="form-row"><div class="form-group"><label>Duración (min)</label><input v-model.number="form.duration" type="number" /></div><div class="form-group"><label>Capacidad</label><input v-model.number="form.capacity" type="number" /></div></div>
          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px">Crear Clase</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { seedClasses } from '../data/seed'
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
const classes = ref([...seedClasses])
const days = ['Todos','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const selectedDay = ref('Todos')
const showModal = ref(false)
const form = ref({ name: '', trainer: '', day: 'Lunes', time: '07:00', duration: 60, capacity: 15 })
const filtered = computed(() => selectedDay.value === 'Todos' ? classes.value : classes.value.filter(c => c.day === selectedDay.value))
function reserve(c) { c.enrolled++; toast.success(`Reserva confirmada: ${c.name}`) }
function removeClass(id) { classes.value = classes.value.filter(c => c.id !== id); toast.success('Clase eliminada') }
function addClass() {
  classes.value.push({ ...form.value, id: Date.now(), enrolled: 0, emoji: '🏃', color: '#3b82f6' })
  showModal.value = false; toast.success('Clase creada')
}
</script>

<style scoped>
.classes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.class-card { display: flex; flex-direction: column; gap: 12px; border-left: 4px solid; }
.class-meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); }
</style>

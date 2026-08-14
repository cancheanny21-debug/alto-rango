<template>
  <div class="routines-view">
    <div class="page-header">
      <div>
        <h1>🏋️ Rutinas de Entrenamiento</h1>
        <p class="page-subtitle">Gestiona y consulta las rutinas disponibles</p>
      </div>
      <button class="btn btn-primary" @click="showModal = true" v-if="auth.user?.role === 'Administrador'">
        + Nueva Rutina
      </button>
    </div>

    <div class="routines-grid">
      <div v-for="routine in routines" :key="routine.id" class="card">
        <h3>{{ routine.name }}</h3>
        <span class="badge badge-primary">{{ routine.level }}</span>
        <p style="margin-top: 12px; color: var(--text-muted)">{{ routine.description }}</p>
        <div style="margin-top: 16px; font-size: 0.9rem">
          <strong>Ejercicios:</strong>
          <ul style="padding-left: 20px; margin-top: 8px;">
            <li v-for="(ex, i) in routine.exercises" :key="i">{{ ex }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="!routines.length" class="empty-state">
      <div class="empty-icon">🏋️</div>
      <p>No hay rutinas registradas aún.</p>
    </div>

    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header">
          <h3>Crear Nueva Rutina</h3>
          <button class="close-btn" @click="showModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nombre de la Rutina</label>
            <input v-model="newRoutine.name" class="form-control" placeholder="Ej: Full Body Principiantes">
          </div>
          <div class="form-group">
            <label>Nivel</label>
            <select v-model="newRoutine.level" class="form-control">
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea v-model="newRoutine.description" class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Ejercicios (uno por línea)</label>
            <textarea v-model="newRoutine.exercisesText" class="form-control" rows="4" placeholder="Sentadillas 4x12..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="saveRoutine">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const routines = ref([
  {
    id: 1,
    name: 'Rutina de Fuerza Básica',
    level: 'Principiante',
    description: 'Ideal para quienes inician en el gimnasio. Enfoque en ejercicios compuestos.',
    exercises: ['Sentadilla 4x10', 'Press de Banca 4x10', 'Remo con barra 4x10', 'Planchas 3x30s']
  },
  {
    id: 2,
    name: 'Hipertrofia Tren Superior',
    level: 'Intermedio',
    description: 'Enfoque en pecho, espalda y brazos.',
    exercises: ['Press Inclinado Mancuernas 4x12', 'Dominadas 4x al fallo', 'Curl Biceps 3x15', 'Extensión Triceps 3x15']
  }
])

const showModal = ref(false)
const newRoutine = ref({
  name: '',
  level: 'Principiante',
  description: '',
  exercisesText: ''
})

const saveRoutine = () => {
  if(!newRoutine.value.name) return
  routines.value.push({
    id: Date.now(),
    name: newRoutine.value.name,
    level: newRoutine.value.level,
    description: newRoutine.value.description,
    exercises: newRoutine.value.exercisesText.split('\n').filter(e => e.trim())
  })
  showModal.value = false
  newRoutine.value = { name: '', level: 'Principiante', description: '', exercisesText: '' }
}
</script>

<style scoped>
.routines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>

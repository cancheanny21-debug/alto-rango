<template>
  <div>
    <div class="page-header">
      <div>
        <h1>📋 Control de Asistencia</h1>
        <p class="page-subtitle">Registro de entradas y salidas</p>
        <div style="margin-top: 8px; padding: 8px 16px; border-radius: 8px; font-weight: bold; display: inline-block" 
             :style="{ background: doorStatus === 'Abierta' ? '#dcfce7' : '#fee2e2', color: doorStatus === 'Abierta' ? '#166534' : '#991b1b' }">
          🚪 Puerta: {{ doorStatus }}
        </div>
      </div>
      <button class="btn btn-primary" @click="showCheckin = true">📱 Registrar Asistencia</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:rgba(59,130,246,0.15)">📊</div><div class="stat-value">{{ todayCount }}</div><div class="stat-label">Asistencias Hoy</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(6,182,212,0.15)">🕐</div><div class="stat-value">07:00</div><div class="stat-label">Hora Pico</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.15)">📈</div><div class="stat-value">85%</div><div class="stat-label">Tasa de Asistencia</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Cliente</th><th>Fecha</th><th>Entrada</th><th>Salida</th><th>Duración</th></tr></thead>
        <tbody>
          <tr v-for="r in records" :key="r.id">
            <td><strong>{{ r.client }}</strong></td><td>{{ r.date }}</td><td>{{ r.checkin }}</td><td>{{ r.checkout || '—' }}</td><td>{{ r.duration || 'En gimnasio' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showCheckin" class="modal-overlay" @click.self="showCheckin = false">
      <div class="modal-content" style="text-align:center">
        <div class="modal-header"><h2>📱 Registrar Asistencia</h2><button class="btn-icon" @click="showCheckin = false">✕</button></div>
        <div style="font-size:5rem;margin:20px 0;animation:pulse 1.5s ease infinite">📷</div>
        <p style="color:var(--text-muted);margin-bottom:16px">Escanea el código QR del cliente o selecciona manualmente</p>
        <select v-model="selectedClient" style="margin-bottom:16px">
          <option value="">Seleccionar cliente...</option>
          <option v-for="c in clients" :key="c.id" :value="c.name">{{ c.name }}</option>
        </select>
        <button class="btn btn-primary btn-lg" style="width:100%" @click="registerAttendance" :disabled="!selectedClient">✅ Registrar Entrada</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { seedClients } from '../data/seed'
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
const clients = seedClients.filter(c => c.status === 'active')
const showCheckin = ref(false)
const selectedClient = ref('')
const records = ref([
  { id: 1, client: 'Carlos Mendoza', date: '2026-05-29', checkin: '06:45', checkout: '08:15', duration: '1h 30min' },
  { id: 2, client: 'María López', date: '2026-05-29', checkin: '07:00', checkout: '08:30', duration: '1h 30min' },
  { id: 3, client: 'Diego Herrera', date: '2026-05-29', checkin: '07:15', checkout: null, duration: null },
  { id: 4, client: 'Isabella Vargas', date: '2026-05-29', checkin: '08:00', checkout: null, duration: null },
  { id: 5, client: 'Andrés Torres', date: '2026-05-28', checkin: '17:00', checkout: '18:45', duration: '1h 45min' },
  { id: 6, client: 'Valentina Cruz', date: '2026-05-28', checkin: '06:30', checkout: '07:45', duration: '1h 15min' },
])
const todayCount = computed(() => records.value.filter(r => r.date === '2026-05-29').length)
const doorStatus = ref('Cerrada')

function registerAttendance() {
  const clientObj = clients.find(c => c.name === selectedClient.value)
  if (clientObj) {
    if (clientObj.plan === 'Pospago por Tarjeta' && clientObj.visits > 0) {
      clientObj.visits--
    }
    doorStatus.value = 'Abierta'
    setTimeout(() => { doorStatus.value = 'Cerrada' }, 3000)
  }
  
  records.value.unshift({ id: Date.now(), client: selectedClient.value, date: '2026-05-29', checkin: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }), checkout: null, duration: null })
  toast.success(`Asistencia registrada: ${selectedClient.value}`)
  showCheckin.value = false; selectedClient.value = ''
}
</script>

<template>
  <div>
    <div class="page-header">
      <div><h1>🕐 Mis Asistencias</h1><p class="page-subtitle">Historial de tus visitas al gimnasio</p></div>
    </div>
    <div class="filter-bar" style="margin-bottom:20px">
      <button v-for="f in filters" :key="f.key" class="filter-chip" :class="{ active: activeFilter === f.key }" @click="activeFilter = f.key">{{ f.label }}</button>
    </div>
    <div class="stats-grid" style="margin-bottom:20px">
      <div class="stat-card"><div class="stat-icon" style="background:rgba(59,130,246,0.15)">🕐</div><div class="stat-value">{{ monthCount }}</div><div class="stat-label">Este mes</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.15)">✅</div><div class="stat-value">{{ totalCount }}</div><div class="stat-label">Total</div></div>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Fecha</th><th>Entrada</th><th>Salida</th><th>Estado</th></tr></thead>
        <tbody>
          <tr v-for="a in filtered" :key="a.id">
            <td>{{ (a.date || ``).split(`T`)[0] }}</td>
            <td>{{ a.checkin || `—` }}</td>
            <td>{{ a.checkout || `—` }}</td>
            <td><span class="badge" :class="a.status === `verified` ? `badge-success` : a.status === `cancelled` ? `badge-danger` : `badge-warning`">{{ statusLabel(a.status) }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filtered.length" class="empty-state"><div class="empty-icon">🕐</div><p>Sin asistencias en este período</p></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useGymStore } from "../stores/gym"
import { useAuthStore } from "../stores/auth"

const gym = useGymStore()
const auth = useAuthStore()
const activeFilter = ref("mes")
const today = new Date().toISOString().split("T")[0]
const month = today.slice(0, 7)
const weekStart = (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split("T")[0] })()

const filters = [
  { key: "mes", label: "Este mes" },
  { key: "semana", label: "Esta semana" },
  { key: "todo", label: "Todo" },
]

const myClient = computed(() => gym.clients.find(c => c.email === auth.user?.email) || null)

const myAttendances = computed(() => {
  if (!myClient.value) return []
  return gym.attendance.filter(a => a.client_id === myClient.value.id && a.status !== "cancelled")
})

const filtered = computed(() => {
  if (activeFilter.value === "mes") return myAttendances.value.filter(a => (a.date || "").startsWith(month))
  if (activeFilter.value === "semana") return myAttendances.value.filter(a => (a.date || "").split("T")[0] >= weekStart)
  return myAttendances.value
})

const monthCount = computed(() => myAttendances.value.filter(a => (a.date || "").startsWith(month)).length)
const totalCount = computed(() => myAttendances.value.length)

function statusLabel(s) {
  return { verified: "Completa", cancelled: "Anulada", pending: "Registrada" }[s] || s
}
</script>

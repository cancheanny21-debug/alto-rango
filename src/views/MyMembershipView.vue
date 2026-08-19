<template>
  <div>
    <div class="page-header">
      <div><h1>💳 Mi Membresía</h1><p class="page-subtitle">Estado actual de tu membresía</p></div>
    </div>
    <div v-if="myClient" class="membership-page">
      <div class="card membership-main-card">
        <div class="membership-hero">
          <div>
            <div class="membership-plan-name">{{ myClient.plan }}</div>
            <span class="badge badge-lg" :class="statusClass">{{ statusLabel }}</span>
          </div>
          <div class="days-box" :class="daysClass">
            <span class="days-big">{{ daysRemaining }}</span>
            <span class="days-sub">días restantes</span>
          </div>
        </div>
        <div class="progress-bar" style="margin:20px 0 6px">
          <div class="progress-fill" :class="progressClass" :style="{ width: progressPct + `%` }"></div>
        </div>
        <div class="progress-labels">
          <span>Inicio: {{ myClient.join_date?.split(`T`)[0] || `—` }}</span>
          <span>Vence: {{ myClient.plan_end?.split(`T`)[0] || `—` }}</span>
        </div>
        <div class="info-grid" style="margin-top:20px">
          <div class="info-tile"><span class="tile-label">Tipo de plan</span><span class="tile-val">{{ myClient.plan }}</span></div>
          <div class="info-tile"><span class="tile-label">Estado</span><span class="tile-val">{{ statusLabel }}</span></div>
          <div class="info-tile"><span class="tile-label">Total asistencias</span><span class="tile-val">{{ myClient.visits || 0 }}</span></div>
          <div class="info-tile" v-if="myClient.plan?.includes(`Pospago`)"><span class="tile-label">Asistencias restantes</span><span class="tile-val">{{ myClient.visits_remaining ?? 30 }}</span></div>
        </div>
        <div v-if="daysRemaining <= 5 && daysRemaining > 0" class="mem-alert mem-alert-warning" style="margin-top:16px">🟡 Tu membresía vence en {{ daysRemaining }} días. Contacta al administrador para renovarla.</div>
        <div v-if="daysRemaining <= 0 || myClient.status === `expired`" class="mem-alert mem-alert-danger" style="margin-top:16px">🔴 Tu membresía ha vencido. Contacta al administrador para renovarla.</div>
      </div>
      <div class="card access-card">
        <h3 style="margin-bottom:16px">🚪 Estado de Acceso</h3>
        <div v-if="myClient.status === `active`" class="access-status access-ok">
          <span style="font-size:2rem">🟢</span>
          <div><strong>Acceso habilitado</strong><p>Puedes ingresar al gimnasio</p></div>
        </div>
        <div v-else class="access-status access-no">
          <span style="font-size:2rem">🔴</span>
          <div><strong>Acceso deshabilitado</strong><p>Tu membresía no está activa</p></div>
        </div>
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color)">
          <div class="info-tile" style="margin-bottom:8px"><span class="tile-label">Último registro</span><span class="tile-val">{{ lastAttendance?.date?.split(`T`)[0] || `Sin registros` }}</span></div>
          <div class="info-tile"><span class="tile-label">Hora de entrada</span><span class="tile-val">{{ lastAttendance?.checkin || `—` }}</span></div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state"><div class="empty-icon">💳</div><p>No se encontró membresía vinculada a tu cuenta.</p></div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useGymStore } from "../stores/gym"
import { useAuthStore } from "../stores/auth"

const gym = useGymStore()
const auth = useAuthStore()
const today = new Date().toISOString().split("T")[0]

const myClient = computed(() => gym.clients.find(c => c.email === auth.user?.email) || null)

const lastAttendance = computed(() => {
  if (!myClient.value) return null
  return gym.attendance.filter(a => a.client_id === myClient.value.id && a.status !== "cancelled")[0] || null
})

const statusClass = computed(() => {
  const s = myClient.value?.status
  return s === "active" ? "badge-success" : s === "frozen" ? "badge-warning" : "badge-danger"
})

const statusLabel = computed(() => {
  const s = myClient.value?.status
  return { active: "Activa", expired: "Vencida", frozen: "Congelada", completed: "Cumplida" }[s] || "—"
})

const daysRemaining = computed(() => {
  if (!myClient.value?.plan_end) return 0
  const end = new Date(myClient.value.plan_end.split("T")[0])
  return Math.max(0, Math.ceil((end - new Date(today)) / 86400000))
})

const daysClass = computed(() => daysRemaining.value <= 0 ? "days-expired" : daysRemaining.value <= 5 ? "days-warn" : "days-ok")

const progressPct = computed(() => {
  if (!myClient.value?.plan_end || !myClient.value?.join_date) return 0
  const s = new Date(myClient.value.join_date.split("T")[0])
  const e = new Date(myClient.value.plan_end.split("T")[0])
  return Math.min(100, Math.max(0, Math.round(((new Date(today) - s) / (e - s)) * 100)))
})

const progressClass = computed(() => progressPct.value >= 90 ? "progress-danger" : progressPct.value >= 70 ? "progress-warning" : "progress-ok")
</script>

<style scoped>
.membership-page { display:grid; grid-template-columns:2fr 1fr; gap:20px; }
.membership-plan-name { font-size:1.8rem; font-weight:800; margin-bottom:8px; }
.membership-hero { display:flex; justify-content:space-between; align-items:flex-start; }
.days-box { text-align:center; padding:12px 20px; border-radius:var(--radius-sm); background:var(--bg-hover); }
.days-big { display:block; font-size:2.5rem; font-weight:900; line-height:1; }
.days-sub { font-size:0.72rem; color:var(--text-muted); }
.days-ok .days-big { color:#10b981; }
.days-warn .days-big { color:#f59e0b; }
.days-expired .days-big { color:#ef4444; }
.progress-bar { background:var(--bg-hover); border-radius:50px; height:10px; overflow:hidden; }
.progress-fill { height:100%; border-radius:50px; transition:width 0.5s; }
.progress-ok { background:linear-gradient(90deg,#3b82f6,#06b6d4); }
.progress-warning { background:linear-gradient(90deg,#f59e0b,#ef4444); }
.progress-danger { background:#ef4444; }
.progress-labels { display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); }
.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.info-tile { display:flex; flex-direction:column; padding:10px 14px; background:var(--bg-hover); border-radius:var(--radius-sm); }
.tile-label { font-size:0.72rem; color:var(--text-muted); margin-bottom:2px; }
.tile-val { font-weight:600; }
.mem-alert { padding:12px 16px; border-radius:var(--radius-sm); font-size:0.85rem; }
.mem-alert-warning { background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); color:#f59e0b; }
.mem-alert-danger { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); color:#ef4444; }
.access-status { display:flex; align-items:center; gap:16px; padding:16px; border-radius:var(--radius-sm); }
.access-ok { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); }
.access-no { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); }
@media (max-width:768px) { .membership-page { grid-template-columns:1fr; } .info-grid { grid-template-columns:1fr; } }
</style>

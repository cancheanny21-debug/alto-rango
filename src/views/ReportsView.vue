<template>
  <div>
    <div class="page-header">
      <div><h1>📈 Reportes y Analítica</h1><p class="page-subtitle">Estadísticas del gimnasio</p></div>
    </div>
    <div class="tabs">
      <button v-for="t in tabs" :key="t" class="tab" :class="{ active: activeTab === t }" @click="activeTab = t">{{ t }}</button>
    </div>

    <div v-if="activeTab === 'Ingresos'" class="card"><h3 style="margin-bottom:16px">💰 Ingresos Mensuales (2026)</h3><div class="chart-container"><canvas ref="revenueRef"></canvas></div></div>
    <div v-if="activeTab === 'Clientes'">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">185</div><div class="stat-label">Total Registrados</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--success)">160</div><div class="stat-label">Activos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--danger)">18</div><div class="stat-label">Vencidos</div></div>
        <div class="stat-card"><div class="stat-value" style="color:var(--warning)">7</div><div class="stat-label">Congelados</div></div>
      </div>
      <div class="card"><h3 style="margin-bottom:16px">📊 Crecimiento de Miembros</h3><div class="chart-container"><canvas ref="membersRef"></canvas></div></div>
    </div>
    <div v-if="activeTab === 'Ventas Tienda'">
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">$1,240</div><div class="stat-label">Ventas del Mes</div></div>
        <div class="stat-card"><div class="stat-value">89</div><div class="stat-label">Productos Vendidos</div></div>
        <div class="stat-card"><div class="stat-value">$13.93</div><div class="stat-label">Ticket Promedio</div></div>
      </div>
      <div class="card"><h3 style="margin-bottom:16px">🏆 Productos Más Vendidos</h3>
        <div v-for="p in topProducts" :key="p.name" style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-color)">
          <span style="font-size:1.3rem">{{ p.emoji }}</span>
          <div style="flex:1"><strong>{{ p.name }}</strong><div style="background:var(--bg-input);border-radius:4px;height:6px;margin-top:4px"><div :style="{ width: (p.sold/300*100)+'%', height:'100%', background:'var(--gradient-primary)', borderRadius:'4px' }"></div></div></div>
          <span style="font-weight:600;color:var(--cyan-light)">{{ p.sold }} uds</span>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'Asistencia'" class="card"><h3 style="margin-bottom:16px">📋 Asistencia Semanal</h3><div class="chart-container"><canvas ref="attendRef"></canvas></div></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { monthlyRevenue, monthlyMembers, weeklyAttendance, seedProducts } from '../data/seed'
Chart.register(...registerables)

const tabs = ['Ingresos', 'Clientes', 'Ventas Tienda', 'Asistencia']
const activeTab = ref('Ingresos')
const revenueRef = ref(null); const membersRef = ref(null); const attendRef = ref(null)
const topProducts = [...seedProducts].sort((a, b) => b.sold - a.sold).slice(0, 8)
const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(59,130,246,0.06)' }, ticks: { color: '#64748b' } }, y: { grid: { color: 'rgba(59,130,246,0.06)' }, ticks: { color: '#64748b' } } } }
let charts = {}

function renderChart() {
  Object.values(charts).forEach(c => c.destroy()); charts = {}
  nextTick(() => {
    if (activeTab.value === 'Ingresos' && revenueRef.value)
      charts.rev = new Chart(revenueRef.value, { type: 'line', data: { labels: months, datasets: [{ data: monthlyRevenue, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, borderWidth: 2 }] }, options: opts })
    if (activeTab.value === 'Clientes' && membersRef.value)
      charts.mem = new Chart(membersRef.value, { type: 'bar', data: { labels: months, datasets: [{ data: monthlyMembers, backgroundColor: '#06b6d4', borderRadius: 8 }] }, options: opts })
    if (activeTab.value === 'Asistencia' && attendRef.value)
      charts.att = new Chart(attendRef.value, { type: 'bar', data: { labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'], datasets: [{ data: weeklyAttendance, backgroundColor: ['#3b82f6','#06b6d4','#8b5cf6','#3b82f6','#06b6d4','#8b5cf6','#64748b'], borderRadius: 8 }] }, options: opts })
  })
}
watch(activeTab, renderChart)
onMounted(renderChart)
</script>

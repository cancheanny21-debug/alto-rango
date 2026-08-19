<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1>🛒 Historial de Ventas</h1>
        <p class="page-subtitle">Registro de ventas de la tienda</p>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Método</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in gym.sales" :key="s.id">
            <td>{{ new Date(s.sale_date || s.created_at).toLocaleString() }}</td>
            <td><strong style="color: var(--success)">${{ s.total.toFixed(2) }}</strong></td>
            <td>
              <span class="badge badge-info">{{ s.method || 'Tienda' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!gym.sales.length" style="padding: 20px; text-align:center; color: var(--text-muted)">
        No hay ventas registradas.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGymStore } from '../stores/gym'
const gym = useGymStore()
</script>

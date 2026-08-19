<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1>💰 Registro de Cobros</h1>
        <p class="page-subtitle">Historial de pagos de membresías y servicios (RF-004)</p>
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
          <tr v-for="p in gym.payments" :key="p.id">
            <td>{{ new Date(p.payment_date || p.created_at).toLocaleString() }}</td>
            <td><strong>${{ p.amount.toFixed(2) }}</strong></td>
            <td>
              <span class="badge badge-info">{{ p.method }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!gym.payments.length" style="padding: 20px; text-align:center; color: var(--text-muted)">
        No hay cobros registrados.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGymStore } from '../stores/gym'
const gym = useGymStore()
</script>

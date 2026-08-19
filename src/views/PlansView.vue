<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h1>📋 Gestión de Planes</h1>
        <p class="page-subtitle">Administra los planes de membresía del gimnasio</p>
      </div>
      <button class="btn btn-primary" @click="showModal = true">➕ Nuevo Plan</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Duración (Días)</th>
            <th>Características</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in gym.plans" :key="p.id">
            <td><strong>{{ p.name }}</strong></td>
            <td>${{ p.price.toFixed(2) }}</td>
            <td>{{ p.duration_days }}</td>
            <td>{{ (p.features || []).join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Nuevo Plan</h2>
          <button class="modal-close-btn" @click="showModal = false">✕</button>
        </div>
        <div style="padding:20px;text-align:center">Formulario en construcción</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGymStore } from '../stores/gym'
const gym = useGymStore()
const showModal = ref(false)
</script>

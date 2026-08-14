<template>
  <div>
    <div class="page-header"><div><h1>⚙️ Configuración</h1><p class="page-subtitle">Ajustes del gimnasio</p></div></div>
    <div class="settings-grid">
      <div class="card">
        <h3 style="margin-bottom:20px">🏢 Datos del Gimnasio</h3>
        <div class="form-group"><label>Nombre del Gimnasio</label><input v-model="gym.name" /></div>
        <div class="form-row">
          <div class="form-group"><label>Teléfono</label><input v-model="gym.phone" /></div>
          <div class="form-group"><label>Ciudad</label><input v-model="gym.city" /></div>
        </div>
        <div class="form-group"><label>Dirección</label><input v-model="gym.address" /></div>
        <button class="btn btn-primary" @click="saveGym">💾 Guardar Cambios</button>
      </div>
      <div class="card">
        <h3 style="margin-bottom:20px">🏦 Datos Bancarios (Transferencia)</h3>
        <div class="form-group"><label>Banco</label><input v-model="bank.name" /></div>
        <div class="form-row">
          <div class="form-group"><label>Tipo de Cuenta</label><select v-model="bank.type"><option>Corriente</option><option>Ahorros</option></select></div>
          <div class="form-group"><label>Número de Cuenta</label><input v-model="bank.number" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Titular</label><input v-model="bank.holder" /></div>
          <div class="form-group"><label>RUC / Cédula</label><input v-model="bank.ruc" /></div>
        </div>
        <button class="btn btn-primary" @click="toast.success('Datos bancarios guardados')">💾 Guardar</button>
      </div>
      <div class="card">
        <h3 style="margin-bottom:20px">👤 Mi Perfil</h3>
        <div class="form-group"><label>Nombre</label><input :value="auth.userName" readonly /></div>
        <div class="form-group"><label>Email</label><input :value="auth.user?.email" readonly /></div>
        <div class="form-group"><label>Rol</label><input :value="auth.userRole" readonly style="text-transform:capitalize" /></div>
      </div>
      <div class="card">
        <h3 style="margin-bottom:20px">🎨 Apariencia</h3>
        <p style="color:var(--text-muted);font-size:0.9rem">El tema actual es <strong>Azul Oscuro Premium</strong>. Personalización de temas disponible próximamente.</p>
        <div style="display:flex;gap:8px;margin-top:16px">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--gradient-primary);border:2px solid white"></div>
          <div style="width:40px;height:40px;border-radius:50%;background:#8b5cf6;opacity:0.4"></div>
          <div style="width:40px;height:40px;border-radius:50%;background:#10b981;opacity:0.4"></div>
          <div style="width:40px;height:40px;border-radius:50%;background:#f59e0b;opacity:0.4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
const auth = useAuthStore()
const toast = useToastStore()
const gym = ref({ name: 'PowerFit Gym', phone: '+593 999 000 111', city: 'Quito', address: 'Av. Principal 123' })
const bank = ref({ name: 'Banco Pichincha', type: 'Corriente', number: '2200123456', holder: 'PowerFit Gym S.A.', ruc: '1791234567001' })
function saveGym() { toast.success('Configuración guardada') }
</script>

<style scoped>
.settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }
</style>

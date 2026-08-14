<template>
  <header class="app-header">
    <div class="header-left">
      <button class="btn-icon header-menu-btn" @click="$emit('toggle-sidebar')">☰</button>
      <div class="header-greeting">
        <h2>{{ greeting }}, {{ auth.userName }} 👋</h2>
        <p class="header-sub">{{ auth.gymName }} · {{ today }}</p>
      </div>
    </div>
    <div class="header-right">
      <button class="header-cart btn-icon" style="background: none; border: none; cursor: pointer; margin-right: 8px;" @click="showToast('Notificaciones recientes')">
        🔔
        <span class="cart-count" style="background: var(--danger)">2</span>
      </button>
      <router-link to="/tienda" class="header-cart btn-icon" id="header-cart-btn">
        🛒
        <span v-if="cart.totalItems" class="cart-count">{{ cart.totalItems }}</span>
      </router-link>
      <div class="avatar">{{ auth.user?.avatar || 'A' }}</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'

const auth = useAuthStore()
const cart = useCartStore()
const toast = useToastStore()

function showToast(msg) {
  toast.info(msg)
}

const greeting = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 18 ? 'Buenas tardes' : 'Buenas noches'
})

const today = computed(() => new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
</script>

<style scoped>
.app-header {
  position: fixed; top: 0; right: 0; left: var(--sidebar-width);
  height: var(--header-height);
  background: rgba(6,11,24,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  z-index: 40;
  transition: left 0.3s ease;
}
.header-left { display: flex; align-items: center; gap: 16px; }
.header-menu-btn { font-size: 1.2rem; display: none; }
.header-greeting h2 { font-size: 1rem; font-weight: 600; }
.header-sub { font-size: 0.8rem; color: var(--text-muted); text-transform: capitalize; }
.header-right { display: flex; align-items: center; gap: 12px; }
.header-cart { position: relative; font-size: 1.2rem; }
.cart-count {
  position: absolute; top: -6px; right: -6px;
  background: var(--gradient-primary); color: white;
  font-size: 0.65rem; font-weight: 700;
  min-width: 18px; height: 18px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}

@media (max-width: 768px) {
  .app-header { left: 0; padding: 0 16px; }
  .header-menu-btn { display: flex; }
}
</style>

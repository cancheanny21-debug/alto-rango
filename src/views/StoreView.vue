<template>
  <div>
    <div class="page-header">
      <div><h1>🛍️ Módulo de Ventas</h1><p class="page-subtitle">Registro de ventas · Alto Rango Suplementos</p></div>
      <router-link to="/carrito" class="btn btn-primary">🛒 Carrito ({{ cart.totalItems }})</router-link>
    </div>

    <div class="filter-bar">
      <div class="search-bar" style="flex:1;max-width:360px"><span>🔍</span><input v-model="search" placeholder="Buscar producto..." /></div>
      <button v-for="c in categories" :key="c" class="filter-chip" :class="{ active: category === c }" @click="category = c">{{ c }}</button>
    </div>

    <div class="product-grid">
      <div v-for="p in filtered" :key="p.id" class="product-card">
        <div class="product-img">
          <span>{{ p.emoji }}</span>
          <span v-if="p.stock < 20" class="product-badge badge badge-warning">¡Últimas uds!</span>
        </div>
        <div class="product-info">
          <div class="product-category">{{ p.category }}</div>
          <div class="product-name">{{ p.name }}</div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">{{ p.desc }}</p>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span class="product-price">${{ p.price.toFixed(2) }}</span>
            <span style="font-size:0.75rem;color:var(--text-muted)">Stock: {{ p.stock }}</span>
          </div>
          <div style="font-size:0.8rem;color:var(--warning)">⭐ {{ p.rating }} · {{ p.sold }} vendidos</div>
        </div>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" style="flex:1" @click="addToCart(p)">🛒 Agregar</button>
        </div>
      </div>
    </div>
    <div v-if="!filtered.length" class="empty-state"><div class="empty-icon">🔍</div><p>No se encontraron productos</p></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGymStore } from '../stores/gym'
import { useCartStore } from '../stores/cart'
import { useToastStore } from '../stores/toast'

const gym = useGymStore()
const cart = useCartStore()
const toast = useToastStore()
const search = ref('')
const category = ref('Todos')
const categories = ['Todos', 'Bebidas', 'Suplementos', 'Snacks']

const filtered = computed(() => {
  let list = gym.products
  if (category.value !== 'Todos') list = list.filter(p => p.category === category.value)
  if (search.value) { const s = search.value.toLowerCase(); list = list.filter(p => p.name.toLowerCase().includes(s)) }
  return list
})

function addToCart(p) { cart.addItem(p); toast.success(`${p.name} agregado al carrito`) }
</script>

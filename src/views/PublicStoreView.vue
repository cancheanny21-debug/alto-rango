<template>
  <div class="public-store">
    <header class="public-header">
      <div class="container header-content">
        <div class="logo">
          <img src="/logo.jpeg" alt="Alto Rango Gym" class="logo-img" />
        </div>
        <div class="social-links">
          <a href="#" target="_blank" title="Facebook">FB</a>
          <a href="#" target="_blank" title="Instagram">IG</a>
          <a href="#" target="_blank" title="TikTok">TK</a>
        </div>
      </div>
    </header>

    <main class="container">
      <div class="page-header">
        <div>
          <h2>Catálogo de Productos</h2>
          <p class="page-subtitle">Suplementos y bebidas para potenciar tu entrenamiento</p>
        </div>
      </div>

      <div class="filter-bar">
        <div class="search-bar" style="flex:1;max-width:360px">
          <span>🔍</span>
          <input v-model="search" placeholder="Buscar producto..." />
        </div>
        <button v-for="c in categories" :key="c" class="filter-chip" :class="{ active: category === c }" @click="category = c">
          {{ c }}
        </button>
      </div>

      <div class="product-grid">
        <div v-for="p in filtered" :key="p.id" class="product-card">
          <div class="product-img">
            <span>{{ p.emoji }}</span>
          </div>
          <div class="product-info">
            <div class="product-category">{{ p.category }}</div>
            <div class="product-name">{{ p.name }}</div>
            <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px">{{ p.desc }}</p>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span class="product-price">${{ p.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="product-actions" style="padding: 16px;">
            <p style="font-size: 0.8rem; color: var(--text-muted); text-align: center; margin: 0;">Disponible en tienda física</p>
          </div>
        </div>
      </div>
      <div v-if="!filtered.length" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No se encontraron productos</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { seedProducts } from '../data/seed'

const search = ref('')
const category = ref('Todos')
const categories = ['Todos', 'Bebidas', 'Suplementos', 'Snacks']
const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}

const filtered = computed(() => {
  let list = seedProducts
  if (category.value !== 'Todos') list = list.filter(p => p.category === category.value)
  if (search.value) { 
    const s = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(s)) 
  }
  return list
})
</script>

<style scoped>
.public-store {
  min-height: 100vh;
  background-color: var(--bg-body, #f8fafc);
  font-family: 'Inter', sans-serif;
}
.public-header {
  background-color: white;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  padding: 16px 0;
  margin-bottom: 32px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-main, #0f172a);
}
.logo h1 span {
  color: var(--primary, #3b82f6);
}
.logo-img {
  height: 48px;
  object-fit: contain;
}
.social-links {
  display: flex;
  gap: 12px;
}
.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--bg-surface, #f1f5f9);
  border-radius: 50%;
  color: var(--text-main, #334155);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s;
}
.social-links a:hover {
  background-color: var(--primary, #3b82f6);
  color: white;
}
</style>

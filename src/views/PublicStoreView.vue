<template>
  <div class="public-store">
    <header class="public-header">
      <div class="store-container header-content">
        <div class="logo">
          <button @click="router.push('/login')" class="back-btn">⬅ Volver</button>
          <img src="/logotienda.jpeg" alt="Alto Rango" class="logo-img" />
          <div>
            <strong>Alto Rango</strong>
            <span>Suplementos</span>
          </div>
        </div>
        <div class="social-links">
          <a v-for="s in socialLinks" :key="s.name" :href="s.url" target="_blank" rel="noopener noreferrer" :title="s.name">{{ s.short }}</a>
        </div>
      </div>
    </header>

    <main class="store-container">
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
            <p class="product-desc">{{ p.desc }}</p>
            <div class="product-price">${{ p.price.toFixed(2) }}</div>
          </div>
          <div class="product-actions">
            <p class="stock-note">Disponible en tienda física</p>
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
import { useRouter } from 'vue-router'
import { socialLinks } from '../data/seed'
import { useGymStore } from '../stores/gym'

const router = useRouter()

const gym = useGymStore()
const search = ref('')
const category = ref('Todos')
const categories = ['Todos', 'Bebidas', 'Suplementos', 'Snacks']

const filtered = computed(() => {
  let list = gym.products
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
  flex: 1;
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary, #060b18);
}
.public-header {
  background: rgba(12, 20, 37, 0.95);
  border-bottom: 1px solid var(--border-color);
  padding: 16px 0;
  margin-bottom: 28px;
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 10;
}
.store-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 40px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}
.back-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.logo strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
}
.logo span {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.logo-img {
  height: 48px;
  width: 48px;
  object-fit: contain;
  border-radius: 8px;
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
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s;
}
.social-links a:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.product-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.stock-note {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
  margin: 0;
  width: 100%;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
}
</style>

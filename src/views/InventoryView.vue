<template>
  <div>
    <div class="page-header">
      <div><h1>📦 Inventario</h1><p class="page-subtitle">Control de stock y productos</p></div>
      <button class="btn btn-primary" @click="showModal = true">➕ Nuevo Producto</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:rgba(59,130,246,0.15)">📦</div><div class="stat-value">{{ products.length }}</div><div class="stat-label">Total Productos</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,0.15)">⚠️</div><div class="stat-value">{{ lowStock }}</div><div class="stat-label">Stock Bajo (&lt;20)</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:rgba(6,182,212,0.15)">💰</div><div class="stat-value">${{ totalValue.toFixed(0) }}</div><div class="stat-label">Valor del Inventario</div></div>
    </div>
    <div class="filter-bar">
      <div class="search-bar" style="flex:1;max-width:360px"><span>🔍</span><input v-model="search" placeholder="Buscar producto..." /></div>
      <button v-for="c in ['Todos','Suplementos','Ropa','Accesorios']" :key="c" class="filter-chip" :class="{ active: cat === c }" @click="cat = c">{{ c }}</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Vendidos</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td><div style="display:flex;align-items:center;gap:8px"><span style="font-size:1.3rem">{{ p.emoji }}</span><strong>{{ p.name }}</strong></div></td>
            <td>{{ p.category }}</td>
            <td class="price">${{ p.price.toFixed(2) }}</td>
            <td>{{ p.stock }}</td>
            <td>{{ p.sold }}</td>
            <td><span class="badge" :class="p.stock < 15 ? 'badge-danger' : p.stock < 25 ? 'badge-warning' : 'badge-success'">{{ p.stock < 15 ? 'Bajo' : p.stock < 25 ? 'Medio' : 'OK' }}</span></td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-secondary btn-sm" @click="edit(p)">✏️</button>
                <button class="btn btn-success btn-sm" @click="addStock(p)">📥+10</button>
                <button class="btn btn-danger btn-sm" @click="remove(p.id)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header"><h2>{{ editing ? 'Editar' : 'Nuevo' }} Producto</h2><button class="btn-icon" @click="showModal = false">✕</button></div>
        <form @submit.prevent="save">
          <div class="form-group"><label>Nombre</label><input v-model="form.name" required /></div>
          <div class="form-row">
            <div class="form-group"><label>Categoría</label><select v-model="form.category"><option>Suplementos</option><option>Ropa</option><option>Accesorios</option></select></div>
            <div class="form-group"><label>Precio ($)</label><input v-model.number="form.price" type="number" step="0.01" required /></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Stock</label><input v-model.number="form.stock" type="number" required /></div>
            <div class="form-group"><label>Emoji</label><input v-model="form.emoji" /></div>
          </div>
          <div class="form-group"><label>Descripción</label><textarea v-model="form.desc" rows="2"></textarea></div>
          <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { seedProducts } from '../data/seed'
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
const products = ref([...seedProducts])
const search = ref(''); const cat = ref('Todos')
const showModal = ref(false); const editing = ref(null)
const form = ref({ name: '', category: 'Suplementos', price: 0, stock: 0, emoji: '📦', desc: '' })
const lowStock = computed(() => products.value.filter(p => p.stock < 20).length)
const totalValue = computed(() => products.value.reduce((s, p) => s + p.price * p.stock, 0))
const filtered = computed(() => {
  let l = products.value
  if (cat.value !== 'Todos') l = l.filter(p => p.category === cat.value)
  if (search.value) { const s = search.value.toLowerCase(); l = l.filter(p => p.name.toLowerCase().includes(s)) }
  return l
})
function edit(p) { editing.value = p.id; form.value = { ...p }; showModal.value = true }
function remove(id) { products.value = products.value.filter(p => p.id !== id); toast.success('Producto eliminado') }
function addStock(p) { p.stock += 10; toast.success(`+10 unidades: ${p.name}`) }
function save() {
  if (editing.value) { const i = products.value.findIndex(p => p.id === editing.value); if (i >= 0) products.value[i] = { ...products.value[i], ...form.value }; toast.success('Producto actualizado') }
  else { products.value.push({ ...form.value, id: Date.now(), sold: 0, rating: 5.0 }); toast.success('Producto agregado') }
  showModal.value = false; editing.value = null
}
</script>

<style scoped>
.price { font-weight: 700; color: var(--cyan-light); }
</style>

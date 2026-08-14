import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { seedProducts } from '../data/seed'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('gym_cart') || '[]'))

  const totalItems = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const tax = computed(() => subtotal.value * 0.12)
  const total = computed(() => subtotal.value + tax.value)

  function save() { localStorage.setItem('gym_cart', JSON.stringify(items.value)) }

  function addItem(product) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) { existing.qty++ } else { items.value.push({ ...product, qty: 1 }) }
    save()
  }
  function removeItem(id) { items.value = items.value.filter(i => i.id !== id); save() }
  function updateQty(id, qty) {
    const item = items.value.find(i => i.id === id)
    if (item) { item.qty = Math.max(1, qty); save() }
  }
  function clear() { items.value = []; save() }

  return { items, totalItems, subtotal, tax, total, addItem, removeItem, updateQty, clear }
})

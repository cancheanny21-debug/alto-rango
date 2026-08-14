<template>
  <div>
    <div class="page-header">
      <div><h1>🛒 Carrito de Compras</h1><p class="page-subtitle">{{ cart.totalItems }} productos en tu carrito</p></div>
      <router-link to="/tienda" class="btn btn-secondary">← Seguir Comprando</router-link>
    </div>

    <div v-if="cart.items.length" class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-item card">
          <span style="font-size:2.5rem">{{ item.emoji }}</span>
          <div class="cart-item-info">
            <strong>{{ item.name }}</strong>
            <span style="font-size:0.8rem;color:var(--text-muted)">{{ item.category }}</span>
          </div>
          <div class="cart-item-qty">
            <button class="btn-icon" @click="cart.updateQty(item.id, item.qty - 1)">−</button>
            <span style="min-width:30px;text-align:center;font-weight:600">{{ item.qty }}</span>
            <button class="btn-icon" @click="cart.updateQty(item.id, item.qty + 1)">+</button>
          </div>
          <div class="cart-item-price">${{ (item.price * item.qty).toFixed(2) }}</div>
          <button class="btn-icon" style="color:var(--danger)" @click="cart.removeItem(item.id)">🗑️</button>
        </div>
      </div>

      <div class="cart-summary card">
        <h3 style="margin-bottom:20px">Resumen del Pedido</h3>
        <div class="summary-row"><span>Subtotal</span><span>${{ cart.subtotal.toFixed(2) }}</span></div>
        <div class="summary-row"><span>IVA (12%)</span><span>${{ cart.tax.toFixed(2) }}</span></div>
        <div class="summary-row total"><span>Total</span><span>${{ cart.total.toFixed(2) }}</span></div>
        <router-link to="/checkout" class="btn btn-primary btn-lg" style="width:100%;margin-top:16px;justify-content:center">Proceder al Pago →</router-link>
        <button class="btn btn-secondary" style="width:100%;margin-top:8px" @click="cart.clear()">Vaciar Carrito</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">🛒</div>
      <p>Tu carrito está vacío</p>
      <router-link to="/tienda" class="btn btn-primary" style="margin-top:16px">Ir a la Tienda</router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'
const cart = useCartStore()
</script>

<style scoped>
.cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
.cart-items { display: flex; flex-direction: column; gap: 12px; }
.cart-item { display: flex; align-items: center; gap: 16px; padding: 16px; }
.cart-item-info { flex: 1; display: flex; flex-direction: column; }
.cart-item-qty { display: flex; align-items: center; gap: 4px; }
.cart-item-price { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--cyan-light); min-width: 80px; text-align: right; }
.summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.9rem; color: var(--text-secondary); }
.summary-row.total { border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: 8px; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); }
@media (max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } }
</style>

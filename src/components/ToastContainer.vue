<template>
  <div class="toast-container">
    <div v-for="t in toast.toasts" :key="t.id" class="toast" :class="'toast-' + t.type">
      <span>{{ t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️' }}</span>
      <span>{{ t.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
</script>

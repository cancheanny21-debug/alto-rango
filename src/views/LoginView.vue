<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo.jpeg" alt="Alto Rango" style="display: block; height: 80px; margin: 0 auto 12px; object-fit: contain; border-radius: 8px;" />
          <h1>Alto Rango</h1>
          <p>Sistema de Gestión Integral</p>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Correo electrónico</label>
            <input id="login-email" v-model="email" type="email" placeholder="admin@gympro.com" required />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input id="login-password" v-model="password" type="password" placeholder="••••••••" required />
          </div>
          <button id="login-submit" type="submit" class="btn btn-primary btn-lg" style="width:100%">
            Iniciar Sesión
          </button>
          <p class="login-hint">Demo: cualquier email y contraseña</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const email = ref('admin@gympro.com')
const password = ref('admin123')
const imageError = ref(false)
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

function handleLogin() {
  if (auth.login(email.value, password.value)) {
    toast.success('¡Bienvenido a GymPro!')
    router.push('/')
  } else {
    toast.error('Credenciales incorrectas')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh; width: 100%; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.login-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(6,182,212,0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 60%);
}
.login-container { position: relative; z-index: 1; width: 100%; max-width: 440px; padding: 20px; }
.login-card {
  background: rgba(12,20,37,0.9);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-lg), 0 0 60px rgba(59,130,246,0.1);
}
.login-header { text-align: center; margin-bottom: 36px; }
.login-logo {
  font-size: 3.5rem; margin-bottom: 12px;
  animation: pulse 2s ease-in-out infinite;
}
.login-header h1 {
  font-family: var(--font-display); font-size: 2.2rem; font-weight: 800;
  background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.login-header p { color: var(--text-muted); font-size: 0.9rem; margin-top: 4px; }
.login-form { display: flex; flex-direction: column; gap: 4px; }
.login-hint { text-align: center; font-size: 0.8rem; color: var(--text-muted); margin-top: 16px; }
</style>

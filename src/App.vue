<template>
  <div class="app-wrapper" :class="{ 'app-wrapper--public': !auth.isAuthenticated || isPublicStore }">
    <template v-if="auth.isAuthenticated && !isPublicStore">
      <AppSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
      <div class="main-area" :class="{ collapsed: sidebarCollapsed }">
        <AppHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </template>
    <template v-else>
      <div class="public-shell">
        <router-view />
      </div>
    </template>
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useGymStore }  from './stores/gym'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import ToastContainer from './components/ToastContainer.vue'

const auth = useAuthStore()
const gym  = useGymStore()
const route = useRoute()
const sidebarCollapsed = ref(false)
const isPublicStore = computed(() => route.path === '/public-store')

// Cargar datos cuando el usuario está autenticado
onMounted(() => { if (auth.isAuthenticated) gym.loadAll() })
watch(() => auth.isAuthenticated, (val) => { if (val) gym.loadAll() })
</script>

<style>
.app-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
}
.app-wrapper--public {
  display: block;
}
.public-shell {
  width: 100%;
  min-height: 100vh;
}

.main-area {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}
.main-area.collapsed { margin-left: 72px; }

.main-content {
  flex: 1;
  padding: 28px;
  margin-top: var(--header-height);
}

@media (max-width: 768px) {
  .main-area { margin-left: 0 !important; }
  .main-content { padding: 16px; }
}
</style>

<template>
  <div class="app-wrapper">
    <template v-if="auth.isAuthenticated">
      <AppSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
      <div class="main-area" :class="{ collapsed: sidebarCollapsed }">
        <AppHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from './stores/auth'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import ToastContainer from './components/ToastContainer.vue'

const auth = useAuthStore()
const sidebarCollapsed = ref(false)
</script>

<style>
.app-wrapper { display: flex; min-height: 100vh; }

.main-area {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

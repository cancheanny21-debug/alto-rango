import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes = [
  { path: '/login', name: 'Login', component: () => import('./views/LoginView.vue'), meta: { public: true } },
  { path: '/', name: 'Dashboard', component: () => import('./views/DashboardView.vue') },
  { path: '/clientes', name: 'Clientes', component: () => import('./views/ClientsView.vue') },
  { path: '/membresias', name: 'Membresias', component: () => import('./views/MembershipsView.vue') },
  { path: '/asistencia', name: 'Asistencia', component: () => import('./views/AttendanceView.vue') },
  { path: '/entrenadores', name: 'Entrenadores', component: () => import('./views/TrainersView.vue') },
  { path: '/clases', name: 'Clases', component: () => import('./views/ClassesView.vue') },
  { path: '/tienda', name: 'Tienda', component: () => import('./views/StoreView.vue') },
  { path: '/carrito', name: 'Carrito', component: () => import('./views/CartView.vue') },
  { path: '/checkout', name: 'Checkout', component: () => import('./views/CheckoutView.vue') },
  { path: '/inventario', name: 'Inventario', component: () => import('./views/InventoryView.vue') },
  { path: '/reportes', name: 'Reportes', component: () => import('./views/ReportsView.vue') },
  { path: '/configuracion', name: 'Configuracion', component: () => import('./views/SettingsView.vue') },
  { path: '/public-store', name: 'PublicStore', component: () => import('./views/PublicStoreView.vue'), meta: { public: true } },
  { path: '/rutinas', name: 'Rutinas', component: () => import('./views/RoutinesView.vue') },
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) next('/login')
  else if (to.path === '/login' && auth.isAuthenticated) next('/')
  else next()
})

export default router

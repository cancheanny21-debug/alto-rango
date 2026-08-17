import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes = [
  { path: '/login', name: 'Login', component: () => import('./views/LoginView.vue'), meta: { public: true } },
  { path: '/', name: 'Dashboard', component: () => import('./views/DashboardView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/clientes', name: 'Clientes', component: () => import('./views/ClientsView.vue'), meta: { roles: ['admin'] } },
  { path: '/membresias', name: 'Membresias', component: () => import('./views/MembershipsView.vue'), meta: { roles: ['admin'] } },
  { path: '/asistencia', name: 'Asistencia', component: () => import('./views/AttendanceView.vue'), meta: { roles: ['admin', 'empleado', 'usuario'] } },
  { path: '/entrenadores', name: 'Entrenadores', component: () => import('./views/TrainersView.vue'), meta: { roles: ['admin'] } },
  { path: '/clases', name: 'Clases', component: () => import('./views/ClassesView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/tienda', name: 'Tienda', component: () => import('./views/StoreView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/carrito', name: 'Carrito', component: () => import('./views/CartView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/checkout', name: 'Checkout', component: () => import('./views/CheckoutView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/inventario', name: 'Inventario', component: () => import('./views/InventoryView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/reportes', name: 'Reportes', component: () => import('./views/ReportsView.vue'), meta: { roles: ['admin'] } },
  { path: '/configuracion', name: 'Configuracion', component: () => import('./views/SettingsView.vue'), meta: { roles: ['admin', 'empleado'] } },
  { path: '/public-store', name: 'PublicStore', component: () => import('./views/PublicStoreView.vue'), meta: { public: true } },
  { path: '/rutinas', name: 'Rutinas', component: () => import('./views/RoutinesView.vue'), meta: { roles: ['admin', 'empleado', 'usuario'] } },
  { path: '/perfil', name: 'Perfil', component: () => import('./views/ProfileView.vue'), meta: { roles: ['admin', 'empleado', 'usuario'] } },
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    next('/login')
    return
  }
  if (to.path === '/login' && auth.isAuthenticated) {
    next(auth.isUsuario ? '/asistencia' : '/')
    return
  }
  if (to.meta.roles && auth.isAuthenticated && !to.meta.roles.includes(auth.userRole)) {
    next(auth.isUsuario ? '/asistencia' : '/')
    return
  }
  next()
})

export default router

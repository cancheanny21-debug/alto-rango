import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('gym_user') || 'null'))
  const gym = ref(JSON.parse(localStorage.getItem('gym_info') || 'null'))

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userRole = computed(() => user.value?.role || '')
  const gymName = computed(() => gym.value?.name || 'GymPro')
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')
  const isAdmin = computed(() => user.value?.role === 'admin' || isSuperAdmin.value)

  // Usuarios del sistema (demo)
  const systemUsers = ref(JSON.parse(localStorage.getItem('gym_system_users') || JSON.stringify([
    { id: 1, name: 'Carlos Ruiz', email: 'superadmin@gympro.com', role: 'superadmin', status: 'active', avatar: 'CR', lastLogin: '2026-05-29 07:30', createdAt: '2024-01-15' },
    { id: 2, name: 'Ana Martínez', email: 'admin@powerfitgym.com', role: 'admin', status: 'active', avatar: 'AM', lastLogin: '2026-05-29 06:45', gym: 'PowerFit Gym', createdAt: '2024-03-20' },
    { id: 3, name: 'Luis Paredes', email: 'recepcion@powerfitgym.com', role: 'receptionist', status: 'active', avatar: 'LP', lastLogin: '2026-05-28 18:00', gym: 'PowerFit Gym', createdAt: '2025-01-10' },
    { id: 4, name: 'Roberto Silva', email: 'roberto@powerfitgym.com', role: 'trainer', status: 'active', avatar: 'RS', lastLogin: '2026-05-29 06:00', gym: 'PowerFit Gym', createdAt: '2025-02-14' },
    { id: 5, name: 'María López', email: 'admin@ironfit.com', role: 'admin', status: 'active', avatar: 'ML', lastLogin: '2026-05-28 10:30', gym: 'IronFit Centro', createdAt: '2025-06-01' },
    { id: 6, name: 'Pedro Gómez', email: 'pedro@ironfit.com', role: 'receptionist', status: 'inactive', avatar: 'PG', lastLogin: '2026-04-15 09:00', gym: 'IronFit Centro', createdAt: '2025-07-20' },
  ])))

  // Gimnasios registrados (demo multi-tenant)
  const registeredGyms = ref(JSON.parse(localStorage.getItem('gym_registered_gyms') || JSON.stringify([
    { id: 1, name: 'PowerFit Gym', slug: 'powerfit', owner: 'Ana Martínez', plan: 'Profesional', status: 'active', members: 185, revenue: 6800, city: 'Quito', createdAt: '2024-03-20', expiresAt: '2027-03-20' },
    { id: 2, name: 'IronFit Centro', slug: 'ironfit', owner: 'María López', plan: 'Básico', status: 'active', members: 90, revenue: 2800, city: 'Guayaquil', createdAt: '2025-06-01', expiresAt: '2026-06-01' },
    { id: 3, name: 'CrossBox Elite', slug: 'crossbox', owner: 'Juan Vera', plan: 'Enterprise', status: 'active', members: 320, revenue: 14500, city: 'Cuenca', createdAt: '2024-08-15', expiresAt: '2027-08-15' },
    { id: 4, name: 'Flex Studio', slug: 'flexstudio', owner: 'Laura Díaz', plan: 'Profesional', status: 'suspended', members: 45, revenue: 0, city: 'Ambato', createdAt: '2025-09-10', expiresAt: '2026-03-10' },
  ])))

  function login(email, password) {
    if (email && password) {
      // Si es superadmin@gympro.com → SuperAdmin
      const isSA = email.toLowerCase().includes('superadmin')
      const u = isSA
        ? { id: 1, name: 'Carlos Ruiz', email, role: 'superadmin', avatar: 'CR', phone: '+593 999 888 777', position: 'Super Administrador', department: 'Dirección General' }
        : { id: 2, name: 'Ana Martínez', email, role: 'admin', avatar: 'AM', phone: '+593 999 000 111', position: 'Administradora', department: 'Operaciones' }
      const g = { id: 1, name: 'PowerFit Gym', logo: '💪', currency: 'USD', phone: '+593 999 000 111', address: 'Av. Principal 123', city: 'Quito' }
      user.value = u
      gym.value = g
      localStorage.setItem('gym_user', JSON.stringify(u))
      localStorage.setItem('gym_info', JSON.stringify(g))
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    gym.value = null
    localStorage.removeItem('gym_user')
    localStorage.removeItem('gym_info')
  }

  function saveUsers() { localStorage.setItem('gym_system_users', JSON.stringify(systemUsers.value)) }
  function saveGyms() { localStorage.setItem('gym_registered_gyms', JSON.stringify(registeredGyms.value)) }

  function addUser(userData) {
    systemUsers.value.push({ ...userData, id: Date.now(), status: 'active', lastLogin: 'Nunca', createdAt: new Date().toISOString().split('T')[0] })
    saveUsers()
  }
  function updateUser(id, data) {
    const idx = systemUsers.value.findIndex(u => u.id === id)
    if (idx >= 0) { systemUsers.value[idx] = { ...systemUsers.value[idx], ...data }; saveUsers() }
  }
  function deleteUser(id) {
    systemUsers.value = systemUsers.value.filter(u => u.id !== id)
    saveUsers()
  }

  function updateProfile(data) {
    user.value = { ...user.value, ...data }
    localStorage.setItem('gym_user', JSON.stringify(user.value))
  }

  return {
    user, gym, isAuthenticated, userName, userRole, gymName, isSuperAdmin, isAdmin,
    systemUsers, registeredGyms,
    login, logout, addUser, updateUser, deleteUser, updateProfile, saveGyms
  }
})

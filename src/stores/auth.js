import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const DEFAULT_USERS = [
  { id: 1, name: 'Ana Martínez', email: 'admin@altorango.com', password: 'admin123', role: 'admin', status: 'active', avatar: 'AM', lastLogin: '2026-08-15 07:30', createdAt: '2024-03-20' },
  { id: 2, name: 'Luis Paredes', email: 'empleado@altorango.com', password: 'empleado123', role: 'empleado', status: 'active', avatar: 'LP', lastLogin: '2026-08-14 18:00', createdAt: '2025-01-10' },
  { id: 3, name: 'Carlos Mendoza', email: 'usuario@altorango.com', password: 'usuario123', role: 'usuario', status: 'active', avatar: 'CM', lastLogin: '2026-08-13 09:00', createdAt: '2025-03-10', clientId: 1 },
]

const DEFAULT_GYM = {
  id: 1,
  name: 'Alto Rango Gym',
  logo: '💪',
  currency: 'USD',
  phone: '+593 999 000 111',
  address: 'Av. Principal 123',
  city: 'Quito',
  email: 'info@altorango.com',
  website: 'www.altorango.com',
}

const ROLE_LABELS = {
  admin: 'Administrador',
  empleado: 'Empleado/Encargado',
  usuario: 'Usuario',
}

const LEGACY_ROLE_MAP = {
  superadmin: 'admin',
  administrador: 'admin',
  Administrador: 'admin',
  receptionist: 'empleado',
  recepcionista: 'empleado',
  trainer: 'empleado',
  entrenador: 'empleado',
  employee: 'empleado',
  manager: 'empleado',
  user: 'usuario',
  cliente: 'usuario',
}

function initials(name) {
  return (name || 'U').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function normalizeRole(role) {
  if (!role) return null
  if (['admin', 'empleado', 'usuario'].includes(role)) return role
  return LEGACY_ROLE_MAP[role] || null
}

function migrateUsers(raw) {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_USERS
  const migrated = raw.map(u => {
    const role = normalizeRole(u.role)
    if (!role) return null
    return {
      ...u,
      role,
      password: u.password || 'cambiar123',
      status: u.status || 'active',
      avatar: u.avatar || initials(u.name),
    }
  }).filter(Boolean)

  // Si no hay ningún admin demo usable, restaurar defaults
  const hasValid = migrated.some(u => u.email && u.password && ['admin', 'empleado', 'usuario'].includes(u.role))
  if (!hasValid) return DEFAULT_USERS

  // Asegurar que existan las 3 cuentas demo
  const emails = new Set(migrated.map(u => u.email.toLowerCase()))
  DEFAULT_USERS.forEach(demo => {
    if (!emails.has(demo.email.toLowerCase())) migrated.push({ ...demo })
  })
  return migrated
}

function migrateSessionUser(raw) {
  if (!raw) return null
  const role = normalizeRole(raw.role)
  if (!role) return null
  return {
    ...raw,
    role,
    position: ROLE_LABELS[role],
  }
}

export const useAuthStore = defineStore('auth', () => {
  let initialUser = null
  try {
    initialUser = migrateSessionUser(JSON.parse(localStorage.getItem('gym_user') || 'null'))
  } catch { initialUser = null }
  if (initialUser) localStorage.setItem('gym_user', JSON.stringify(initialUser))
  else localStorage.removeItem('gym_user')

  let initialGym = DEFAULT_GYM
  try {
    const g = JSON.parse(localStorage.getItem('gym_info') || 'null')
    if (g) {
      initialGym = { ...DEFAULT_GYM, ...g, name: g.name?.includes('PowerFit') || g.name === 'GymPro' ? DEFAULT_GYM.name : (g.name || DEFAULT_GYM.name) }
    }
  } catch { /* keep default */ }
  localStorage.setItem('gym_info', JSON.stringify(initialGym))

  let initialUsers = DEFAULT_USERS
  try {
    initialUsers = migrateUsers(JSON.parse(localStorage.getItem('gym_system_users') || 'null'))
  } catch { initialUsers = DEFAULT_USERS }
  localStorage.setItem('gym_system_users', JSON.stringify(initialUsers))

  const user = ref(initialUser)
  const gym = ref(initialGym)
  const systemUsers = ref(initialUsers)

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name || '')
  const userRole = computed(() => user.value?.role || '')
  const userRoleLabel = computed(() => ROLE_LABELS[user.value?.role] || user.value?.role || '')
  const gymName = computed(() => gym.value?.name || 'Alto Rango Gym')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEmpleado = computed(() => user.value?.role === 'empleado')
  const isUsuario = computed(() => user.value?.role === 'usuario')
  const canManageUsers = computed(() => isAdmin.value)
  const canManagePlans = computed(() => isAdmin.value)
  const canSell = computed(() => isAdmin.value || isEmpleado.value)
  const canAccessControl = computed(() => isAdmin.value || isEmpleado.value)

  function login(email, password) {
    if (!email || !password) return false
    const emailNorm = email.toLowerCase().trim()
    const found = systemUsers.value.find(
      u => u.email.toLowerCase() === emailNorm && u.password === password && u.status === 'active'
    )
    if (!found) return false

    const role = normalizeRole(found.role) || 'usuario'
    const u = {
      id: found.id,
      name: found.name,
      email: found.email,
      role,
      avatar: found.avatar || initials(found.name),
      clientId: found.clientId || null,
      phone: found.phone || '',
      position: ROLE_LABELS[role],
    }
    found.lastLogin = new Date().toISOString().slice(0, 16).replace('T', ' ')
    found.role = role
    saveUsers()

    user.value = u
    if (!gym.value?.name) gym.value = { ...DEFAULT_GYM }
    localStorage.setItem('gym_user', JSON.stringify(u))
    localStorage.setItem('gym_info', JSON.stringify(gym.value))
    return true
  }

  function logout() {
    user.value = null
    localStorage.removeItem('gym_user')
  }

  function saveUsers() {
    localStorage.setItem('gym_system_users', JSON.stringify(systemUsers.value))
  }

  function saveGym(data) {
    gym.value = { ...gym.value, ...data }
    localStorage.setItem('gym_info', JSON.stringify(gym.value))
  }

  function addUser(userData) {
    const role = normalizeRole(userData.role) || 'empleado'
    const avatar = initials(userData.name)
    systemUsers.value.push({
      ...userData,
      role,
      id: Date.now(),
      status: userData.status || 'active',
      avatar,
      lastLogin: 'Nunca',
      createdAt: new Date().toISOString().split('T')[0],
      password: userData.password || 'cambiar123',
    })
    saveUsers()
  }

  function updateUser(id, data) {
    const idx = systemUsers.value.findIndex(u => u.id === id)
    if (idx >= 0) {
      const patch = { ...data }
      if (patch.role) patch.role = normalizeRole(patch.role) || systemUsers.value[idx].role
      systemUsers.value[idx] = { ...systemUsers.value[idx], ...patch }
      // Solo recalcular avatar de iniciales si no hay foto personalizada
      if (patch.name && !systemUsers.value[idx].photoUrl) {
        systemUsers.value[idx].avatar = initials(patch.name)
      }
      saveUsers()
    }
  }

  function deleteUser(id) {
    if (user.value?.id === id) return false
    systemUsers.value = systemUsers.value.filter(u => u.id !== id)
    saveUsers()
    return true
  }

  function updateProfile(data) {
    user.value = { ...user.value, ...data }
    localStorage.setItem('gym_user', JSON.stringify(user.value))
  }

  function hasRole(...roles) {
    return roles.includes(user.value?.role)
  }

  return {
    user, gym, isAuthenticated, userName, userRole, userRoleLabel, gymName,
    isAdmin, isEmpleado, isUsuario, canManageUsers, canManagePlans, canSell, canAccessControl,
    systemUsers, ROLE_LABELS,
    login, logout, addUser, updateUser, deleteUser, updateProfile, saveGym, hasRole,
  }
})

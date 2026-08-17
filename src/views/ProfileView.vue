<template>
  <div class="profile-page">
    <!-- Hero Banner -->
    <div class="profile-hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <!-- Avatar con upload -->
        <div class="avatar-section">
          <div class="avatar-wrapper" @click="triggerFileInput" :title="'Cambiar foto'">
            <img v-if="previewUrl || auth.user?.photoUrl" :src="previewUrl || auth.user.photoUrl" class="avatar-img" alt="Foto de perfil" />
            <div v-else class="avatar-initials" :style="{ background: avatarGradient }">
              {{ auth.user?.avatar || 'U' }}
            </div>
            <div class="avatar-overlay">
              <span>📷</span>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileChange" />
          <div class="avatar-actions" v-if="previewUrl">
            <button class="btn btn-primary btn-sm" @click="savePhoto">✅ Guardar foto</button>
            <button class="btn btn-secondary btn-sm" @click="cancelPhoto">✕ Cancelar</button>
          </div>
          <div v-if="!previewUrl" class="avatar-hint">Haz clic en la foto para cambiarla</div>
        </div>

        <!-- Nombre y rol badge -->
        <div class="hero-info">
          <h1 class="profile-name">{{ auth.userName }}</h1>
          <span class="role-badge" :class="`role-${auth.userRole}`">
            {{ roleIcon }} {{ auth.userRoleLabel }}
          </span>
          <p class="profile-email">{{ auth.user?.email }}</p>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="profile-body">
      <!-- Columna izquierda: stats -->
      <div class="profile-stats-col">
        <div class="stats-card">
          <h3>📊 Resumen de Cuenta</h3>
          <div class="stat-list">
            <div class="stat-item">
              <span class="stat-label">Miembro desde</span>
              <span class="stat-value">{{ memberSince }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Último acceso</span>
              <span class="stat-value">{{ lastLogin }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Rol en sistema</span>
              <span class="stat-value">{{ auth.userRoleLabel }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Estado</span>
              <span class="badge badge-success">Activo</span>
            </div>
            <div class="stat-item" v-if="auth.user?.phone">
              <span class="stat-label">Teléfono</span>
              <span class="stat-value">{{ auth.user.phone }}</span>
            </div>
          </div>
        </div>

        <div class="perms-card">
          <h3>🔐 Permisos</h3>
          <div class="perm-list">
            <div class="perm-item" :class="{ active: auth.isAdmin }">
              <span>⚙️ Configuración</span><span class="perm-dot"></span>
            </div>
            <div class="perm-item" :class="{ active: auth.canManageUsers }">
              <span>👥 Gestión de usuarios</span><span class="perm-dot"></span>
            </div>
            <div class="perm-item" :class="{ active: auth.canSell }">
              <span>🛒 Ventas / Tienda</span><span class="perm-dot"></span>
            </div>
            <div class="perm-item" :class="{ active: auth.canAccessControl }">
              <span>🚪 Control de acceso</span><span class="perm-dot"></span>
            </div>
            <div class="perm-item" :class="{ active: auth.isAdmin }">
              <span>📊 Reportes</span><span class="perm-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna derecha: formulario de edición -->
      <div class="profile-edit-col">
        <div class="edit-card">
          <h3>✏️ Editar Información Personal</h3>
          <form @submit.prevent="saveProfile" class="edit-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre completo</label>
                <input v-model="form.name" required placeholder="Tu nombre completo" />
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="form.phone" placeholder="+593 999 000 111" />
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input :value="auth.user?.email" readonly class="readonly-input" />
              <small class="field-hint">El email no puede modificarse desde aquí.</small>
            </div>
            <div class="form-group">
              <label>Rol</label>
              <input :value="auth.userRoleLabel" readonly class="readonly-input" />
            </div>
            <button type="submit" class="btn btn-primary save-btn">
              💾 Guardar cambios
            </button>
          </form>
        </div>

        <!-- Cambiar contraseña -->
        <div class="edit-card">
          <h3>🔑 Cambiar Contraseña</h3>
          <form @submit.prevent="changePassword" class="edit-form">
            <div class="form-group">
              <label>Contraseña actual</label>
              <div class="pass-wrap">
                <input v-model="passForm.current" :type="showPass.current ? 'text' : 'password'" required placeholder="Contraseña actual" />
                <button type="button" class="eye-btn" @click="showPass.current = !showPass.current">{{ showPass.current ? '🙈' : '👁️' }}</button>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Nueva contraseña</label>
                <div class="pass-wrap">
                  <input v-model="passForm.newPass" :type="showPass.newPass ? 'text' : 'password'" required placeholder="Nueva contraseña" minlength="6" />
                  <button type="button" class="eye-btn" @click="showPass.newPass = !showPass.newPass">{{ showPass.newPass ? '🙈' : '👁️' }}</button>
                </div>
              </div>
              <div class="form-group">
                <label>Confirmar nueva</label>
                <div class="pass-wrap">
                  <input v-model="passForm.confirm" :type="showPass.confirm ? 'text' : 'password'" required placeholder="Repetir contraseña" />
                  <button type="button" class="eye-btn" @click="showPass.confirm = !showPass.confirm">{{ showPass.confirm ? '🙈' : '👁️' }}</button>
                </div>
              </div>
            </div>
            <div v-if="passError" class="pass-error">{{ passError }}</div>
            <button type="submit" class="btn btn-secondary save-btn">🔒 Actualizar contraseña</button>
          </form>
        </div>

        <!-- Actividad reciente -->
        <div class="activity-card">
          <h3>🕐 Actividad Reciente</h3>
          <div class="activity-list">
            <div class="activity-item" v-for="item in activityLog" :key="item.id">
              <span class="activity-icon">{{ item.icon }}</span>
              <div class="activity-info">
                <span class="activity-title">{{ item.title }}</span>
                <span class="activity-date">{{ item.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const auth = useAuthStore()
const toast = useToastStore()

// Avatar / foto
const fileInput = ref(null)
const previewUrl = ref(null)
const pendingFile = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error('La imagen no debe superar 5MB')
    return
  }
  pendingFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { previewUrl.value = ev.target.result }
  reader.readAsDataURL(file)
}

function savePhoto() {
  if (!previewUrl.value) return
  auth.updateProfile({ photoUrl: previewUrl.value })
  // Actualizar también en systemUsers para que se vea en la lista
  const found = auth.systemUsers.find(u => u.id === auth.user.id)
  if (found) {
    auth.updateUser(auth.user.id, { photoUrl: previewUrl.value })
  }
  previewUrl.value = null
  pendingFile.value = null
  toast.success('Foto de perfil actualizada ✅')
}

function cancelPhoto() {
  previewUrl.value = null
  pendingFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// Gradiente del avatar basado en iniciales
const avatarGradient = computed(() => {
  const colors = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #06b6d4)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
  ]
  const idx = (auth.user?.name?.charCodeAt(0) || 0) % colors.length
  return colors[idx]
})

// Ícono de rol
const roleIcon = computed(() => {
  const icons = { admin: '👑', empleado: '🧑‍💼', usuario: '🏋️' }
  return icons[auth.userRole] || '👤'
})

// Fechas
const memberSince = computed(() => {
  const u = auth.systemUsers.find(u => u.id === auth.user?.id)
  return u?.createdAt || '—'
})
const lastLogin = computed(() => {
  const u = auth.systemUsers.find(u => u.id === auth.user?.id)
  return u?.lastLogin || '—'
})

// Formulario de edición
const form = ref({
  name: auth.user?.name || '',
  phone: auth.user?.phone || '',
})

function saveProfile() {
  if (!form.value.name.trim()) {
    toast.error('El nombre no puede estar vacío')
    return
  }
  auth.updateProfile({ name: form.value.name, phone: form.value.phone })
  auth.updateUser(auth.user.id, { name: form.value.name, phone: form.value.phone })
  toast.success('Perfil actualizado correctamente ✅')
}

// Cambio de contraseña
const passForm = ref({ current: '', newPass: '', confirm: '' })
const passError = ref('')
const showPass = ref({ current: false, newPass: false, confirm: false })

function changePassword() {
  passError.value = ''
  const u = auth.systemUsers.find(u => u.id === auth.user?.id)
  if (!u || u.password !== passForm.value.current) {
    passError.value = 'La contraseña actual es incorrecta.'
    return
  }
  if (passForm.value.newPass.length < 6) {
    passError.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (passForm.value.newPass !== passForm.value.confirm) {
    passError.value = 'Las contraseñas no coinciden.'
    return
  }
  auth.updateUser(auth.user.id, { password: passForm.value.newPass })
  passForm.value = { current: '', newPass: '', confirm: '' }
  toast.success('Contraseña actualizada correctamente 🔒')
}

// Actividad reciente (simulada)
const activityLog = computed(() => [
  { id: 1, icon: '🔑', title: 'Inicio de sesión exitoso', date: auth.systemUsers.find(u => u.id === auth.user?.id)?.lastLogin || 'Hoy' },
  { id: 2, icon: '✏️', title: 'Perfil actualizado', date: new Date().toLocaleDateString('es-EC') },
  { id: 3, icon: '🔒', title: 'Sesión iniciada en dispositivo', date: new Date().toLocaleDateString('es-EC') },
])
</script>

<style scoped>
.profile-page {
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Hero ── */
.profile-hero {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 28px;
  min-height: 220px;
  display: flex;
  align-items: flex-end;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #6d28d9 100%);
  z-index: 0;
}
.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: 28px;
  padding: 32px;
  width: 100%;
}

/* ── Avatar ── */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-wrapper {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.3);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  flex-shrink: 0;
}
.avatar-wrapper:hover { border-color: rgba(255,255,255,0.7); }
.avatar-wrapper:hover .avatar-overlay { opacity: 1; }

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.hidden-input { display: none; }

.avatar-actions {
  display: flex;
  gap: 8px;
}

.avatar-hint {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.5);
  text-align: center;
  max-width: 110px;
}

/* ── Hero info ── */
.hero-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.profile-email {
  color: rgba(255,255,255,0.65);
  font-size: 0.9rem;
  margin: 0;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  width: fit-content;
}
.role-admin    { background: rgba(245,158,11,0.25); color: #fcd34d; border: 1px solid rgba(245,158,11,0.4); }
.role-empleado { background: rgba(59,130,246,0.25); color: #93c5fd; border: 1px solid rgba(59,130,246,0.4); }
.role-usuario  { background: rgba(16,185,129,0.25); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.4); }

/* ── Body ── */
.profile-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;
}

/* ── Stats col ── */
.profile-stats-col { display: flex; flex-direction: column; gap: 16px; }

.stats-card, .perms-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
}
.stats-card h3, .perms-card h3 {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.stat-list { display: flex; flex-direction: column; gap: 12px; }
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}
.stat-item:last-child { border-bottom: none; padding-bottom: 0; }
.stat-label { color: var(--text-muted); }
.stat-value { font-weight: 500; }

.perm-list { display: flex; flex-direction: column; gap: 10px; }
.perm-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.84rem;
  color: var(--text-muted);
  padding: 6px 0;
}
.perm-item.active { color: var(--text-primary); }
.perm-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--border-color);
  flex-shrink: 0;
}
.perm-item.active .perm-dot { background: var(--success); box-shadow: 0 0 6px rgba(16,185,129,0.5); }

/* ── Edit col ── */
.profile-edit-col { display: flex; flex-direction: column; gap: 16px; }

.edit-card, .activity-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 24px;
}
.edit-card h3, .activity-card h3 {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 18px;
}

.edit-form { display: flex; flex-direction: column; gap: 14px; }

.readonly-input {
  background: rgba(255,255,255,0.03) !important;
  cursor: not-allowed;
  color: var(--text-muted) !important;
}

.field-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}

.save-btn { margin-top: 4px; }

/* Pass */
.pass-wrap {
  position: relative;
  display: flex;
}
.pass-wrap input { padding-right: 44px; }
.eye-btn {
  position: absolute;
  right: 10px; top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.pass-error {
  background: rgba(239,68,68,0.12);
  border: 1px solid rgba(239,68,68,0.3);
  color: #fca5a5;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.84rem;
}

/* Activity */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.02);
  transition: background 0.15s;
}
.activity-item:hover { background: rgba(255,255,255,0.05); }
.activity-icon { font-size: 1.2rem; flex-shrink: 0; }
.activity-info { display: flex; flex-direction: column; gap: 2px; }
.activity-title { font-size: 0.85rem; font-weight: 500; }
.activity-date { font-size: 0.75rem; color: var(--text-muted); }

/* Responsive */
@media (max-width: 900px) {
  .profile-body { grid-template-columns: 1fr; }
  .profile-stats-col { flex-direction: row; flex-wrap: wrap; }
  .stats-card, .perms-card { flex: 1; min-width: 240px; }
}
@media (max-width: 600px) {
  .hero-content { flex-direction: column; align-items: center; text-align: center; }
  .hero-info { align-items: center; }
  .role-badge { margin: 0 auto; }
}
</style>

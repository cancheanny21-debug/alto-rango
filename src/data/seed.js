export const seedClients = [
  { id: 1, name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '0991234567', status: 'active', plan: 'Mensual', planEnd: '2026-09-15', photo: '👨', weight: 78, height: 175, bmi: 25.5, joinDate: '2025-03-10', visits: 45, visitsRemaining: null },
  { id: 2, name: 'María López', email: 'maria@email.com', phone: '0997654321', status: 'active', plan: 'Plan Nutricional', planEnd: '2026-10-20', photo: '👩', weight: 62, height: 165, bmi: 22.8, joinDate: '2025-01-15', visits: 78, visitsRemaining: null },
  { id: 3, name: 'Andrés Torres', email: 'andres@email.com', phone: '0993456789', status: 'active', plan: 'Personalizado', planEnd: '2027-01-05', photo: '🧔', weight: 85, height: 180, bmi: 26.2, joinDate: '2025-06-01', visits: 120, visitsRemaining: null },
  { id: 4, name: 'Sofía Ramírez', email: 'sofia@email.com', phone: '0995678901', status: 'expired', plan: 'Normal', planEnd: '2026-05-01', photo: '👧', weight: 55, height: 160, bmi: 21.5, joinDate: '2025-09-20', visits: 30, visitsRemaining: null },
  { id: 5, name: 'Diego Herrera', email: 'diego@email.com', phone: '0992345678', status: 'active', plan: 'Pospago por Tarjeta', planEnd: '2026-12-31', photo: '👦', weight: 90, height: 185, bmi: 26.3, joinDate: '2024-11-10', visits: 20, visitsRemaining: 10 },
  { id: 6, name: 'Valentina Cruz', email: 'vale@email.com', phone: '0998765432', status: 'active', plan: 'Mensual', planEnd: '2026-09-15', photo: '👩‍🦰', weight: 58, height: 162, bmi: 22.1, joinDate: '2025-04-05', visits: 55, visitsRemaining: null },
  { id: 7, name: 'Sebastián Mora', email: 'seba@email.com', phone: '0991112233', status: 'frozen', plan: 'Personalizado', planEnd: '2026-12-01', photo: '🧑', weight: 72, height: 170, bmi: 24.9, joinDate: '2025-02-14', visits: 40, visitsRemaining: null },
  { id: 8, name: 'Isabella Vargas', email: 'isa@email.com', phone: '0994445566', status: 'active', plan: 'Normal', planEnd: '2026-09-10', photo: '👩‍🦱', weight: 65, height: 168, bmi: 23.0, joinDate: '2025-07-22', visits: 88, visitsRemaining: null },
  { id: 9, name: 'Mateo Jiménez', email: 'mateo@email.com', phone: '0997778899', status: 'active', plan: 'Diario', planEnd: '2026-08-15', photo: '👱', weight: 80, height: 178, bmi: 25.2, joinDate: '2025-05-30', visits: 65, visitsRemaining: null },
  { id: 10, name: 'Camila Paredes', email: 'cami@email.com', phone: '0990001122', status: 'expired', plan: 'Plan Nutricional', planEnd: '2026-04-20', photo: '👩‍🔧', weight: 60, height: 163, bmi: 22.6, joinDate: '2025-08-12', visits: 22, visitsRemaining: null },
  { id: 11, name: 'Nicolás Guerrero', email: 'nico@email.com', phone: '0993334455', status: 'active', plan: 'Personalizado', planEnd: '2027-03-15', photo: '🧑‍🦲', weight: 95, height: 190, bmi: 26.3, joinDate: '2024-12-01', visits: 180, visitsRemaining: null },
  { id: 12, name: 'Luciana Medina', email: 'lu@email.com', phone: '0996667788', status: 'active', plan: 'Mensual', planEnd: '2026-09-25', photo: '👱‍♀️', weight: 57, height: 158, bmi: 22.8, joinDate: '2025-10-08', visits: 42, visitsRemaining: null },
]

export const seedPlans = [
  { id: 1, name: 'Diario', type: 'diario', duration: 1, price: 5, limit: null, features: ['Acceso a máquinas por un día'], color: '#94a3b8' },
  { id: 2, name: 'Normal', type: 'normal', duration: 30, price: 25, limit: null, features: ['Acceso a máquinas', 'Horario limitado'], color: '#3b82f6' },
  { id: 3, name: 'Mensual', type: 'mensual', duration: 30, price: 40, limit: null, features: ['Acceso ilimitado', 'Todas las clases'], color: '#06b6d4' },
  { id: 4, name: 'Personalizado', type: 'personalizado', duration: 30, price: 60, limit: null, features: ['Acceso ilimitado', 'Entrenador personal'], color: '#8b5cf6' },
  { id: 5, name: 'Plan Nutricional', type: 'nutricional', duration: 30, price: 80, limit: null, features: ['Acceso ilimitado', 'Entrenador', 'Plan nutricional'], color: '#10b981' },
  { id: 6, name: 'Pospago por Tarjeta', type: 'pospago', duration: 999, price: 50, limit: 30, features: ['30 asistencias', 'Pago por adelantado', 'Se cumple al completar 30 visitas'], color: '#f59e0b' },
]

export const seedProducts = [
  { id: 1, name: 'Agua Dasani', category: 'Bebidas', price: 1.00, stock: 50, emoji: '💧', desc: 'Agua purificada Dasani.', rating: 4.8, sold: 150 },
  { id: 2, name: 'Powerade', category: 'Bebidas', price: 2.50, stock: 30, emoji: '⚡', desc: 'Bebida deportiva rehidratante.', rating: 4.7, sold: 120 },
  { id: 3, name: 'Electrolitos', category: 'Bebidas', price: 3.00, stock: 18, emoji: '🧪', desc: 'Electrolitos para recuperación rápida.', rating: 4.5, sold: 85 },
  { id: 4, name: 'Yogur', category: 'Snacks', price: 2.00, stock: 22, emoji: '🥣', desc: 'Yogur natural alto en proteína.', rating: 4.6, sold: 95 },
  { id: 5, name: 'Batidos', category: 'Bebidas', price: 4.50, stock: 40, emoji: '🥤', desc: 'Batidos de proteína preparados.', rating: 4.4, sold: 200 },
  { id: 6, name: 'Proteína Pura', category: 'Suplementos', price: 45.00, stock: 35, emoji: '💪', desc: 'Proteína de suero de leche premium.', rating: 4.3, sold: 160 },
  { id: 7, name: 'Ensalada', category: 'Snacks', price: 5.00, stock: 15, emoji: '🥗', desc: 'Ensalada fresca post-entrenamiento.', rating: 4.7, sold: 180 },
  { id: 8, name: 'Creatina', category: 'Suplementos', price: 25.00, stock: 25, emoji: '💊', desc: 'Creatina monohidratada pura.', rating: 4.5, sold: 220 },
]

export const seedEquipment = [
  { id: 1, name: 'Cinta de correr', type: 'Máquina', quantity: 4, status: 'operativo', location: 'Zona cardio', notes: '' },
  { id: 2, name: 'Bicicleta estática', type: 'Máquina', quantity: 6, status: 'operativo', location: 'Zona cardio', notes: '' },
  { id: 3, name: 'Máquina de remo', type: 'Máquina', quantity: 2, status: 'mantenimiento', location: 'Zona cardio', notes: 'Correa a revisar' },
  { id: 4, name: 'Press banca', type: 'Máquina', quantity: 3, status: 'operativo', location: 'Zona fuerza', notes: '' },
  { id: 5, name: 'Hack squat', type: 'Máquina', quantity: 1, status: 'operativo', location: 'Zona piernas', notes: '' },
  { id: 6, name: 'Mancuernas 5–40 kg', type: 'Pesas', quantity: 20, status: 'operativo', location: 'Rack mancuernas', notes: 'Par completo' },
  { id: 7, name: 'Barras olímpicas', type: 'Pesas', quantity: 8, status: 'operativo', location: 'Zona free weights', notes: '' },
  { id: 8, name: 'Discos olímpicos', type: 'Pesas', quantity: 40, status: 'operativo', location: 'Zona free weights', notes: '' },
  { id: 9, name: 'Kettlebells', type: 'Pesas', quantity: 12, status: 'operativo', location: 'Zona funcional', notes: '' },
  { id: 10, name: 'Smith machine', type: 'Máquina', quantity: 1, status: 'baja', location: 'Almacén', notes: 'Fuera de servicio' },
]

export const seedPayments = [
  { id: 1, date: '2026-08-01', clientId: 1, client: 'Carlos Mendoza', concept: 'Membresía Mensual', amount: 40, method: 'Efectivo', discount: 0, promo: null },
  { id: 2, date: '2026-08-03', clientId: 5, client: 'Diego Herrera', concept: 'Pospago por Tarjeta (30 asistencias)', amount: 45, method: 'Tarjeta', discount: 5, promo: 'Bienvenida 10%' },
  { id: 3, date: '2026-08-05', clientId: 2, client: 'María López', concept: 'Plan Nutricional', amount: 80, method: 'Transferencia', discount: 0, promo: null },
  { id: 4, date: '2026-08-08', clientId: 8, client: 'Isabella Vargas', concept: 'Membresía Normal', amount: 25, method: 'Efectivo', discount: 0, promo: null },
  { id: 5, date: '2026-08-10', clientId: 6, client: 'Valentina Cruz', concept: 'Membresía Mensual', amount: 36, method: 'Tarjeta', discount: 4, promo: 'Bienvenida 10%' },
]

export const seedPromotions = [
  { id: 1, name: 'Bienvenida 10%', type: 'percent', value: 10, active: true, appliesTo: 'membresias', description: '10% de descuento en cobros de membresía' },
  { id: 2, name: 'Combo Suplementos $5', type: 'fixed', value: 5, active: false, appliesTo: 'tienda', description: '$5 de descuento en compras de tienda' },
]

export const seedTrainers = [
  { id: 1, name: 'Roberto Silva', specialty: 'Fuerza y Potencia', phone: '0991001001', email: 'roberto@altorango.com', emoji: '🏋️‍♂️', clients: 15, rating: 4.9, schedule: 'Lun-Vie 6:00-14:00' },
  { id: 2, name: 'Ana García', specialty: 'Yoga y Pilates', phone: '0992002002', email: 'ana@altorango.com', emoji: '🧘‍♀️', clients: 20, rating: 4.8, schedule: 'Lun-Sáb 7:00-15:00' },
  { id: 3, name: 'Miguel Ramos', specialty: 'CrossFit y Funcional', phone: '0993003003', email: 'miguel@altorango.com', emoji: '🤸‍♂️', clients: 18, rating: 4.7, schedule: 'Lun-Vie 14:00-22:00' },
  { id: 4, name: 'Laura Vega', specialty: 'Cardio y HIIT', phone: '0994004004', email: 'laura@altorango.com', emoji: '🏃‍♀️', clients: 22, rating: 4.9, schedule: 'Mar-Sáb 8:00-16:00' },
]

export const seedClasses = [
  { id: 1, name: 'CrossFit Intenso', trainer: 'Miguel Ramos', day: 'Lunes', time: '07:00', duration: 60, capacity: 15, enrolled: 12, emoji: '🔥', color: '#ef4444' },
  { id: 2, name: 'Yoga Flow', trainer: 'Ana García', day: 'Lunes', time: '09:00', duration: 60, capacity: 20, enrolled: 18, emoji: '🧘', color: '#8b5cf6' },
  { id: 3, name: 'Spinning Power', trainer: 'Laura Vega', day: 'Martes', time: '06:30', duration: 45, capacity: 20, enrolled: 20, emoji: '🚴', color: '#f59e0b' },
  { id: 4, name: 'Fuerza Total', trainer: 'Roberto Silva', day: 'Martes', time: '17:00', duration: 60, capacity: 12, enrolled: 10, emoji: '💪', color: '#3b82f6' },
  { id: 5, name: 'HIIT Cardio Blast', trainer: 'Laura Vega', day: 'Miércoles', time: '07:00', duration: 45, capacity: 25, enrolled: 22, emoji: '⚡', color: '#06b6d4' },
  { id: 6, name: 'Pilates Core', trainer: 'Ana García', day: 'Miércoles', time: '10:00', duration: 50, capacity: 15, enrolled: 13, emoji: '🎯', color: '#10b981' },
  { id: 7, name: 'Funcional Mix', trainer: 'Miguel Ramos', day: 'Jueves', time: '18:00', duration: 60, capacity: 18, enrolled: 15, emoji: '🏋️', color: '#f97316' },
  { id: 8, name: 'Yoga Restaurativo', trainer: 'Ana García', day: 'Viernes', time: '08:00', duration: 75, capacity: 15, enrolled: 8, emoji: '🌿', color: '#22c55e' },
  { id: 9, name: 'CrossFit Open', trainer: 'Miguel Ramos', day: 'Viernes', time: '17:00', duration: 60, capacity: 15, enrolled: 14, emoji: '🔥', color: '#ef4444' },
  { id: 10, name: 'Body Combat', trainer: 'Roberto Silva', day: 'Sábado', time: '09:00', duration: 60, capacity: 20, enrolled: 16, emoji: '🥊', color: '#dc2626' },
]

export const seedSales = [
  { id: 1, date: '2026-08-12', client: 'Carlos Mendoza', items: [{ name: 'Proteína Pura', qty: 1, price: 45.00 }], total: 50.40, method: 'Efectivo' },
  { id: 2, date: '2026-08-11', client: 'María López', items: [{ name: 'Creatina', qty: 1, price: 25.00 }, { name: 'Agua Dasani', qty: 2, price: 1.00 }], total: 30.24, method: 'Transferencia' },
  { id: 3, date: '2026-08-10', client: 'Diego Herrera', items: [{ name: 'Powerade', qty: 3, price: 2.50 }], total: 8.40, method: 'Tarjeta' },
  { id: 4, date: '2026-08-09', client: 'Isabella Vargas', items: [{ name: 'Ensalada', qty: 1, price: 5.00 }, { name: 'Yogur', qty: 1, price: 2.00 }], total: 7.84, method: 'Efectivo' },
  { id: 5, date: '2026-08-08', client: 'Valentina Cruz', items: [{ name: 'Batidos', qty: 2, price: 4.50 }], total: 10.08, method: 'Transferencia' },
]

export const seedAttendance = [
  { id: 1, clientId: 1, client: 'Carlos Mendoza', date: '2026-08-15', checkin: '06:45', checkout: '08:15', duration: '1h 30min', status: 'verified' },
  { id: 2, clientId: 2, client: 'María López', date: '2026-08-15', checkin: '07:00', checkout: '08:30', duration: '1h 30min', status: 'verified' },
  { id: 3, clientId: 5, client: 'Diego Herrera', date: '2026-08-15', checkin: '07:15', checkout: null, duration: null, status: 'pending' },
  { id: 4, clientId: 8, client: 'Isabella Vargas', date: '2026-08-15', checkin: '08:00', checkout: null, duration: null, status: 'pending' },
  { id: 5, clientId: 3, client: 'Andrés Torres', date: '2026-08-14', checkin: '17:00', checkout: '18:45', duration: '1h 45min', status: 'verified' },
  { id: 6, clientId: 6, client: 'Valentina Cruz', date: '2026-08-14', checkin: '06:30', checkout: '07:45', duration: '1h 15min', status: 'verified' },
]

export const seedRoutines = [
  {
    id: 1,
    name: 'Rutina de Fuerza Básica',
    level: 'Principiante',
    description: 'Ideal para quienes inician en el gimnasio. Enfoque en ejercicios compuestos.',
    exercises: ['Sentadillas 4x12', 'Press banca 4x10', 'Peso muerto rumano 3x10', 'Remo con barra 3x12'],
  },
  {
    id: 2,
    name: 'Hipertrofia Upper/Lower',
    level: 'Intermedio',
    description: 'División upper/lower para ganar masa muscular.',
    exercises: ['Press inclinado 4x8', 'Dominadas 4x8', 'Curl bíceps 3x12', 'Extensiones tríceps 3x12', 'Sentadilla búlgara 3x10'],
  },
]

export const socialLinks = [
  { name: 'Facebook', short: 'FB', url: 'https://www.facebook.com/altorango' },
  { name: 'Instagram', short: 'IG', url: 'https://www.instagram.com/altorango' },
  { name: 'TikTok', short: 'TK', url: 'https://www.tiktok.com/@altorango' },
]

export const monthlyRevenue = [3200, 3800, 4100, 3900, 4500, 5200, 4800, 5500, 5100, 5800, 6200, 6800]
export const monthlyMembers = [80, 95, 110, 105, 120, 135, 140, 150, 145, 160, 170, 185]
export const weeklyAttendance = [45, 62, 58, 70, 55, 40, 20]

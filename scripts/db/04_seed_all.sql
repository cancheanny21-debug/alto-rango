-- ============================================================
-- 04_seed_all.sql
-- Datos de prueba migrados desde src/data/seed.js
-- Ejecutar DESPUÉS de 05_schema_extra.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ─── PLANES ───────────────────────────────────────────────
TRUNCATE TABLE plans;
INSERT INTO plans (id, tenant_id, name, type, duration, price, limit_visits, features, color) VALUES
(1, 1, 'Diario',            'diario',        1,   5.00, NULL, '["Acceso a máquinas por un día"]',                                               '#94a3b8'),
(2, 1, 'Normal',            'normal',        30,  25.00, NULL, '["Acceso a máquinas", "Horario limitado"]',                                      '#3b82f6'),
(3, 1, 'Mensual',           'mensual',       30,  40.00, NULL, '["Acceso ilimitado", "Todas las clases"]',                                       '#06b6d4'),
(4, 1, 'Personalizado',     'personalizado', 30,  60.00, NULL, '["Acceso ilimitado", "Entrenador personal"]',                                    '#8b5cf6'),
(5, 1, 'Plan Nutricional',  'nutricional',   30,  80.00, NULL, '["Acceso ilimitado", "Entrenador", "Plan nutricional"]',                         '#10b981'),
(6, 1, 'Pospago por Tarjeta','pospago',      999, 50.00, 30,  '["30 asistencias", "Pago por adelantado", "Se cumple al completar 30 visitas"]', '#f59e0b');

-- ─── CLIENTES ─────────────────────────────────────────────
TRUNCATE TABLE clients;
INSERT INTO clients (id, tenant_id, name, email, phone, status, plan, plan_end, photo, weight, height, bmi, join_date, visits, visits_remaining) VALUES
(1,  1, 'Carlos Mendoza',   'carlos@email.com',  '0991234567', 'active',    'Mensual',            '2026-09-15', '👨',    78, 175, 25.5, '2025-03-10', 45,  NULL),
(2,  1, 'María López',      'maria@email.com',   '0997654321', 'active',    'Plan Nutricional',   '2026-10-20', '👩',    62, 165, 22.8, '2025-01-15', 78,  NULL),
(3,  1, 'Andrés Torres',    'andres@email.com',  '0993456789', 'active',    'Personalizado',      '2027-01-05', '🧔',    85, 180, 26.2, '2025-06-01', 120, NULL),
(4,  1, 'Sofía Ramírez',    'sofia@email.com',   '0995678901', 'expired',   'Normal',             '2026-05-01', '👧',    55, 160, 21.5, '2025-09-20', 30,  NULL),
(5,  1, 'Diego Herrera',    'diego@email.com',   '0992345678', 'active',    'Pospago por Tarjeta','2026-12-31', '👦',    90, 185, 26.3, '2024-11-10', 20,  10),
(6,  1, 'Valentina Cruz',   'vale@email.com',    '0998765432', 'active',    'Mensual',            '2026-09-15', '👩',    58, 162, 22.1, '2025-04-05', 55,  NULL),
(7,  1, 'Sebastián Mora',   'seba@email.com',    '0991112233', 'frozen',    'Personalizado',      '2026-12-01', '🧑',    72, 170, 24.9, '2025-02-14', 40,  NULL),
(8,  1, 'Isabella Vargas',  'isa@email.com',     '0994445566', 'active',    'Normal',             '2026-09-10', '👩',    65, 168, 23.0, '2025-07-22', 88,  NULL),
(9,  1, 'Mateo Jiménez',    'mateo@email.com',   '0997778899', 'active',    'Diario',             '2026-08-15', '👱',    80, 178, 25.2, '2025-05-30', 65,  NULL),
(10, 1, 'Camila Paredes',   'cami@email.com',    '0990001122', 'expired',   'Plan Nutricional',   '2026-04-20', '👩',    60, 163, 22.6, '2025-08-12', 22,  NULL),
(11, 1, 'Nicolás Guerrero', 'nico@email.com',    '0993334455', 'active',    'Personalizado',      '2027-03-15', '🧑',    95, 190, 26.3, '2024-12-01', 180, NULL),
(12, 1, 'Luciana Medina',   'lu@email.com',      '0996667788', 'active',    'Mensual',            '2026-09-25', '👱',    57, 158, 22.8, '2025-10-08', 42,  NULL);

-- ─── PRODUCTOS ────────────────────────────────────────────
TRUNCATE TABLE products;
INSERT INTO products (id, tenant_id, name, category, price, stock, emoji, description, rating, sold) VALUES
(1, 1, 'Agua Dasani',   'Bebidas',     1.00,  50, '💧', 'Agua purificada Dasani.',                  4.8, 150),
(2, 1, 'Powerade',      'Bebidas',     2.50,  30, '⚡', 'Bebida deportiva rehidratante.',            4.7, 120),
(3, 1, 'Electrolitos',  'Bebidas',     3.00,  18, '🧪', 'Electrolitos para recuperación rápida.',   4.5,  85),
(4, 1, 'Yogur',         'Snacks',      2.00,  22, '🥣', 'Yogur natural alto en proteína.',          4.6,  95),
(5, 1, 'Batidos',       'Bebidas',     4.50,  40, '🥤', 'Batidos de proteína preparados.',          4.4, 200),
(6, 1, 'Proteína Pura', 'Suplementos', 45.00, 35, '💪', 'Proteína de suero de leche premium.',      4.3, 160),
(7, 1, 'Ensalada',      'Snacks',      5.00,  15, '🥗', 'Ensalada fresca post-entrenamiento.',      4.7, 180),
(8, 1, 'Creatina',      'Suplementos', 25.00, 25, '💊', 'Creatina monohidratada pura.',             4.5, 220);

-- ─── EQUIPAMIENTO ─────────────────────────────────────────
TRUNCATE TABLE equipment;
INSERT INTO equipment (id, tenant_id, name, type, quantity, status, location, notes) VALUES
(1,  1, 'Cinta de correr',    'Máquina', 4,  'operativo',    'Zona cardio',       ''),
(2,  1, 'Bicicleta estática', 'Máquina', 6,  'operativo',    'Zona cardio',       ''),
(3,  1, 'Máquina de remo',    'Máquina', 2,  'mantenimiento','Zona cardio',       'Correa a revisar'),
(4,  1, 'Press banca',        'Máquina', 3,  'operativo',    'Zona fuerza',       ''),
(5,  1, 'Hack squat',         'Máquina', 1,  'operativo',    'Zona piernas',      ''),
(6,  1, 'Mancuernas 5-40 kg', 'Pesas',   20, 'operativo',    'Rack mancuernas',   'Par completo'),
(7,  1, 'Barras olímpicas',   'Pesas',   8,  'operativo',    'Zona free weights', ''),
(8,  1, 'Discos olímpicos',   'Pesas',   40, 'operativo',    'Zona free weights', ''),
(9,  1, 'Kettlebells',        'Pesas',   12, 'operativo',    'Zona funcional',    ''),
(10, 1, 'Smith machine',      'Máquina', 1,  'baja',         'Almacén',           'Fuera de servicio');

-- ─── PAGOS ────────────────────────────────────────────────
TRUNCATE TABLE payments;
INSERT INTO payments (id, tenant_id, client_id, client_name, concept, amount, method, discount, promo, date) VALUES
(1, 1, 1, 'Carlos Mendoza',  'Membresía Mensual',               40.00, 'Efectivo',      0.00, NULL,               '2026-08-01'),
(2, 1, 5, 'Diego Herrera',   'Pospago por Tarjeta (30 asist.)', 45.00, 'Tarjeta',       5.00, 'Bienvenida 10%',   '2026-08-03'),
(3, 1, 2, 'María López',     'Plan Nutricional',                80.00, 'Transferencia', 0.00, NULL,               '2026-08-05'),
(4, 1, 8, 'Isabella Vargas', 'Membresía Normal',                25.00, 'Efectivo',      0.00, NULL,               '2026-08-08'),
(5, 1, 6, 'Valentina Cruz',  'Membresía Mensual',               36.00, 'Tarjeta',       4.00, 'Bienvenida 10%',   '2026-08-10');

-- ─── VENTAS ───────────────────────────────────────────────
TRUNCATE TABLE sales;
TRUNCATE TABLE sale_items;
INSERT INTO sales (id, tenant_id, client_name, total, method, date) VALUES
(1, 1, 'Carlos Mendoza',  50.40, 'Efectivo',      '2026-08-12'),
(2, 1, 'María López',     30.24, 'Transferencia', '2026-08-11'),
(3, 1, 'Diego Herrera',    8.40, 'Tarjeta',       '2026-08-10'),
(4, 1, 'Isabella Vargas',  7.84, 'Efectivo',      '2026-08-09'),
(5, 1, 'Valentina Cruz',  10.08, 'Transferencia', '2026-08-08');

INSERT INTO sale_items (sale_id, name, qty, price) VALUES
(1, 'Proteína Pura', 1, 45.00),
(2, 'Creatina',      1, 25.00),
(2, 'Agua Dasani',   2,  1.00),
(3, 'Powerade',      3,  2.50),
(4, 'Ensalada',      1,  5.00),
(4, 'Yogur',         1,  2.00),
(5, 'Batidos',       2,  4.50);

-- ─── PROMOCIONES ──────────────────────────────────────────
TRUNCATE TABLE promotions;
INSERT INTO promotions (id, tenant_id, name, type, value, active, applies_to, description) VALUES
(1, 1, 'Bienvenida 10%',      'percent', 10, 1, 'membresias', '10% de descuento en cobros de membresía'),
(2, 1, 'Combo Suplementos $5','fixed',    5, 0, 'tienda',      '$5 de descuento en compras de tienda');

-- ─── ASISTENCIAS ──────────────────────────────────────────
TRUNCATE TABLE attendance;
INSERT INTO attendance (id, tenant_id, client_id, client_name, date, checkin, checkout, duration, status) VALUES
(1, 1, 1, 'Carlos Mendoza',  '2026-08-15', '06:45', '08:15', '1h 30min', 'verified'),
(2, 1, 2, 'María López',     '2026-08-15', '07:00', '08:30', '1h 30min', 'verified'),
(3, 1, 5, 'Diego Herrera',   '2026-08-15', '07:15', NULL,    NULL,       'pending'),
(4, 1, 8, 'Isabella Vargas', '2026-08-15', '08:00', NULL,    NULL,       'pending'),
(5, 1, 3, 'Andrés Torres',   '2026-08-14', '17:00', '18:45', '1h 45min', 'verified'),
(6, 1, 6, 'Valentina Cruz',  '2026-08-14', '06:30', '07:45', '1h 15min', 'verified');

-- ─── RUTINAS ──────────────────────────────────────────────
TRUNCATE TABLE routine_exercises;
TRUNCATE TABLE routines;
INSERT INTO routines (id, tenant_id, name, level, description) VALUES
(1, 1, 'Rutina de Fuerza Básica',   'Principiante', 'Ideal para quienes inician en el gimnasio. Enfoque en ejercicios compuestos.'),
(2, 1, 'Hipertrofia Upper/Lower',   'Intermedio',   'División upper/lower para ganar masa muscular.');

INSERT INTO routine_exercises (routine_id, description, sort_order) VALUES
(1, 'Sentadillas 4x12',          1),
(1, 'Press banca 4x10',          2),
(1, 'Peso muerto rumano 3x10',   3),
(1, 'Remo con barra 3x12',       4),
(2, 'Press inclinado 4x8',       1),
(2, 'Dominadas 4x8',             2),
(2, 'Curl bíceps 3x12',          3),
(2, 'Extensiones tríceps 3x12',  4),
(2, 'Sentadilla búlgara 3x10',   5);

SET FOREIGN_KEY_CHECKS = 1;

-- Resumen final
SELECT 'plans'      AS tabla, COUNT(*) AS registros FROM plans      UNION ALL
SELECT 'clients',            COUNT(*)               FROM clients     UNION ALL
SELECT 'products',           COUNT(*)               FROM products    UNION ALL
SELECT 'equipment',          COUNT(*)               FROM equipment   UNION ALL
SELECT 'payments',           COUNT(*)               FROM payments    UNION ALL
SELECT 'sales',              COUNT(*)               FROM sales       UNION ALL
SELECT 'sale_items',         COUNT(*)               FROM sale_items  UNION ALL
SELECT 'promotions',         COUNT(*)               FROM promotions  UNION ALL
SELECT 'attendance',         COUNT(*)               FROM attendance  UNION ALL
SELECT 'routines',           COUNT(*)               FROM routines;

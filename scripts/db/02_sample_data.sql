-- 02_sample_data.sql
-- Alto Rango SaaS Database Sample Data

-- 1. Insert Gyms (Tenants)
INSERT INTO gyms (name, address, phone, email) VALUES 
('Gimnasio Alto Rango Norte', 'Av. Norte 123', '555-0101', 'norte@altorango.com'),
('Gimnasio Alto Rango Sur', 'Av. Sur 456', '555-0202', 'sur@altorango.com');

-- 2. Insert Users
-- role_id: 1=Administrador, 2=Empleado/Encargado, 3=Usuario
INSERT INTO users (tenant_id, role_id, name, email, password) VALUES 
(1, 1, 'Admin Norte', 'admin_norte@altorango.com', '123456'),
(1, 2, 'Empleado Norte', 'empleado_norte@altorango.com', '123456'),
(1, 3, 'Usuario Norte', 'usuario_norte@altorango.com', '123456'),
(2, 1, 'Admin Sur', 'admin_sur@altorango.com', '123456'),
(2, 2, 'Empleado Sur', 'empleado_sur@altorango.com', '123456'),
(2, 3, 'Usuario Sur', 'usuario_sur@altorango.com', '123456');

-- 3. Insert Clients
INSERT INTO clients (tenant_id, personal_data, physical_data) VALUES 
(1, '{"name": "Juan Perez", "email": "juan@example.com", "phone": "555-1111"}', '{"weight": 75, "height": 1.75, "imc": 24.5}'),
(1, '{"name": "Maria Lopez", "email": "maria@example.com", "phone": "555-2222"}', '{"weight": 60, "height": 1.60, "imc": 23.4}'),
(2, '{"name": "Carlos Ruiz", "email": "carlos@example.com", "phone": "555-3333"}', '{"weight": 80, "height": 1.80, "imc": 24.7}'),
(2, '{"name": "Ana Diaz", "email": "ana@example.com", "phone": "555-4444"}', '{"weight": 65, "height": 1.65, "imc": 23.9}');

-- 4. Insert Plans
INSERT INTO plans (tenant_id, name, price, duration_days, features) VALUES
(1, 'Mensual', 30.00, 30, '["Acceso libre", "Uso de máquinas"]'),
(1, 'Pospago Tarjeta', 25.00, 30, '["30 Asistencias"]'),
(2, 'Mensual', 30.00, 30, '["Acceso libre", "Uso de máquinas"]'),
(2, 'Pospago Tarjeta', 25.00, 30, '["30 Asistencias"]');

-- 5. Insert Memberships
-- client 1 and 2 belong to gym 1, client 3 and 4 belong to gym 2
INSERT INTO memberships (tenant_id, client_id, plan_id, start_date, end_date, remaining_accesses) VALUES 
(1, 1, 1, '2026-01-01', '2026-12-31', NULL), -- Plan Mensual
(1, 2, 2, '2026-05-01', '2026-05-31', 30), -- Plan Pospago Tarjeta
(2, 3, 3, '2026-02-01', '2026-12-31', NULL), -- Plan Mensual
(2, 4, 4, '2026-06-01', '2026-08-31', 30); -- Plan Pospago Tarjeta

-- 6. Insert Promotions
INSERT INTO promotions (tenant_id, name, discount_percentage, start_date, end_date, is_active) VALUES
(1, 'Descuento Verano', 10.00, '2026-06-01', '2026-08-31', TRUE),
(2, 'Promo Nuevo Ingreso', 15.00, '2026-01-01', '2026-12-31', TRUE);

-- 7. Insert Trainers
INSERT INTO trainers (tenant_id, name, specialty) VALUES 
(1, 'Pedro Entrenador', 'CrossFit'),
(1, 'Sofia Entrenadora', 'Yoga'),
(2, 'Luis Entrenador', 'Pesas'),
(2, 'Carmen Entrenadora', 'Pilates');

-- 8. Insert Classes
INSERT INTO classes (tenant_id, trainer_id, name, schedule) VALUES 
(1, 1, 'CrossFit Mañana', '2026-07-01 08:00:00'),
(1, 2, 'Yoga Tarde', '2026-07-01 18:00:00'),
(2, 3, 'Pesas Intensivo', '2026-07-01 09:00:00'),
(2, 4, 'Pilates Basico', '2026-07-01 19:00:00');

-- 9. Insert Inventory (Products)
INSERT INTO inventory (tenant_id, name, category, stock, price, is_public) VALUES 
(1, 'Proteina Whey', 'Suplementos', 20, 45.00, TRUE),
(1, 'Agua Mineral Dasani', 'Bebidas', 100, 1.50, TRUE),
(1, 'Powerade', 'Bebidas', 50, 2.00, TRUE),
(2, 'Creatina', 'Suplementos', 30, 25.00, TRUE),
(2, 'Bebida Isotonica', 'Bebidas', 80, 2.50, TRUE);

-- 10. Insert Routines
INSERT INTO routines (tenant_id, name, description, difficulty) VALUES
(1, 'Rutina Pecho y Tríceps', '1. Press de banca 4x10\n2. Aperturas 3x12\n3. Tríceps polea 4x12', 'Intermedia'),
(2, 'Rutina Pierna Fuerte', '1. Sentadillas 4x10\n2. Prensa 4x12\n3. Curl femoral 3x15', 'Avanzada');

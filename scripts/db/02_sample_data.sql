-- 02_sample_data.sql
-- Alto Rango SaaS Database Sample Data

-- 1. Insert Gyms (Tenants)
INSERT INTO gyms (name, address, phone, email) VALUES 
('Gimnasio Alto Rango Norte', 'Av. Norte 123', '555-0101', 'norte@altorango.com'),
('Gimnasio Alto Rango Sur', 'Av. Sur 456', '555-0202', 'sur@altorango.com');

-- 2. Insert Users
-- role_id: 1=Super Admin, 2=Admin Gym, 3=Recepción, 4=Usuario
INSERT INTO users (tenant_id, role_id, name, email, password) VALUES 
(1, 2, 'Admin Norte', 'admin_norte@altorango.com', '123456'),
(1, 3, 'Recepcion Norte', 'recepcion_norte@altorango.com', '123456'),
(1, 4, 'Usuario Norte', 'usuario_norte@altorango.com', '123456'),
(2, 2, 'Admin Sur', 'admin_sur@altorango.com', '123456'),
(2, 3, 'Recepcion Sur', 'recepcion_sur@altorango.com', '123456'),
(2, 4, 'Usuario Sur', 'usuario_sur@altorango.com', '123456');

-- 3. Insert Clients
INSERT INTO clients (tenant_id, personal_data, physical_data) VALUES 
(1, '{"name": "Juan Perez", "email": "juan@example.com", "phone": "555-1111"}', '{"weight": 75, "height": 1.75, "imc": 24.5}'),
(1, '{"name": "Maria Lopez", "email": "maria@example.com", "phone": "555-2222"}', '{"weight": 60, "height": 1.60, "imc": 23.4}'),
(2, '{"name": "Carlos Ruiz", "email": "carlos@example.com", "phone": "555-3333"}', '{"weight": 80, "height": 1.80, "imc": 24.7}'),
(2, '{"name": "Ana Diaz", "email": "ana@example.com", "phone": "555-4444"}', '{"weight": 65, "height": 1.65, "imc": 23.9}');

-- 4. Insert Memberships
-- client 1 and 2 belong to gym 1, client 3 and 4 belong to gym 2
INSERT INTO memberships (tenant_id, client_id, plan_id, start_date, end_date) VALUES 
(1, 1, 1, '2023-01-01', '2023-12-31'), -- Annual Plan
(1, 2, 2, '2023-05-01', '2023-05-31'), -- Monthly Plan
(2, 3, 1, '2023-02-01', '2024-01-31'), -- Annual Plan
(2, 4, 3, '2023-06-01', '2023-08-31'); -- Quarterly Plan

-- 5. Insert Trainers
INSERT INTO trainers (tenant_id, name, specialty) VALUES 
(1, 'Pedro Entrenador', 'CrossFit'),
(1, 'Sofia Entrenadora', 'Yoga'),
(2, 'Luis Entrenador', 'Pesas'),
(2, 'Carmen Entrenadora', 'Pilates');

-- 6. Insert Classes
INSERT INTO classes (tenant_id, trainer_id, name, schedule) VALUES 
(1, 1, 'CrossFit Mañana', '2023-07-01 08:00:00'),
(1, 2, 'Yoga Tarde', '2023-07-01 18:00:00'),
(2, 3, 'Pesas Intensivo', '2023-07-01 09:00:00'),
(2, 4, 'Pilates Basico', '2023-07-01 19:00:00');

-- 7. Insert Inventory
INSERT INTO inventory (tenant_id, name, stock, price) VALUES 
(1, 'Proteina Whey', 20, 45.00),
(1, 'Agua Mineral', 100, 1.50),
(2, 'Camiseta Alto Rango', 50, 15.00),
(2, 'Bebida Isotonica', 80, 2.50);

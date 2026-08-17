-- ============================================================
-- 05_schema_extra.sql
-- Tablas adicionales para plans, products, equipment,
-- payments, sales, promotions, attendance, routines
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ─── PLANES DE MEMBRESÍA ──────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id    INT NOT NULL DEFAULT 1,
  name         VARCHAR(100) NOT NULL,
  type         VARCHAR(50)  NOT NULL,
  duration     INT          NOT NULL DEFAULT 30,   -- días
  price        DECIMAL(8,2) NOT NULL,
  limit_visits INT          DEFAULT NULL,           -- NULL = ilimitado
  features     JSON         NOT NULL DEFAULT (JSON_ARRAY()),
  color        VARCHAR(20)  DEFAULT '#3b82f6',
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── CLIENTES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id        INT          NOT NULL DEFAULT 1,
  name             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) DEFAULT NULL,
  phone            VARCHAR(30)  DEFAULT NULL,
  status           ENUM('active','expired','frozen','completed') NOT NULL DEFAULT 'active',
  plan             VARCHAR(100) DEFAULT NULL,
  plan_end         DATE         DEFAULT NULL,
  photo            VARCHAR(20)  DEFAULT '👤',
  weight           DECIMAL(5,1) DEFAULT NULL,
  height           INT          DEFAULT NULL,
  bmi              DECIMAL(4,1) DEFAULT NULL,
  join_date        DATE         NOT NULL DEFAULT (CURRENT_DATE),
  visits           INT          NOT NULL DEFAULT 0,
  visits_remaining INT          DEFAULT NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── PRODUCTOS / TIENDA ────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   INT          NOT NULL DEFAULT 1,
  name        VARCHAR(150) NOT NULL,
  category    VARCHAR(80)  NOT NULL,
  price       DECIMAL(8,2) NOT NULL,
  stock       INT          NOT NULL DEFAULT 0,
  emoji       VARCHAR(10)  DEFAULT '📦',
  description TEXT         DEFAULT NULL,
  rating      DECIMAL(3,1) DEFAULT 0,
  sold        INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── EQUIPAMIENTO ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS equipment (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id  INT          NOT NULL DEFAULT 1,
  name       VARCHAR(150) NOT NULL,
  type       VARCHAR(80)  DEFAULT NULL,
  quantity   INT          NOT NULL DEFAULT 1,
  status     ENUM('operativo','mantenimiento','baja') NOT NULL DEFAULT 'operativo',
  location   VARCHAR(150) DEFAULT NULL,
  notes      TEXT         DEFAULT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── PAGOS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   INT          NOT NULL DEFAULT 1,
  client_id   INT          DEFAULT NULL,
  client_name VARCHAR(255) NOT NULL,
  concept     VARCHAR(255) NOT NULL,
  amount      DECIMAL(8,2) NOT NULL,
  method      VARCHAR(50)  NOT NULL,
  discount    DECIMAL(8,2) NOT NULL DEFAULT 0,
  promo       VARCHAR(100) DEFAULT NULL,
  date        DATE         NOT NULL DEFAULT (CURRENT_DATE),
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── VENTAS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sales (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   INT          NOT NULL DEFAULT 1,
  client_name VARCHAR(255) NOT NULL,
  total       DECIMAL(8,2) NOT NULL,
  method      VARCHAR(50)  NOT NULL,
  date        DATE         NOT NULL DEFAULT (CURRENT_DATE),
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sale_items (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  sale_id  INT          NOT NULL,
  name     VARCHAR(150) NOT NULL,
  qty      INT          NOT NULL DEFAULT 1,
  price    DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── PROMOCIONES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   INT          NOT NULL DEFAULT 1,
  name        VARCHAR(150) NOT NULL,
  type        ENUM('percent','fixed') NOT NULL DEFAULT 'percent',
  value       DECIMAL(8,2) NOT NULL,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  applies_to  VARCHAR(80)  NOT NULL DEFAULT 'membresias',
  description TEXT         DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── ASISTENCIAS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   INT          NOT NULL DEFAULT 1,
  client_id   INT          DEFAULT NULL,
  client_name VARCHAR(255) NOT NULL,
  date        DATE         NOT NULL,
  checkin     VARCHAR(10)  NOT NULL,
  checkout    VARCHAR(10)  DEFAULT NULL,
  duration    VARCHAR(30)  DEFAULT NULL,
  status      ENUM('pending','verified','cancelled') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── RUTINAS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routines (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id   INT          NOT NULL DEFAULT 1,
  name        VARCHAR(150) NOT NULL,
  level       VARCHAR(50)  DEFAULT NULL,
  description TEXT         DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS routine_exercises (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  routine_id  INT          NOT NULL,
  description VARCHAR(255) NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Verificar
SELECT TABLE_NAME FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;

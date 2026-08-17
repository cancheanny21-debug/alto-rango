-- 06_alter_users_status.sql
-- El login (POST /api/auth/login) exige status = 'active' y actualiza last_login.
-- La tabla users original no tenía esas columnas, por eso el ingreso fallaba.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS status ENUM('active','inactive') NOT NULL DEFAULT 'active'
        COMMENT 'Estado de la cuenta. Solo usuarios active pueden iniciar sesión'
        AFTER profile_image_url;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS last_login DATETIME DEFAULT NULL
        COMMENT 'Último inicio de sesión'
        AFTER status;

UPDATE users SET status = 'active' WHERE status IS NULL OR status = '';

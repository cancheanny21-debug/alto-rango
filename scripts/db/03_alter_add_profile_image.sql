-- 03_alter_add_profile_image.sql
-- Migración: Agregar campo profile_image_url a la tabla users
-- Ejecutar sobre una BD existente (no recrea la tabla)
-- Fecha: 2026-08-17

-- Agrega la columna profile_image_url si aún no existe
-- La columna acepta una URL/ruta relativa o absoluta de la imagen de perfil
-- Máximo 512 caracteres para soportar URLs largas o rutas base64 cortas

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(512) DEFAULT NULL
        COMMENT 'Ruta o URL de la imagen de perfil del usuario. Puede ser relativa (/uploads/...) o absoluta (https://...)'
    AFTER password;

-- Verificar el resultado
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME   = 'users'
  AND COLUMN_NAME  = 'profile_image_url';

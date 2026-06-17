-- 008_admin_features.sql
-- Añade columna bloqueado en profiles: el admin puede bloquear el acceso de un usuario.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bloqueado boolean NOT NULL DEFAULT false;

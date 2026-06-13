-- ─────────────────────────────────────────────────────────────────────────────
-- 007_fix_mock_users.sql
--
-- Garantiza que los 3 perfiles demo existen con los UUIDs fijos del seed.
-- El seed (001) los insertó con ON CONFLICT DO NOTHING. Esta migración usa
-- ON CONFLICT (id) DO UPDATE para corregir cualquier dato desincronizado
-- y añade el perfil frutero y repartidor si por algún motivo no existen.
--
-- IMPORTANTE: si ya existe un perfil con el mismo telefono pero diferente UUID,
-- esta migración fallará por la restricción UNIQUE en telefono. En ese caso
-- hay que eliminar primero ese perfil duplicado manualmente.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO profiles (id, telefono, nombre, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', '600000001', 'Ana Frutería',  'frutero'),
  ('22222222-2222-2222-2222-222222222222', '600000002', 'Juan Mercado',  'proveedor'),
  ('33333333-3333-3333-3333-333333333333', '600000003', 'Pedro Reparto', 'repartidor')
ON CONFLICT (id) DO UPDATE SET
  telefono = EXCLUDED.telefono,
  nombre   = EXCLUDED.nombre,
  role     = EXCLUDED.role;

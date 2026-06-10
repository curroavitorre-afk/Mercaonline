-- ─── Migración 002: aprobación de proveedores ─────────────────────────────────
-- El campo `role` en profiles ya existe desde la migración inicial (001).
-- Esta migración añade el flujo de aprobación para los puestos de la lonja.

-- ─── Nuevos campos en proveedores ─────────────────────────────────────────────

ALTER TABLE proveedores
  ADD COLUMN IF NOT EXISTS estado_aprobacion TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado_aprobacion IN ('pendiente', 'aprobado', 'rechazado'));

ALTER TABLE proveedores
  ADD COLUMN IF NOT EXISTS aprobado_por UUID REFERENCES profiles(id);

-- ─── Datos de seed: aprobar los puestos de prueba ─────────────────────────────
-- Los proveedores del seed inicial se consideran ya aprobados.

UPDATE proveedores
  SET estado_aprobacion = 'aprobado'
  WHERE id IN (
    'aaaa0001-0000-0000-0000-000000000000',
    'aaaa0002-0000-0000-0000-000000000000',
    'aaaa0003-0000-0000-0000-000000000000'
  );

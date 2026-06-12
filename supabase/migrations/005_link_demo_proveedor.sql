-- ─────────────────────────────────────────────────────────────────────────────
-- 005_link_demo_proveedor.sql
--
-- Problema raíz:
--   El seed de 001 insertó 3 proveedores TODOS con
--   user_id = '22222222-2222-2222-2222-222222222222' (Juan Mercado, 600000002).
--   Cuando la app llama a getProveedorByUserId(), usa .single() que falla
--   si hay más de una fila — devuelve null y el panel proveedor queda vacío.
--
-- Solución en tres pasos:
--   1. Asegurar que "Frutas Macías Vera" existe y tiene el user_id del demo.
--   2. Reasignar los demás proveedores que todavía usen ese user_id a un
--      profile placeholder neutro (sin usuario real), para que .single() funcione.
--   3. Marcar el proveedor elegido como aprobado.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  v_demo_user_id   UUID := '22222222-2222-2222-2222-222222222222';
  v_placeholder_id UUID := '00000000-0000-0000-0000-000000000099';
  v_proveedor_id   UUID;
  v_count          INT;
BEGIN

  -- ── Paso 1: localizar o crear "Frutas Macías Vera" ─────────────────────────
  SELECT id INTO v_proveedor_id
  FROM proveedores
  WHERE nombre = 'Frutas Macías Vera'
  LIMIT 1;

  IF v_proveedor_id IS NOT NULL THEN
    -- El proveedor ya existe en el catálogo real → solo actualiza el vínculo
    UPDATE proveedores
    SET user_id           = v_demo_user_id,
        estado_aprobacion = 'aprobado',
        activo            = true
    WHERE id = v_proveedor_id;

    RAISE NOTICE '[005] Proveedor encontrado: % — user_id actualizado.', v_proveedor_id;

  ELSE
    -- No existe en el catálogo → créalo completo
    INSERT INTO proveedores (user_id, nombre, descripcion, activo, estado_aprobacion)
    VALUES (
      v_demo_user_id,
      'Frutas Macías Vera',
      'Frutas y cítricos de temporada. Puesto 14, nave A.',
      true,
      'aprobado'
    )
    RETURNING id INTO v_proveedor_id;

    RAISE NOTICE '[005] Proveedor creado: %.', v_proveedor_id;
  END IF;

  -- ── Paso 2: evitar filas duplicadas para este user_id ──────────────────────
  -- Si hay más proveedores apuntando al mismo user_id del demo,
  -- .single() seguirá fallando. Los reasignamos a un profile placeholder.
  SELECT COUNT(*) INTO v_count
  FROM proveedores
  WHERE user_id = v_demo_user_id
    AND id <> v_proveedor_id;

  IF v_count > 0 THEN
    -- Crea el profile placeholder si no existe todavía
    INSERT INTO profiles (id, telefono, nombre, role)
    VALUES (v_placeholder_id, '000000099', '_placeholder_proveedor', 'proveedor')
    ON CONFLICT (id) DO NOTHING;

    -- Reasigna los proveedores huérfanos al placeholder
    UPDATE proveedores
    SET user_id = v_placeholder_id
    WHERE user_id = v_demo_user_id
      AND id <> v_proveedor_id;

    RAISE NOTICE '[005] % proveedor(es) adicional(es) reasignados al placeholder.', v_count;
  END IF;

  RAISE NOTICE '[005] Listo. El usuario demo (600000002) queda vinculado a id: %.', v_proveedor_id;

END $$;

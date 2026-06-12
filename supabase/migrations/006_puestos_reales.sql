-- ─────────────────────────────────────────────────────────────────────────────
-- 006_puestos_reales.sql
--
-- Reemplaza los 3 proveedores del seed inicial (Frutas García, Verduras
-- Hermanos López, Finca El Olivo) con los 6 puestos reales de Mercagranada.
-- Inserta los 30 productos reales (5 por puesto).
--
-- Orden de operaciones para respetar las FK sin CASCADE:
--   1. Placeholder profile para proveedores sin cuenta de usuario
--   2. Eliminar order_lines del seed que referencian proveedores/productos antiguos
--   3. Eliminar el pedido de prueba si queda sin líneas
--   4. Eliminar los 3 proveedores del seed (productos caen en cascada)
--   5. Limpiar posibles duplicados de Frutas Macías Vera creados por migración 005
--   6. Insertar los 6 puestos reales con UUIDs fijos
--   7. Insertar los 30 productos reales con UUIDs fijos
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. Placeholder para proveedores sin cuenta ────────────────────────────────
-- Los 5 puestos sin usuario real apuntan a este profile neutro.

INSERT INTO profiles (id, telefono, nombre, role)
VALUES ('00000000-0000-0000-0000-000000000099', '000000099', '_placeholder_proveedor', 'proveedor')
ON CONFLICT (id) DO NOTHING;


-- ── 2. Eliminar order_lines del seed antiguo ──────────────────────────────────
-- Borramos las líneas que apunten a los 3 proveedores del seed o a sus productos.

DELETE FROM order_lines
WHERE proveedor_id IN (
  'aaaa0001-0000-0000-0000-000000000000',
  'aaaa0002-0000-0000-0000-000000000000',
  'aaaa0003-0000-0000-0000-000000000000'
)
OR producto_id IN (
  SELECT id FROM productos
  WHERE proveedor_id IN (
    'aaaa0001-0000-0000-0000-000000000000',
    'aaaa0002-0000-0000-0000-000000000000',
    'aaaa0003-0000-0000-0000-000000000000'
  )
);


-- ── 3. Eliminar el pedido de prueba del seed si ya no tiene líneas ────────────

DELETE FROM orders
WHERE id = 'cccc0001-0000-0000-0000-000000000000'
  AND NOT EXISTS (
    SELECT 1 FROM order_lines
    WHERE order_id = 'cccc0001-0000-0000-0000-000000000000'
  );


-- ── 4. Eliminar los 3 proveedores del seed (productos caen en cascada) ─────────

DELETE FROM proveedores
WHERE id IN (
  'aaaa0001-0000-0000-0000-000000000000',
  'aaaa0002-0000-0000-0000-000000000000',
  'aaaa0003-0000-0000-0000-000000000000'
);


-- ── 5. Limpiar posibles duplicados de Frutas Macías Vera (migración 005) ───────
-- La migración 005 pudo crear 'Frutas Macías Vera' con un UUID auto-generado.
-- Eliminamos ese registro para insertar después con UUID fijo.

DELETE FROM order_lines
WHERE proveedor_id IN (
  SELECT id FROM proveedores
  WHERE nombre = 'Frutas Macías Vera'
    AND id <> 'aa000001-0000-0000-0000-000000000001'
);

DELETE FROM proveedores
WHERE nombre = 'Frutas Macías Vera'
  AND id <> 'aa000001-0000-0000-0000-000000000001';


-- ── 6. Insertar los 6 puestos reales ──────────────────────────────────────────
-- UUIDs fijos para que el frontend pueda referirse a ellos de forma estable.
-- Frutas Macías Vera usa el user_id del usuario demo proveedor (Juan Mercado).
-- Los otros 5 usan el placeholder.

INSERT INTO proveedores (id, user_id, nombre, descripcion, imagen_url, activo, estado_aprobacion)
VALUES
  (
    'aa000001-0000-0000-0000-000000000001',
    '22222222-2222-2222-2222-222222222222',
    'Frutas Macías Vera',
    'Frutas y verduras variadas, cítricos y tropicales. Puestos 117, 137',
    'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/frutas_macias_vera2.jpg',
    true, 'aprobado'
  ),
  (
    'aa000002-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000099',
    'Frutas Martín Mariscal',
    'Fruta de temporada nacional. Puestos 113-116',
    'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/frutas_martin_mariscal2.jpg',
    true, 'aprobado'
  ),
  (
    'aa000003-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000099',
    'Gallegos e Hijos',
    'Verdura de hoja y hortalizas. Puestos 111, 131-133',
    'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/gallegos_e_hijos2.jpg',
    true, 'aprobado'
  ),
  (
    'aa000004-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000099',
    'Importpatata',
    'Patata, cebolla y tubérculos. Puestos 105-107',
    'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/importpatata2.jpg',
    true, 'aprobado'
  ),
  (
    'aa000005-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000099',
    'Frutas del Pino',
    'Plátano de Canarias y fruta tropical. Puesto 139',
    'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/frutas_del_pino2.jpg',
    true, 'aprobado'
  ),
  (
    'aa000006-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000099',
    'Hortifrut Granada',
    'Producto local de la Vega de Granada. Puestos 101, 120, 228-230',
    'https://xxxpwpigllobofzvyfaq.supabase.co/storage/v1/object/public/puestos/hortifrut_granada2.jpg',
    true, 'aprobado'
  )
ON CONFLICT (id) DO UPDATE SET
  user_id           = EXCLUDED.user_id,
  nombre            = EXCLUDED.nombre,
  descripcion       = EXCLUDED.descripcion,
  imagen_url        = EXCLUDED.imagen_url,
  activo            = EXCLUDED.activo,
  estado_aprobacion = EXCLUDED.estado_aprobacion;


-- ── 7. Insertar los 30 productos reales ───────────────────────────────────────

INSERT INTO productos (id, proveedor_id, nombre, precio, unidad, stock_disponible, activo)
VALUES

  -- Frutas Macías Vera (aa000001)
  ('bb010001-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000001', 'Naranjas Valencia',    0.45, 'kg',     500, true),
  ('bb010002-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000001', 'Limones',              0.55, 'kg',     300, true),
  ('bb010003-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000001', 'Mandarinas',           0.65, 'kg',     400, true),
  ('bb010004-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000001', 'Aguacates',            1.80, 'kg',     150, true),
  ('bb010005-0000-0000-0000-000000000000', 'aa000001-0000-0000-0000-000000000001', 'Mangos',               1.50, 'kg',     100, true),

  -- Frutas Martín Mariscal (aa000002)
  ('bb020001-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000002', 'Fresas Huelva',        1.20, 'kg',     200, true),
  ('bb020002-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000002', 'Melocotones',          0.90, 'kg',     300, true),
  ('bb020003-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000002', 'Nectarinas',           0.85, 'kg',     250, true),
  ('bb020004-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000002', 'Ciruelas',             0.95, 'kg',     180, true),
  ('bb020005-0000-0000-0000-000000000000', 'aa000002-0000-0000-0000-000000000002', 'Cerezas',              3.50, 'kg',      80, true),

  -- Gallegos e Hijos (aa000003)
  ('bb030001-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000003', 'Tomates rama',         0.70, 'kg',     600, true),
  ('bb030002-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000003', 'Pimientos rojos',      0.65, 'kg',     400, true),
  ('bb030003-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000003', 'Pepinos',              0.40, 'kg',     350, true),
  ('bb030004-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000003', 'Lechugas',             0.45, 'unidad', 300, true),
  ('bb030005-0000-0000-0000-000000000000', 'aa000003-0000-0000-0000-000000000003', 'Judías verdes',        1.10, 'kg',     200, true),

  -- Importpatata (aa000004)
  ('bb040001-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000004', 'Patata blanca',        0.35, 'kg',    1000, true),
  ('bb040002-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000004', 'Patata nueva',         0.55, 'kg',     800, true),
  ('bb040003-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000004', 'Cebolla',              0.30, 'kg',     900, true),
  ('bb040004-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000004', 'Ajo morado',           2.50, 'kg',     200, true),
  ('bb040005-0000-0000-0000-000000000000', 'aa000004-0000-0000-0000-000000000004', 'Boniato',              0.60, 'kg',     400, true),

  -- Frutas del Pino (aa000005)
  ('bb050001-0000-0000-0000-000000000000', 'aa000005-0000-0000-0000-000000000005', 'Plátanos Canarias',    0.85, 'kg',     500, true),
  ('bb050002-0000-0000-0000-000000000000', 'aa000005-0000-0000-0000-000000000005', 'Piñas',                0.95, 'unidad', 150, true),
  ('bb050003-0000-0000-0000-000000000000', 'aa000005-0000-0000-0000-000000000005', 'Papayas',              1.20, 'kg',     100, true),
  ('bb050004-0000-0000-0000-000000000000', 'aa000005-0000-0000-0000-000000000005', 'Cocos',                1.50, 'unidad',  80, true),
  ('bb050005-0000-0000-0000-000000000000', 'aa000005-0000-0000-0000-000000000005', 'Kiwis',                1.10, 'kg',     200, true),

  -- Hortifrut Granada (aa000006)
  ('bb060001-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000006', 'Calabacín',            0.45, 'kg',     400, true),
  ('bb060002-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000006', 'Berenjena',            0.55, 'kg',     300, true),
  ('bb060003-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000006', 'Pimiento verde',       0.50, 'kg',     500, true),
  ('bb060004-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000006', 'Habas',                1.80, 'kg',     150, true),
  ('bb060005-0000-0000-0000-000000000000', 'aa000006-0000-0000-0000-000000000006', 'Espárragos trigueros', 2.20, 'kg',     100, true)

ON CONFLICT (id) DO UPDATE SET
  nombre           = EXCLUDED.nombre,
  precio           = EXCLUDED.precio,
  unidad           = EXCLUDED.unidad,
  stock_disponible = EXCLUDED.stock_disponible,
  activo           = EXCLUDED.activo;

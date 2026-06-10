-- ─── Tablas ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono   TEXT        UNIQUE NOT NULL,
  nombre     TEXT        NOT NULL,
  role       TEXT        NOT NULL CHECK (role IN ('frutero', 'proveedor', 'repartidor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proveedores (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  nombre      TEXT        NOT NULL,
  descripcion TEXT        NOT NULL DEFAULT '',
  imagen_url  TEXT,
  activo      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS productos (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  proveedor_id     UUID         NOT NULL REFERENCES proveedores(id) ON DELETE CASCADE,
  nombre           TEXT         NOT NULL,
  descripcion      TEXT,
  precio           NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
  unidad           TEXT         NOT NULL CHECK (unidad IN ('kg', 'unidad', 'bandeja', 'caja', 'manojos')),
  stock_disponible INTEGER      NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
  imagen_url       TEXT,
  activo           BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  frutero_id            UUID         NOT NULL REFERENCES profiles(id),
  repartidor_id         UUID         REFERENCES profiles(id),
  estado                TEXT         NOT NULL DEFAULT 'confirmado'
                                     CHECK (estado IN ('confirmado','en_recogida','recogido','en_reparto','entregado','incidencia')),
  tarifa_servicio       NUMERIC(10,2) NOT NULL DEFAULT 5.00,
  total                 NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  notas                 TEXT,
  fecha_entrega_estimada TIMESTAMPTZ,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_lines (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  producto_id     UUID         NOT NULL REFERENCES productos(id),
  proveedor_id    UUID         NOT NULL REFERENCES proveedores(id),
  nombre_producto TEXT         NOT NULL,
  cantidad        NUMERIC(10,3) NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal        NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- ─── Trigger: updated_at automático en orders ─────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Políticas abiertas temporales mientras no hay Supabase Auth integrado.
-- Cuando se active el login OTP, reemplazar por políticas basadas en auth.uid().

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON profiles    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON proveedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON productos   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON orders      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON order_lines FOR ALL USING (true) WITH CHECK (true);

-- ─── Seed: datos de prueba ────────────────────────────────────────────────────

INSERT INTO profiles (id, telefono, nombre, role) VALUES
  ('11111111-1111-1111-1111-111111111111', '600000001', 'Ana Frutería', 'frutero'),
  ('22222222-2222-2222-2222-222222222222', '600000002', 'Juan Mercado',  'proveedor'),
  ('33333333-3333-3333-3333-333333333333', '600000003', 'Pedro Reparto', 'repartidor')
ON CONFLICT (id) DO NOTHING;

INSERT INTO proveedores (id, user_id, nombre, descripcion) VALUES
  ('aaaa0001-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Frutas García',           'Especialistas en cítricos y frutas tropicales'),
  ('aaaa0002-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Verduras Hermanos López', 'Hortalizas frescas de temporada'),
  ('aaaa0003-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Finca El Olivo',          'Fruta de hueso y pepita de producción propia')
ON CONFLICT (id) DO NOTHING;

INSERT INTO productos (id, proveedor_id, nombre, precio, unidad, stock_disponible) VALUES
  ('bbbb0001-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Naranjas Valencia', 0.80, 'kg',     200),
  ('bbbb0002-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Limones',           1.20, 'kg',     100),
  ('bbbb0003-0000-0000-0000-000000000000', 'aaaa0002-0000-0000-0000-000000000000', 'Tomates rama',      1.50, 'kg',     150),
  ('bbbb0004-0000-0000-0000-000000000000', 'aaaa0002-0000-0000-0000-000000000000', 'Lechuga romana',    0.90, 'unidad',  80),
  ('bbbb0005-0000-0000-0000-000000000000', 'aaaa0003-0000-0000-0000-000000000000', 'Melocotones',       2.10, 'kg',      60)
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, frutero_id, estado, tarifa_servicio, total) VALUES
  ('cccc0001-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'entregado', 5.00, 75.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_lines (order_id, producto_id, proveedor_id, nombre_producto, cantidad, precio_unitario, subtotal) VALUES
  ('cccc0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Naranjas Valencia', 50, 0.80, 40.00),
  ('cccc0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'aaaa0002-0000-0000-0000-000000000000', 'Tomates rama',      20, 1.50, 30.00)
ON CONFLICT DO NOTHING;

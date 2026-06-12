-- Tabla de configuración global (singleton: id siempre = 1)
CREATE TABLE configuracion (
  id         INTEGER      PRIMARY KEY CHECK (id = 1),
  fase       TEXT         NOT NULL DEFAULT 'fase0' CHECK (fase IN ('fase0', 'fase2')),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_configuracion_updated_at
  BEFORE UPDATE ON configuracion
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO configuracion (id, fase) VALUES (1, 'fase0');

ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_configuracion" ON configuracion
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Conversaciones entre un frutero y un proveedor (único par)
create table if not exists conversaciones (
  id            uuid        primary key default gen_random_uuid(),
  frutero_id    uuid        not null references profiles(id),
  proveedor_id  uuid        not null references proveedores(id),
  created_at    timestamptz not null default now(),
  unique(frutero_id, proveedor_id)
);

-- Mensajes dentro de una conversación
create table if not exists mensajes (
  id               uuid        primary key default gen_random_uuid(),
  conversacion_id  uuid        not null references conversaciones(id) on delete cascade,
  remitente_id     uuid        not null references profiles(id),
  remitente_role   text        not null check (remitente_role in ('frutero', 'proveedor', 'sistema')),
  contenido        text        not null,
  leido            boolean     not null default false,
  created_at       timestamptz not null default now()
);

-- Índices para consultas frecuentes
create index if not exists mensajes_conversacion_idx on mensajes(conversacion_id, created_at);
create index if not exists conversaciones_frutero_idx on conversaciones(frutero_id);
create index if not exists conversaciones_proveedor_idx on conversaciones(proveedor_id);

-- RLS abierta para desarrollo
alter table conversaciones enable row level security;
alter table mensajes enable row level security;

create policy "dev_conversaciones_all" on conversaciones for all using (true) with check (true);
create policy "dev_mensajes_all"       on mensajes       for all using (true) with check (true);

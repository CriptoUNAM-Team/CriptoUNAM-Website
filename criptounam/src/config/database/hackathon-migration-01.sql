-- ============================================================================
-- Hackathon UNAM — Migración 01: solicitudes de ingreso, seguridad y Storage
-- ----------------------------------------------------------------------------
-- Ejecutar UNA VEZ en el SQL Editor de Supabase, DESPUÉS de hackathon-schema.sql.
-- Qué hace:
--   1. Crea hackathon_join_requests (flujo solicitud → aprobación del líder).
--   2. Cierra el RLS abierto de hackathon_notifications (cualquiera podía
--      leer/insertar/aceptar solicitudes de todos los equipos).
--   3. Quita la lectura pública de hackathon_answers (exponía author_email);
--      las respuestas se sirven vía /api/hackathon/questions sin ese campo.
--   4. Crea el bucket público 'hackathon' para logos/portadas de proyectos.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Solicitudes de ingreso a equipos
--    El aspirante postula; el líder acepta o rechaza desde su panel.
--    Sin policies de anon: todas las operaciones pasan por las Vercel
--    Functions (service role) que validan el token de Privy.
-- ---------------------------------------------------------------------------
create table if not exists hackathon_join_requests (
  id             uuid primary key default gen_random_uuid(),
  team_id        uuid not null references hackathon_teams(id) on delete cascade,
  participant_id uuid not null references hackathon_participants(id) on delete cascade,
  role           varchar(60),
  message        text,
  status         varchar(20) not null default 'pending', -- pending | accepted | rejected | cancelled
  resolved_at    timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists idx_join_requests_team on hackathon_join_requests(team_id);
create index if not exists idx_join_requests_participant on hackathon_join_requests(participant_id);
-- Máximo una solicitud pendiente por persona/equipo.
create unique index if not exists uq_join_request_pending
  on hackathon_join_requests(team_id, participant_id)
  where status = 'pending';

alter table hackathon_join_requests enable row level security;
-- (sin policies → cerrada a la anon key; solo service role)

-- ---------------------------------------------------------------------------
-- 2. Cerrar hackathon_notifications (tabla legacy del flujo anterior).
--    Tenía insert/update/select públicos: cualquier visitante podía ver y
--    "aceptar" solicitudes ajenas. El flujo real ahora vive en join_requests.
-- ---------------------------------------------------------------------------
drop policy if exists "public read notifications"   on hackathon_notifications;
drop policy if exists "public insert notifications" on hackathon_notifications;
drop policy if exists "public update notifications" on hackathon_notifications;

-- ---------------------------------------------------------------------------
-- 3. Proteger el email de quien responde dudas.
--    RLS no oculta columnas: la única forma de no exponer author_email a la
--    anon key es cerrar el select directo. El endpoint público de preguntas
--    ya devuelve las respuestas con campos seguros.
-- ---------------------------------------------------------------------------
drop policy if exists "public read answers" on hackathon_answers;

-- ---------------------------------------------------------------------------
-- 4. Storage: bucket público para imágenes de proyectos (logo / portada).
--    La escritura se hace con signed upload URLs emitidas por
--    /api/hackathon/upload (service role); la lectura es pública.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hackathon',
  'hackathon',
  true,
  5242880, -- 5 MB por archivo
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "hackathon public read" on storage.objects;
create policy "hackathon public read" on storage.objects
  for select using (bucket_id = 'hackathon');

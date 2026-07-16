-- ============================================================================
-- Hackathon UNAM — Esquema de base de datos (Supabase / Postgres)
-- ----------------------------------------------------------------------------
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
-- Todas las escrituras pasan por las Vercel Functions (service role), que
-- verifican el access token de Privy. Las policies de RLS solo abren LECTURA
-- pública de lo que debe ser público (hackathons, tracks, proyectos enviados,
-- equipos que buscan miembros, dudas). El resto queda cerrado a la anon key.
-- ============================================================================

-- Extensión para gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Hackathons (soporta múltiples ediciones)
-- ---------------------------------------------------------------------------
create table if not exists hackathons (
  id          uuid primary key default gen_random_uuid(),
  slug        varchar(120) unique not null,
  name        varchar(255) not null,
  description text,
  location    varchar(255),
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      varchar(30) not null default 'upcoming', -- upcoming | open | judging | closed
  config      jsonb not null default '{}'::jsonb,       -- premios, reglas, cronograma, criterios
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Tracks
-- ---------------------------------------------------------------------------
create table if not exists hackathon_tracks (
  id           uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references hackathons(id) on delete cascade,
  name         varchar(160) not null,
  description  text,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists idx_tracks_hackathon on hackathon_tracks(hackathon_id);

-- ---------------------------------------------------------------------------
-- 3. Participantes (inscritos) — 1 fila por usuario Privy por hackathon
-- ---------------------------------------------------------------------------
create table if not exists hackathon_participants (
  id             uuid primary key default gen_random_uuid(),
  hackathon_id   uuid not null references hackathons(id) on delete cascade,
  privy_id       varchar(255) not null,
  email          varchar(320),
  wallet_address varchar(66),
  full_name      varchar(255) not null,
  bio            text,
  skills         text[] not null default '{}',
  socials        jsonb not null default '{}'::jsonb, -- { github, x, linkedin, telegram, discord }
  experience     varchar(40),                        -- beginner | intermediate | advanced
  looking_for_team boolean not null default true,
  status         varchar(30) not null default 'registered', -- registered | checked_in | disqualified
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (hackathon_id, privy_id)
);
create index if not exists idx_participants_hackathon on hackathon_participants(hackathon_id);
create index if not exists idx_participants_privy on hackathon_participants(privy_id);

-- ---------------------------------------------------------------------------
-- 4. Equipos
-- ---------------------------------------------------------------------------
create table if not exists hackathon_teams (
  id                  uuid primary key default gen_random_uuid(),
  hackathon_id        uuid not null references hackathons(id) on delete cascade,
  name                varchar(160) not null,
  description         text,
  track_id            uuid references hackathon_tracks(id) on delete set null,
  leader_participant_id uuid not null references hackathon_participants(id) on delete cascade,
  invite_code         varchar(12) unique not null,
  looking_for_members boolean not null default true,
  needed_skills       text[] not null default '{}',
  max_members         int not null default 5,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (hackathon_id, name)
);
create index if not exists idx_teams_hackathon on hackathon_teams(hackathon_id);

-- ---------------------------------------------------------------------------
-- 5. Miembros de equipo
-- ---------------------------------------------------------------------------
create table if not exists hackathon_team_members (
  team_id        uuid not null references hackathon_teams(id) on delete cascade,
  participant_id uuid not null references hackathon_participants(id) on delete cascade,
  role           varchar(60),
  status         varchar(20) not null default 'member', -- member | pending | invited
  joined_at      timestamptz not null default now(),
  primary key (team_id, participant_id)
);
create index if not exists idx_team_members_participant on hackathon_team_members(participant_id);

-- ---------------------------------------------------------------------------
-- 6. Proyectos (1 por equipo)
-- ---------------------------------------------------------------------------
create table if not exists hackathon_projects (
  id           uuid primary key default gen_random_uuid(),
  hackathon_id uuid not null references hackathons(id) on delete cascade,
  team_id      uuid not null references hackathon_teams(id) on delete cascade,
  track_id     uuid references hackathon_tracks(id) on delete set null,
  title        varchar(255) not null,
  tagline      varchar(280),
  description  text,
  repo_url     varchar(500),
  demo_url     varchar(500),
  video_url    varchar(500),
  slides_url   varchar(500),
  cover_url    varchar(500),
  tags         text[] not null default '{}',
  status       varchar(20) not null default 'draft', -- draft | submitted
  submitted_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (team_id)
);
create index if not exists idx_projects_hackathon on hackathon_projects(hackathon_id);
create index if not exists idx_projects_status on hackathon_projects(status);

-- ---------------------------------------------------------------------------
-- 7. Dudas (Q&A) y respuestas
-- ---------------------------------------------------------------------------
create table if not exists hackathon_questions (
  id             uuid primary key default gen_random_uuid(),
  hackathon_id   uuid not null references hackathons(id) on delete cascade,
  participant_id uuid references hackathon_participants(id) on delete set null,
  author_name    varchar(255),
  title          varchar(280) not null,
  body           text not null,
  category       varchar(60) not null default 'general', -- general | tecnico | reglas | logistica
  is_answered    boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists idx_questions_hackathon on hackathon_questions(hackathon_id);

create table if not exists hackathon_answers (
  id                   uuid primary key default gen_random_uuid(),
  question_id          uuid not null references hackathon_questions(id) on delete cascade,
  participant_id       uuid references hackathon_participants(id) on delete set null,
  author_name          varchar(255),
  author_email         varchar(320),
  body                 text not null,
  is_official          boolean not null default false, -- respuesta de organizador
  created_at           timestamptz not null default now()
);
create index if not exists idx_answers_question on hackathon_answers(question_id);

-- ---------------------------------------------------------------------------
-- 8. Calificaciones (jurado)
-- ---------------------------------------------------------------------------
create table if not exists hackathon_scores (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references hackathon_projects(id) on delete cascade,
  judge_email varchar(320) not null,
  criteria    jsonb not null default '{}'::jsonb, -- { innovacion: 8, ejecucion: 7, impacto: 9, ... }
  total       numeric(6,2) not null default 0,
  feedback    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (project_id, judge_email)
);
create index if not exists idx_scores_project on hackathon_scores(project_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table hackathons              enable row level security;
alter table hackathon_tracks        enable row level security;
alter table hackathon_participants  enable row level security;
alter table hackathon_teams         enable row level security;
alter table hackathon_team_members  enable row level security;
alter table hackathon_projects      enable row level security;
alter table hackathon_questions     enable row level security;
alter table hackathon_answers       enable row level security;
alter table hackathon_scores        enable row level security;

-- Lectura pública (anon): info del hackathon y contenido público.
-- NOTA: en Supabase el service role bypassa RLS, así que las Functions escriben
-- sin restricción. Estas policies solo controlan la anon key del front.
drop policy if exists "public read hackathons" on hackathons;
create policy "public read hackathons" on hackathons for select using (true);

drop policy if exists "public read tracks" on hackathon_tracks;
create policy "public read tracks" on hackathon_tracks for select using (true);

-- Equipos: se pueden listar (para explorar y unirse).
drop policy if exists "public read teams" on hackathon_teams;
create policy "public read teams" on hackathon_teams for select using (true);

drop policy if exists "public read team members" on hackathon_team_members;
create policy "public read team members" on hackathon_team_members for select using (true);

-- Proyectos: solo los enviados son públicos.
drop policy if exists "public read submitted projects" on hackathon_projects;
create policy "public read submitted projects" on hackathon_projects
  for select using (status = 'submitted');

-- Dudas y respuestas: públicas (foro abierto).
drop policy if exists "public read questions" on hackathon_questions;
create policy "public read questions" on hackathon_questions for select using (true);

drop policy if exists "public read answers" on hackathon_answers;
create policy "public read answers" on hackathon_answers for select using (true);

-- Participantes y scores NO tienen policy de lectura anon → cerrados salvo
-- vía service role (Functions con verificación de Privy / gating de admin).

-- ---------------------------------------------------------------------------
-- Seed: Hackathon UNAM 2026 (Semana DIE) + tracks
-- ---------------------------------------------------------------------------
insert into hackathons (slug, name, description, location, starts_at, ends_at, status, config)
values (
  'hackathon-unam-2026',
  'Hackathon UNAM 2026',
  'Hackathon organizado por CriptoUNAM y la Facultad de Ingeniería en el marco de la Semana DIE. Construye soluciones en AI, Blockchain o de impacto social y ambiental.',
  'Facultad de Ingeniería, UNAM · Ciudad de México',
  '2026-09-21T09:00:00-06:00',
  '2026-09-24T20:00:00-06:00',
  'upcoming',
  jsonb_build_object(
    'organizers', jsonb_build_array('CriptoUNAM', 'Facultad de Ingeniería UNAM'),
    'event', 'Semana DIE',
    'judging_criteria', jsonb_build_array('Innovación', 'Ejecución técnica', 'Impacto', 'Presentación')
  )
)
on conflict (slug) do nothing;

insert into hackathon_tracks (hackathon_id, name, description, sort_order)
select h.id, t.name, t.description, t.sort_order
from hackathons h
cross join (values
  ('AI & Blockchain', 'Proyectos que combinen inteligencia artificial y/o tecnología blockchain: agentes, DeFi, ZK, on-chain AI, infraestructura Web3.', 1),
  ('Track Libre', 'Construye libre: soluciona problemas sociales y ambientales, o crea algo original. Cualquier stack, máxima creatividad.', 2)
) as t(name, description, sort_order)
where h.slug = 'hackathon-unam-2026'
  and not exists (
    select 1 from hackathon_tracks x where x.hackathon_id = h.id and x.name = t.name
  );

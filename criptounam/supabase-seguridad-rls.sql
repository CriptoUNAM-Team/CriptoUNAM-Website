-- ============================================================================
-- CriptoUNAM — Endurecimiento de seguridad de Supabase
-- ----------------------------------------------------------------------------
-- Ejecutar en el SQL Editor de Supabase (una sola vez, entero).
--
-- QUÉ ARREGLA
-- -----------
-- `supabase-schema-unico.sql` dejó todas las policies como `USING (true)`, y
-- varias como `FOR ALL`. Como la anon key viaja dentro del bundle de JavaScript,
-- eso equivalía a publicar la base de datos entera:
--
--   * se podían descargar los correos de suscriptores, los registros de
--     comunidad (nombre, carrera, número de cuenta), las wallets conectadas y
--     las inscripciones a cursos con nombre y correo;
--   * se podía escribir en `curso_progreso`, que es justo lo que
--     `api/courses/auto-certificate` consulta para decidir si acuña el
--     certificado NFT y entrega la recompensa en PUMA;
--   * se podían borrar cursos, eventos y likes, o inflar `perfiles_puntos`.
--
-- A partir de aquí la anon key solo puede:
--   * LEER lo que es público de verdad (cursos, eventos, newsletters, likes y
--     el contenido público del hackathon);
--   * INSERTAR en los tres formularios abiertos (suscripción, registro de
--     comunidad y registro de wallet conectada), sin poder leer lo insertado.
--
-- Todo lo demás pasa por las Vercel Functions de `api/`, que usan el service
-- role (bypassa RLS) después de verificar el token de Privy.
--
-- ORDEN DE APLICACIÓN — IMPORTANTE
-- --------------------------------
--   1. Arreglar el Root Directory del proyecto de Vercel (ver
--      docs/PLATAFORMA_HACKATHON_DESPLIEGUE.md) y comprobar que `/api/...` responde 401 y no 404.
--   2. Ejecutar ESTE archivo.
-- Si se ejecuta antes de tener la API viva, el progreso de cursos y los likes
-- dejan de guardarse (el front ya no escribe directo).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Rate limiting compartido (lo usa api/_lib/ratelimit.ts)
-- ---------------------------------------------------------------------------
-- Contador global por cubo: las funciones serverless no comparten memoria, así
-- que un límite en memoria solo frena ráfagas dentro de la misma instancia.

create table if not exists public.api_rate_limits (
  bucket       text primary key,
  hits         integer not null default 0,
  window_start timestamptz not null default now()
);

alter table public.api_rate_limits enable row level security;
-- Sin policies: nadie con anon key la toca. El service role bypassa RLS.

create or replace function public.check_rate_limit(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now  timestamptz := now();
  v_hits integer;
begin
  insert into public.api_rate_limits as l (bucket, hits, window_start)
  values (p_bucket, 1, v_now)
  on conflict (bucket) do update
    set hits = case
          when l.window_start < v_now - make_interval(secs => p_window_seconds) then 1
          else l.hits + 1
        end,
        window_start = case
          when l.window_start < v_now - make_interval(secs => p_window_seconds) then v_now
          else l.window_start
        end
  returning l.hits into v_hits;

  -- Limpieza oportunista: 1 de cada 100 llamadas barre los cubos viejos para
  -- que la tabla no crezca sin fin. Más barato que un cron.
  if random() < 0.01 then
    delete from public.api_rate_limits
     where window_start < v_now - interval '1 day';
  end if;

  return v_hits <= p_limit;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public;
revoke all on function public.check_rate_limit(text, integer, integer) from anon;
revoke all on function public.check_rate_limit(text, integer, integer) from authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

-- ---------------------------------------------------------------------------
-- 1. Fuera las policies permisivas del esquema anterior
-- ---------------------------------------------------------------------------
drop policy if exists "newsletters_select"        on public.newsletters;
drop policy if exists "likes_select"              on public.likes;
drop policy if exists "likes_insert"              on public.likes;
drop policy if exists "likes_delete"              on public.likes;
drop policy if exists "email_subscriptions_all"   on public.email_subscriptions;
drop policy if exists "suscripciones_select"      on public.suscripciones_newsletter;
drop policy if exists "suscripciones_insert"      on public.suscripciones_newsletter;
drop policy if exists "puma_select"               on public.puma_users;
drop policy if exists "puma_insert"               on public.puma_users;
drop policy if exists "puma_update"               on public.puma_users;
drop policy if exists "puma_tx_all"               on public.puma_transactions;
drop policy if exists "cursos_select"             on public.cursos;
drop policy if exists "cursos_all"                on public.cursos;
drop policy if exists "eventos_select"            on public.eventos;
drop policy if exists "eventos_all"               on public.eventos;
drop policy if exists "registros_select"          on public.registros_comunidad;
drop policy if exists "registros_insert"          on public.registros_comunidad;
drop policy if exists "wallets_select"            on public.wallets_conectadas;
drop policy if exists "wallets_insert"            on public.wallets_conectadas;
drop policy if exists "curso_inscripciones_all"   on public.curso_inscripciones;
drop policy if exists "curso_progreso_all"        on public.curso_progreso;
drop policy if exists "perfiles_puntos_all"       on public.perfiles_puntos;

-- ---------------------------------------------------------------------------
-- 2. RLS activado en todo (incluye tablas creadas fuera del esquema base)
-- ---------------------------------------------------------------------------
create table if not exists public.curso_certificados (
  id             uuid primary key default gen_random_uuid(),
  wallet_address varchar(255) not null,
  curso_id       varchar(50)  not null,
  badge_ref      varchar(255) not null,
  token_id       numeric,
  tx_hash        text,
  claimed_at     timestamptz not null default now(),
  unique (wallet_address, badge_ref)
);

alter table public.newsletters              enable row level security;
alter table public.likes                    enable row level security;
alter table public.email_subscriptions      enable row level security;
alter table public.suscripciones_newsletter enable row level security;
alter table public.puma_users               enable row level security;
alter table public.puma_transactions        enable row level security;
alter table public.cursos                   enable row level security;
alter table public.eventos                  enable row level security;
alter table public.registros_comunidad      enable row level security;
alter table public.wallets_conectadas       enable row level security;
alter table public.curso_inscripciones      enable row level security;
alter table public.curso_progreso           enable row level security;
alter table public.perfiles_puntos          enable row level security;
alter table public.curso_certificados       enable row level security;

-- ---------------------------------------------------------------------------
-- 3. Lectura pública: solo contenido, nunca datos personales
-- ---------------------------------------------------------------------------
create policy "lectura publica newsletters" on public.newsletters
  for select to anon, authenticated using (true);

create policy "lectura publica cursos" on public.cursos
  for select to anon, authenticated using (true);

create policy "lectura publica eventos" on public.eventos
  for select to anon, authenticated using (true);

-- Los likes se cuentan desde el navegador; escribirlos pasa por /api/likes.
create policy "lectura publica likes" on public.likes
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- 4. Formularios abiertos: insertar sí, leer no
-- ---------------------------------------------------------------------------
-- Alta de newsletter (Footer), registro de comunidad y registro de la wallet
-- recién conectada. Se puede escribir sin sesión —son formularios públicos—
-- pero el listado solo sale por /api/admin/lists, con correo de organizador.

create policy "alta publica suscripciones" on public.suscripciones_newsletter
  for insert to anon, authenticated with check (true);

create policy "alta publica registros comunidad" on public.registros_comunidad
  for insert to anon, authenticated with check (true);

create policy "alta publica wallets conectadas" on public.wallets_conectadas
  for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------------
-- 5. Cerradas por completo a la anon key
-- ---------------------------------------------------------------------------
-- Sin ninguna policy, RLS niega todo salvo al service role:
--   email_subscriptions   — la usa un backend Express que no está desplegado
--   puma_users / puma_transactions — saldo off-chain heredado, sin uso en el UI
--   curso_inscripciones   — nombre y correo del alumno
--   curso_progreso        — base del certificado NFT y de la recompensa PUMA
--   perfiles_puntos       — puntos del perfil
--   curso_certificados    — certificados emitidos

-- ---------------------------------------------------------------------------
-- 6. Hackathon: quitar la escritura pública de notificaciones
-- ---------------------------------------------------------------------------
-- Estaban abiertas "para permitir solicitudes de ingreso en tiempo real", pero
-- ningún componente las usa: hoy solo servían para que cualquiera escribiera.
drop policy if exists "public insert notifications" on public.hackathon_notifications;
drop policy if exists "public update notifications" on public.hackathon_notifications;

-- ---------------------------------------------------------------------------
-- 7. Likes: la columna no coincidía con los identificadores reales
-- ---------------------------------------------------------------------------
-- `newsletter_id` era UUID con clave foránea a `newsletters`, pero las entradas
-- viven en `src/data/newsletterData.ts` con ids tipo 'intro-blockchain-2024'.
-- Cada inserción fallaba, así que el botón de like nunca guardó nada (la tabla
-- está vacía). Se pasa a texto y se quita la FK.
alter table public.likes drop constraint if exists fk_likes_newsletter;
alter table public.likes alter column newsletter_id type text using newsletter_id::text;

-- ---------------------------------------------------------------------------
-- 8. Datos del hackathon activo: Goya Hack
-- ---------------------------------------------------------------------------
-- La fila decía "Hackathon UNAM 2026" del 21 al 24 de septiembre, mientras el
-- sitio anuncia Goya Hack del 22 al 26 (ver src/data/hackathonInfo.ts).
update public.hackathons
   set name       = 'Goya Hack · Hackathon UNAM 2026',
       starts_at  = '2026-09-22T11:00:00-06:00',
       ends_at    = '2026-09-26T20:00:00-06:00',
       status     = 'open',
       updated_at = now()
 where slug = 'hackathon-unam-2026';

-- ---------------------------------------------------------------------------
-- 9. Comprobación
-- ---------------------------------------------------------------------------
-- Debe listar exactamente las policies de arriba: lectura en newsletters,
-- cursos, eventos y likes; inserción en los tres formularios; nada más en el
-- resto de tablas del sitio.
select tablename, policyname, cmd
  from pg_policies
 where schemaname = 'public'
 order by tablename, policyname;

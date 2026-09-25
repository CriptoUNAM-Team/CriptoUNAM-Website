-- Varios tracks por equipo y por proyecto.
-- No borra equipos ni proyectos: copia el track actual a track_ids
-- y deja track_id como el primero (las lecturas viejas siguen funcionando).
-- Ejecutar en el SQL Editor del proyecto del hackathon.

alter table public.hackathon_teams
  add column if not exists track_ids uuid[] not null default '{}';

alter table public.hackathon_projects
  add column if not exists track_ids uuid[] not null default '{}';

update public.hackathon_teams
set track_ids = array[track_id]
where track_id is not null
  and cardinality(track_ids) = 0;

update public.hackathon_projects
set track_ids = array[track_id]
where track_id is not null
  and cardinality(track_ids) = 0;

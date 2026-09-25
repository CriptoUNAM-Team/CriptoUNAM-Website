-- Sponsors elegidos, aparte del track.
-- No borra ni reescribe equipos o proyectos: la columna nueva arranca vacía.
-- Ejecutar en el SQL Editor del proyecto del hackathon.

alter table public.hackathon_teams
  add column if not exists sponsor_ids text[] not null default '{}';

alter table public.hackathon_projects
  add column if not exists sponsor_ids text[] not null default '{}';

-- Enlace de la pieza de Contenido (Instagram o TikTok).
-- No borra ni reescribe proyectos: la columna nueva arranca vacía.
-- Ejecutar en el SQL Editor del proyecto del hackathon.

alter table public.hackathon_projects
  add column if not exists content_url varchar(500);

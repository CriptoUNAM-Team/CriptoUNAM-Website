-- Tracks oficiales GOYA HACK: AI · Blockchain · Contenido
-- Seguro con equipos/proyectos ya registrados:
--   • Solo toca la tabla hackathon_tracks del hackathon slug `hackathon-unam-2026`.
--   • No borra equipos, miembros, proyectos ni otras tablas.
--   • Renombra Innovación → Contenido EN EL MISMO UUID: las FKs de
--     hackathon_teams.track_id / hackathon_projects.track_id siguen válidas.
-- Ejecutar en Supabase SQL Editor del proyecto del hackathon.

-- 1) Renombrar Innovación → Contenido (mismo id, no rompe FKs).
update public.hackathon_tracks t
set
  name = 'Contenido',
  description =
    'Narrativa, educación, media y productos creativos para la UNAM y la Semana DIE. Cualquier stack. Premios Tangem en USD.',
  sort_order = 3
from public.hackathons h
where t.hackathon_id = h.id
  and h.slug = 'hackathon-unam-2026'
  and t.name in ('Innovación', 'Innovacion');

-- 2) Insertar tracks faltantes (solo si no existen; no duplica).
insert into public.hackathon_tracks (hackathon_id, name, description, sort_order)
select h.id, v.name, v.description, v.sort_order
from public.hackathons h
cross join (values
  (
    'AI',
    'Inteligencia artificial aplicada: agentes, LLMs, copilots, pipelines y productos que resuelvan un problema concreto. Bolsa en $PUMA patrocinada por CriptoUNAM.',
    1
  ),
  (
    'Blockchain',
    'Web3 y contratos inteligentes: DeFi, identidad, infraestructura y aplicaciones descentralizadas. Tres retos: Stellar, Avalanche y Pollar.',
    2
  ),
  (
    'Contenido',
    'Narrativa, educación, media y productos creativos para la UNAM y la Semana DIE. Cualquier stack. Premios Tangem en USD.',
    3
  )
) as v(name, description, sort_order)
where h.slug = 'hackathon-unam-2026'
  and not exists (
    select 1 from public.hackathon_tracks x
    where x.hackathon_id = h.id and x.name = v.name
  );

-- 3) Actualizar solo description/sort_order de AI, Blockchain y Contenido.
update public.hackathon_tracks t
set
  description = v.description,
  sort_order = v.sort_order
from public.hackathons h,
(values
  (
    'AI',
    'Inteligencia artificial aplicada: agentes, LLMs, copilots, pipelines y productos que resuelvan un problema concreto. Bolsa en $PUMA patrocinada por CriptoUNAM.',
    1
  ),
  (
    'Blockchain',
    'Web3 y contratos inteligentes: DeFi, identidad, infraestructura y aplicaciones descentralizadas. Tres retos: Stellar, Avalanche y Pollar.',
    2
  ),
  (
    'Contenido',
    'Narrativa, educación, media y productos creativos para la UNAM y la Semana DIE. Cualquier stack. Premios Tangem en USD.',
    3
  )
) as v(name, description, sort_order)
where t.hackathon_id = h.id
  and h.slug = 'hackathon-unam-2026'
  and t.name = v.name;

-- Nota: no hay DELETE. Tracks viejos sin usar se pueden limpiar a mano después.

-- Renombra / resemilla tracks: AI · Blockchain · Innovación
-- Ejecutar en Supabase SQL Editor (edición hackathon-unam-2026).

-- 1) Quitar tracks viejos sin proyectos referenciados (track_id queda NULL por FK).
delete from hackathon_tracks t
using hackathons h
where t.hackathon_id = h.id
  and h.slug = 'hackathon-unam-2026'
  and t.name not in ('AI', 'Blockchain', 'Innovación')
  and not exists (
    select 1 from hackathon_projects p where p.track_id = t.id
  )
  and not exists (
    select 1 from hackathon_teams tm where tm.track_id = t.id
  );

-- 2) Insertar los tres tracks oficiales si faltan.
insert into hackathon_tracks (hackathon_id, name, description, sort_order)
select h.id, t.name, t.description, t.sort_order
from hackathons h
cross join (values
  (
    'AI',
    'Inteligencia artificial aplicada: agentes, LLMs, copilots, pipelines y productos que resuelvan un problema concreto.',
    1
  ),
  (
    'Blockchain',
    'Web3 y contratos inteligentes: DeFi, identidad, infraestructura, Avalanche y aplicaciones descentralizadas.',
    2
  ),
  (
    'Innovación',
    'Productos originales, impacto social o ambiental, y soluciones creativas para la UNAM y la Semana DIE. Cualquier stack.',
    3
  )
) as t(name, description, sort_order)
where h.slug = 'hackathon-unam-2026'
  and not exists (
    select 1 from hackathon_tracks x
    where x.hackathon_id = h.id and x.name = t.name
  );

-- 3) Alinear nombres/descripciones si ya existían filas con esos nombres.
update hackathon_tracks t
set
  description = v.description,
  sort_order = v.sort_order
from hackathons h,
(values
  ('AI', 'Inteligencia artificial aplicada: agentes, LLMs, copilots, pipelines y productos que resuelvan un problema concreto.', 1),
  ('Blockchain', 'Web3 y contratos inteligentes: DeFi, identidad, infraestructura, Avalanche y aplicaciones descentralizadas.', 2),
  ('Innovación', 'Productos originales, impacto social o ambiental, y soluciones creativas para la UNAM y la Semana DIE. Cualquier stack.', 3)
) as v(name, description, sort_order)
where t.hackathon_id = h.id
  and h.slug = 'hackathon-unam-2026'
  and t.name = v.name;

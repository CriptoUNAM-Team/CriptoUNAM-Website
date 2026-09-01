-- Alinea las fechas de la fila viva con el programa por sedes del sitio.
-- Ejecutar en Supabase SQL Editor (edición hackathon-unam-2026).
--
-- La semilla de hackathon-schema.sql dejó '2026-09-21 → 2026-09-24' y va con
-- `on conflict (slug) do nothing`, así que volver a correrla no arregla nada:
-- la fila viva sigue con esas fechas mientras el sitio anuncia del 22 al 26.
--
-- Fechas correctas, las mismas que `HACKATHON_INFO` en
-- criptounam/src/data/hackathonInfo.ts:
--   arranque : mar 22 sep 10:00 (inauguración en el Auditorio)
--   entregas : vie 25 sep 17:00 (cierran el CIA y la oficina M)
--   fin      : sáb 26 sep 20:00 (tras la clausura en el Auditorio)

update hackathons
set starts_at = '2026-09-22T10:00:00-06:00',
    ends_at   = '2026-09-26T20:00:00-06:00',
    location  = 'Centro de Ingeniería Avanzada (CIA), Facultad de Ingeniería, UNAM · Ciudad de México',
    config    = coalesce(config, '{}'::jsonb) || jsonb_build_object(
      'submissions_close_at', '2026-09-25T17:00:00-06:00',
      'venues', jsonb_build_array('CIA', 'Auditorio', 'PC Puma M / PC Puma I', 'Oficina M')
    )
where slug = 'hackathon-unam-2026';

-- Comprobación.
select slug, starts_at, ends_at, location, config -> 'submissions_close_at' as cierre
from hackathons
where slug = 'hackathon-unam-2026';

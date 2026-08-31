# Sistema de puntos (Issue #10)

## Reglas

- **10 puntos** por cada lección/sección completada.
- **50 puntos** bonus al completar el 100% de un curso (todas las lecciones).

Los puntos se guardan en Supabase (`perfiles_puntos`) y se muestran en el perfil del usuario.

## Constantes

En `src/services/progresoCurso.service.ts`:

- `PUNTOS_POR_LECCION = 10`
- `PUNTOS_CURSO_COMPLETO = 50`

Exportadas como `PUNTOS.POR_LECCION` y `PUNTOS.CURSO_COMPLETO`.

## Cálculo

- Se suman puntos solo cuando se **marca por primera vez** una lección como completada (no se duplican si el usuario vuelve a marcar).
- El bonus de curso completo se suma **una vez** cuando el usuario completa la última lección del curso.

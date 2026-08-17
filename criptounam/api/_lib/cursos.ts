/**
 * Catálogo de cursos visto desde el servidor.
 *
 * Reutiliza el mismo `cursosData` que renderiza el front (son datos puros, sin
 * nada de navegador) para que el backend no tenga que creerse lo que el cliente
 * dice sobre cuántas lecciones tiene un curso.
 */
import { cursosData, getLeccionesFlat, cursoBadgeRef } from '../../src/constants/cursosData'

export { cursoBadgeRef }

/** Número real de lecciones de un curso. 0 si el curso no existe. */
export function totalLeccionesDeCurso(cursoId: string): number {
  const curso = cursosData.find((c) => String(c.id) === String(cursoId))
  if (!curso) return 0
  return getLeccionesFlat(curso).length
}

/** Cohorte declarada en el catálogo (default "v1"), no la que mande el cliente. */
export function cohorteDeCurso(cursoId: string): string {
  const curso = cursosData.find((c) => String(c.id) === String(cursoId))
  return (curso?.cohorteRef && curso.cohorteRef.trim()) || 'v1'
}

/** True si el curso existe en el catálogo. */
export function cursoExiste(cursoId: string): boolean {
  return cursosData.some((c) => String(c.id) === String(cursoId))
}

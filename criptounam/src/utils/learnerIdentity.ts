/**
 * Identidad del alumno para inscripciones y progreso de cursos.
 *
 * Antes todo se llavaba con la dirección de wallet, lo que obligaba a conectar
 * wallet + firmar un mensaje solo para inscribirse (fricción innecesaria: la firma
 * nunca se verificaba en el backend). Ahora la identidad puede ser:
 *   - la wallet conectada (si la hay), o
 *   - un id derivado del email (`email:<correo>`) para inscripción sin wallet.
 *
 * La columna `wallet_address` en Supabase es VARCHAR(255) sin validación de formato,
 * así que un id basado en email cabe sin cambios de esquema.
 */

const STORAGE_KEY = 'criptounam.learnerId'

/** Convierte un correo en un id estable de alumno. */
export function emailToLearnerId(email: string): string {
  return `email:${email.trim().toLowerCase()}`
}

/** Lee el id de alumno persistido (para usuarios que se inscribieron con email). */
export function getStoredLearnerId(): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
  } catch {
    return null
  }
}

/** Persiste el id de alumno para que el progreso sobreviva a refrescos. */
export function setStoredLearnerId(id: string): void {
  try {
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* localStorage no disponible: seguimos sin persistir */
  }
}

/**
 * Resuelve la identidad activa del alumno.
 * Prioridad: wallet conectada > id basado en email guardado localmente.
 */
export function resolveLearnerId(walletAddress?: string | null): string | null {
  if (walletAddress) return walletAddress.toLowerCase()
  return getStoredLearnerId()
}

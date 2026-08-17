/**
 * Servicio de progreso de cursos (Issues #9 y #10)
 * Tablas: curso_inscripciones, curso_progreso, perfiles_puntos, curso_certificados
 *
 * Todo pasa por `/api/courses/progress` con el token de Privy. Antes se escribía
 * y se leía directo desde el navegador con la anon key: las inscripciones traen
 * nombre y correo (quedaban públicos), y el progreso es lo que `auto-certificate`
 * usa para decidir si acuña el certificado NFT y entrega PUMA, así que quien
 * pudiera escribirlo podía regalarse certificados.
 *
 * Las funciones conservan su firma: reciben `walletAddress` y el servidor
 * comprueba que esa wallet esté enlazada a la cuenta de Privy que llama.
 */

import { apiFetch } from './apiClient'

const PUNTOS_POR_LECCION = 10
const PUNTOS_CURSO_COMPLETO = 50

export interface InscripcionCurso {
  wallet_address: string
  curso_id: string
  inscrito_en: string
  nombre_completo?: string
  email?: string
}

export interface ProgresoLeccionRow {
  wallet_address: string
  curso_id: string
  leccion_index: number
  completado_en: string
}

export interface PerfilPuntos {
  wallet_address: string
  puntos: number
  updated_at: string
}

export interface InscripcionResumen {
  curso_id: string
  inscrito_en: string
  nombre_completo?: string | null
  email?: string | null
  lecciones_completadas: number[]
}

export interface CertificadoCurso {
  wallet_address: string
  curso_id: string
  badge_ref: string
  token_id?: string | null
  tx_hash?: string | null
  claimed_at: string
}

interface ResumenAlumno {
  inscripciones: InscripcionResumen[]
  progreso: Record<string, number[]>
  puntos: number
  certificados: CertificadoCurso[]
}

const RESUMEN_VACIO: ResumenAlumno = {
  inscripciones: [],
  progreso: {},
  puntos: 0,
  certificados: [],
}

/**
 * Caché corta del resumen por wallet.
 *
 * Las pantallas de cursos y perfil piden varias cosas seguidas (inscripciones,
 * progreso, puntos, certificados) y todas salen de la misma respuesta: sin esto
 * una sola vista dispararía cuatro o cinco peticiones idénticas.
 */
const TTL_MS = 15_000
const cache = new Map<string, { at: number; datos: Promise<ResumenAlumno> }>()

function invalidar(wallet: string) {
  cache.delete(wallet.toLowerCase())
}

async function pedirResumen(wallet: string): Promise<ResumenAlumno> {
  try {
    const datos = await apiFetch<ResumenAlumno>('/courses/progress', {
      query: { wallet },
    })
    return {
      inscripciones: datos.inscripciones ?? [],
      progreso: datos.progreso ?? {},
      puntos: datos.puntos ?? 0,
      certificados: datos.certificados ?? [],
    }
  } catch (error) {
    console.error('Error obteniendo el progreso del alumno:', error)
    return RESUMEN_VACIO
  }
}

function obtenerResumen(walletAddress: string): Promise<ResumenAlumno> {
  const wallet = (walletAddress || '').toLowerCase()
  if (!wallet) return Promise.resolve(RESUMEN_VACIO)

  const cacheado = cache.get(wallet)
  if (cacheado && Date.now() - cacheado.at < TTL_MS) return cacheado.datos

  const datos = pedirResumen(wallet)
  cache.set(wallet, { at: Date.now(), datos })
  return datos
}

/** Registrar inscripción a un curso (tras firma) */
export async function inscripcionCurso(params: {
  walletAddress: string
  cursoId: string
  nombre?: string
  email?: string
}): Promise<boolean> {
  try {
    await apiFetch('/courses/progress', {
      method: 'POST',
      body: {
        action: 'enroll',
        wallet: params.walletAddress.toLowerCase(),
        curso_id: params.cursoId,
        nombre: params.nombre ?? null,
        email: params.email ?? null,
      },
    })
    invalidar(params.walletAddress)
    return true
  } catch (error) {
    console.error('Error guardando inscripción:', error)
    return false
  }
}

/** Perfil del usuario reutilizable: última inscripción con nombre/email. */
export async function obtenerPerfilUsuario(
  walletAddress: string
): Promise<{ nombre: string; email: string } | null> {
  const { inscripciones } = await obtenerResumen(walletAddress)
  for (const row of inscripciones) {
    const nombre = (row.nombre_completo || '').trim()
    const email = (row.email || '').trim()
    if (nombre || email) return { nombre, email }
  }
  return null
}

/** Verificar si el usuario está inscrito en un curso */
export async function estaInscrito(walletAddress: string, cursoId: string): Promise<boolean> {
  const { inscripciones } = await obtenerResumen(walletAddress)
  return inscripciones.some((i) => String(i.curso_id) === String(cursoId))
}

/** Obtener índices de lecciones completadas para un curso */
export async function obtenerProgresoCurso(
  walletAddress: string,
  cursoId: string
): Promise<number[]> {
  const { progreso } = await obtenerResumen(walletAddress)
  return progreso[String(cursoId)] ?? []
}

/** Devuelve todas las inscripciones del usuario con sus lecciones completadas. */
export async function obtenerInscripcionesUsuario(
  walletAddress: string
): Promise<InscripcionResumen[]> {
  const { inscripciones } = await obtenerResumen(walletAddress)
  return inscripciones
}

/** Marcar lección como completada y actualizar puntos */
export async function marcarLeccionCompletada(params: {
  walletAddress: string
  cursoId: string
  leccionIndex: number
  totalLecciones: number
}): Promise<boolean> {
  try {
    await apiFetch('/courses/progress', {
      method: 'POST',
      body: {
        action: 'complete_lesson',
        wallet: params.walletAddress.toLowerCase(),
        curso_id: params.cursoId,
        leccion_index: params.leccionIndex,
      },
    })
    invalidar(params.walletAddress)
    return true
  } catch (error) {
    console.error('Error guardando progreso:', error)
    return false
  }
}

/** Obtener puntos de un usuario (para perfil) */
export async function obtenerPuntos(walletAddress: string): Promise<number> {
  const { puntos } = await obtenerResumen(walletAddress)
  return puntos
}

/**
 * Recalcular puntos desde el progreso.
 *
 * El cálculo vive en el servidor (`api/courses/progress.ts`), que cuenta las
 * lecciones del catálogo real: el curso completo suma solo si están todas.
 */
export async function recalcularPuntos(walletAddress: string): Promise<number> {
  try {
    const { puntos } = await apiFetch<{ puntos: number }>('/courses/progress', {
      method: 'POST',
      body: { action: 'recalc', wallet: walletAddress.toLowerCase() },
    })
    invalidar(walletAddress)
    return puntos ?? 0
  } catch (error) {
    console.error('Error recalculando puntos:', error)
    return 0
  }
}

export const PUNTOS = {
  POR_LECCION: PUNTOS_POR_LECCION,
  CURSO_COMPLETO: PUNTOS_CURSO_COMPLETO
}

/* ======================================================================
   Certificados NFT (CriptoUNAMBadges, kind=CourseCompletion)

   La tabla `curso_certificados` la escribe el servidor al acuñar
   (`api/courses/auto-certificate.ts`). Aquí solo se consulta.
   ====================================================================== */

/** Verifica si el alumno completó el 100% de las lecciones de un curso. */
export async function cursoCompletado(
  walletAddress: string,
  cursoId: string,
  totalLecciones: number
): Promise<boolean> {
  if (totalLecciones <= 0) return false
  const completadas = await obtenerProgresoCurso(walletAddress, cursoId)
  return new Set(completadas).size >= totalLecciones
}

/** Registra que el certificado fue emitido (idempotente por wallet+badge_ref). */
export async function registrarCertificadoEmitido(params: {
  walletAddress: string
  cursoId: string
  badgeRef: string
  tokenId?: string
  txHash?: string
}): Promise<boolean> {
  try {
    await apiFetch('/courses/progress', {
      method: 'POST',
      body: {
        action: 'register_certificate',
        wallet: params.walletAddress.toLowerCase(),
        curso_id: params.cursoId,
        token_id: params.tokenId ?? null,
        tx_hash: params.txHash ?? null,
      },
    })
    invalidar(params.walletAddress)
    return true
  } catch (error) {
    console.warn('No se pudo registrar el certificado:', error)
    return false
  }
}

/** Devuelve el certificado registrado si existe (null si no se ha reclamado). */
export async function obtenerCertificadoCurso(
  walletAddress: string,
  badgeRef: string
): Promise<CertificadoCurso | null> {
  const { certificados } = await obtenerResumen(walletAddress)
  return certificados.find((c) => c.badge_ref === badgeRef) ?? null
}

/** Lista todos los certificados registrados para una wallet (para el perfil). */
export async function obtenerCertificadosUsuario(
  walletAddress: string
): Promise<CertificadoCurso[]> {
  const { certificados } = await obtenerResumen(walletAddress)
  return certificados
}

/** Fuerza que la próxima lectura vuelva a pedir datos al servidor. */
export function invalidarCacheProgreso(walletAddress: string) {
  invalidar(walletAddress)
}

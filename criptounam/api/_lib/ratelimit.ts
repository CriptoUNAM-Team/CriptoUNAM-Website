/**
 * Rate limiting para las Vercel Functions.
 *
 * Dos capas, porque ninguna basta sola:
 *
 *  1. Memoria del lambda — gratis e inmediata, pero cada instancia tiene su
 *     propio contador y Vercel levanta varias, así que solo frena ráfagas.
 *  2. Postgres (Supabase) — contador global compartido por todas las
 *     instancias. Cuesta un roundtrip, así que se consulta después de la capa
 *     de memoria y solo si esta deja pasar.
 *
 * Si la función SQL todavía no está instalada (`supabase-seguridad-rls.sql`),
 * el limitador global falla en abierto y deja actuar al de memoria: preferimos
 * un sitio que funciona con menos protección a un 500 en cada request.
 */
import { getSupabaseAdmin } from './supabase'
import { HttpError, clientIp } from './http'

export type RateLimitOpts = {
  /** Etiqueta de la ruta, para que cada endpoint tenga su propio cubo. */
  name: string
  /** Peticiones permitidas dentro de la ventana. */
  limit: number
  /** Tamaño de la ventana en segundos. */
  windowSeconds: number
  /** Identidad adicional (privyId, wallet…). Por defecto solo la IP. */
  subject?: string
}

type MemoryEntry = { hits: number; resetAt: number }
const memory = new Map<string, MemoryEntry>()

function memoryAllows(bucket: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now()
  const entry = memory.get(bucket)

  if (!entry || entry.resetAt <= now) {
    memory.set(bucket, { hits: 1, resetAt: now + windowSeconds * 1000 })
    // Limpieza barata: el Map vive en la instancia y no debe crecer sin fin.
    if (memory.size > 5000) {
      for (const [key, value] of memory) {
        if (value.resetAt <= now) memory.delete(key)
      }
    }
    return true
  }

  entry.hits += 1
  return entry.hits <= limit
}

async function postgresAllows(
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const { data, error } = await getSupabaseAdmin().rpc('check_rate_limit', {
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      console.warn('rate limit global no disponible:', error.message)
      return true
    }
    return data !== false
  } catch (err) {
    console.warn('rate limit global falló:', err)
    return true
  }
}

/**
 * Aplica el límite y lanza 429 si se excede. Llamar al principio del handler,
 * antes de cualquier trabajo caro (verificar el token con Privy, leer la BD,
 * firmar on-chain).
 */
export async function enforceRateLimit(req: any, opts: RateLimitOpts): Promise<void> {
  const subject = opts.subject ? `${opts.subject}` : clientIp(req)
  const bucket = `${opts.name}:${subject}`

  if (!memoryAllows(bucket, opts.limit, opts.windowSeconds)) {
    throw new HttpError(429, 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.')
  }

  if (!(await postgresAllows(bucket, opts.limit, opts.windowSeconds))) {
    throw new HttpError(429, 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.')
  }
}

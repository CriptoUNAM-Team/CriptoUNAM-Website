/**
 * /api/courses/progress — inscripciones, progreso, puntos y certificados.
 *
 *  GET  ?wallet=0x…                    → resumen completo del alumno   [auth]
 *  POST { action: 'enroll' }           → inscribirse a un curso        [auth]
 *  POST { action: 'complete_lesson' }  → marcar lección completada     [auth]
 *  POST { action: 'recalc' }           → recalcular puntos             [auth]
 *  POST { action: 'register_certificate' } → registrar claim on-chain  [auth]
 *
 * Por qué existe: estas cuatro tablas se escribían desde el navegador con la
 * anon key y policies `USING (true)`, así que cualquiera podía leer los datos
 * personales de las inscripciones (nombre y correo), inventarse progreso ajeno
 * y —lo peor— fabricar el progreso que `auto-certificate` usa para decidir si
 * acuña el NFT y suelta la recompensa en PUMA. Ahora las policies no aceptan
 * escrituras con la anon key y todo pasa por aquí, con token de Privy.
 *
 * Env: PRIVY_APP_ID, PRIVY_APP_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { authenticate, assertWalletOwned, type AuthedUser } from '../_lib/privy'
import { getSupabaseAdmin } from '../_lib/supabase'
import { enforceRateLimit } from '../_lib/ratelimit'
import { setCors, sendError, readBody, HttpError } from '../_lib/http'
import { totalLeccionesDeCurso, cursoExiste, cursoBadgeRef, cohorteDeCurso } from '../_lib/cursos'

const PUNTOS_POR_LECCION = 10
const PUNTOS_CURSO_COMPLETO = 50

/** Recorta y normaliza texto libre que acaba en la BD. */
function texto(valor: unknown, max: number): string | null {
  if (valor == null) return null
  const limpio = String(valor).trim().slice(0, max)
  return limpio || null
}

function email(valor: unknown): string | null {
  const limpio = texto(valor, 254)
  if (!limpio) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio) ? limpio : null
}

/** Wallet del body/query, verificada contra las wallets enlazadas en Privy. */
function walletDe(user: AuthedUser, valor: unknown): string {
  const wallet = String(valor || '').trim().toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    throw new HttpError(400, 'wallet inválida')
  }
  assertWalletOwned(user, wallet)
  return wallet
}

function cursoDe(valor: unknown): string {
  const cursoId = String(valor || '').trim()
  if (!cursoId || !cursoExiste(cursoId)) {
    throw new HttpError(400, 'Curso desconocido')
  }
  return cursoId
}

/**
 * Recalcula los puntos desde el progreso guardado, en vez de sumar sobre lo que
 * ya había: así el total no depende del orden ni del número de llamadas, y no
 * se puede inflar repitiendo peticiones.
 */
async function recalcularPuntos(wallet: string): Promise<number> {
  const supabase = getSupabaseAdmin()
  const { data: rows, error } = await supabase
    .from('curso_progreso')
    .select('curso_id, leccion_index')
    .eq('wallet_address', wallet)
  if (error) throw error

  const porCurso: Record<string, Set<number>> = {}
  for (const row of rows || []) {
    const curso = String(row.curso_id)
    if (!porCurso[curso]) porCurso[curso] = new Set()
    porCurso[curso].add(row.leccion_index)
  }

  let total = 0
  for (const [cursoId, indices] of Object.entries(porCurso)) {
    total += indices.size * PUNTOS_POR_LECCION
    const requeridas = totalLeccionesDeCurso(cursoId)
    if (requeridas > 0 && indices.size >= requeridas) total += PUNTOS_CURSO_COMPLETO
  }

  const { error: errPuntos } = await supabase.from('perfiles_puntos').upsert(
    { wallet_address: wallet, puntos: total, updated_at: new Date().toISOString() },
    { onConflict: 'wallet_address' }
  )
  if (errPuntos) throw errPuntos

  return total
}

/** Todo lo que el front necesita de una wallet, en una sola llamada. */
async function resumen(wallet: string) {
  const supabase = getSupabaseAdmin()

  const [inscripciones, progreso, puntos, certificados] = await Promise.all([
    supabase
      .from('curso_inscripciones')
      .select('curso_id, inscrito_en, nombre_completo, email')
      .eq('wallet_address', wallet)
      .order('inscrito_en', { ascending: false }),
    supabase.from('curso_progreso').select('curso_id, leccion_index').eq('wallet_address', wallet),
    supabase.from('perfiles_puntos').select('puntos').eq('wallet_address', wallet).maybeSingle(),
    supabase
      .from('curso_certificados')
      .select('wallet_address, curso_id, badge_ref, token_id, tx_hash, claimed_at')
      .eq('wallet_address', wallet)
      .order('claimed_at', { ascending: false }),
  ])

  if (inscripciones.error) throw inscripciones.error
  if (progreso.error) throw progreso.error

  const porCurso: Record<string, number[]> = {}
  for (const row of progreso.data || []) {
    const curso = String(row.curso_id)
    if (!porCurso[curso]) porCurso[curso] = []
    porCurso[curso].push(row.leccion_index)
  }
  for (const indices of Object.values(porCurso)) indices.sort((a, b) => a - b)

  return {
    inscripciones: (inscripciones.data || []).map((row: any) => ({
      curso_id: row.curso_id,
      inscrito_en: row.inscrito_en,
      nombre_completo: row.nombre_completo,
      email: row.email,
      lecciones_completadas: porCurso[String(row.curso_id)] ?? [],
    })),
    progreso: porCurso,
    puntos: puntos.data?.puntos ?? 0,
    // La tabla de certificados puede no existir todavía en algún entorno: eso
    // no debe tumbar el resto del resumen.
    certificados: certificados.error ? [] : certificados.data ?? [],
  }
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'courses:progress', limit: 90, windowSeconds: 60 })
    const user = await authenticate(req, { withProfile: true })
    const supabase = getSupabaseAdmin()

    if (req.method === 'GET') {
      const wallet = walletDe(user, req.query?.wallet)
      return res.status(200).json(await resumen(wallet))
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' })
    }

    const body = readBody(req)
    const action = String(body.action || '')
    const wallet = walletDe(user, body.wallet)

    if (action === 'enroll') {
      const cursoId = cursoDe(body.curso_id ?? body.cursoId)
      const { error } = await supabase.from('curso_inscripciones').upsert(
        {
          wallet_address: wallet,
          curso_id: cursoId,
          nombre_completo: texto(body.nombre, 120),
          email: email(body.email),
          inscrito_en: new Date().toISOString(),
        },
        { onConflict: 'wallet_address,curso_id' }
      )
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    if (action === 'complete_lesson') {
      const cursoId = cursoDe(body.curso_id ?? body.cursoId)
      const total = totalLeccionesDeCurso(cursoId)
      const indice = Number(body.leccion_index ?? body.leccionIndex)
      if (!Number.isInteger(indice) || indice < 0 || indice >= total) {
        return res.status(400).json({ error: 'Índice de lección fuera de rango' })
      }

      const { error } = await supabase.from('curso_progreso').upsert(
        {
          wallet_address: wallet,
          curso_id: cursoId,
          leccion_index: indice,
          completado_en: new Date().toISOString(),
        },
        { onConflict: 'wallet_address,curso_id,leccion_index' }
      )
      if (error) throw error

      const puntos = await recalcularPuntos(wallet)
      return res.status(200).json({ ok: true, puntos })
    }

    if (action === 'recalc') {
      return res.status(200).json({ ok: true, puntos: await recalcularPuntos(wallet) })
    }

    if (action === 'register_certificate') {
      const cursoId = cursoDe(body.curso_id ?? body.cursoId)
      // El badge_ref se deriva del catálogo: si lo pusiera el cliente podría
      // registrar certificados de cursos que no cursó.
      const badgeRef = cursoBadgeRef(cursoId, cohorteDeCurso(cursoId))
      const { error } = await supabase.from('curso_certificados').upsert(
        {
          wallet_address: wallet,
          curso_id: cursoId,
          badge_ref: badgeRef,
          token_id: texto(body.token_id ?? body.tokenId, 80),
          tx_hash: texto(body.tx_hash ?? body.txHash, 80),
          claimed_at: new Date().toISOString(),
        },
        { onConflict: 'wallet_address,badge_ref' }
      )
      if (error) throw error
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Acción desconocida' })
  } catch (err) {
    return sendError(res, err)
  }
}

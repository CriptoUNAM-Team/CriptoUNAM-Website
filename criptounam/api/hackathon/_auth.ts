/**
 * Utilidades compartidas por las Vercel Functions del hackathon.
 *
 * - Verifica el access token de Privy (Authorization: Bearer <token>).
 * - Expone un cliente de Supabase con service role (bypassa RLS).
 * - Gating de organizadores por allowlist de emails (HACKATHON_ADMIN_EMAILS).
 *
 * Los archivos con prefijo "_" NO se publican como endpoints en Vercel.
 *
 * Env (sin prefijo VITE_):
 *   PRIVY_APP_ID, PRIVY_APP_SECRET
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   HACKATHON_ADMIN_EMAILS  (coma-separado)
 */
import { PrivyClient } from '@privy-io/server-auth'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type AuthedUser = {
  privyId: string
  email: string | null
  wallet: string | null
}

let _privy: PrivyClient | null = null
function getPrivy(): PrivyClient {
  if (_privy) return _privy
  const appId = process.env.PRIVY_APP_ID
  const appSecret = process.env.PRIVY_APP_SECRET
  if (!appId || !appSecret) {
    throw new HttpError(500, 'Backend mal configurado (faltan envs de Privy)')
  }
  _privy = new PrivyClient(appId, appSecret)
  return _privy
}

let _supabase: SupabaseClient | null = null
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new HttpError(500, 'Backend mal configurado (faltan envs de Supabase)')
  }
  _supabase = createClient(url, key, { auth: { persistSession: false } })
  return _supabase
}

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function bearer(req: any): string {
  const header = req.headers?.authorization || req.headers?.Authorization || ''
  const token = String(header).replace(/^Bearer\s+/i, '').trim()
  if (!token) throw new HttpError(401, 'Falta el token de autenticación')
  return token
}

/**
 * Verifica el token y devuelve el privyId. Si `withProfile` es true, además
 * consulta el perfil (email + wallet) — úsalo solo cuando lo necesites
 * (registro, gating de admin) para evitar rate limits.
 */
export async function authenticate(
  req: any,
  opts: { withProfile?: boolean } = {}
): Promise<AuthedUser> {
  const token = bearer(req)
  const privy = getPrivy()

  let privyId: string
  try {
    const claims = await privy.verifyAuthToken(token)
    privyId = claims.userId
  } catch {
    throw new HttpError(401, 'Token inválido o expirado')
  }

  let email: string | null = null
  let wallet: string | null = null
  if (opts.withProfile) {
    try {
      const user = await privy.getUser(privyId)
      email = user.email?.address ?? null
      wallet = user.wallet?.address ?? null
    } catch {
      /* si falla el fetch de perfil, seguimos solo con el privyId */
    }
  }

  return { privyId, email, wallet }
}

export function adminEmails(): string[] {
  return (process.env.HACKATHON_ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null): boolean {
  if (!email) return false
  return adminEmails().includes(email.trim().toLowerCase())
}

/** Verifica token + perfil y exige que el email esté en la allowlist. */
export async function requireAdmin(req: any): Promise<AuthedUser> {
  const user = await authenticate(req, { withProfile: true })
  if (!isAdminEmail(user.email)) {
    throw new HttpError(403, 'Acceso restringido a organizadores')
  }
  return user
}

export function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export function sendError(res: any, err: unknown) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message })
  }
  console.error('Hackathon API error:', err)
  return res.status(500).json({ error: 'Error interno del servidor' })
}

/** Slug del hackathon activo (por ahora, edición 2026). */
export const ACTIVE_HACKATHON_SLUG = 'hackathon-unam-2026'

/** Resuelve el id del hackathon activo (cacheado en memoria del lambda). */
let _hackathonId: string | null = null
export async function getActiveHackathonId(): Promise<string> {
  if (_hackathonId) return _hackathonId
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('hackathons')
    .select('id')
    .eq('slug', ACTIVE_HACKATHON_SLUG)
    .single()
  if (error || !data) {
    throw new HttpError(500, 'Hackathon activo no encontrado (¿corriste el schema SQL?)')
  }
  _hackathonId = data.id as string
  return _hackathonId
}

/** Genera un invite_code corto y legible para equipos. */
export function genInviteCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function readBody(req: any): any {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

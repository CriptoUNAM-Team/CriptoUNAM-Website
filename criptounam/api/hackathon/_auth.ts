/**
 * Utilidades compartidas por las Vercel Functions del hackathon.
 *
 * La autenticación (Privy), el cliente de Supabase con service role, el CORS y
 * el rate limiting viven en `api/_lib` porque también los usan los endpoints de
 * cursos. Aquí queda solo lo propio del hackathon.
 *
 * Los archivos con prefijo "_" NO se publican como endpoints en Vercel.
 *
 * Env (sin prefijo VITE_):
 *   PRIVY_APP_ID, PRIVY_APP_SECRET
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   HACKATHON_ADMIN_EMAILS  (coma-separado)
 */
import { getSupabaseAdmin } from '../_lib/supabase'
import { HttpError } from '../_lib/http'

export { getSupabaseAdmin } from '../_lib/supabase'
export { HttpError, setCors, sendError, readBody, clientIp } from '../_lib/http'
export {
  authenticate,
  assertWalletOwned,
  requireAdmin,
  adminEmails,
  isAdminEmail,
  type AuthedUser,
} from '../_lib/privy'
export { enforceRateLimit } from '../_lib/ratelimit'

/** Slug del hackathon activo (por ahora, edición 2026 · Goya Hack). */
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

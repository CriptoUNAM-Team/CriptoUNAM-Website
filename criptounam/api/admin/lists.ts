/**
 * /api/admin/lists — datos privados del panel de administración.
 *
 *  GET ?list=perfil                                → { isAdmin }        [auth]
 *  GET ?list=suscripciones | registros | wallets   [auth + allowlist de admins]
 *
 * Esas tres tablas guardan datos personales (correos, nombres, número de
 * cuenta, wallets). Antes el panel las leía desde el navegador con la anon key
 * y policies `USING (true)`: cualquiera con la llave pública —que va dentro del
 * bundle— podía descargarlas enteras. Ahora solo salen por aquí, y solo para
 * quien esté en `ADMIN_EMAILS` (organizadores, que entran por correo) o en
 * `ADMIN_WALLETS` (el panel de PUMA, donde el admin se identifica con wallet
 * porque los permisos de recompensas y drops son roles on-chain).
 *
 * `list=perfil` existe para que el navegador no tenga que llevar la allowlist:
 * pregunta si la sesión es de organizador y el servidor responde sí o no. Va en
 * este mismo endpoint —y no en uno propio— porque el plan Hobby de Vercel
 * admite 12 funciones y ya vamos por 11.
 *
 * Env: PRIVY_APP_ID, PRIVY_APP_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *      ADMIN_EMAILS (o HACKATHON_ADMIN_EMAILS), ADMIN_WALLETS
 */
import { authenticate, isAdmin } from '../_lib/privy.js'
import { getSupabaseAdmin } from '../_lib/supabase.js'
import { enforceRateLimit } from '../_lib/ratelimit.js'
import { setCors, sendError } from '../_lib/http.js'

const LISTAS: Record<string, { tabla: string; campos: string; orden: string; asc: boolean }> = {
  suscripciones: {
    tabla: 'suscripciones_newsletter',
    campos: 'id, email, fuente, activo, creadoen',
    orden: 'id',
    asc: false,
  },
  registros: {
    tabla: 'registros_comunidad',
    campos: '*',
    orden: 'id',
    asc: false,
  },
  wallets: {
    tabla: 'wallets_conectadas',
    campos: 'id, address, provider, conectadoen',
    orden: 'conectadoen',
    asc: false,
  },
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })

    await enforceRateLimit(req, { name: 'admin:lists', limit: 60, windowSeconds: 60 })
    const user = await authenticate(req, { withProfile: true })
    const esAdmin = isAdmin(user)

    // Responder que no eres organizador es información que ya tienes sobre ti
    // mismo, así que aquí sí es un 200 con `false` y no un 403.
    if (String(req.query?.list || '') === 'perfil') {
      return res.status(200).json({ isAdmin: esAdmin })
    }

    if (!esAdmin) return res.status(403).json({ error: 'Acceso restringido a organizadores' })

    const lista = LISTAS[String(req.query?.list || '')]
    if (!lista) return res.status(400).json({ error: 'Listado desconocido' })

    const { data, error } = await getSupabaseAdmin()
      .from(lista.tabla)
      .select(lista.campos)
      .order(lista.orden, { ascending: lista.asc })
      .limit(5000)
    if (error) throw error

    return res.status(200).json({ items: data ?? [] })
  } catch (err) {
    return sendError(res, err)
  }
}

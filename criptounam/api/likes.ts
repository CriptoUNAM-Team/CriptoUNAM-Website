/**
 * /api/likes — dar y quitar "me gusta" a una entrada de la newsletter.
 *
 *  POST   { newsletter_id }  → dar like      [auth]
 *  DELETE { newsletter_id }  → quitar like   [auth]
 *
 * El conteo se sigue leyendo desde el navegador (la tabla es de lectura
 * pública), pero escribir ya no: con la policy anterior cualquiera podía
 * insertar o borrar likes a nombre de la wallet de otra persona.
 */
import { authenticate, assertWalletOwned } from './_lib/privy'
import { getSupabaseAdmin } from './_lib/supabase'
import { enforceRateLimit } from './_lib/ratelimit'
import { setCors, sendError, readBody } from './_lib/http'

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Método no permitido' })
    }

    await enforceRateLimit(req, { name: 'likes', limit: 60, windowSeconds: 60 })
    const user = await authenticate(req, { withProfile: true })

    const body = readBody(req)
    const newsletterId = String(body.newsletter_id ?? body.newsletterId ?? '').trim().slice(0, 200)
    if (!newsletterId) return res.status(400).json({ error: 'newsletter_id requerido' })

    // El like se guarda con la wallet como user_id, así que hay que comprobar
    // que esa wallet es de quien pide.
    const wallet = String(body.wallet || user.wallet || '').trim().toLowerCase()
    assertWalletOwned(user, wallet)

    const supabase = getSupabaseAdmin()

    if (req.method === 'POST') {
      const { error } = await supabase
        .from('likes')
        .upsert(
          { user_id: wallet, newsletter_id: newsletterId },
          { onConflict: 'user_id,newsletter_id', ignoreDuplicates: true }
        )
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', wallet)
        .eq('newsletter_id', newsletterId)
      if (error) throw error
    }

    const { count } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('newsletter_id', newsletterId)

    return res.status(200).json({ ok: true, liked: req.method === 'POST', count: count ?? 0 })
  } catch (err) {
    return sendError(res, err)
  }
}

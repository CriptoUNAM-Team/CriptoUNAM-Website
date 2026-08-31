/**
 * /api/hackathon/upload
 *
 *  POST { filename, content_type } → { path, token, public_url }   [auth]
 */
import {
  authenticate,
  getSupabaseAdmin,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth.js'

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const MAX_FILENAME_LEN = 120

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'hackathon:upload:ip', limit: 30, windowSeconds: 600 })
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

    const { privyId } = await authenticate(req)
    await enforceRateLimit(req, {
      name: 'hackathon:upload:user',
      limit: 12,
      windowSeconds: 600,
      subject: privyId,
    })

    const supabase = getSupabaseAdmin()
    const body = readBody(req)
    const contentType = String(body.content_type || '')
    const ext = ALLOWED_TYPES[contentType]
    if (!ext) {
      return res.status(400).json({ error: 'Tipo de archivo no permitido (usa PNG, JPG, WebP o GIF)' })
    }

    const rawName = String(body.filename || 'upload').replace(/[^\w.\-() ]/g, '').slice(0, MAX_FILENAME_LEN)
    if (!rawName) {
      return res.status(400).json({ error: 'Nombre de archivo inválido' })
    }

    const rand = Math.random().toString(36).slice(2, 10)
    const owner = privyId.replace(/[^a-zA-Z0-9_-]/g, '').slice(-24) || 'anon'
    const path = `uploads/${owner}/${Date.now()}-${rand}.${ext}`

    const { data, error } = await supabase.storage.from('hackathon').createSignedUploadUrl(path)
    if (error) throw error

    const { data: pub } = supabase.storage.from('hackathon').getPublicUrl(path)

    return res.status(200).json({
      path: data.path,
      token: data.token,
      public_url: pub.publicUrl,
    })
  } catch (err) {
    return sendError(res, err)
  }
}

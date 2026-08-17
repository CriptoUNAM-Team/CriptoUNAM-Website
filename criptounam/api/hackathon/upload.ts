/**
 * /api/hackathon/upload
 *
 *  POST { filename, content_type } → { path, token, public_url }   [auth]
 *
 * Emite una signed upload URL para el bucket público 'hackathon'.
 * El navegador sube el archivo directo a Supabase Storage con
 * `uploadToSignedUrl(path, token, file)` y usa `public_url` en el proyecto.
 * El bucket limita tamaño (5 MB) y MIME types (imágenes) del lado de Supabase.
 */
import {
  authenticate,
  getSupabaseAdmin,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth.js'

/**
 * Sin SVG a propósito: el bucket es público y un SVG puede llevar `<script>`
 * dentro, así que serviría como página de phishing alojada en nuestro dominio
 * de Supabase. Para una foto de perfil no aporta nada.
 */
const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'hackathon:upload', limit: 20, windowSeconds: 600 })
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

    // Basta la sesión de Privy: la foto de perfil se sube ANTES de completar
    // la inscripción. El bucket limita tamaño (5 MB) y MIME types.
    const { privyId } = await authenticate(req)
    const supabase = getSupabaseAdmin()

    const body = readBody(req)
    const contentType = String(body.content_type || '')
    const ext = ALLOWED_TYPES[contentType]
    if (!ext) {
      return res.status(400).json({ error: 'Tipo de archivo no permitido (usa PNG, JPG, WebP o GIF)' })
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

/**
 * Validación de campos de proyecto del hackathon (server-side).
 * Complementa RLS + rate limiting; no sustituye autenticación Privy.
 */
import { HttpError } from './http.js'

const MAX_TITLE = 200
const MAX_TAGLINE = 280
const MAX_DESCRIPTION = 12_000
const MAX_TAGS = 15
const MAX_TAG_LEN = 40
const HTTPS_URL = /^https:\/\/.+/i

export type ProjectPayload = {
  title?: unknown
  tagline?: unknown
  description?: unknown
  repo_url?: unknown
  demo_url?: unknown
  video_url?: unknown
  slides_url?: unknown
  cover_url?: unknown
  logo_url?: unknown
  track_id?: unknown
  tags?: unknown
}

function trimStr(v: unknown, max: number): string | undefined {
  if (v == null) return undefined
  const s = String(v).trim()
  if (!s) return ''
  if (s.length > max) {
    throw new HttpError(400, `Texto demasiado largo (máx. ${max} caracteres)`)
  }
  return s
}

function optionalUrl(v: unknown, label: string): string | undefined {
  if (v == null || v === '') return undefined
  const s = String(v).trim()
  if (!s) return ''
  if (s.length > 2048) throw new HttpError(400, `${label}: URL demasiado larga`)
  if (!HTTPS_URL.test(s)) {
    throw new HttpError(400, `${label}: usa una URL https:// válida`)
  }
  return s
}

function parseTags(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const tags = raw
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, MAX_TAGS)
  for (const t of tags) {
    if (t.length > MAX_TAG_LEN) {
      throw new HttpError(400, `Etiqueta demasiado larga (máx. ${MAX_TAG_LEN} caracteres)`)
    }
  }
  return tags
}

/** Normaliza y valida el body antes de escribir en Supabase. */
export function sanitizeProjectBody(body: ProjectPayload, opts: { submitting: boolean }) {
  const title = trimStr(body.title, MAX_TITLE)
  const tagline = trimStr(body.tagline, MAX_TAGLINE)
  const description = trimStr(body.description, MAX_DESCRIPTION)
  const repo_url = optionalUrl(body.repo_url, 'Repositorio')
  const demo_url = optionalUrl(body.demo_url, 'Demo')
  const video_url = optionalUrl(body.video_url, 'Video')
  const slides_url = optionalUrl(body.slides_url, 'Slides')
  const cover_url = optionalUrl(body.cover_url, 'Portada')
  const logo_url = optionalUrl(body.logo_url, 'Logo')
  const tags = parseTags(body.tags)

  let track_id: string | null | undefined
  if (body.track_id !== undefined) {
    if (body.track_id === null || body.track_id === '') {
      track_id = null
    } else {
      const id = String(body.track_id).trim()
      if (!/^[0-9a-f-]{36}$/i.test(id)) {
        throw new HttpError(400, 'Track inválido')
      }
      track_id = id
    }
  }

  if (opts.submitting) {
    if (!title) throw new HttpError(400, 'El título del proyecto es obligatorio')
    if (!repo_url) {
      throw new HttpError(400, 'Para enviar el proyecto necesitas el enlace https del repositorio')
    }
    if (!track_id) throw new HttpError(400, 'Selecciona un track antes de enviar')
    if (!description || description.length < 40) {
      throw new HttpError(400, 'La descripción debe explicar el proyecto (mín. 40 caracteres)')
    }
  }

  const fields: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (title !== undefined) fields.title = title
  if (tagline !== undefined) fields.tagline = tagline
  if (description !== undefined) fields.description = description
  if (repo_url !== undefined) fields.repo_url = repo_url
  if (demo_url !== undefined) fields.demo_url = demo_url
  if (video_url !== undefined) fields.video_url = video_url
  if (slides_url !== undefined) fields.slides_url = slides_url
  if (cover_url !== undefined) fields.cover_url = cover_url
  if (logo_url !== undefined) fields.logo_url = logo_url
  if (track_id !== undefined) fields.track_id = track_id
  if (tags !== undefined) fields.tags = tags

  return fields
}

/** Comprueba que el track pertenezca al hackathon activo. */
export async function assertTrackBelongsToHackathon(
  supabase: any,
  hackathonId: string,
  trackId: string
): Promise<void> {
  const { data, error } = await supabase
    .from('hackathon_tracks')
    .select('id')
    .eq('id', trackId)
    .eq('hackathon_id', hackathonId)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new HttpError(400, 'El track seleccionado no es válido para esta edición')
}

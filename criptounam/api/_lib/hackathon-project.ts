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
  track_ids?: unknown
  tags?: unknown
}

const UUID = /^[0-9a-f-]{36}$/i

/** Uno o más tracks. `undefined` = el body no trae tracks. */
export function parseTrackIds(body: { track_ids?: unknown; track_id?: unknown }): string[] | undefined {
  if (Array.isArray(body.track_ids)) {
    const ids = [...new Set(body.track_ids.map((x) => String(x).trim()).filter(Boolean))]
    if (ids.length > 6) throw new HttpError(400, 'Puedes elegir hasta 6 tracks')
    for (const id of ids) {
      if (!UUID.test(id)) throw new HttpError(400, 'Track inválido')
    }
    return ids
  }
  if (body.track_id !== undefined) {
    if (body.track_id === null || body.track_id === '') return []
    const id = String(body.track_id).trim()
    if (!UUID.test(id)) throw new HttpError(400, 'Track inválido')
    return [id]
  }
  return undefined
}

/** `track_id` queda como el primero para no romper lecturas viejas. */
export function trackWriteFields(ids: string[]): { track_ids: string[]; track_id: string | null } {
  return { track_ids: ids, track_id: ids[0] ?? null }
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

  const trackIds = parseTrackIds(body)

  if (opts.submitting) {
    if (!title) throw new HttpError(400, 'El título del proyecto es obligatorio')
    if (!repo_url) {
      throw new HttpError(400, 'Para enviar el proyecto necesitas el enlace https del repositorio')
    }
    if (!trackIds || trackIds.length === 0) throw new HttpError(400, 'Selecciona al menos un track antes de enviar')
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
  if (trackIds !== undefined) Object.assign(fields, trackWriteFields(trackIds))
  if (tags !== undefined) fields.tags = tags

  return fields
}

/** Comprueba que cada track pertenezca al hackathon activo. */
export async function assertTracksBelongToHackathon(
  supabase: any,
  hackathonId: string,
  trackIds: string[]
): Promise<void> {
  if (trackIds.length === 0) return
  const { data, error } = await supabase
    .from('hackathon_tracks')
    .select('id')
    .eq('hackathon_id', hackathonId)
    .in('id', trackIds)
  if (error) throw error
  if ((data?.length ?? 0) !== trackIds.length) {
    throw new HttpError(400, 'Uno de los tracks no es válido para esta edición')
  }
}

/** Alias de un solo track. */
export async function assertTrackBelongsToHackathon(
  supabase: any,
  hackathonId: string,
  trackId: string
): Promise<void> {
  await assertTracksBelongToHackathon(supabase, hackathonId, [trackId])
}

/** Si la columna `track_ids` aún no existe, reintenta solo con `track_id`. */
export function sinColumnaTrackIds(error: { message?: string; code?: string } | null): boolean {
  const msg = String(error?.message || '')
  return msg.includes('track_ids') || error?.code === '42703'
}

type FilaTracks = {
  track_id?: string | null
  track_ids?: string[] | null
  track?: { id: string; name: string } | { id: string; name: string }[] | null
}

function trackEmbebido(track: FilaTracks['track']): { id: string; name: string } | null {
  if (!track) return null
  if (Array.isArray(track)) return track[0] ?? null
  return track
}

function idsDeFila(row: FilaTracks): string[] {
  if (Array.isArray(row.track_ids) && row.track_ids.length > 0) return row.track_ids
  if (row.track_id) return [row.track_id]
  const embebido = trackEmbebido(row.track)
  if (embebido?.id) return [embebido.id]
  return []
}

/** Resuelve los nombres de todos los tracks elegidos (PostgREST no embebe un uuid[]). */
export async function conNombresDeTracks<T extends FilaTracks>(
  supabase: any,
  rows: T[]
): Promise<(T & { tracks: { id: string; name: string }[] })[]> {
  const ids = [...new Set(rows.flatMap((row) => idsDeFila(row)))]
  const porId = new Map<string, { id: string; name: string }>()
  if (ids.length > 0) {
    const { data, error } = await supabase.from('hackathon_tracks').select('id, name').in('id', ids)
    if (error) throw error
    for (const track of data ?? []) porId.set(track.id, track)
  }
  return rows.map((row) => {
    const embebido = trackEmbebido(row.track)
    const tracks = idsDeFila(row)
      .map((id) => porId.get(id) ?? (embebido?.id === id ? embebido : null))
      .filter((track): track is { id: string; name: string } => Boolean(track))
    return { ...row, tracks, track: tracks[0] ?? embebido }
  })
}

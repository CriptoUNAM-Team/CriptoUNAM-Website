/**
 * /api/hackathon/projects
 *
 *  GET  (default)   → galería pública de proyectos enviados       [público]
 *  GET  ?mine=1     → proyecto de mi equipo                       [auth]
 *  POST             → crear/actualizar proyecto de mi equipo      [auth]
 *  POST ?action=submit → marcar como enviado                      [auth]
 *  PATCH            → actualizar campos del proyecto              [auth]
 */
import {
  authenticate,
  getSupabaseAdmin,
  getActiveHackathonId,
  sendError,
  setCors,
  readBody,
} from './_auth'

const GALLERY_FIELDS = `
  id, title, tagline, description, repo_url, demo_url, video_url, slides_url,
  cover_url, tags, submitted_at,
  track:hackathon_tracks(id, name),
  team:hackathon_teams(id, name)
`

async function myTeamId(supabase: any, hackathonId: string, privyId: string): Promise<string | null> {
  const { data: me, error: meErr } = await supabase
    .from('hackathon_participants')
    .select('id')
    .eq('hackathon_id', hackathonId)
    .eq('privy_id', privyId)
    .maybeSingle()
  if (meErr) throw meErr
  if (!me) return null
  const { data: mem, error } = await supabase
    .from('hackathon_team_members')
    .select('team_id')
    .eq('participant_id', me.id)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return mem?.team_id ?? null
}

export default async function handler(req: any, res: any) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()
    const action = String(req.query?.action || '')

    if (req.method === 'GET') {
      if (req.query?.mine) {
        const { privyId } = await authenticate(req)
        const teamId = await myTeamId(supabase, hackathonId, privyId)
        if (!teamId) return res.status(200).json({ project: null })
        const { data, error } = await supabase
          .from('hackathon_projects')
          .select('*, track:hackathon_tracks(id, name)')
          .eq('team_id', teamId)
          .maybeSingle()
        if (error) throw error
        return res.status(200).json({ project: data ?? null, team_id: teamId })
      }

      // Galería pública
      const { data, error } = await supabase
        .from('hackathon_projects')
        .select(GALLERY_FIELDS)
        .eq('hackathon_id', hackathonId)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false })
      if (error) throw error
      return res.status(200).json({ projects: data ?? [] })
    }

    if (req.method === 'POST' || req.method === 'PATCH') {
      const { privyId } = await authenticate(req)
      const teamId = await myTeamId(supabase, hackathonId, privyId)
      if (!teamId) return res.status(400).json({ error: 'Debes pertenecer a un equipo' })
      const body = readBody(req)

      const fields: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (body.title != null) fields.title = String(body.title).trim()
      if (body.tagline != null) fields.tagline = String(body.tagline)
      if (body.description != null) fields.description = String(body.description)
      if (body.repo_url != null) fields.repo_url = String(body.repo_url)
      if (body.demo_url != null) fields.demo_url = String(body.demo_url)
      if (body.video_url != null) fields.video_url = String(body.video_url)
      if (body.slides_url != null) fields.slides_url = String(body.slides_url)
      if (body.cover_url != null) fields.cover_url = String(body.cover_url)
      if (body.track_id !== undefined) fields.track_id = body.track_id || null
      if (Array.isArray(body.tags)) fields.tags = body.tags.slice(0, 15)

      if (action === 'submit') {
        fields.status = 'submitted'
        fields.submitted_at = new Date().toISOString()
      }

      // Upsert por team_id (único). Si no existe, exigimos título.
      const { data: existing } = await supabase
        .from('hackathon_projects')
        .select('id')
        .eq('team_id', teamId)
        .maybeSingle()

      if (!existing && !fields.title) {
        return res.status(400).json({ error: 'El título del proyecto es obligatorio' })
      }

      const row = {
        hackathon_id: hackathonId,
        team_id: teamId,
        ...fields,
      }

      const { data, error } = await supabase
        .from('hackathon_projects')
        .upsert(row, { onConflict: 'team_id' })
        .select('*, track:hackathon_tracks(id, name)')
        .single()
      if (error) throw error
      return res.status(200).json({ project: data })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    return sendError(res, err)
  }
}

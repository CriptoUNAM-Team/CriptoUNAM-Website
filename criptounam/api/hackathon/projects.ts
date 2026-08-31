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
  HttpError,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth.js'
import {
  sanitizeProjectBody,
  assertTrackBelongsToHackathon,
} from '../_lib/hackathon-project.js'

const GALLERY_FIELDS = `
  id, title, tagline, description, repo_url, demo_url, video_url, slides_url,
  cover_url, logo_url, tags, status, submitted_at,
  track:hackathon_tracks(id, name),
  team:hackathon_teams(id, name)
`

/** Bloquea escrituras cuando el hackathon ya está en evaluación o cerrado. */
async function assertEditionOpen(supabase: any, hackathonId: string) {
  const { data, error } = await supabase
    .from('hackathons')
    .select('status')
    .eq('id', hackathonId)
    .single()
  if (error) throw error
  if (data.status === 'judging' || data.status === 'closed') {
    throw new HttpError(403, 'El periodo de edición y envío de proyectos ha cerrado')
  }
}

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
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()
    const action = String(req.query?.action || '')
    const submitting = action === 'submit'

    if (req.method === 'GET') {
      await enforceRateLimit(req, { name: 'hackathon:projects:read', limit: 90, windowSeconds: 60 })

      if (req.query?.mine) {
        const { privyId } = await authenticate(req)
        await enforceRateLimit(req, {
          name: 'hackathon:projects:mine',
          limit: 40,
          windowSeconds: 60,
          subject: privyId,
        })
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

      await enforceRateLimit(req, {
        name: submitting ? 'hackathon:projects:submit-ip' : 'hackathon:projects:write-ip',
        limit: submitting ? 10 : 40,
        windowSeconds: 600,
      })
      await enforceRateLimit(req, {
        name: submitting ? 'hackathon:projects:submit' : 'hackathon:projects:write',
        limit: submitting ? 3 : 20,
        windowSeconds: submitting ? 3600 : 600,
        subject: privyId,
      })

      await assertEditionOpen(supabase, hackathonId)
      const teamId = await myTeamId(supabase, hackathonId, privyId)
      if (!teamId) return res.status(400).json({ error: 'Debes pertener a un equipo' })

      const body = readBody(req)
      const fields = sanitizeProjectBody(body, { submitting })

      if (typeof fields.track_id === 'string') {
        await assertTrackBelongsToHackathon(supabase, hackathonId, fields.track_id)
      }

      if (submitting) {
        fields.status = 'submitted'
        fields.submitted_at = new Date().toISOString()
      }

      const { data: existing } = await supabase
        .from('hackathon_projects')
        .select('id, status')
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

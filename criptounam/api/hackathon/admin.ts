/**
 * /api/hackathon/admin  —  solo organizadores (HACKATHON_ADMIN_EMAILS)
 *
 *  GET  ?resource=overview       → conteos + resumen
 *  GET  ?resource=participants   → inscritos (todos los campos)
 *  GET  ?resource=teams          → equipos con miembros
 *  GET  ?resource=projects       → proyectos (incluye borradores) + scores
 *  GET  ?resource=export&type=participants|projects → CSV
 *  POST ?action=score            → calificar proyecto (upsert)
 */
import {
  requireAdmin,
  getSupabaseAdmin,
  getActiveHackathonId,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth'

function toCsv(rows: Record<string, any>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: any) => {
    const s = v == null ? '' : Array.isArray(v) ? v.join('; ') : typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(',')]
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(','))
  return lines.join('\n')
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'hackathon:admin', limit: 120, windowSeconds: 60 })
    await requireAdmin(req)
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()
    const resource = String(req.query?.resource || 'overview')

    if (req.method === 'GET') {
      if (resource === 'participants') {
        const { data, error } = await supabase
          .from('hackathon_participants')
          .select('*, memberships:hackathon_team_members(role, team:hackathon_teams(id, name))')
          .eq('hackathon_id', hackathonId)
          .order('created_at', { ascending: false })
        if (error) throw error
        return res.status(200).json({ participants: data ?? [] })
      }

      if (resource === 'teams') {
        const { data, error } = await supabase
          .from('hackathon_teams')
          .select(
            `*, track:hackathon_tracks(id, name),
             members:hackathon_team_members(role, status, participant:hackathon_participants(id, full_name, email, avatar_url))`
          )
          .eq('hackathon_id', hackathonId)
          .order('created_at', { ascending: false })
        if (error) throw error
        return res.status(200).json({ teams: data ?? [] })
      }

      if (resource === 'projects') {
        const { data, error } = await supabase
          .from('hackathon_projects')
          .select(
            `*, track:hackathon_tracks(id, name), team:hackathon_teams(id, name),
             scores:hackathon_scores(id, judge_email, total, criteria, feedback)`
          )
          .eq('hackathon_id', hackathonId)
          .order('submitted_at', { ascending: false, nullsFirst: false })
        if (error) throw error
        return res.status(200).json({ projects: data ?? [] })
      }

      if (resource === 'export') {
        const type = String(req.query?.type || 'participants')
        const table = type === 'projects' ? 'hackathon_projects' : 'hackathon_participants'
        const { data, error } = await supabase.from(table).select('*').eq('hackathon_id', hackathonId)
        if (error) throw error
        const csv = toCsv(data ?? [])
        res.setHeader('Content-Type', 'text/csv; charset=utf-8')
        res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`)
        return res.status(200).send(csv)
      }

      // overview
      const [participants, teams, projects] = await Promise.all([
        supabase.from('hackathon_participants').select('id', { count: 'exact', head: true }).eq('hackathon_id', hackathonId),
        supabase.from('hackathon_teams').select('id', { count: 'exact', head: true }).eq('hackathon_id', hackathonId),
        supabase.from('hackathon_projects').select('status').eq('hackathon_id', hackathonId),
      ])
      const projList = projects.data ?? []
      return res.status(200).json({
        counts: {
          participants: participants.count ?? 0,
          teams: teams.count ?? 0,
          projects: projList.length,
          submitted: projList.filter((p: any) => p.status === 'submitted').length,
        },
      })
    }

    if (req.method === 'POST' && String(req.query?.action) === 'score') {
      const admin = await requireAdmin(req)
      const body = readBody(req)
      const projectId = String(body.project_id || '')
      if (!projectId) return res.status(400).json({ error: 'Falta project_id' })

      const criteria = body.criteria && typeof body.criteria === 'object' ? body.criteria : {}
      const total =
        body.total != null
          ? Number(body.total)
          : Object.values(criteria).reduce((a: number, b: any) => a + (Number(b) || 0), 0)

      const { data, error } = await supabase
        .from('hackathon_scores')
        .upsert(
          {
            project_id: projectId,
            judge_email: (admin.email || '').toLowerCase(),
            criteria,
            total,
            feedback: body.feedback ? String(body.feedback) : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'project_id,judge_email' }
        )
        .select('*')
        .single()
      if (error) throw error
      return res.status(200).json({ score: data })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    return sendError(res, err)
  }
}

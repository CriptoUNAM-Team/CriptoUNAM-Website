/**
 * /api/hackathon/teams
 *
 *  GET  ?mine=1          → mi(s) equipo(s) con miembros            [auth]
 *  GET  (default)        → equipos que buscan miembros            [auth]
 *  POST                  → crear equipo (yo = líder)              [auth]
 *  POST ?action=join     → unirme (body: invite_code | team_id)   [auth]
 *  POST ?action=leave    → salir  (body: team_id)                 [auth]
 *  PATCH                 → editar equipo (solo líder)             [auth]
 */
import {
  authenticate,
  getSupabaseAdmin,
  getActiveHackathonId,
  genInviteCode,
  sendError,
  setCors,
  readBody,
} from './_auth'

async function myParticipant(supabase: any, hackathonId: string, privyId: string) {
  const { data, error } = await supabase
    .from('hackathon_participants')
    .select('id, full_name')
    .eq('hackathon_id', hackathonId)
    .eq('privy_id', privyId)
    .maybeSingle()
  if (error) throw error
  return data as { id: string; full_name: string } | null
}

async function teamWithMembers(supabase: any, teamId: string) {
  const { data, error } = await supabase
    .from('hackathon_teams')
    .select(
      `*, track:hackathon_tracks(id, name),
       members:hackathon_team_members(
         role, status, joined_at,
         participant:hackathon_participants(id, full_name, skills, socials)
       )`
    )
    .eq('id', teamId)
    .single()
  if (error) throw error
  return data
}

export default async function handler(req: any, res: any) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()
    const action = String(req.query?.action || '')

    if (req.method === 'GET') {
      const { privyId } = await authenticate(req)

      if (req.query?.mine) {
        const me = await myParticipant(supabase, hackathonId, privyId)
        if (!me) return res.status(200).json({ teams: [] })
        const { data: memberships, error } = await supabase
          .from('hackathon_team_members')
          .select('team_id')
          .eq('participant_id', me.id)
        if (error) throw error
        const ids = (memberships ?? []).map((m: any) => m.team_id)
        const teams = await Promise.all(ids.map((id: string) => teamWithMembers(supabase, id)))
        return res.status(200).json({ teams })
      }

      const { data, error } = await supabase
        .from('hackathon_teams')
        .select(
          `*, track:hackathon_tracks(id, name),
           members:hackathon_team_members(status)`
        )
        .eq('hackathon_id', hackathonId)
        .eq('looking_for_members', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.status(200).json({ teams: data ?? [] })
    }

    if (req.method === 'POST') {
      const { privyId } = await authenticate(req)
      const me = await myParticipant(supabase, hackathonId, privyId)
      if (!me) return res.status(400).json({ error: 'Primero debes inscribirte' })
      const body = readBody(req)

      if (action === 'join') {
        let teamId = body.team_id as string | undefined
        if (!teamId && body.invite_code) {
          const { data: t, error } = await supabase
            .from('hackathon_teams')
            .select('id')
            .eq('hackathon_id', hackathonId)
            .eq('invite_code', String(body.invite_code).toUpperCase().trim())
            .maybeSingle()
          if (error) throw error
          if (!t) return res.status(404).json({ error: 'Código de invitación inválido' })
          teamId = t.id
        }
        if (!teamId) return res.status(400).json({ error: 'Falta team_id o invite_code' })

        const { error: insErr } = await supabase
          .from('hackathon_team_members')
          .upsert(
            { team_id: teamId, participant_id: me.id, status: 'member', role: body.role || null },
            { onConflict: 'team_id,participant_id' }
          )
        if (insErr) throw insErr
        const team = await teamWithMembers(supabase, teamId)
        return res.status(200).json({ team })
      }

      if (action === 'leave') {
        const teamId = body.team_id as string
        if (!teamId) return res.status(400).json({ error: 'Falta team_id' })
        const { error } = await supabase
          .from('hackathon_team_members')
          .delete()
          .eq('team_id', teamId)
          .eq('participant_id', me.id)
        if (error) throw error
        return res.status(200).json({ ok: true })
      }

      // Crear equipo
      const name = String(body.name || '').trim()
      if (!name) return res.status(400).json({ error: 'El nombre del equipo es obligatorio' })

      const { data: team, error: teamErr } = await supabase
        .from('hackathon_teams')
        .insert({
          hackathon_id: hackathonId,
          name,
          description: body.description ? String(body.description) : null,
          track_id: body.track_id || null,
          leader_participant_id: me.id,
          invite_code: genInviteCode(),
          looking_for_members: body.looking_for_members !== false,
          needed_skills: Array.isArray(body.needed_skills) ? body.needed_skills.slice(0, 15) : [],
          max_members: Number(body.max_members) > 0 ? Number(body.max_members) : 5,
        })
        .select('*')
        .single()
      if (teamErr) {
        if (teamErr.code === '23505') return res.status(409).json({ error: 'Ya existe un equipo con ese nombre' })
        throw teamErr
      }

      const { error: memErr } = await supabase
        .from('hackathon_team_members')
        .insert({ team_id: team.id, participant_id: me.id, status: 'member', role: 'Líder' })
      if (memErr) throw memErr

      const full = await teamWithMembers(supabase, team.id)
      return res.status(201).json({ team: full })
    }

    if (req.method === 'PATCH') {
      const { privyId } = await authenticate(req)
      const me = await myParticipant(supabase, hackathonId, privyId)
      if (!me) return res.status(400).json({ error: 'Primero debes inscribirte' })
      const body = readBody(req)
      const teamId = String(body.team_id || '')
      if (!teamId) return res.status(400).json({ error: 'Falta team_id' })

      const { data: team, error: tErr } = await supabase
        .from('hackathon_teams')
        .select('leader_participant_id')
        .eq('id', teamId)
        .single()
      if (tErr) throw tErr
      if (team.leader_participant_id !== me.id) {
        return res.status(403).json({ error: 'Solo el líder puede editar el equipo' })
      }

      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (body.name != null) updates.name = String(body.name).trim()
      if (body.description != null) updates.description = String(body.description)
      if (body.track_id !== undefined) updates.track_id = body.track_id || null
      if (body.looking_for_members != null) updates.looking_for_members = Boolean(body.looking_for_members)
      if (Array.isArray(body.needed_skills)) updates.needed_skills = body.needed_skills.slice(0, 15)
      if (body.max_members != null) updates.max_members = Number(body.max_members) || 5

      const { error: upErr } = await supabase
        .from('hackathon_teams')
        .update(updates)
        .eq('id', teamId)
      if (upErr) throw upErr
      const full = await teamWithMembers(supabase, teamId)
      return res.status(200).json({ team: full })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    return sendError(res, err)
  }
}

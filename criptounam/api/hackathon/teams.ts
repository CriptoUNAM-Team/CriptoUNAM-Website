/**
 * /api/hackathon/teams
 *
 *  GET  (default)           → directorio público de equipos            [público]
 *  GET  ?mine=1             → mi(s) equipo(s) con miembros             [auth]
 *  GET  ?requests=1         → solicitudes pendientes a mis equipos     [auth, líder]
 *  POST                     → crear equipo (yo = líder)                [auth]
 *  POST ?action=join        → unirme con invite_code (directo)         [auth]
 *  POST ?action=request     → solicitar unirme (body: team_id)         [auth]
 *  POST ?action=respond     → líder acepta/rechaza (request_id, accept)[auth, líder]
 *  POST ?action=cancel_request → cancelar mi solicitud pendiente       [auth]
 *  POST ?action=leave       → salir (body: team_id)                    [auth]
 *  PATCH                    → editar equipo (solo líder)               [auth]
 *
 * Reglas aplicadas en servidor:
 *  - Una persona solo puede pertenecer a UN equipo por hackathon.
 *  - max_members se valida al unirse, al solicitar y al aceptar.
 *  - El líder no puede salir si quedan más miembros; si está solo,
 *    salir elimina el equipo (cascade borra miembros/solicitudes/proyecto).
 */
import {
  authenticate,
  getSupabaseAdmin,
  getActiveHackathonId,
  genInviteCode,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth.js'

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

/** Equipo (con hackathon_id para validar edición) del que ya soy miembro, si existe. */
async function myMembership(supabase: any, hackathonId: string, participantId: string) {
  const { data, error } = await supabase
    .from('hackathon_team_members')
    .select('team_id, team:hackathon_teams!inner(id, name, hackathon_id)')
    .eq('participant_id', participantId)
    .eq('team.hackathon_id', hackathonId)
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as { team_id: string; team: { id: string; name: string } } | null
}

async function teamWithMembers(supabase: any, teamId: string) {
  const { data, error } = await supabase
    .from('hackathon_teams')
    .select(
      `*, track:hackathon_tracks(id, name),
       members:hackathon_team_members(
         role, status, joined_at,
         participant:hackathon_participants(id, full_name, avatar_url, skills, socials)
       )`
    )
    .eq('id', teamId)
    .single()
  if (error) throw error
  return data
}

async function memberCount(supabase: any, teamId: string): Promise<number> {
  const { count, error } = await supabase
    .from('hackathon_team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
  if (error) throw error
  return count ?? 0
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'hackathon:teams', limit: 60, windowSeconds: 60 })
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()
    const action = String(req.query?.action || '')

    if (req.method === 'GET') {
      // Mis equipos (con código de invitación) — requiere sesión.
      if (req.query?.mine) {
        const { privyId } = await authenticate(req)
        const me = await myParticipant(supabase, hackathonId, privyId)
        if (!me) return res.status(200).json({ teams: [] })
        const { data: memberships, error } = await supabase
          .from('hackathon_team_members')
          .select('team_id')
          .eq('participant_id', me.id)
        if (error) throw error
        const ids = (memberships ?? []).map((m: any) => m.team_id)
        const teams = await Promise.all(ids.map((id: string) => teamWithMembers(supabase, id)))
        return res.status(200).json({ teams: teams.filter((t: any) => t.hackathon_id === hackathonId) })
      }

      // Solicitudes pendientes de equipos que lidero — requiere sesión.
      if (req.query?.requests) {
        const { privyId } = await authenticate(req)
        const me = await myParticipant(supabase, hackathonId, privyId)
        if (!me) return res.status(200).json({ requests: [] })
        const { data, error } = await supabase
          .from('hackathon_join_requests')
          .select(
            `id, role, message, status, created_at,
             team:hackathon_teams!inner(id, name, leader_participant_id, max_members),
             applicant:hackathon_participants(id, full_name, bio, avatar_url, skills, socials, experience)`
          )
          .eq('status', 'pending')
          .eq('team.leader_participant_id', me.id)
          .eq('team.hackathon_id', hackathonId)
          .order('created_at', { ascending: false })
        if (error) throw error
        return res.status(200).json({ requests: data ?? [] })
      }

      // Directorio público: equipos que buscan miembros. Sin invite_code.
      const { data, error } = await supabase
        .from('hackathon_teams')
        .select(
          `id, name, description, track_id, looking_for_members, needed_skills,
           max_members, created_at,
           track:hackathon_tracks(id, name),
           members:hackathon_team_members(
             role, status,
             participant:hackathon_participants(id, full_name, avatar_url, skills)
           )`
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
      if (!me) return res.status(400).json({ error: 'Primero debes inscribirte al hackathon' })
      const body = readBody(req)

      // ---- Unirse directo con código de invitación (lo comparte el líder) ----
      if (action === 'join') {
        const code = String(body.invite_code || '').toUpperCase().trim()
        if (!code) return res.status(400).json({ error: 'Falta el código de invitación' })

        const existing = await myMembership(supabase, hackathonId, me.id)
        if (existing) {
          return res.status(409).json({ error: `Ya perteneces al equipo "${existing.team.name}". Sal de ese equipo primero.` })
        }

        const { data: team, error } = await supabase
          .from('hackathon_teams')
          .select('id, name, max_members')
          .eq('hackathon_id', hackathonId)
          .eq('invite_code', code)
          .maybeSingle()
        if (error) throw error
        if (!team) return res.status(404).json({ error: 'Código de invitación inválido' })

        const count = await memberCount(supabase, team.id)
        if (count >= (team.max_members || 5)) {
          return res.status(409).json({ error: `El equipo "${team.name}" ya está lleno (${team.max_members} miembros)` })
        }

        const { error: insErr } = await supabase
          .from('hackathon_team_members')
          .insert({ team_id: team.id, participant_id: me.id, status: 'member', role: body.role || null })
        if (insErr) throw insErr

        // Cancela mis solicitudes pendientes a otros equipos (ya tengo equipo).
        await supabase
          .from('hackathon_join_requests')
          .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
          .eq('participant_id', me.id)
          .eq('status', 'pending')

        const full = await teamWithMembers(supabase, team.id)
        return res.status(200).json({ team: full })
      }

      // ---- Solicitar unirme (el líder decide) ----
      if (action === 'request') {
        const teamId = String(body.team_id || '')
        if (!teamId) return res.status(400).json({ error: 'Falta team_id' })

        const existing = await myMembership(supabase, hackathonId, me.id)
        if (existing) {
          return res.status(409).json({ error: `Ya perteneces al equipo "${existing.team.name}"` })
        }

        const { data: team, error } = await supabase
          .from('hackathon_teams')
          .select('id, name, max_members, looking_for_members, leader_participant_id')
          .eq('id', teamId)
          .eq('hackathon_id', hackathonId)
          .maybeSingle()
        if (error) throw error
        if (!team) return res.status(404).json({ error: 'Equipo no encontrado' })
        if (team.leader_participant_id === me.id) {
          return res.status(400).json({ error: 'No puedes postularte a tu propio equipo' })
        }
        if (!team.looking_for_members) {
          return res.status(409).json({ error: 'Este equipo no está buscando miembros' })
        }
        const count = await memberCount(supabase, team.id)
        if (count >= (team.max_members || 5)) {
          return res.status(409).json({ error: `El equipo "${team.name}" ya está lleno` })
        }

        const { data: request, error: reqErr } = await supabase
          .from('hackathon_join_requests')
          .insert({
            team_id: team.id,
            participant_id: me.id,
            role: body.role ? String(body.role).slice(0, 60) : null,
            message: body.message ? String(body.message).slice(0, 500) : null,
          })
          .select('*')
          .single()
        if (reqErr) {
          if (reqErr.code === '23505') {
            return res.status(409).json({ error: 'Ya tienes una solicitud pendiente para este equipo' })
          }
          throw reqErr
        }
        return res.status(201).json({ request })
      }

      // ---- Líder responde una solicitud ----
      if (action === 'respond') {
        const requestId = String(body.request_id || '')
        const accept = Boolean(body.accept)
        if (!requestId) return res.status(400).json({ error: 'Falta request_id' })

        const { data: requestRow, error } = await supabase
          .from('hackathon_join_requests')
          .select('id, status, participant_id, role, team:hackathon_teams!inner(id, name, max_members, leader_participant_id, hackathon_id)')
          .eq('id', requestId)
          .maybeSingle()
        if (error) throw error
        // PostgREST devuelve la relación a-uno como objeto; el tipo inferido cree que es array.
        const request = requestRow as unknown as {
          id: string
          status: string
          participant_id: string
          role: string | null
          team: { id: string; name: string; max_members: number; leader_participant_id: string; hackathon_id: string }
        } | null
        if (!request || request.team.hackathon_id !== hackathonId) {
          return res.status(404).json({ error: 'Solicitud no encontrada' })
        }
        if (request.team.leader_participant_id !== me.id) {
          return res.status(403).json({ error: 'Solo el líder del equipo puede responder solicitudes' })
        }
        if (request.status !== 'pending') {
          return res.status(409).json({ error: 'Esta solicitud ya fue respondida' })
        }

        if (accept) {
          // ¿El aspirante consiguió equipo mientras tanto?
          const aspirant = await myMembership(supabase, hackathonId, request.participant_id)
          if (aspirant) {
            await supabase
              .from('hackathon_join_requests')
              .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
              .eq('id', request.id)
            return res.status(409).json({ error: 'El aspirante ya se unió a otro equipo' })
          }
          const count = await memberCount(supabase, request.team.id)
          if (count >= (request.team.max_members || 5)) {
            return res.status(409).json({ error: 'Tu equipo ya está lleno; amplía max_members o rechaza la solicitud' })
          }
          const { error: insErr } = await supabase
            .from('hackathon_team_members')
            .insert({ team_id: request.team.id, participant_id: request.participant_id, status: 'member', role: request.role || null })
          if (insErr) throw insErr

          // Cancela las demás solicitudes pendientes del aspirante.
          await supabase
            .from('hackathon_join_requests')
            .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
            .eq('participant_id', request.participant_id)
            .eq('status', 'pending')
            .neq('id', request.id)
        }

        const { error: upErr } = await supabase
          .from('hackathon_join_requests')
          .update({ status: accept ? 'accepted' : 'rejected', resolved_at: new Date().toISOString() })
          .eq('id', request.id)
        if (upErr) throw upErr

        const full = await teamWithMembers(supabase, request.team.id)
        return res.status(200).json({ team: full, status: accept ? 'accepted' : 'rejected' })
      }

      // ---- Aspirante cancela su solicitud ----
      if (action === 'cancel_request') {
        const requestId = String(body.request_id || '')
        if (!requestId) return res.status(400).json({ error: 'Falta request_id' })
        const { error } = await supabase
          .from('hackathon_join_requests')
          .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
          .eq('id', requestId)
          .eq('participant_id', me.id)
          .eq('status', 'pending')
        if (error) throw error
        return res.status(200).json({ ok: true })
      }

      // ---- Transferir liderazgo a otro miembro ----
      if (action === 'transfer_lead') {
        const teamId = String(body.team_id || '')
        const newLeaderId = String(body.participant_id || '')
        if (!teamId || !newLeaderId) return res.status(400).json({ error: 'Faltan team_id y participant_id' })

        const { data: team, error: tErr } = await supabase
          .from('hackathon_teams')
          .select('id, leader_participant_id')
          .eq('id', teamId)
          .eq('hackathon_id', hackathonId)
          .maybeSingle()
        if (tErr) throw tErr
        if (!team) return res.status(404).json({ error: 'Equipo no encontrado' })
        if (team.leader_participant_id !== me.id) {
          return res.status(403).json({ error: 'Solo el líder actual puede transferir el liderazgo' })
        }
        if (newLeaderId === me.id) {
          return res.status(400).json({ error: 'Ya eres el líder de este equipo' })
        }

        const { data: member, error: mErr } = await supabase
          .from('hackathon_team_members')
          .select('participant_id')
          .eq('team_id', teamId)
          .eq('participant_id', newLeaderId)
          .maybeSingle()
        if (mErr) throw mErr
        if (!member) return res.status(400).json({ error: 'El nuevo líder debe ser miembro del equipo' })

        const { error: upErr } = await supabase
          .from('hackathon_teams')
          .update({ leader_participant_id: newLeaderId, updated_at: new Date().toISOString() })
          .eq('id', teamId)
        if (upErr) throw upErr

        // Actualiza los roles informativos de ambos.
        await supabase
          .from('hackathon_team_members')
          .update({ role: 'Líder' })
          .eq('team_id', teamId)
          .eq('participant_id', newLeaderId)
        await supabase
          .from('hackathon_team_members')
          .update({ role: 'Miembro' })
          .eq('team_id', teamId)
          .eq('participant_id', me.id)

        const full = await teamWithMembers(supabase, teamId)
        return res.status(200).json({ team: full })
      }

      // ---- Salir del equipo ----
      if (action === 'leave') {
        const teamId = String(body.team_id || '')
        if (!teamId) return res.status(400).json({ error: 'Falta team_id' })

        const { data: team, error: tErr } = await supabase
          .from('hackathon_teams')
          .select('id, leader_participant_id')
          .eq('id', teamId)
          .maybeSingle()
        if (tErr) throw tErr
        if (!team) return res.status(404).json({ error: 'Equipo no encontrado' })

        if (team.leader_participant_id === me.id) {
          const count = await memberCount(supabase, teamId)
          if (count > 1) {
            return res.status(409).json({
              error: 'Eres líder y tu equipo tiene más miembros. Transfiere el liderazgo a otro miembro antes de salir.',
            })
          }
          // Líder solo → eliminar el equipo completo (cascade).
          const { error: delErr } = await supabase.from('hackathon_teams').delete().eq('id', teamId)
          if (delErr) throw delErr
          return res.status(200).json({ ok: true, deleted: true })
        }

        const { error } = await supabase
          .from('hackathon_team_members')
          .delete()
          .eq('team_id', teamId)
          .eq('participant_id', me.id)
        if (error) throw error
        return res.status(200).json({ ok: true })
      }

      // ---- Crear equipo ----
      const name = String(body.name || '').trim()
      if (!name) return res.status(400).json({ error: 'El nombre del equipo es obligatorio' })

      const existing = await myMembership(supabase, hackathonId, me.id)
      if (existing) {
        return res.status(409).json({ error: `Ya perteneces al equipo "${existing.team.name}". Solo puedes estar en un equipo.` })
      }

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
          max_members: Number(body.max_members) > 0 ? Math.min(Number(body.max_members), 10) : 5,
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

      // Al crear equipo, cancela mis solicitudes pendientes a otros equipos.
      await supabase
        .from('hackathon_join_requests')
        .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
        .eq('participant_id', me.id)
        .eq('status', 'pending')

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
      if (body.max_members != null) updates.max_members = Math.min(Number(body.max_members) || 5, 10)

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

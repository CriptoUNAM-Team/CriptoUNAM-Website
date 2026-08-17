/**
 * /api/hackathon/participants
 *
 *  GET  ?me=1     → mi inscripción (o null)          [auth]
 *  GET  (default) → participantes que buscan equipo   [auth] (campos seguros)
 *  POST           → inscribirme / actualizar registro [auth+perfil]
 *  PATCH          → actualizar mi perfil              [auth]
 */
import {
  authenticate,
  getSupabaseAdmin,
  getActiveHackathonId,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth.js'

const SAFE_FIELDS = 'id, full_name, bio, avatar_url, skills, socials, experience, looking_for_team, created_at'

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'hackathon:participants', limit: 60, windowSeconds: 60 })
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()

    if (req.method === 'GET') {
      const { privyId } = await authenticate(req)

      if (req.query?.me) {
        const { data, error } = await supabase
          .from('hackathon_participants')
          .select('*')
          .eq('hackathon_id', hackathonId)
          .eq('privy_id', privyId)
          .maybeSingle()
        if (error) throw error
        return res.status(200).json({ participant: data ?? null })
      }

      const { data, error } = await supabase
        .from('hackathon_participants')
        .select(SAFE_FIELDS)
        .eq('hackathon_id', hackathonId)
        .eq('looking_for_team', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.status(200).json({ participants: data ?? [] })
    }

    if (req.method === 'POST') {
      const { privyId, email, wallet } = await authenticate(req, { withProfile: true })
      const body = readBody(req)
      const fullName = String(body.full_name || '').trim()
      if (!fullName) return res.status(400).json({ error: 'El nombre es obligatorio' })

      const row = {
        hackathon_id: hackathonId,
        privy_id: privyId,
        email: email,
        wallet_address: wallet,
        full_name: fullName,
        bio: body.bio ? String(body.bio) : null,
        avatar_url: body.avatar_url ? String(body.avatar_url) : null,
        skills: Array.isArray(body.skills) ? body.skills.slice(0, 20) : [],
        socials: body.socials && typeof body.socials === 'object' ? body.socials : {},
        experience: body.experience ? String(body.experience) : null,
        looking_for_team: body.looking_for_team !== false,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('hackathon_participants')
        .upsert(row, { onConflict: 'hackathon_id,privy_id' })
        .select('*')
        .single()
      if (error) throw error
      return res.status(200).json({ participant: data })
    }

    if (req.method === 'PATCH') {
      const { privyId } = await authenticate(req)
      const body = readBody(req)
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (body.full_name != null) updates.full_name = String(body.full_name).trim()
      if (body.bio != null) updates.bio = String(body.bio)
      if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url ? String(body.avatar_url) : null
      if (Array.isArray(body.skills)) updates.skills = body.skills.slice(0, 20)
      if (body.socials && typeof body.socials === 'object') updates.socials = body.socials
      if (body.experience != null) updates.experience = String(body.experience)
      if (body.looking_for_team != null) updates.looking_for_team = Boolean(body.looking_for_team)

      const { data, error } = await supabase
        .from('hackathon_participants')
        .update(updates)
        .eq('hackathon_id', hackathonId)
        .eq('privy_id', privyId)
        .select('*')
        .maybeSingle()
      if (error) throw error
      if (!data) return res.status(404).json({ error: 'Aún no estás inscrito' })
      return res.status(200).json({ participant: data })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    return sendError(res, err)
  }
}

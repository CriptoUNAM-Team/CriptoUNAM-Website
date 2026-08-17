/**
 * /api/hackathon/questions
 *
 *  GET  (default)      → dudas con respuestas                     [público]
 *  POST                → nueva duda                               [auth]
 *  POST ?action=answer → responder (oficial si eres organizador)  [auth+perfil]
 */
import {
  authenticate,
  getSupabaseAdmin,
  getActiveHackathonId,
  isAdminEmail,
  sendError,
  setCors,
  readBody,
  enforceRateLimit,
} from './_auth.js'

async function participantName(supabase: any, hackathonId: string, privyId: string) {
  const { data } = await supabase
    .from('hackathon_participants')
    .select('id, full_name')
    .eq('hackathon_id', hackathonId)
    .eq('privy_id', privyId)
    .maybeSingle()
  return data as { id: string; full_name: string } | null
}

export default async function handler(req: any, res: any) {
  setCors(res, req)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    await enforceRateLimit(req, { name: 'hackathon:questions', limit: 60, windowSeconds: 60 })
    const supabase = getSupabaseAdmin()
    const hackathonId = await getActiveHackathonId()
    const action = String(req.query?.action || '')

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('hackathon_questions')
        .select(
          `id, title, body, category, is_answered, author_name, created_at,
           answers:hackathon_answers(id, body, author_name, is_official, created_at)`
        )
        .eq('hackathon_id', hackathonId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.status(200).json({ questions: data ?? [] })
    }

    if (req.method === 'POST' && action === 'answer') {
      const { privyId, email } = await authenticate(req, { withProfile: true })
      const body = readBody(req)
      const questionId = String(body.question_id || '')
      const text = String(body.body || '').trim()
      if (!questionId || !text) return res.status(400).json({ error: 'Faltan datos de la respuesta' })

      const official = isAdminEmail(email)
      const me = await participantName(supabase, hackathonId, privyId)

      const { data, error } = await supabase
        .from('hackathon_answers')
        .insert({
          question_id: questionId,
          participant_id: me?.id ?? null,
          author_name: official ? 'Organización CriptoUNAM' : me?.full_name ?? 'Hacker',
          author_email: email,
          body: text,
          is_official: official,
        })
        .select('*')
        .single()
      if (error) throw error

      if (official) {
        await supabase.from('hackathon_questions').update({ is_answered: true }).eq('id', questionId)
      }
      return res.status(201).json({ answer: data })
    }

    if (req.method === 'POST') {
      const { privyId } = await authenticate(req)
      const body = readBody(req)
      const title = String(body.title || '').trim()
      const text = String(body.body || '').trim()
      if (!title || !text) return res.status(400).json({ error: 'Faltan título o descripción' })

      const me = await participantName(supabase, hackathonId, privyId)
      const { data, error } = await supabase
        .from('hackathon_questions')
        .insert({
          hackathon_id: hackathonId,
          participant_id: me?.id ?? null,
          author_name: me?.full_name ?? 'Hacker',
          title,
          body: text,
          category: body.category ? String(body.category) : 'general',
        })
        .select('*')
        .single()
      if (error) throw error
      return res.status(201).json({ question: data })
    }

    return res.status(405).json({ error: 'Método no permitido' })
  } catch (err) {
    return sendError(res, err)
  }
}

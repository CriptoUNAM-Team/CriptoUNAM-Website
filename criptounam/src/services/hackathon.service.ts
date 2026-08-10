/**
 * Cliente del frontend para las Vercel Functions del hackathon
 * (/api/hackathon/*). Adjunta el access token de Privy en cada request
 * autenticado mediante `getAccessToken()`.
 *
 * Sin fallbacks silenciosos: si el backend falla, el error se propaga y la UI
 * lo muestra. Así nunca se le dice "guardado" a un participante cuyo registro,
 * equipo o proyecto no llegó a la base de datos.
 */
import { getAccessToken } from '@privy-io/react-auth'
import { supabase } from '../config/supabase'

const BASE = '/api/hackathon'

// ---------- Tipos ----------
export interface Participant {
  id: string
  full_name: string
  email?: string | null
  wallet_address?: string | null
  bio?: string | null
  avatar_url?: string | null
  skills: string[]
  socials: Record<string, string>
  experience?: string | null
  looking_for_team: boolean
  status?: string
  created_at?: string
  /** Solo en el panel de admin: equipo(s) del participante. */
  memberships?: { role?: string | null; team?: { id: string; name: string } | null }[]
}

export interface TeamMember {
  id?: string
  role?: string | null
  status: string
  joined_at?: string
  participant?: {
    id: string
    full_name: string
    avatar_url?: string | null
    skills?: string[]
    socials?: Record<string, string>
    email?: string
  }
}

export interface Team {
  id: string
  name: string
  description?: string | null
  track?: { id: string; name: string } | null
  track_id?: string | null
  leader_participant_id?: string
  invite_code?: string
  looking_for_members?: boolean
  needed_skills?: string[]
  max_members?: number
  members?: TeamMember[]
  created_at?: string
}

export interface JoinRequest {
  id: string
  role?: string | null
  message?: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  created_at: string
  team?: { id: string; name: string; max_members?: number }
  applicant?: {
    id: string
    full_name: string
    bio?: string | null
    avatar_url?: string | null
    skills?: string[]
    socials?: Record<string, string>
    experience?: string | null
  }
}

export interface Project {
  id: string
  team_id?: string
  title: string
  tagline?: string | null
  description?: string | null
  repo_url?: string | null
  demo_url?: string | null
  video_url?: string | null
  slides_url?: string | null
  cover_url?: string | null
  logo_url?: string | null
  tags: string[]
  status: 'draft' | 'submitted'
  submitted_at?: string | null
  track?: { id: string; name: string } | null
  track_id?: string | null
  team?: { id: string; name: string } | null
}

export interface Answer {
  id: string
  body: string
  author_name?: string
  is_official: boolean
  created_at: string
}

export interface Question {
  id: string
  title: string
  body: string
  category: string
  is_answered: boolean
  author_name?: string
  created_at: string
  answers?: Answer[]
}

export interface Track {
  id: string
  name: string
  description?: string
}

// ---------- Helper de fetch ----------
async function api<T>(
  path: string,
  opts: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, auth = false } = opts
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = await getAccessToken()
    if (!token) throw new Error('Debes iniciar sesión')
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let msg = `Error ${res.status}`
    try {
      const j = await res.json()
      msg = j.error || msg
    } catch {
      /* respuesta no-JSON */
    }
    throw new Error(msg)
  }

  // Un 200 no garantiza JSON: con `vite` a secas las funciones de api/hackathon
  // no se ejecutan y el dev server devuelve el .ts como texto plano, así que
  // JSON.parse revienta con un mensaje incomprensible para quien lo lee.
  const texto = await res.text()
  try {
    return JSON.parse(texto) as T
  } catch {
    throw new Error(
      'La API del hackathon no respondió JSON. Si estás en desarrollo, levanta el sitio con `vercel dev`: `vite` no ejecuta las funciones de api/hackathon.'
    )
  }
}

// ---------- API ----------
export const hackathonApi = {
  // ----- Participantes -----
  getMe: () => api<{ participant: Participant | null }>('/participants?me=1', { auth: true }),

  listParticipants: () => api<{ participants: Participant[] }>('/participants', { auth: true }),

  register: (data: Partial<Participant>) =>
    api<{ participant: Participant }>('/participants', { method: 'POST', body: data, auth: true }),

  updateProfile: (data: Partial<Participant>) =>
    api<{ participant: Participant }>('/participants', { method: 'PATCH', body: data, auth: true }),

  // ----- Equipos -----
  /** Directorio público de equipos que buscan miembros (no requiere sesión). */
  listTeams: () => api<{ teams: Team[] }>('/teams'),

  myTeams: () => api<{ teams: Team[] }>('/teams?mine=1', { auth: true }),

  createTeam: (data: Partial<Team>) =>
    api<{ team: Team }>('/teams', { method: 'POST', body: data, auth: true }),

  updateTeam: (data: Partial<Team> & { team_id: string }) =>
    api<{ team: Team }>('/teams', { method: 'PATCH', body: data, auth: true }),

  /** Unirse directo con el código que comparte el líder. */
  joinByCode: (invite_code: string, role?: string) =>
    api<{ team: Team }>('/teams?action=join', { method: 'POST', body: { invite_code, role }, auth: true }),

  /** Postularse a un equipo del directorio; el líder acepta o rechaza. */
  requestJoin: (data: { team_id: string; role?: string; message?: string }) =>
    api<{ request: JoinRequest }>('/teams?action=request', { method: 'POST', body: data, auth: true }),

  /** Solicitudes pendientes de los equipos que lidero. */
  listJoinRequests: () => api<{ requests: JoinRequest[] }>('/teams?requests=1', { auth: true }),

  /** Líder acepta o rechaza una solicitud. Aceptar agrega al miembro al equipo. */
  respondJoinRequest: (request_id: string, accept: boolean) =>
    api<{ team: Team; status: string }>('/teams?action=respond', {
      method: 'POST',
      body: { request_id, accept },
      auth: true,
    }),

  cancelJoinRequest: (request_id: string) =>
    api<{ ok: boolean }>('/teams?action=cancel_request', { method: 'POST', body: { request_id }, auth: true }),

  leaveTeam: (team_id: string) =>
    api<{ ok: boolean; deleted?: boolean }>('/teams?action=leave', { method: 'POST', body: { team_id }, auth: true }),

  /** Líder actual cede el liderazgo a otro miembro del equipo. */
  transferLead: (team_id: string, participant_id: string) =>
    api<{ team: Team }>('/teams?action=transfer_lead', {
      method: 'POST',
      body: { team_id, participant_id },
      auth: true,
    }),

  // ----- Proyectos -----
  /** Galería pública de proyectos enviados. */
  gallery: () => api<{ projects: Project[] }>('/projects'),

  myProject: () => api<{ project: Project | null; team_id?: string }>('/projects?mine=1', { auth: true }),

  saveProject: (data: Partial<Project>) =>
    api<{ project: Project }>('/projects', { method: 'POST', body: data, auth: true }),

  submitProject: (data: Partial<Project>) =>
    api<{ project: Project }>('/projects?action=submit', { method: 'POST', body: data, auth: true }),

  // ----- Imágenes (logo / portada) -----
  /**
   * Sube una imagen a Supabase Storage vía signed upload URL y devuelve
   * su URL pública para guardarla en el proyecto.
   */
  uploadImage: async (file: File): Promise<string> => {
    if (!supabase) throw new Error('Supabase no está configurado en el frontend')
    if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no debe superar 5 MB')

    const { path, token, public_url } = await api<{ path: string; token: string; public_url: string }>(
      '/upload',
      { method: 'POST', body: { filename: file.name, content_type: file.type }, auth: true }
    )

    const { error } = await supabase.storage.from('hackathon').uploadToSignedUrl(path, token, file)
    if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`)
    return public_url
  },

  // ----- Tracks -----
  /**
   * Tracks reales de la edición activa (UUIDs de la DB). Lectura pública con
   * la anon key (policy "public read tracks"). Los formularios y filtros deben
   * usar ESTOS ids — los de HACKATHON_TRACKS son solo copy de la landing.
   */
  listTracks: async (): Promise<Track[]> => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('hackathon_tracks')
      .select('id, name, description')
      .order('sort_order', { ascending: true })
    if (error) throw new Error(error.message)
    return (data ?? []) as Track[]
  },

  // ----- Dudas (Q&A) -----
  listQuestions: () => api<{ questions: Question[] }>('/questions'),

  askQuestion: (data: { title: string; body: string; category?: string }) =>
    api<{ question: Question }>('/questions', { method: 'POST', body: data, auth: true }),

  answerQuestion: (data: { question_id: string; body: string }) =>
    api<{ answer: Answer }>('/questions?action=answer', { method: 'POST', body: data, auth: true }),

  // ----- Admin (organizadores) -----
  adminOverview: () => api<{ counts: Record<string, number> }>('/admin?resource=overview', { auth: true }),

  adminParticipants: () => api<{ participants: Participant[] }>('/admin?resource=participants', { auth: true }),

  adminTeams: () => api<{ teams: Team[] }>('/admin?resource=teams', { auth: true }),

  adminProjects: () =>
    api<{ projects: (Project & { scores?: unknown[] })[] }>('/admin?resource=projects', { auth: true }),

  score: (data: { project_id: string; criteria?: Record<string, number>; total?: number; feedback?: string }) =>
    api<{ score: unknown }>('/admin?action=score', { method: 'POST', body: data, auth: true }),
}

// El copy público (info y tracks) vive en src/data/hackathonInfo.ts, que es lo
// único que consumen las páginas informativas. Se re-exporta para no duplicarlo.
export { HACKATHON_INFO, HACKATHON_TRACKS } from '../data/hackathonInfo'

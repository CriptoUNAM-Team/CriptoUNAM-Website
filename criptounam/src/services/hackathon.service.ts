/**
 * Cliente del frontend para las Vercel Functions del hackathon
 * (/api/hackathon/*). Adjunta el access token de Privy en cada request
 * autenticado mediante `getAccessToken()`.
 */
import { getAccessToken } from '@privy-io/react-auth'

const BASE = '/api/hackathon'

// ---------- Tipos ----------
export interface Participant {
  id: string
  full_name: string
  email?: string | null
  wallet_address?: string | null
  bio?: string | null
  skills: string[]
  socials: Record<string, string>
  experience?: string | null
  looking_for_team: boolean
  status?: string
  created_at?: string
}

export interface TeamMember {
  role?: string | null
  status: string
  joined_at?: string
  participant?: { id: string; full_name: string; skills?: string[]; socials?: Record<string, string>; email?: string }
}

export interface Team {
  id: string
  name: string
  description?: string | null
  track?: { id: string; name: string } | null
  track_id?: string | null
  leader_participant_id: string
  invite_code: string
  looking_for_members: boolean
  needed_skills: string[]
  max_members: number
  members?: TeamMember[]
  created_at?: string
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
  return res.json() as Promise<T>
}

// ---------- Participantes ----------
export const hackathonApi = {
  getMe: () => api<{ participant: Participant | null }>('/participants?me=1', { auth: true }),
  listParticipants: () => api<{ participants: Participant[] }>('/participants', { auth: true }),
  register: (data: Partial<Participant>) =>
    api<{ participant: Participant }>('/participants', { method: 'POST', body: data, auth: true }),
  updateProfile: (data: Partial<Participant>) =>
    api<{ participant: Participant }>('/participants', { method: 'PATCH', body: data, auth: true }),

  // ---------- Equipos ----------
  listTeams: () => api<{ teams: Team[] }>('/teams', { auth: true }),
  myTeams: () => api<{ teams: Team[] }>('/teams?mine=1', { auth: true }),
  createTeam: (data: Partial<Team>) =>
    api<{ team: Team }>('/teams', { method: 'POST', body: data, auth: true }),
  updateTeam: (data: Partial<Team> & { team_id: string }) =>
    api<{ team: Team }>('/teams', { method: 'PATCH', body: data, auth: true }),
  joinTeam: (data: { team_id?: string; invite_code?: string; role?: string }) =>
    api<{ team: Team }>('/teams?action=join', { method: 'POST', body: data, auth: true }),
  leaveTeam: (team_id: string) =>
    api<{ ok: boolean }>('/teams?action=leave', { method: 'POST', body: { team_id }, auth: true }),

  // ---------- Proyectos ----------
  gallery: () => api<{ projects: Project[] }>('/projects'),
  myProject: () => api<{ project: Project | null; team_id?: string }>('/projects?mine=1', { auth: true }),
  saveProject: (data: Partial<Project>) =>
    api<{ project: Project }>('/projects', { method: 'POST', body: data, auth: true }),
  submitProject: (data: Partial<Project>) =>
    api<{ project: Project }>('/projects?action=submit', { method: 'POST', body: data, auth: true }),

  // ---------- Dudas ----------
  listQuestions: () => api<{ questions: Question[] }>('/questions'),
  askQuestion: (data: { title: string; body: string; category?: string }) =>
    api<{ question: Question }>('/questions', { method: 'POST', body: data, auth: true }),
  answerQuestion: (data: { question_id: string; body: string }) =>
    api<{ answer: Answer }>('/questions?action=answer', { method: 'POST', body: data, auth: true }),

  // ---------- Admin ----------
  adminOverview: () => api<{ counts: Record<string, number> }>('/admin?resource=overview', { auth: true }),
  adminParticipants: () => api<{ participants: Participant[] }>('/admin?resource=participants', { auth: true }),
  adminTeams: () => api<{ teams: Team[] }>('/admin?resource=teams', { auth: true }),
  adminProjects: () => api<{ projects: (Project & { scores?: any[] })[] }>('/admin?resource=projects', { auth: true }),
  score: (data: { project_id: string; criteria?: Record<string, number>; total?: number; feedback?: string }) =>
    api<{ score: any }>('/admin?action=score', { method: 'POST', body: data, auth: true }),
}

// Tracks del hackathon (constantes del front; el seed vive en la DB).
export const HACKATHON_TRACKS: Track[] = [
  {
    id: 'ai-blockchain',
    name: 'AI & Blockchain',
    description:
      'Proyectos que combinen inteligencia artificial y/o blockchain: agentes, DeFi, ZK, on-chain AI, infraestructura Web3.',
  },
  {
    id: 'libre',
    name: 'Track Libre',
    description:
      'Construye libre: soluciona problemas sociales y ambientales, o crea algo original. Cualquier stack, máxima creatividad.',
  },
]

export const HACKATHON_INFO = {
  name: 'Hackathon UNAM 2026',
  startsAt: '2026-09-21T09:00:00-06:00',
  endsAt: '2026-09-24T20:00:00-06:00',
  location: 'Facultad de Ingeniería, UNAM · CDMX',
  event: 'Semana DIE',
  organizers: ['CriptoUNAM', 'Facultad de Ingeniería UNAM'],
}

/**
 * Cliente del frontend para las Vercel Functions del hackathon
 * (/api/hackathon/*). Adjunta el access token de Privy en cada request
 * autenticado mediante `getAccessToken()`.
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
  skills: string[]
  socials: Record<string, string>
  experience?: string | null
  looking_for_team: boolean
  status?: string
  created_at?: string
}

export interface TeamMember {
  id?: string
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
  leader_participant_id?: string
  invite_code?: string
  looking_for_members?: boolean
  needed_skills?: string[]
  max_members?: number
  members?: TeamMember[]
  created_at?: string
}

export interface HackathonNotification {
  id: string
  team_id: string
  team_name: string
  applicant_name: string
  role: string
  message: string
  created_at: string
  status: 'pending' | 'accepted' | 'rejected'
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
  return res.json() as Promise<T>
}

// ---------- Datos Demo / Fallback Estilo Devpost & DoraHacks ----------
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-ai-1',
    title: 'PumaCopilot · Autonomous DeFi Agent',
    tagline: 'Agente IA autónomo sobre Avalanche para optimización de yields e inversiones en tiempo real.',
    description:
      'PumaCopilot conecta LLMs especializados con smart contracts en Avalanche (C-Chain) para ejecutar estrategias de rebalanceo automático, mitigación de impermanent loss y alertas de seguridad DeFi 24/7 sin intervención humana.',
    repo_url: 'https://github.com/CriptoUNAM-Team/PumaCopilot-Demo',
    demo_url: 'https://pumacopilot.criptounam.xyz',
    video_url: 'https://youtube.com/watch?v=demo',
    logo_url: '/images/Proyectos_Hacks/PumaPay.svg',
    cover_url: '/images/trends-2026.png',
    tags: ['AI Agents', 'Avalanche', 'DeFi', 'Solidity', 'Python'],
    status: 'submitted',
    submitted_at: '2026-07-15T18:00:00Z',
    track: { id: 'ai-agents', name: 'AI & Autonomous Agents' },
    team: { id: 'team-demo-1', name: 'PumaAI Core' },
  },
  {
    id: 'demo-web3-2',
    title: 'PumaCredential · ZK Student Identity',
    tagline: 'Identidad universitaria soberana y credenciales verificables con Zero-Knowledge Proofs para la UNAM.',
    description:
      'Permite a estudiantes de la UNAM acreditar su tira de materias, calificaciones y estatus activo ante empleadores y protocolos Web3 preservando su privacidad total mediante criptografía ZK.',
    repo_url: 'https://github.com/CriptoUNAM-Team/PumaCredential',
    demo_url: 'https://credential.criptounam.xyz',
    logo_url: '/images/Proyectos_Hacks/Verifica.svg',
    cover_url: '/images/ethereum-verge.png',
    tags: ['Zero-Knowledge', 'Web3 Identity', 'Avalanche', 'RWA'],
    status: 'submitted',
    submitted_at: '2026-07-15T16:30:00Z',
    track: { id: 'web3-blockchain', name: 'Web3, DeFi & Blockchain' },
    team: { id: 'team-demo-2', name: 'UNAM ZK Labs' },
  },
  {
    id: 'demo-social-3',
    title: 'EcoChain UNAM · Social Good & Carbon Tracking',
    tagline: 'Trazabilidad de huella de carbono y compensación verde universitaria incentivada con tokens PUMA.',
    description:
      'Plataforma IoT + Blockchain donde facultades e institutos registran su ahorro energético y reciclaje, recibiendo recompensas on-chain verificadas por oráculos automáticos e IA.',
    repo_url: 'https://github.com/CriptoUNAM-Team/EcoChain-UNAM',
    logo_url: null,
    cover_url: null,
    tags: ['Social Good', 'Sustainability', 'IoT', 'Tokens'],
    status: 'submitted',
    submitted_at: '2026-07-15T14:15:00Z',
    track: { id: 'social-good', name: 'AI + Blockchain for Social Good' },
    team: { id: 'team-demo-3', name: 'Green Engineers FI' },
  },
]

export const DEMO_TEAMS: Team[] = [
  {
    id: 'team-demo-1',
    name: 'PumaAI Core',
    description: 'Buscamos desarrolladores Full-Stack (React/Next) y especialistas en Smart Contracts (Avalanche/Solidity) para construir nuestro agente DeFi autónomo.',
    invite_code: 'PUMAAI2026',
    leader_participant_id: 'p1',
    looking_for_members: true,
    max_members: 5,
    needed_skills: ['React', 'Solidity', 'Python/LLMs', 'UI/UX'],
    track: { id: 'ai-agents', name: 'AI & Autonomous Agents' },
    created_at: '2026-07-15T10:00:00Z',
    members: [
      { id: 'm1', role: 'leader', status: 'approved', participant: { id: 'p1', full_name: 'Alejandro V.', skills: ['Python', 'AI Agents', 'Rust'] } },
      { id: 'm2', role: 'member', status: 'approved', participant: { id: 'p2', full_name: 'Sofía M.', skills: ['UI/UX', 'Figma', 'Frontend'] } },
    ],
  },
  {
    id: 'team-demo-2',
    name: 'UNAM ZK Labs',
    description: 'Investigación y desarrollo de credenciales académicas soberanas con ZK. Buscamos entusiastas de criptografía y desarrolladores en Circom / Solidity.',
    invite_code: 'UNAMZK26',
    leader_participant_id: 'p3',
    looking_for_members: true,
    max_members: 5,
    needed_skills: ['Circom', 'ZK Proofs', 'Solidity', 'TypeScript'],
    track: { id: 'web3-blockchain', name: 'Web3, DeFi & Blockchain' },
    created_at: '2026-07-15T11:30:00Z',
    members: [
      { id: 'm3', role: 'leader', status: 'approved', participant: { id: 'p3', full_name: 'Carlos R.', skills: ['Cryptography', 'Math', 'Solidity'] } },
    ],
  },
  {
    id: 'team-demo-3',
    name: 'Green Engineers FI',
    description: 'Equipo interdisciplinario de la Facultad de Ingeniería enfocado en sustentabilidad y tokenización de activos de impacto social.',
    invite_code: 'GREENUNAM',
    leader_participant_id: 'p4',
    looking_for_members: true,
    max_members: 5,
    needed_skills: ['IoT', 'Solidity', 'Frontend', 'Marketing/Pitch'],
    track: { id: 'social-good', name: 'AI + Blockchain for Social Good' },
    created_at: '2026-07-15T12:00:00Z',
    members: [
      { id: 'm4', role: 'leader', status: 'approved', participant: { id: 'p4', full_name: 'Mariana L.', skills: ['Environmental Eng', 'Project Management'] } },
      { id: 'm5', role: 'member', status: 'approved', participant: { id: 'p5', full_name: 'Diego G.', skills: ['React', 'Node.js'] } },
    ],
  },
]

export const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q-demo-1',
    title: '¿Cuál es la fecha límite exacta para registrar mi equipo y subir el proyecto?',
    body: 'Queremos saber si el registro de equipos cierra el mismo día que inicia el hackathon intensivo de 72 horas.',
    category: 'reglas',
    is_answered: true,
    author_name: 'Equipo PumaAI',
    created_at: '2026-07-15T13:00:00Z',
    answers: [
      {
        id: 'a-demo-1',
        body: '¡Hola! La Fase 1 (Pre-registro y formación de equipos) está abierta en plataforma desde hoy 15 de julio hasta el 20 de septiembre. El hacking intensivo de 72 horas corre del 21 al 24 de septiembre. Puedes formar o modificar tu equipo hasta el 21 de septiembre a las 09:00 AM.',
        author_name: 'Organizador CriptoUNAM',
        is_official: true,
        created_at: '2026-07-15T13:30:00Z',
      },
    ],
  },
  {
    id: 'q-demo-2',
    title: '¿Podemos desplegar nuestro smart contract en la testnet de Avalanche (Fuji)?',
    body: 'Para la evaluación técnica, ¿es suficiente desplegar y demostrar el funcionamiento en Avalanche Fuji o debe ser en C-Chain mainnet?',
    category: 'tecnico',
    is_answered: true,
    author_name: 'Hacker Web3',
    created_at: '2026-07-15T15:00:00Z',
    answers: [
      {
        id: 'a-demo-2',
        body: 'El despliegue en Avalanche Fuji Testnet es 100% aceptado y recomendado para la evaluación. Si despliegan en Mainnet o integran herramientas de IA adicionales, sumará puntos extra en innovación.',
        author_name: 'Mentor Técnico',
        is_official: true,
        created_at: '2026-07-15T15:20:00Z',
      },
    ],
  },
]

// ---------- Helpers Locales & Supabase para Resiliencia 100% ----------
function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultVal
  } catch {
    return defaultVal
  }
}

function setLocal(key: string, val: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    // ignore quota exceeded
  }
}

// ---------- Participantes & Métodos Resilientes ----------
export const hackathonApi = {
  getMe: async () => {
    try {
      return await api<{ participant: Participant | null }>('/participants?me=1', { auth: true })
    } catch {
      const p = getLocal<Participant | null>('hackathon_my_participant', null)
      if (!p && supabase) {
        try {
          const { data } = await supabase.from('hackathon_participants').select('*').limit(1).maybeSingle()
          if (data) return { participant: data }
        } catch { /* ignore */ }
      }
      return { participant: p }
    }
  },
  listParticipants: async () => {
    try {
      return await api<{ participants: Participant[] }>('/participants', { auth: true })
    } catch {
      let list = getLocal<Participant[]>('hackathon_local_participants', [])
      if (supabase) {
        try {
          const { data } = await supabase.from('hackathon_participants').select('*')
          if (data && data.length > 0) list = data
        } catch { /* ignore */ }
      }
      return { participants: list }
    }
  },
  register: async (data: Partial<Participant>) => {
    try {
      return await api<{ participant: Participant }>('/participants', { method: 'POST', body: data, auth: true })
    } catch {
      const newP: Participant = {
        id: data.id || 'p-' + Date.now(),
        full_name: data.full_name || 'Hacker UNAM',
        email: data.email || '',
        wallet_address: data.wallet_address || '',
        bio: data.bio || '',
        skills: data.skills || ['React', 'Web3', 'AI'],
        socials: data.socials || {},
        experience: data.experience || 'intermediate',
        looking_for_team: data.looking_for_team ?? true,
        status: 'registered',
        created_at: new Date().toISOString(),
      }
      setLocal('hackathon_my_participant', newP)
      const list = getLocal<Participant[]>('hackathon_local_participants', [])
      setLocal('hackathon_local_participants', [newP, ...list.filter(x => x.id !== newP.id)])
      if (supabase) {
        try {
          await supabase.from('hackathon_participants').insert([newP])
        } catch { /* ignore */ }
      }
      return { participant: newP }
    }
  },
  updateProfile: async (data: Partial<Participant>) => {
    try {
      return await api<{ participant: Participant }>('/participants', { method: 'PATCH', body: data, auth: true })
    } catch {
      const current = getLocal<Participant | null>('hackathon_my_participant', null) || {
        id: 'p-' + Date.now(),
        full_name: data.full_name || 'Hacker UNAM',
        skills: [],
        socials: {},
        looking_for_team: true,
      }
      const updated: Participant = { ...current, ...data }
      setLocal('hackathon_my_participant', updated)
      if (supabase && updated.id) {
        try {
          await supabase.from('hackathon_participants').update(updated).eq('id', updated.id)
        } catch { /* ignore */ }
      }
      return { participant: updated }
    }
  },

  // ---------- Equipos (con fallback Supabase & Devpost) ----------
  listTeams: async () => {
    try {
      const res = await api<{ teams: Team[] }>('/teams', { auth: false })
      if (res.teams && res.teams.length > 0) return res
    } catch { /* use fallback */ }

    let list = [...DEMO_TEAMS]
    if (supabase) {
      try {
        const { data } = await supabase.from('hackathon_teams').select('*')
        if (data && data.length > 0) {
          list = [...data, ...DEMO_TEAMS]
        }
      } catch { /* ignore */ }
    }
    const localTeams = getLocal<Team[]>('hackathon_local_teams', [])
    const merged = [...localTeams, ...list]
    // deduplicate
    const map = new Map<string, Team>()
    merged.forEach(t => map.set(t.id, t))
    return { teams: Array.from(map.values()) }
  },
  myTeams: async () => {
    try {
      const res = await api<{ teams: Team[] }>('/teams?mine=1', { auth: true })
      if (res.teams && res.teams.length > 0) return res
    } catch { /* fallback */ }
    const localTeams = getLocal<Team[]>('hackathon_local_teams', [])
    return { teams: localTeams }
  },
  createTeam: async (data: Partial<Team>) => {
    try {
      return await api<{ team: Team }>('/teams', { method: 'POST', body: data, auth: true })
    } catch {
      const newTeam: Team = {
        id: 'team-' + Date.now(),
        name: data.name || 'Nuevo Equipo PUMA',
        description: data.description || 'Equipo enfocado en construir soluciones revolucionarias de AI & Blockchain para el hackathon.',
        invite_code: 'PUMA' + Math.floor(1000 + Math.random() * 9000),
        looking_for_members: data.looking_for_members ?? true,
        max_members: data.max_members || 5,
        needed_skills: data.needed_skills || ['React', 'Solidity', 'AI'],
        track: data.track || { id: 'ai-agents', name: 'AI & Autonomous Agents' },
        created_at: new Date().toISOString(),
        members: [
          {
            id: 'm-' + Date.now(),
            role: 'leader',
            status: 'approved',
            participant: getLocal<Participant | null>('hackathon_my_participant', null) || {
              id: 'p-leader',
              full_name: 'Hacker UNAM',
              skills: ['React', 'AI'],
            },
          },
        ],
      }
      const existing = getLocal<Team[]>('hackathon_local_teams', [])
      setLocal('hackathon_local_teams', [newTeam, ...existing])
      if (supabase) {
        try {
          await supabase.from('hackathon_teams').insert([{
            id: newTeam.id,
            name: newTeam.name,
            description: newTeam.description,
            invite_code: newTeam.invite_code,
            looking_for_members: newTeam.looking_for_members,
            max_members: newTeam.max_members,
          }])
        } catch { /* ignore */ }
      }
      return { team: newTeam }
    }
  },
  updateTeam: async (data: Partial<Team> & { team_id: string }) => {
    try {
      return await api<{ team: Team }>('/teams', { method: 'PATCH', body: data, auth: true })
    } catch {
      const teams = getLocal<Team[]>('hackathon_local_teams', [])
      const idx = teams.findIndex(t => t.id === data.team_id)
      const updated: Team = idx >= 0 ? { ...teams[idx], ...data } : {
        id: data.team_id,
        name: data.name || 'Equipo PUMA',
        description: data.description || '',
      }
      if (idx >= 0) teams[idx] = updated
      else teams.unshift(updated)
      setLocal('hackathon_local_teams', teams)
      return { team: updated }
    }
  },
  joinTeam: async (data: { team_id?: string; invite_code?: string; role?: string }) => {
    try {
      return await api<{ team: Team }>('/teams?action=join', { method: 'POST', body: data, auth: true })
    } catch {
      const all = getLocal<Team[]>('hackathon_local_teams', [...DEMO_TEAMS])
      const team = all.find(t => t.id === data.team_id || t.invite_code === data.invite_code) || DEMO_TEAMS[0]
      const notifs = getLocal<HackathonNotification[]>('hackathon_notifications', [])
      const newNotif: HackathonNotification = {
        id: 'notif-' + Date.now(),
        team_id: team.id,
        team_name: team.name,
        applicant_name: 'Hacker Web3 (' + (data.role || 'Desarrollador') + ')',
        role: data.role || 'Colaborador',
        message: `Ha solicitado unirse a tu equipo "${team.name}" como ${data.role || 'miembro de equipo'}.`,
        created_at: new Date().toISOString(),
        status: 'pending'
      }
      setLocal('hackathon_notifications', [newNotif, ...notifs])
      if (supabase) {
        try {
          await supabase.from('hackathon_notifications').insert([newNotif])
        } catch { /* ignore */ }
      }
      return { team }
    }
  },
  getNotifications: () => {
    return getLocal<HackathonNotification[]>('hackathon_notifications', [])
  },
  getNotificationsAsync: async (): Promise<HackathonNotification[]> => {
    if (supabase) {
      try {
        const { data } = await supabase.from('hackathon_notifications').select('*').order('created_at', { ascending: false })
        if (data && data.length > 0) {
          setLocal('hackathon_notifications', data)
          return data
        }
      } catch { /* ignore */ }
    }
    return getLocal<HackathonNotification[]>('hackathon_notifications', [])
  },
  respondToNotification: async (id: string, status: 'accepted' | 'rejected') => {
    const list = getLocal<HackathonNotification[]>('hackathon_notifications', [])
    const updated = list.map(n => n.id === id ? { ...n, status } : n)
    setLocal('hackathon_notifications', updated)
    if (supabase) {
      try {
        await supabase.from('hackathon_notifications').update({ status }).eq('id', id)
      } catch { /* ignore */ }
    }
    return updated
  },
  leaveTeam: async (team_id: string) => {
    try {
      return await api<{ ok: boolean }>('/teams?action=leave', { method: 'POST', body: { team_id }, auth: true })
    } catch {
      return { ok: true }
    }
  },

  // ---------- Proyectos (con fallback Supabase & Devpost) ----------
  gallery: async () => {
    try {
      const res = await api<{ projects: Project[] }>('/projects')
      if (res.projects) return res
    } catch { /* use fallback */ }

    let list: Project[] = []
    if (supabase) {
      try {
        const { data } = await supabase.from('hackathon_projects').select('*')
        if (data && data.length > 0) list = [...data]
      } catch { /* ignore */ }
    }
    const localProj = getLocal<Project[]>('hackathon_local_projects', [])
    const merged = [...localProj, ...list]
    const map = new Map<string, Project>()
    merged.forEach(p => map.set(p.id, p))
    return { projects: Array.from(map.values()) }
  },
  myProject: async () => {
    try {
      const res = await api<{ project: Project | null; team_id?: string }>('/projects?mine=1', { auth: true })
      if (res.project) return res
    } catch { /* fallback */ }
    const localProj = getLocal<Project[]>('hackathon_local_projects', [])
    return { project: localProj[0] || null }
  },
  saveProject: async (data: Partial<Project>) => {
    try {
      return await api<{ project: Project }>('/projects', { method: 'POST', body: data, auth: true })
    } catch {
      const proj: Project = {
        id: data.id || 'proj-' + Date.now(),
        title: data.title || 'Proyecto PUMA',
        tagline: data.tagline || 'Solución innovadora para el Hackathon UNAM 2026',
        description: data.description || '',
        repo_url: data.repo_url || '',
        demo_url: data.demo_url || '',
        video_url: data.video_url || '',
        slides_url: data.slides_url || '',
        cover_url: data.cover_url || null,
        logo_url: data.logo_url || null,
        tags: data.tags || ['AI', 'Avalanche'],
        status: data.status || 'draft',
        submitted_at: data.status === 'submitted' ? new Date().toISOString() : null,
        track: data.track || { id: data.track_id || 'ai-agents', name: data.track_id ? 'Track ' + data.track_id : 'AI & Autonomous Agents' },
        track_id: data.track_id || null,
      }
      const existing = getLocal<Project[]>('hackathon_local_projects', [])
      setLocal('hackathon_local_projects', [proj, ...existing.filter(p => p.id !== proj.id)])
      if (supabase) {
        try {
          await supabase.from('hackathon_projects').upsert([{
            id: proj.id,
            title: proj.title,
            tagline: proj.tagline,
            description: proj.description,
            repo_url: proj.repo_url,
            demo_url: proj.demo_url,
            video_url: proj.video_url,
            slides_url: proj.slides_url,
            cover_url: proj.cover_url,
            logo_url: proj.logo_url,
            tags: proj.tags,
            track_id: proj.track_id,
            status: proj.status,
            submitted_at: proj.submitted_at,
          }])
        } catch { /* ignore */ }
      }
      return { project: proj }
    }
  },
  submitProject: async (data: Partial<Project>) => {
    return hackathonApi.saveProject({ ...data, status: 'submitted', submitted_at: new Date().toISOString() })
  },

  // ---------- Dudas (con fallback Supabase & Devpost) ----------
  listQuestions: async () => {
    try {
      const res = await api<{ questions: Question[] }>('/questions')
      if (res.questions && res.questions.length > 0) return res
    } catch { /* fallback */ }

    let list = [...DEMO_QUESTIONS]
    if (supabase) {
      try {
        const { data } = await supabase.from('hackathon_questions').select('*')
        if (data && data.length > 0) list = [...data, ...DEMO_QUESTIONS]
      } catch { /* ignore */ }
    }
    const localQ = getLocal<Question[]>('hackathon_local_questions', [])
    const merged = [...localQ, ...list]
    const map = new Map<string, Question>()
    merged.forEach(q => map.set(q.id, q))
    return { questions: Array.from(map.values()) }
  },
  askQuestion: async (data: { title: string; body: string; category?: string }) => {
    try {
      return await api<{ question: Question }>('/questions', { method: 'POST', body: data, auth: true })
    } catch {
      const newQ: Question = {
        id: 'q-' + Date.now(),
        title: data.title,
        body: data.body,
        category: data.category || 'general',
        is_answered: false,
        author_name: getLocal<Participant | null>('hackathon_my_participant', null)?.full_name || 'Hacker UNAM',
        created_at: new Date().toISOString(),
        answers: [],
      }
      const existing = getLocal<Question[]>('hackathon_local_questions', [])
      setLocal('hackathon_local_questions', [newQ, ...existing])
      if (supabase) {
        try {
          await supabase.from('hackathon_questions').insert([{
            id: newQ.id,
            title: newQ.title,
            body: newQ.body,
            category: newQ.category,
          }])
        } catch { /* ignore */ }
      }
      return { question: newQ }
    }
  },
  answerQuestion: async (data: { question_id: string; body: string }) => {
    try {
      return await api<{ answer: Answer }>('/questions?action=answer', { method: 'POST', body: data, auth: true })
    } catch {
      const newA: Answer = {
        id: 'a-' + Date.now(),
        body: data.body,
        author_name: 'Mentor UNAM',
        is_official: true,
        created_at: new Date().toISOString(),
      }
      const questions = getLocal<Question[]>('hackathon_local_questions', [])
      const idx = questions.findIndex(q => q.id === data.question_id)
      if (idx >= 0) {
        questions[idx].answers = [...(questions[idx].answers || []), newA]
        questions[idx].is_answered = true
        setLocal('hackathon_local_questions', questions)
      }
      return { answer: newA }
    }
  },

  // ---------- Admin ----------
  adminOverview: async () => {
    try {
      return await api<{ counts: Record<string, number> }>('/admin?resource=overview', { auth: true })
    } catch {
      return { counts: { participants: 18, teams: 6, projects: 5, questions: 4 } }
    }
  },
  adminParticipants: async () => {
    try {
      return await api<{ participants: Participant[] }>('/admin?resource=participants', { auth: true })
    } catch {
      const list = getLocal<Participant[]>('hackathon_local_participants', [])
      return { participants: list }
    }
  },
  adminTeams: async () => {
    try {
      return await api<{ teams: Team[] }>('/admin?resource=teams', { auth: true })
    } catch {
      const res = await hackathonApi.listTeams()
      return { teams: res.teams }
    }
  },
  adminProjects: async () => {
    try {
      return await api<{ projects: (Project & { scores?: any[] })[] }>('/admin?resource=projects', { auth: true })
    } catch {
      const res = await hackathonApi.gallery()
      return { projects: res.projects }
    }
  },
  score: async (data: { project_id: string; criteria?: Record<string, number>; total?: number; feedback?: string }) => {
    try {
      return await api<{ score: any }>('/admin?action=score', { method: 'POST', body: data, auth: true })
    } catch {
      return { score: { project_id: data.project_id, total: data.total || 10, feedback: data.feedback } }
    }
  },
}

// Tracks del hackathon (constantes del front; el seed vive en la DB).
export const HACKATHON_TRACKS: Track[] = [
  {
    id: 'ai-agents',
    name: 'AI & Autonomous Agents',
    description:
      'Agentes autónomos, LLMs especializados, pipelines inteligentes, copilot y herramientas de nueva generación para revolucionar industrias.',
  },
  {
    id: 'web3-blockchain',
    name: 'Web3, DeFi & Blockchain',
    description:
      'Infraestructura descentralizada, smart contracts en Avalanche, protocolos DeFi, identidad digital, ZK proofs y tokenización (RWA).',
  },
  {
    id: 'social-good',
    name: 'AI + Blockchain for Social Good',
    description:
      'Soluciones de impacto social, ambiental, educativo o universitario para la UNAM y la Semana DIE combinando Inteligencia Artificial y Web3.',
  },
]

export const HACKATHON_INFO = {
  name: 'Hackathon UNAM 2026 · AI & Blockchain',
  duration: '72 Horas Intensivas',
  startsAt: '2026-09-21T09:00:00-06:00',
  endsAt: '2026-09-24T09:00:00-06:00',
  location: 'Facultad de Ingeniería, UNAM · CDMX (Presencial & Híbrido)',
  event: 'Semana DIE',
  prizePool: 'Premios por confirmar · PUMA Drops · Becas e Incubación',
  organizers: ['CriptoUNAM', 'Facultad de Ingeniería UNAM'],
}

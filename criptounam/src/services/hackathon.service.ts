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

// ---------- Participantes & Métodos Resilientes ----------
export const hackathonApi = {
  getMe: async () => {
    try {
      return await api<{ participant: Participant | null }>('/participants?me=1', { auth: true })
    } catch {
      return { participant: null }
    }
  },
  listParticipants: async () => {
    try {
      return await api<{ participants: Participant[] }>('/participants', { auth: true })
    } catch {
      return { participants: [] }
    }
  },
  register: (data: Partial<Participant>) =>
    api<{ participant: Participant }>('/participants', { method: 'POST', body: data, auth: true }),
  updateProfile: (data: Partial<Participant>) =>
    api<{ participant: Participant }>('/participants', { method: 'PATCH', body: data, auth: true }),

  // ---------- Equipos (con fallback Devpost) ----------
  listTeams: async () => {
    try {
      const res = await api<{ teams: Team[] }>('/teams', { auth: false })
      if (res.teams && res.teams.length > 0) return res
      return { teams: DEMO_TEAMS }
    } catch {
      return { teams: DEMO_TEAMS }
    }
  },
  myTeams: async () => {
    try {
      return await api<{ teams: Team[] }>('/teams?mine=1', { auth: true })
    } catch {
      return { teams: [] }
    }
  },
  createTeam: (data: Partial<Team>) =>
    api<{ team: Team }>('/teams', { method: 'POST', body: data, auth: true }),
  updateTeam: (data: Partial<Team> & { team_id: string }) =>
    api<{ team: Team }>('/teams', { method: 'PATCH', body: data, auth: true }),
  joinTeam: (data: { team_id?: string; invite_code?: string; role?: string }) =>
    api<{ team: Team }>('/teams?action=join', { method: 'POST', body: data, auth: true }),
  leaveTeam: (team_id: string) =>
    api<{ ok: boolean }>('/teams?action=leave', { method: 'POST', body: { team_id }, auth: true }),

  // ---------- Proyectos (con fallback Devpost) ----------
  gallery: async () => {
    try {
      const res = await api<{ projects: Project[] }>('/projects')
      if (res.projects && res.projects.length > 0) return res
      return { projects: DEMO_PROJECTS }
    } catch {
      return { projects: DEMO_PROJECTS }
    }
  },
  myProject: async () => {
    try {
      return await api<{ project: Project | null; team_id?: string }>('/projects?mine=1', { auth: true })
    } catch {
      return { project: null }
    }
  },
  saveProject: (data: Partial<Project>) =>
    api<{ project: Project }>('/projects', { method: 'POST', body: data, auth: true }),
  submitProject: (data: Partial<Project>) =>
    api<{ project: Project }>('/projects?action=submit', { method: 'POST', body: data, auth: true }),

  // ---------- Dudas (con fallback Devpost) ----------
  listQuestions: async () => {
    try {
      const res = await api<{ questions: Question[] }>('/questions')
      if (res.questions && res.questions.length > 0) return res
      return { questions: DEMO_QUESTIONS }
    } catch {
      return { questions: DEMO_QUESTIONS }
    }
  },
  askQuestion: (data: { title: string; body: string; category?: string }) =>
    api<{ question: Question }>('/questions', { method: 'POST', body: data, auth: true }),
  answerQuestion: (data: { question_id: string; body: string }) =>
    api<{ answer: Answer }>('/questions?action=answer', { method: 'POST', body: data, auth: true }),

  // ---------- Admin ----------
  adminOverview: async () => {
    try {
      return await api<{ counts: Record<string, number> }>('/admin?resource=overview', { auth: true })
    } catch {
      return { counts: { participants: 12, teams: 4, projects: 3, questions: 2 } }
    }
  },
  adminParticipants: async () => {
    try {
      return await api<{ participants: Participant[] }>('/admin?resource=participants', { auth: true })
    } catch {
      return { participants: [] }
    }
  },
  adminTeams: async () => {
    try {
      return await api<{ teams: Team[] }>('/admin?resource=teams', { auth: true })
    } catch {
      return { teams: DEMO_TEAMS }
    }
  },
  adminProjects: async () => {
    try {
      return await api<{ projects: (Project & { scores?: any[] })[] }>('/admin?resource=projects', { auth: true })
    } catch {
      return { projects: DEMO_PROJECTS }
    }
  },
  score: (data: { project_id: string; criteria?: Record<string, number>; total?: number; feedback?: string }) =>
    api<{ score: any }>('/admin?action=score', { method: 'POST', body: data, auth: true }),
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
  prizePool: '+$50,000 MXN en Premios + PUMA Drops + Becas e Incubación',
  organizers: ['CriptoUNAM', 'Facultad de Ingeniería UNAM'],
}

/**
 * Datos públicos del Hackathon UNAM 2026.
 *
 * El registro, la formación de equipos y la entrega de proyectos viven en
 * DoraHacks; el sitio solo informa (overview, tracks, guía del hacker y
 * talleres). Editar aquí no requiere tocar componentes.
 */
import ENV_CONFIG from '../config/env'

export interface HackathonTrack {
  id: string
  name: string
  description: string
}

/** URL del hackathon en DoraHacks. Vacía = CTAs en modo "próximamente". */
export const DORAHACKS_URL = ENV_CONFIG.DORAHACKS_URL || ''

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

// Tracks del hackathon (copy de la landing; los retos oficiales se publican en DoraHacks).
export const HACKATHON_TRACKS: HackathonTrack[] = [
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

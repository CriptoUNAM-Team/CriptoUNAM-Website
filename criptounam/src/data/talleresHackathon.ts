/**
 * Talleres del programa GOYA HACK.
 *
 * La página embebe el calendario Luma completo. La lista de abajo es
 * referencia rápida (mismos eventos) por si hace falta un enlace suelto.
 * Calendario: https://luma.com/embed/calendar/cal-WEjXSRR5jeIrWLb/events
 */

export interface TallerHackathon {
  id: string
  title: string
  /** ID del evento en Luma (`evt-...`). */
  lumaEventId: string
  date: string
  ponente?: string
  description?: string
  tag?: 'IA' | 'Web3' | 'Producto' | 'General'
  estado: 'proximo' | 'grabado'
}

/** ID del calendario Luma GOYA HACK (embed oficial). */
export const LUMA_CALENDAR_EMBED_ID = 'cal-WEjXSRR5jeIrWLb'
export const LUMA_CALENDAR_EMBED_URL = `https://luma.com/embed/calendar/${LUMA_CALENDAR_EMBED_ID}/events`
export const LUMA_CALENDAR_URL = 'https://luma.com/goyahack'

export const TALLERES_HACKATHON: TallerHackathon[] = [
  {
    id: 'stellar',
    title: 'Stellar · Contratos, wallets y Testnet',
    lumaEventId: 'evt-f2g1kccxjyf1nAI',
    date: 'Miércoles 23 · 11:00',
    ponente: 'BAF · Fernanda Tello',
    description: 'Contratos inteligentes, wallets y despliegue en Testnet Stellar.',
    tag: 'Web3',
    estado: 'proximo',
  },
  {
    id: 'pollar',
    title: 'POLLAR · Smart Wallets',
    lumaEventId: 'evt-JPaqgamSfiQIUZm',
    date: 'Miércoles 23 · 13:00',
    description: 'Smart wallets y producto on-chain con Pollar.',
    tag: 'Web3',
    estado: 'proximo',
  },
  {
    id: 'modelo-negocio',
    title: 'Modelo de negocio',
    lumaEventId: 'evt-jVrGyEAFdkJPiD0',
    date: 'Miércoles 23 · 14:00',
    ponente: 'Dorian Posternak',
    description: 'De demo a producto: valor, usuarios y pitch.',
    tag: 'Producto',
    estado: 'proximo',
  },
  {
    id: 'avalanche-l1',
    title: 'Despliega tu L1 en Avalanche',
    lumaEventId: 'evt-I93HQIPNzOOTYua',
    date: 'Miércoles 23 · 15:00',
    ponente: 'Team1 · Sofia',
    description: 'Taller Team 1: cómo desplegar tu L1 en Avalanche.',
    tag: 'Web3',
    estado: 'proximo',
  },
  {
    id: 'apex-am',
    title: 'SUBE TU PROYECTO · APEX',
    lumaEventId: 'evt-TcgrHFZImwDVZHc',
    date: 'Jueves 24 · 11:00',
    ponente: 'BAF · Fernanda Tello',
    description: 'Checklist de entrega en el panel del hacker.',
    tag: 'General',
    estado: 'proximo',
  },
  {
    id: 'avax-office',
    title: 'Office Hours Avalanche',
    lumaEventId: 'evt-lFMbIjCSXHPgHDS',
    date: 'Jueves 24 · 11:00',
    ponente: 'Team1 · Sofia',
    description: 'Dudas técnicas del reto Avalanche (en paralelo con APEX).',
    tag: 'Web3',
    estado: 'proximo',
  },
  {
    id: 'grantfox',
    title: 'GrantFox × CriptoUNAM · De Cero a Contributor',
    lumaEventId: 'evt-V0oECdHGIEKRoU3',
    date: 'Jueves 24 · 12:00',
    description: 'Workshop: de cero a contributor en open source.',
    tag: 'Producto',
    estado: 'proximo',
  },
  {
    id: 'apex-pm',
    title: 'SUBE TU PROYECTO · APEX',
    lumaEventId: 'evt-oLTfPYJFsYhh2pD',
    date: 'Jueves 24 · 15:00',
    description: 'Segunda sesión de entrega antes del deadline.',
    tag: 'General',
    estado: 'proximo',
  },
]

export const talleresProximos = () => TALLERES_HACKATHON.filter((t) => t.estado === 'proximo')
export const talleresGrabados = () => TALLERES_HACKATHON.filter((t) => t.estado === 'grabado')

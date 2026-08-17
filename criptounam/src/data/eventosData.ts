import { HACKATHON_INFO, HACKATHON_RESUMEN, FECHAS_CARTEL } from './hackathonInfo'

/**
 * Eventos mostrados en la página (carrusel "Eventos anteriores" en Home).
 * Editar aquí para agregar o modificar eventos.
 *
 * Imágenes: colocar en public/images/eventos/ con los nombres indicados en cada
 * propiedad "image". Ver public/images/eventos/README.md para la lista de archivos.
 */

export interface EventoItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  /** Ruta desde public: /images/eventos/nombre-archivo.jpg */
  image: string
  description: string
  capacity?: number
  registered?: number
  isUpcoming: boolean
  link?: string
}


/**
 * CriptoUNAM Connect - Spaces y charlas en vivo
 * Cada space debe tener un banner/imagen para mostrar en la página
 */
export interface SpaceItem {
  id: string
  title: string
  date: string
  time: string
  host: string
  url: string // Link to X Space / Recording
  image: string // Banner del space (requerido)
  description?: string // Descripción breve del tema
  status: 'upcoming' | 'past'
}

export interface HackathonItem {
  id: string
  name: string
  description: string
  date: string
  location: string // 'Online', 'CDMX', etc.
  url: string
  image: string
  status: 'upcoming' | 'live' | 'past'
  prizes?: string
}

export const eventosData: EventoItem[] = [
  // Eventos con imagen/card se agregan aquí si se necesitan en el futuro.
  // Los vigentes actuales están en eventosLumaPresenciales (Luma embed + inscripción).
]

/**
 * Eventos presenciales con embed de Luma (misma sección que Eventos Presenciales).
 * Cada evento usa el iframe de Luma y el botón de inscripción.
 */
export interface EventoLumaItem {
  id: string
  title: string
  lumaEventId: string
  description?: string
}

export const eventosLumaPresenciales: EventoLumaItem[] = []

/**
 * Eventos pasados con embed de Luma (solo visualización / replay).
 */
export interface EventoLumaPasadoItem {
  id: string
  title: string
  lumaEventId: string
  date: string
  time?: string
  location: string
  description?: string
}

export const eventosLumaPasados: EventoLumaPasadoItem[] = [
  {
    id: 'pasado-compufest-1',
    title: 'compufest[1] - Charlas & Talleres',
    lumaEventId: 'evt-YbUemgYQBVXzncy',
    date: 'Mayo de 2026',
    location: 'Facultad de Ingeniería UNAM, Ciudad de México',
    description: 'Charlas y talleres sobre Web3 y tecnología.',
  },
  {
    id: 'pasado-avax-bootcamp',
    title: 'Evento AVAX — Bootcamp Economía y Blockchain 103',
    lumaEventId: 'evt-l60ZZPw90Y3rDb7',
    date: 'Marzo de 2026',
    location: 'Facultad de Economía UNAM, Ciudad de México',
    description: 'Bootcamp Economía y Blockchain 103 - UNAM → Stellar.',
  },
  {
    id: 'pasado-economia-unam-series',
    title: 'Eventos en Economía UNAM',
    lumaEventId: 'evt-9EZHF61m0RlO7GF',
    date: 'Marzo de 2026',
    location: 'Facultad de Economía UNAM, Ciudad de México',
    description: 'Eventos y talleres de CriptoUNAM en la Facultad de Economía.',
  },
  {
    id: 'pasado-monad-blitz',
    title: 'Monad Blitz - UNAM',
    lumaEventId: 'evt-otiVS1hdI5QlmC7',
    date: '19 de febrero',
    time: '16:00 - 17:30',
    location: 'Facultad de Economía - Edificio Anexo, Ciudad de México',
  },
  {
    id: 'pasado-arg-side',
    title: 'CriptoUNAM ARG Side Event',
    lumaEventId: 'evt-BYqyc09TyCmXyYg',
    date: '15 de noviembre de 2025',
    time: '13:45 - 15:15 GMT-3',
    location: 'Paraguay 412, Ciudad Autónoma de Buenos Aires',
  },
  {
    id: 'pasado-pitch-starknet',
    title: 'Pitch Day Starknet - Cámara de Diputados',
    lumaEventId: 'evt-ywXRPGBAwHia8yt',
    date: '16 de octubre de 2025',
    time: '10:00 - 15:00',
    location: 'Cámara de Diputados LXVI Legislatura, Ciudad de México',
  },
  {
    id: 'pasado-stellar-summer',
    title: 'Stellar Summer Fridays - CDMX',
    lumaEventId: 'evt-KnpUpK0yh786nXD',
    date: '15 de agosto de 2025',
    time: '14:00 - 19:00',
    location: 'Flemish Pixel, Ciudad de México',
  },
  {
    id: 'pasado-workshop-ideathon',
    title: 'Workshop e Ideathon US2025',
    lumaEventId: 'evt-FfvZZNFozVVyGnN',
    date: '1 de agosto de 2025',
    time: '9:00 - 19:00',
    location: 'Zacatlán de las Manzanas, Zacatlán, Puebla',
  },
  {
    id: 'pasado-ledger-leaders',
    title: 'Ledger Leaders - Side Event CriptoUNAM',
    lumaEventId: 'evt-QAAORjKngI2AT6X',
    date: '19 de mayo de 2025',
    time: '16:30 - 20:30',
    location: 'Auditorium Raúl J. Marsal, Ciudad de México',
  },
  {
    id: 'pasado-blockchain-defi',
    title: 'Blockchain y Finanzas Descentralizadas',
    lumaEventId: 'evt-8m8B6nemQOH9FcV',
    date: '7 de mayo de 2025',
    time: '13:00 - 15:00',
    location: 'Facultad de Contaduría y Administración UNAM, Ciudad de México',
  },
  {
    id: 'pasado-tour-unam',
    title: 'CriptoUNAM Tour: Experiencia UNAM',
    lumaEventId: 'evt-u6VOlnOIkDps7dD',
    date: '29 de abril de 2025',
    time: '10:00 - 14:00',
    location: 'UNAM, Ciudad de México',
  },
]

/**
 * CriptoUNAM Connect - Spaces y charlas en vivo
 * Agregar banners en /public/images/spaces/
 */
export const spacesData: SpaceItem[] = [
  {
    id: 'space-1',
    title: 'El Futuro de Ethereum con Vitalik (Recap)',
    date: '10 de Octubre, 2024',
    time: '8:00 PM',
    host: 'CriptoUNAM Core Team',
    url: 'https://twitter.com/criptounam',
    image: '/images/spaces/ethereum-future.png', // TODO: Agregar imagen
    description: 'Análisis de las últimas propuestas de Vitalik para el futuro de Ethereum.',
    status: 'past',
  },
  {
    id: 'space-2',
    title: 'Introducción a Starknet y L2s',
    date: '15 de Noviembre, 2024',
    time: '7:00 PM',
    host: 'Starknet Mexico',
    url: 'https://twitter.com/criptounam',
    image: '/images/spaces/starknet-l2s.png', // TODO: Agregar imagen
    description: 'Aprende sobre las soluciones de escalabilidad Layer 2 y Starknet.',
    status: 'past',
  }
]

export const hackathonsData: HackathonItem[] = [
  // ========== HACKATHONES 2026 ==========
  {
    id: 'hack-unam-2026',
    name: `${HACKATHON_INFO.brand} — Facultad de Ingeniería`,
    // Nombre, cifras y fechas vienen de HACKATHON_INFO para no volver a
    // divergir del resto del sitio; ver src/data/hackathonInfo.ts. La fecha
    // estaba escrita a mano y se quedó en "21 - 24" cuando el evento pasó a
    // ser del 22 al 26.
    description: HACKATHON_RESUMEN,
    date: `${FECHAS_CARTEL.rango} Septiembre, 2026`,
    location: 'Facultad de Ingeniería UNAM · CDMX',
    url: '/hackathon',
    image: '/images/semanadie/sponsorship/hackathon-unamxhacks.png',
    status: 'upcoming',
    prizes: 'Premios + POAP + Aceleración',
  },
  {
    id: 'hack-celo',
    name: 'Celo - Latam Buildathon',
    description: 'Hackathon específico para talento de Latinoamérica. Enfocado en "ship fast" y MiniApps (Farcaster/MiniPay). ¡Dan 3 CELO para gas por equipo!',
    date: '19 Enero - 27 Febrero, 2026',
    location: 'Online',
    url: 'https://latamhubs.lat',
    image: '/images/hackathones_proximos/celobuild.jpeg',
    status: 'past',
    prizes: 'Open Track + MiniApps Track',
  },
  {
    id: 'hack-avalanche',
    name: 'Avalanche - Build Games',
    description: 'Competencia enfocada en productos de alta calidad y cultura crypto nativa. Buscan builders que entreguen un producto real en 6 semanas.',
    date: '20 Enero - 13 Febrero, 2026',
    location: 'Online',
    url: 'https://build.avax.network',
    image: '/images/hackathones_proximos/avas.jpeg',
    status: 'past',
    prizes: '$1,000,000 USD',
  },
  {
    id: 'hack-near',
    name: 'NEAR - Innovation Sandbox',
    description: 'Sprint virtual sobre capacidades avanzadas de NEAR: AI Agentes, Abstracción de Cuentas y Privacidad. Los ganadores se presentan en NEARCON.',
    date: '26 Enero - 16 Febrero, 2026',
    location: 'Online',
    url: 'https://nearcon.org/innovation-sandbox',
    image: '/images/hackathones_proximos/nearhack.jpeg',
    status: 'past',
    prizes: 'Presentación en NEARCON',
  },
  {
    id: 'hack-starknet',
    name: 'Starknet - Re{define} Hackathon',
    description: 'Enfocado en escalar Bitcoin y soluciones de privacidad usando ZK-Proofs. DeFi nativo en BTC y aplicaciones de privacidad en Cairo.',
    date: '1 Febrero - 28 Febrero, 2026',
    location: 'Online',
    url: 'https://hackathon.starknet.org',
    image: '/images/hackathones_proximos/starknet.jpeg',
    status: 'past',
    prizes: 'DeFi + Privacy Tracks',
  },
  {
    id: 'hack-gemini',
    name: 'Gemini 3.0: The Space-Time Odyssey',
    description: 'Hackathon masivo centrado en la red Gemini (Subspace Network) para infraestructura descentralizada. Web3 Infrastructure, AI descentralizada y DePIN.',
    date: '2 Febrero - 16 Marzo, 2026',
    location: 'Online',
    url: 'https://gemini3.devpost.com',
    image: '/images/hackathones_proximos/gemini.jpeg',
    status: 'past',
    prizes: '$100,000 USD',
  },
  {
    id: 'hack-arbitrum',
    name: 'Arbitrum - Open House NYC',
    description: 'Construye sobre el stack que usan grandes instituciones. DeFi, Gaming o DePIN usando Stylus (Rust) o Solidity. Los mejores van a Founder House en NYC.',
    date: '5 Febrero - 22 Febrero, 2026',
    location: 'Online + NYC',
    url: 'https://hackquest.io',
    image: '/images/hackathones_proximos/arbitrum.jpeg',
    status: 'past',
    prizes: 'Founder House NYC',
  },
  {
    id: 'hack-hedera',
    name: 'Hedera - Hello Future Apex Hackathon',
    description: 'Evento virtual global para innovar sobre Hedera. Tracks: AI & Agentes, Tokenización y Sustentabilidad.',
    date: '17 Febrero - 16 Marzo, 2026',
    location: 'Online',
    url: 'https://stackup.dev',
    image: '/images/hackathones_proximos/Hedera.jpeg',
    status: 'past',
    prizes: '$250,000 USD',
  },
  {
    id: 'hack-chainlink',
    name: 'Chainlink - Convergence Hackathon',
    description: 'Interoperabilidad y datos del mundo real. Uso de CCIP y Oráculos para conectar smart contracts con cualquier API.',
    date: 'Registro Abierto, 2026',
    location: 'Online',
    url: 'https://chain.link/hackathon',
    image: '/images/hackathones_proximos/chainlink.jpeg',
    status: 'past',
    prizes: 'CCIP + Oracles Tracks',
  },
  {
    id: 'hack-ethglobal-hackmoney',
    name: 'ETHGlobal - HackMoney 2026',
    description: 'El evento cumbre para el futuro de las finanzas descentralizadas. El hackathon DeFi más importante del ecosistema Ethereum.',
    date: 'Próximamente, 2026',
    location: 'Online',
    url: 'https://ethglobal.com/events/hackmoney2026',
    image: '/images/hackathones_proximos/hackmoney.jpeg',
    status: 'past',
    prizes: 'DeFi Track',
  },
]

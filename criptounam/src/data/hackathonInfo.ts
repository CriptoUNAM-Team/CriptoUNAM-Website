/**
 * Datos públicos del Hackathon UNAM 2026.
 *
 * El registro, la formación de equipos y la entrega de proyectos viven en la
 * plataforma propia (/hackathon/dashboard y siguientes). Este archivo concentra
 * el contenido de la landing: editarlo no requiere tocar componentes.
 *
 * ⚠️ Lo marcado con TODO son marcadores de posición: revisar antes de publicar.
 */

export interface HackathonTrack {
  id: string
  name: string
  description: string
}

export const HACKATHON_INFO = {
  /** Nombre propio del evento, el que se usa como marca en la landing. */
  brand: 'Goya Hack',
  name: 'Goya Hack · Hackathon UNAM 2026',
  duration: '72 Horas Intensivas',
  /** Kickoff. Coincide con `hackathons.starts_at` en Supabase. */
  startsAt: '2026-09-21T09:00:00-06:00',
  /** Cierre de entregas: 72 h exactas desde el kickoff. */
  hackingEndsAt: '2026-09-24T09:00:00-06:00',
  /** Fin del evento, ceremonia incluida. Coincide con `hackathons.ends_at`. */
  endsAt: '2026-09-24T20:00:00-06:00',
  location: 'Facultad de Ingeniería, UNAM · CDMX (Presencial & Híbrido)',
  event: 'Semana DIE',
  prizePool: 'Premios por confirmar · PUMA Drops · Becas e Incubación',
  organizers: ['CriptoUNAM', 'Facultad de Ingeniería UNAM'],
  /** Controla el copy del CTA y el chip de estado en la landing. */
  registroAbierto: true,
  /**
   * Duración en horas, como número. Home y Eventos la leen de aquí: antes cada
   * página tenía la suya y llegaron a anunciar 48 h mientras la landing decía
   * 72, con las tres visibles en producción a la vez.
   */
  horas: 72,
}

// Tracks del hackathon. Los retos concretos de cada track se publican en la guía.
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

/* ========================================================================== */
/* Premios                                                                     */
/* ========================================================================== */

export interface Premio {
  id: string
  /** 'Track', 'General', 'Especial'… agrupa las tarjetas. */
  categoria: string
  titulo: string
  /** Monto o descripción. TODO: sustituir por los montos reales. */
  monto: string
  descripcion: string
  destacado?: boolean
}

// TODO(premios): montos por confirmar con patrocinadores.
export const PREMIOS: Premio[] = [
  {
    id: 'primer-lugar',
    categoria: 'General',
    titulo: '1.º lugar',
    monto: 'Por confirmar',
    descripcion: 'Bolsa principal, incubación con CriptoUNAM y $PUMA para el equipo.',
    destacado: true,
  },
  {
    id: 'segundo-lugar',
    categoria: 'General',
    titulo: '2.º lugar',
    monto: 'Por confirmar',
    descripcion: 'Bolsa secundaria y mentoría técnica para llevar el BUIDL a producción.',
  },
  {
    id: 'tercer-lugar',
    categoria: 'General',
    titulo: '3.º lugar',
    monto: 'Por confirmar',
    descripcion: 'Bolsa de reconocimiento y acceso al programa de embajadores.',
  },
  {
    id: 'mejor-ai',
    categoria: 'Track',
    titulo: 'Mejor proyecto de AI & Agents',
    monto: 'Por confirmar',
    descripcion: 'Al proyecto que mejor aproveche agentes autónomos o modelos especializados.',
  },
  {
    id: 'mejor-web3',
    categoria: 'Track',
    titulo: 'Mejor proyecto Web3 & DeFi',
    monto: 'Por confirmar',
    descripcion: 'Al mejor uso de contratos inteligentes en Avalanche.',
  },
  {
    id: 'mejor-social',
    categoria: 'Track',
    titulo: 'Mejor proyecto de impacto social',
    monto: 'Por confirmar',
    descripcion: 'Al proyecto con impacto medible en la comunidad universitaria.',
  },
  {
    id: 'poap-participacion',
    categoria: 'Especial',
    titulo: 'POAP + $PUMA para todos',
    monto: 'Todos los participantes',
    descripcion:
      'Quien entregue un BUIDL válido recibe el POAP conmemorativo y un drop de $PUMA en Avalanche.',
  },
]

/* ========================================================================== */
/* Criterios de evaluación                                                     */
/* ========================================================================== */

export interface Criterio {
  id: string
  titulo: string
  descripcion: string
  /** Color de acento de la tarjeta. */
  tono: string
}

export const CRITERIOS: Criterio[] = [
  {
    id: 'tecnica',
    titulo: 'Implementación técnica',
    descripcion:
      'Calidad del código, solidez arquitectónica, dificultad técnica e integración funcional de LLMs, agentes o smart contracts.',
    tono: '#F4D03F',
  },
  {
    id: 'innovacion',
    titulo: 'Innovación y creatividad',
    descripcion:
      'Diferenciación, originalidad de la solución y resolución creativa de un reto complejo del ecosistema.',
    tono: '#60A5FA',
  },
  {
    id: 'impacto',
    titulo: 'Impacto social y usabilidad',
    descripcion:
      'Relevancia para la sociedad, sustentabilidad, beneficio para la comunidad UNAM y experiencia de usuario.',
    tono: '#34D399',
  },
  {
    id: 'demo',
    titulo: 'Demo funcional y pitch',
    descripcion:
      'Demostración en vivo de un MVP operando sin fallos y claridad al transmitir la visión del proyecto.',
    tono: '#A78BFA',
  },
]

/* ========================================================================== */
/* Sedes                                                                       */
/* ========================================================================== */

export interface Sede {
  id: string
  nombre: string
  descripcion: string
  /** Ruta bajo /public. */
  imagen: string
  /** Enlace a Google Maps. TODO: confirmar los pines exactos. */
  mapsUrl?: string
  horario?: string
}

export const SEDES: Sede[] = [
  {
    id: 'facultad-ingenieria',
    nombre: 'Facultad de Ingeniería, UNAM',
    descripcion:
      'Sede principal del hackathon. Kickoff, mesas de trabajo y ceremonia de premiación.',
    imagen: '/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg',
    mapsUrl: 'https://maps.google.com/?q=Facultad+de+Ingenier%C3%ADa+UNAM',
    horario: 'Abierta las 72 horas',
  },
  {
    id: 'auditorio',
    nombre: 'Auditorio · Conferencias',
    descripcion: 'Charlas, talleres presenciales y demo day frente al jurado.',
    imagen: '/images/semanadie/sponsorship/auditorio-conferencia.png',
    horario: 'Según agenda',
  },
  {
    id: 'biblioteca-central',
    nombre: 'Biblioteca Central · Ciudad Universitaria',
    descripcion: 'Punto de encuentro y zona de trabajo tranquila dentro de CU.',
    imagen: '/images/semanadie/sponsorship/biblioteca-central-unam.jpg',
    mapsUrl: 'https://maps.google.com/?q=Biblioteca+Central+UNAM',
  },
]

/* ========================================================================== */
/* Patrocinadores                                                              */
/* ========================================================================== */

export type SponsorTier = 'organizador' | 'diamante' | 'oro' | 'plata' | 'aliado'

export interface Sponsor {
  id: string
  nombre: string
  /** Ruta bajo /public. */
  logo: string
  tier: SponsorTier
  url?: string
  /**
   * El archivo trae fondo blanco opaco en vez de transparencia. La retícula
   * normaliza los logos a blanco con un filtro, y sobre un PNG opaco eso
   * produce un rectángulo sólido; con esto se muestra tal cual.
   */
  fondoOpaco?: boolean
}

export const SPONSOR_TIER_LABEL: Record<SponsorTier, string> = {
  organizador: 'Organizan',
  diamante: 'Patrocinador Diamante',
  oro: 'Patrocinadores Oro',
  plata: 'Patrocinadores Plata',
  aliado: 'Aliados',
}

/** Orden de aparición de los bloques en la landing. */
export const SPONSOR_TIER_ORDER: SponsorTier[] = [
  'organizador',
  'diamante',
  'oro',
  'plata',
  'aliado',
]

// Solo van aquí los que están confirmados. Los logos de public/images/Aliados/
// son SVGs numerados sin identificar, así que no se listan hasta saber a qué
// marca corresponde cada uno.
//
// ⚠️ Cuidado con los nombres de archivo de public/images/semanadie/: pese a
// llamarse así, `escudo-fi.png` contiene el escudo de la BUAP y
// `escudo-unam.png` el de la Facultad de Ciencias Políticas de la UAQ. Los
// correctos son `escudofi_azul-modified.png` y `Logo-UNAM.png`.
//
// TODO(sponsors): agregar patrocinadores comerciales conforme se cierren.
export const SPONSORS: Sponsor[] = [
  {
    id: 'criptounam',
    nombre: 'CriptoUNAM',
    logo: '/images/semanadie/logo-criptounam.png',
    tier: 'organizador',
    url: 'https://criptounam.xyz',
    fondoOpaco: true,
  },
  {
    id: 'facultad-ingenieria',
    nombre: 'Facultad de Ingeniería, UNAM',
    logo: '/images/semanadie/escudofi_azul-modified.png',
    tier: 'organizador',
  },
  {
    id: 'unam',
    nombre: 'UNAM',
    logo: '/images/semanadie/Logo-UNAM.png',
    tier: 'organizador',
  },
  {
    id: 'semana-die',
    nombre: 'Semana DIE',
    logo: '/images/semanadie/LogoSemanaDIE.png',
    tier: 'aliado',
  },
]

/* ========================================================================== */
/* Agenda                                                                      */
/* ========================================================================== */

export interface AgendaItem {
  hora: string
  titulo: string
  descripcion?: string
  /** Resalta hitos como el kickoff o el cierre de entregas. */
  hito?: boolean
}

export interface AgendaDia {
  id: string
  fecha: string
  etiqueta: string
  items: AgendaItem[]
}

// TODO(agenda): borrador. Confirmar horarios con la Facultad antes de publicar.
export const AGENDA: AgendaDia[] = [
  {
    id: 'dia-1',
    fecha: '2026-09-21',
    etiqueta: 'Lunes 21 · Kickoff',
    items: [
      { hora: '08:00', titulo: 'Registro y acreditación', descripcion: 'Entrega de kits.' },
      { hora: '09:00', titulo: 'Ceremonia de apertura', descripcion: 'Arranca el reloj de 72 horas.', hito: true },
      { hora: '10:30', titulo: 'Presentación de tracks y retos' },
      { hora: '12:00', titulo: 'Formación de equipos', descripcion: 'Dinámica para quienes llegan sin equipo.' },
      { hora: '14:00', titulo: 'Comida' },
      { hora: '16:00', titulo: 'Taller: primeros pasos en Avalanche' },
    ],
  },
  {
    id: 'dia-2',
    fecha: '2026-09-22',
    etiqueta: 'Martes 22 · Construcción',
    items: [
      { hora: '09:00', titulo: 'Check-in matutino' },
      { hora: '11:00', titulo: 'Mentorías técnicas', descripcion: 'Bloques de 20 min por equipo.' },
      { hora: '14:00', titulo: 'Comida' },
      { hora: '17:00', titulo: 'Taller: agentes autónomos con LLMs' },
      { hora: '20:00', titulo: 'Checkpoint de avance' },
    ],
  },
  {
    id: 'dia-3',
    fecha: '2026-09-23',
    etiqueta: 'Miércoles 23 · Recta final',
    items: [
      { hora: '09:00', titulo: 'Check-in matutino' },
      { hora: '11:00', titulo: 'Mentorías de producto y pitch' },
      { hora: '14:00', titulo: 'Comida' },
      { hora: '18:00', titulo: 'Ensayo de pitches' },
      { hora: '22:00', titulo: 'Última llamada para dudas técnicas' },
    ],
  },
  {
    id: 'dia-4',
    fecha: '2026-09-24',
    etiqueta: 'Jueves 24 · Demo Day',
    items: [
      { hora: '09:00', titulo: 'Cierre de entregas', descripcion: 'Se bloquea el envío de BUIDLs.', hito: true },
      { hora: '11:00', titulo: 'Demo Day', descripcion: 'Pitches de 5 minutos ante el jurado.' },
      { hora: '16:00', titulo: 'Deliberación del jurado' },
      { hora: '18:00', titulo: 'Premiación y clausura', hito: true },
      { hora: '20:00', titulo: 'Cierre del evento' },
    ],
  },
]

/* ========================================================================== */
/* Derivados                                                                   */
/* ========================================================================== */

/** Número de tracks. Se calcula de la lista para que no pueda desincronizarse. */
export const NUM_TRACKS = HACKATHON_TRACKS.length

/**
 * Descripción corta reutilizable en Home y Eventos, para que las tres páginas
 * cuenten lo mismo.
 */
export const HACKATHON_RESUMEN =
  `El hackathon insignia de CriptoUNAM y la Facultad de Ingeniería en la ${HACKATHON_INFO.event}. ` +
  `${HACKATHON_INFO.horas} horas intensivas construyendo con inteligencia artificial, blockchain e impacto social.`

/** Nombres de los tracks separados por coma, para copy en línea. */
export const TRACKS_EN_LINEA = HACKATHON_TRACKS.map((t) => t.name).join(', ')

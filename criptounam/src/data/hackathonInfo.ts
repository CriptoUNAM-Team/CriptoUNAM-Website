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

/**
 * Kickoff: martes 22 a las 11:00. Coincide con `hackathons.starts_at` en
 * Supabase.
 *
 * El cartel anuncia el evento completo del 22 al 26 de septiembre: la
 * construcción va del martes 22 al viernes 25 y el sábado 26 son la clausura
 * y la premiación.
 */
const ARRANQUE = '2026-09-22T11:00:00-06:00'
/** Límite para enviar el proyecto: viernes 25 a las 19:00. */
const CIERRE_ENTREGAS = '2026-09-25T19:00:00-06:00'
/** Fin del evento, premiación incluida. Coincide con `hackathons.ends_at`. */
const FIN = '2026-09-26T20:00:00-06:00'

/**
 * Duración de la ventana de construcción, en horas.
 *
 * Se deriva de las dos fechas de arriba en vez de escribirse a mano: cada
 * página tenía la suya y llegaron a anunciar 48 h mientras la landing decía 72,
 * con las tres visibles en producción a la vez. Calculándola, mover un horario
 * actualiza el número en todo el sitio.
 *
 * Con el horario actual (mar 22 11:00 → vie 25 19:00) son 80 h.
 */
const HORAS = Math.round(
  (new Date(CIERRE_ENTREGAS).getTime() - new Date(ARRANQUE).getTime()) / 3_600_000
)

export const HACKATHON_INFO = {
  /** Nombre propio del evento, el que se usa como marca en la landing. */
  brand: 'Goya Hack',
  name: 'Goya Hack · Hackathon UNAM 2026',
  startsAt: ARRANQUE,
  hackingEndsAt: CIERRE_ENTREGAS,
  endsAt: FIN,
  /** Horas de construcción. Derivadas de las fechas, no escritas a mano. */
  horas: HORAS,
  location: 'Facultad de Ingeniería, UNAM · CDMX (Presencial & Híbrido)',
  event: 'Semana DIE',
  prizePool: 'Premios por confirmar · PUMA Drops · Becas e Incubación',
  organizers: ['CriptoUNAM', 'Facultad de Ingeniería UNAM'],
  /** Controla el copy del CTA y el chip de estado en la landing. */
  registroAbierto: true,
  /**
   * Evento en Luma, para la asistencia. Convive con el registro de la
   * plataforma (/hackathon/dashboard), que es otra cosa: allí se crean el
   * equipo y el proyecto. Luma solo lleva el aforo y manda los recordatorios.
   */
  lumaEventId: 'evt-1qCZCKEtE6Jg1Mc',
  /** Formulario para comunidades y colectivos que quieran sumarse como aliados. */
  communityPartnerForm: 'https://forms.gle/QYVcMMJxiCUdmTEN6',
}

// Tracks del hackathon. Los retos concretos de cada track se publican en la guía.
export const HACKATHON_TRACKS: HackathonTrack[] = [
  {
    id: 'ai',
    name: 'AI',
    description:
      'Inteligencia artificial aplicada: agentes, LLMs, copilots, pipelines y productos que resuelvan un problema concreto.',
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description:
      'Web3 y contratos inteligentes: DeFi, identidad, infraestructura, Avalanche y aplicaciones descentralizadas.',
  },
  {
    id: 'innovacion',
    name: 'Innovación',
    description:
      'Productos originales, impacto social o ambiental, y soluciones creativas para la UNAM y la Semana DIE. Cualquier stack.',
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
    titulo: 'Mejor proyecto AI',
    monto: 'Por confirmar',
    descripcion: 'Al proyecto que mejor demuestre inteligencia artificial aplicada con impacto real.',
  },
  {
    id: 'mejor-blockchain',
    categoria: 'Track',
    titulo: 'Mejor proyecto Blockchain',
    monto: 'Por confirmar',
    descripcion: 'Al mejor uso de Web3, contratos inteligentes o infraestructura descentralizada.',
  },
  {
    id: 'mejor-innovacion',
    categoria: 'Track',
    titulo: 'Mejor proyecto Innovación',
    monto: 'Por confirmar',
    descripcion: 'A la solución más original o con mayor impacto para la comunidad universitaria.',
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
    horario: 'Abierta todo el evento',
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
   * El archivo trae fondo claro opaco en vez de transparencia.
   *
   * La retícula normaliza los logos a blanco con un filtro de silueta, y sobre
   * un PNG opaco eso produce un rectángulo blanco sólido. Con esta marca se le
   * aplica en su lugar una inversión, que manda el fondo a negro y sube el
   * trazo a blanco.
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
// La construcción va del martes 22 (11:00) al viernes 25 (19:00); el sábado
// 26 son el Demo Day, la clausura y la premiación.
export const AGENDA: AgendaDia[] = [
  {
    id: 'dia-1',
    fecha: '2026-09-22',
    etiqueta: 'Martes 22 · Kickoff',
    items: [
      { hora: '10:00', titulo: 'Registro y acreditación', descripcion: 'Entrega de kits.' },
      { hora: '11:00', titulo: 'Ceremonia de apertura', descripcion: 'Arranca el reloj.', hito: true },
      { hora: '12:30', titulo: 'Presentación de tracks y retos' },
      { hora: '14:00', titulo: 'Comida' },
      { hora: '15:30', titulo: 'Formación de equipos', descripcion: 'Dinámica para quienes llegan sin equipo.' },
      { hora: '17:00', titulo: 'Taller: primeros pasos en Avalanche' },
    ],
  },
  {
    id: 'dia-2',
    fecha: '2026-09-23',
    etiqueta: 'Miércoles 23 · Construcción',
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
    fecha: '2026-09-24',
    etiqueta: 'Jueves 24 · Recta final',
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
    fecha: '2026-09-25',
    etiqueta: 'Viernes 25 · Entrega',
    items: [
      { hora: '09:00', titulo: 'Última jornada de construcción' },
      { hora: '14:00', titulo: 'Comida' },
      { hora: '17:00', titulo: 'Ensayo de pitches' },
      { hora: '19:00', titulo: 'Cierre de entregas', descripcion: 'Límite para enviar el proyecto. Se bloquea el envío de BUIDLs.', hito: true },
    ],
  },
  {
    id: 'dia-5',
    fecha: '2026-09-26',
    etiqueta: 'Sábado 26 · Clausura',
    items: [
      { hora: '10:00', titulo: 'Demo Day', descripcion: 'Pitches de 5 minutos ante el jurado.', hito: true },
      { hora: '14:00', titulo: 'Comida' },
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
 * El rango de fechas tal y como aparece en el cartel: "22 – 26" y
 * "DE SEPTIEMBRE" por separado, que es como está maquetado.
 *
 * Se deriva de `startsAt`/`endsAt` en vez de escribirse a mano: son las mismas
 * dos fechas que alimentan la cuenta atrás, así que no pueden discrepar.
 */
const dia = (iso: string) => new Date(iso).getDate()
const mes = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { month: 'long' })

export const FECHAS_CARTEL = {
  /** "22 – 26" */
  rango: `${dia(HACKATHON_INFO.startsAt)} – ${dia(HACKATHON_INFO.endsAt)}`,
  /** "de septiembre" */
  mes: `de ${mes(HACKATHON_INFO.startsAt)}`,
  /** "22 – 26 de septiembre" — para copy en línea. */
  get completo() {
    return `${this.rango} ${this.mes}`
  },
}

/**
 * Los dos lemas del cartel, en el mismo orden: el primero en blanco y el
 * segundo en ámbar cursiva.
 */
export const LEMAS_CARTEL = ['Inteligencia artificial', 'Innovación & blockchain'] as const

/** El snippet que el cartel usa como adorno tipográfico. */
export const SNIPPET_CARTEL = "import { AI, blockchain } from '@goya-hack/fi';"

/**
 * Descripción corta reutilizable en Home y Eventos, para que las tres páginas
 * cuenten lo mismo.
 */
export const HACKATHON_RESUMEN =
  `El hackathon insignia de CriptoUNAM y la Facultad de Ingeniería en la ${HACKATHON_INFO.event}. ` +
  `${HACKATHON_INFO.horas} horas intensivas construyendo con inteligencia artificial, blockchain e impacto social.`

/** Nombres de los tracks separados por coma, para copy en línea. */
export const TRACKS_EN_LINEA = HACKATHON_TRACKS.map((t) => t.name).join(', ')

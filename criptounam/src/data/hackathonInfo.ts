/**
 * Datos públicos del Hackathon UNAM 2026.
 *
 * El registro, la formación de equipos y la entrega de proyectos viven en la
 * plataforma propia (/hackathon/dashboard y siguientes). Este archivo concentra
 * el contenido de la landing: editarlo no requiere tocar componentes.
 *
 * ⚠️ Lo marcado con TODO son marcadores de posición: revisar antes de publicar.
 */

export interface TrackReto {
  id: string
  nombre: string
  descripcion: string
  logo?: string
  url?: string
  fondoOpaco?: boolean
}

export interface HackathonTrack {
  id: string
  name: string
  description: string
  /** Retos o patrocinadores dentro del track. */
  retos: TrackReto[]
  premio: {
    monto: string
    detalle?: string
    /** Chip corto, p. ej. "100% $PUMA". */
    etiqueta?: string
  }
}

// Tracks del hackathon con retos y premios por patrocinador.
export const HACKATHON_TRACKS: HackathonTrack[] = [
  {
    id: 'ai',
    name: 'AI',
    description:
      'Inteligencia artificial aplicada: agentes, LLMs, copilots, pipelines y productos que resuelvan un problema concreto.',
    retos: [
      {
        id: 'tangem',
        nombre: 'Tangem',
        descripcion:
          'Construye con IA y lleva el producto a usuarios reales: agentes, copilots o flujos donde la wallet y los pagos importen. Patrocinado por Tangem.',
        logo: '/images/hackathon/logos/tangem.png',
        url: 'https://tangem.com',
        fondoOpaco: true,
      },
    ],
    premio: {
      monto: 'Por confirmar',
      detalle: 'Bolsa del reto Tangem para el mejor proyecto AI.',
      etiqueta: 'Tangem',
    },
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
    description:
      'Web3 y contratos inteligentes: DeFi, identidad, infraestructura y aplicaciones descentralizadas. Tres retos, tres ecosistemas.',
    retos: [
      {
        id: 'stellar',
        nombre: 'Stellar · BAF',
        descripcion:
          'Pagos, assets y Soroban: remesas, stablecoins, contratos en Rust o integraciones con el ecosistema Stellar.',
        logo: '/images/cursos/stellar.png',
        url: 'https://developers.stellar.org/',
      },
      {
        id: 'avalanche',
        nombre: 'Avalanche',
        descripcion:
          'Despliega en Fuji o C-Chain: smart contracts, DeFi, NFTs o infra que aproveche la red de CriptoUNAM y $PUMA.',
        logo: '/images/cursos/avalanche.png',
        url: 'https://build.avax.network/docs',
      },
      {
        id: 'pollar',
        nombre: 'Pollar',
        descripcion:
          'Producto on-chain con impacto en comunidad: gobernanza, participación o herramientas para builders latinoamericanos.',
      },
    ],
    premio: {
      monto: 'Por confirmar',
      detalle: 'Premio por cada reto: Stellar, Avalanche y Pollar.',
      etiqueta: '3 retos',
    },
  },
  {
    id: 'innovacion',
    name: 'Innovación',
    description:
      'Productos originales, impacto social o ambiental, y soluciones creativas para la UNAM y la Semana DIE. Cualquier stack.',
    retos: [],
    premio: {
      monto: '10,000,000 $PUMA',
      detalle: '1.º lugar del track · Premios 100% en $PUMA en Avalanche.',
      etiqueta: '100% $PUMA',
    },
  },
]
/**
 * Kickoff: martes 22 a las 10:00, cuando abre el Auditorio. Coincide con
 * `hackathons.starts_at` en Supabase.
 */
const ARRANQUE = '2026-09-22T10:00:00-06:00'
/**
 * Límite para enviar el proyecto: viernes 25 a las 17:00, la hora a la que
 * cierran el CIA y la oficina M. La entrega no sobrevive a la sede.
 */
const CIERRE_ENTREGAS = '2026-09-25T17:00:00-06:00'
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
 * Con el horario actual (mar 22 10:00 → vie 25 17:00) son 79 h.
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
  prizePool: '10M $PUMA en Innovación · Retos Stellar · Avalanche · Pollar · Tangem en AI',
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
    descripcion: 'Reto Tangem: inteligencia artificial aplicada con impacto real y producto demostrable.',
  },
  {
    id: 'mejor-blockchain',
    categoria: 'Track',
    titulo: 'Mejor proyecto Blockchain',
    monto: 'Por confirmar',
    descripcion: 'Tres retos independientes: Stellar (BAF), Avalanche y Pollar. Un premio por ecosistema.',
  },
  {
    id: 'mejor-innovacion',
    categoria: 'Track',
    titulo: 'Mejor proyecto Innovación',
    monto: '10,000,000 $PUMA',
    descripcion: '1.º lugar del track. Premios 100% en $PUMA en Avalanche — la bolsa más grande del hackathon.',
    destacado: true,
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
  /** Nombre largo o descriptor, para el chip y el `title`. */
  nombreLargo?: string
  descripcion: string
  /** Ruta bajo /public. */
  imagen: string
  /**
   * Logo propio del espacio, si lo tiene. Sale como chapa en la esquina de la
   * tarjeta: PC Puma es un servicio con marca y se reconoce antes por el logo
   * que por el nombre.
   */
  logo?: string
  /**
   * Fotos adicionales del espacio. Solo la sede principal las usa: la tarjeta
   * grande las pasa en un carrusel.
   */
  galeria?: string[]
  /** Vídeo del espacio (MP4 para web; opcional .mov como respaldo). */
  video?: string
  videoPoster?: string
  /** Enlace a Google Maps. */
  mapsUrl?: string
  horario?: string
  /** Marca la sede que ocupa la tarjeta grande del bloque "Dónde". */
  principal?: boolean
}

/**
 * Los cuatro espacios del programa. Los `id` son los que referencia
 * `AgendaItem.sede`, así que cambiarlos rompe los chips de la línea de tiempo.
 *
 * El CIA es la sede del hackathon: es donde se construye los cuatro días, y por
 * eso va como tarjeta grande con sus propias fotos. El Auditorio solo abre para
 * la inauguración y la clausura.
 */
export const SEDES: Sede[] = [
  {
    id: 'cia',
    nombre: 'CIA',
    nombreLargo: 'Centro de Ingeniería Avanzada · Edificio X',
    descripcion:
      'La sede del hackathon. El Centro de Ingeniería Avanzada (CIA) es la nave de cristal del Edificio X, sede de la División de Ingeniería Mecánica e Industrial: mesas de trabajo, mentorías y soporte técnico durante los cuatro días de construcción.',
    imagen: '/images/CIA1.png',
    galeria: ['/images/CIA1.png', '/images/CIA2.png'],
    video: '/video/CIA.mp4',
    videoPoster: '/images/CIA1.png',
    mapsUrl: 'https://maps.google.com/?q=Centro+de+Ingenier%C3%ADa+Avanzada+UNAM+Facultad+de+Ingenier%C3%ADa',
    horario: 'Mar 12:00–19:00 · Mié y jue 9:00–19:00 · Vie 9:00–17:00',
    principal: true,
  },
  {
    id: 'auditorio',
    nombre: 'Auditorio',
    nombreLargo: 'Auditorio · Facultad de Ingeniería',
    descripcion: 'Inauguración del martes y, el sábado, Demo Day, premiación y clausura.',
    imagen: '/images/semanadie/sponsorship/auditorio-conferencia.png',
    horario: 'Mar 10:00–11:00 · Sáb 10:00–13:00',
  },
  {
    id: 'pc-puma',
    nombre: 'PC Puma M / I',
    nombreLargo: 'Salas PC Puma, edificios M e I',
    descripcion:
      'Salas de cómputo abiertas para quien no traiga equipo propio o necesite una máquina extra.',
    imagen: '/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg',
    logo: '/images/hackathon/logos/pcpuma-fi.png',
    horario: 'Mié a vie 11:00–17:00',
  },
  {
    id: 'oficina-m',
    nombre: 'Oficina M',
    nombreLargo: 'Oficina del edificio M',
    descripcion:
      'Espacio de apoyo: organización, logística y un lugar tranquilo para reuniones de equipo.',
    imagen: '/images/semanadie/sponsorship/biblioteca-central-unam.jpg',
    horario: 'Mié y jue 9:00–19:00 · Vie 9:00–17:00',
  },
]

/** Índice por `id`, para resolver `AgendaItem.sede` sin recorrer la lista. */
export const SEDE_POR_ID: Record<string, Sede> = Object.fromEntries(
  SEDES.map((s) => [s.id, s])
)

/* ========================================================================== */
/* Patrocinadores                                                              */
/* ========================================================================== */

export type SponsorTier = 'organizador' | 'patrocinador' | 'apoyo'

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
  patrocinador: 'Patrocinadores',
  apoyo: 'Con el apoyo de',
}

/** Orden de aparición de los bloques en la landing. */
export const SPONSOR_TIER_ORDER: SponsorTier[] = ['organizador', 'patrocinador', 'apoyo']

/*
 * Antes había una escalera comercial —diamante, oro, plata— con todo el mundo
 * en "por confirmar". Anunciar niveles vacíos promete una jerarquía que aún no
 * existe, así que queda un solo bloque de patrocinadores hasta que los
 * acuerdos digan otra cosa.
 *
 * ⚠️ Cuidado con los nombres de archivo de public/images/semanadie/: pese a
 * llamarse así, `escudo-fi.png` contiene el escudo de la BUAP y
 * `escudo-unam.png` el de la Facultad de Ciencias Políticas de la UAQ. Los
 * correctos son `escudofi_azul-modified.png` y `Logo-UNAM.png`.
 */
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
    id: 'tangem',
    nombre: 'Tangem',
    logo: '/images/hackathon/logos/tangem.png',
    tier: 'patrocinador',
    url: 'https://tangem.com',
  },
  {
    id: 'pc-puma',
    nombre: 'PC Puma · Facultad de Ingeniería',
    logo: '/images/hackathon/logos/pcpuma-fi.png',
    tier: 'apoyo',
    fondoOpaco: true,
  },
]

/* ========================================================================== */
/* Comunidades aliadas                                                         */
/* ========================================================================== */

export interface Comunidad {
  id: string
  nombre: string
  /**
   * Ruta bajo /public. Opcional: sin archivo, la marquesina pinta el nombre en
   * versalitas, que es mejor que un hueco roto mientras llega el logo.
   */
  logo?: string
  url?: string
  fondoOpaco?: boolean
}

/**
 * Comunidades y colectivos que acompañan GOYA HACK.
 *
 * Van en su propia lista y no como un nivel más de `SPONSORS`: difunden el
 * evento y traen gente. Logos en `public/images/hackathon/comunidades/`.
 *
 * MPC = Mi Primera Chamba (miprimerachamba.ai).
 */
export const COMUNIDADES: Comunidad[] = [
  { id: 'semana-die', nombre: 'Semana DIE', logo: '/images/semanadie/LogoSemanaDIE.png' },
  {
    id: 'ethereum-mexico',
    nombre: 'Ethereum México',
    logo: '/images/hackathon/comunidades/ethereum-mexico.png',
    url: 'https://ethmexico.org/',
  },
  {
    id: 'banda-web3',
    nombre: 'Banda Web3',
    logo: '/images/hackathon/comunidades/banda-web3.png',
    url: 'https://mexi.wtf',
  },
  {
    id: 'unlock',
    nombre: 'UNLOCK',
    logo: '/images/hackathon/comunidades/unlock.png',
    url: 'https://unlocksummit.io/',
  },
  {
    id: 'cartagena-onchain',
    nombre: 'Cartagena Onchain',
    logo: '/images/hackathon/comunidades/cartagena-onchain.png',
    url: 'https://cartagenaonchain.org/',
  },
  {
    id: 'hello-world',
    nombre: 'Hello World UNAM',
    logo: '/images/hackathon/comunidades/hello-world.svg',
    url: 'https://helloworld-unam.tech/',
  },
  {
    id: 'mi-primera-chamba',
    nombre: 'Mi Primera Chamba AI',
    logo: '/images/hackathon/comunidades/mi-primera-chamba.png',
    url: 'https://miprimerachamba.ai/',
  },
  {
    id: 'happ3n',
    nombre: 'Happ3n',
    logo: '/images/hackathon/comunidades/happ3n.png',
    url: 'https://happ3n.xyz/',
  },
  {
    id: 'la-blocka',
    nombre: 'La Blocka',
    logo: '/images/hackathon/comunidades/la-blocka.png',
    url: 'https://linktr.ee/lablocka',
  },
  {
    id: 'viva-la-calaca',
    nombre: 'Viva la Calaca',
    logo: '/images/hackathon/comunidades/viva-la-calaca.png',
    url: 'https://x.com/VivaLaCalaca',
  },
  {
    id: 'mobil3',
    nombre: 'Mobil3',
    logo: '/images/hackathon/comunidades/mobil3.png',
    url: 'https://mobil3.xyz/',
  },
  {
    id: 'casa-blanca',
    nombre: 'Casa Blanca',
    logo: '/images/hackathon/comunidades/casa-blanca.png',
    url: 'https://x.com/casaweb3',
  },
]

/* ========================================================================== */
/* Agenda                                                                      */
/* ========================================================================== */

export interface AgendaItem {
  /** Hora de inicio, "HH:MM". Es la que se rotula sobre el eje. */
  hora: string
  /** Hora de cierre del bloque. Opcional: los hitos son instantáneos. */
  fin?: string
  titulo: string
  descripcion?: string
  /** `id` de una entrada de SEDES. Pinta el chip de lugar del bloque. */
  sede?: string
  /** Resalta hitos como el kickoff o el cierre de entregas. */
  hito?: boolean
}

export interface AgendaDia {
  id: string
  fecha: string
  etiqueta: string
  items: AgendaItem[]
}

/**
 * El programa es, sobre todo, un calendario de sedes: qué espacio está abierto
 * y a qué hora. Por eso cada bloque lleva `sede` y un rango `hora`–`fin` en vez
 * de una lista de actividades con hora puntual.
 *
 * Los bloques de cada día van ordenados por hora de inicio.
 *
 * La construcción va del martes 22 (10:00) al viernes 25 (17:00); el sábado 26
 * son el Demo Day, la clausura y la premiación.
 */
export const AGENDA: AgendaDia[] = [
  {
    id: 'dia-1',
    fecha: '2026-09-22',
    etiqueta: 'Martes 22 · Apertura',
    items: [
      {
        hora: '10:00',
        fin: '11:00',
        titulo: 'Inauguración Goya Hack',
        descripcion: 'Registro, bienvenida y presentación de tracks y retos. Arranca el reloj.',
        sede: 'auditorio',
        hito: true,
      },
      {
        hora: '12:00',
        fin: '19:00',
        titulo: 'Arranca la construcción',
        descripcion: 'Se abre el CIA: mesas de trabajo, formación de equipos y primeras mentorías.',
        sede: 'cia',
      },
    ],
  },
  {
    id: 'dia-2',
    fecha: '2026-09-23',
    etiqueta: 'Miércoles 23 · Construcción',
    items: [
      {
        hora: '09:00',
        fin: '19:00',
        titulo: 'CIA abierto',
        descripcion: 'Sede principal: mesas de trabajo y mentorías durante todo el día.',
        sede: 'cia',
      },
      {
        hora: '09:00',
        fin: '19:00',
        titulo: 'Acceso a oficina M',
        descripcion: 'Espacio de apoyo para equipos y organización.',
        sede: 'oficina-m',
      },
      {
        hora: '11:00',
        fin: '17:00',
        titulo: 'PC Puma M / PC Puma I',
        descripcion: 'Salas de cómputo disponibles para quien no traiga equipo.',
        sede: 'pc-puma',
      },
    ],
  },
  {
    id: 'dia-3',
    fecha: '2026-09-24',
    etiqueta: 'Jueves 24 · Construcción',
    items: [
      {
        hora: '09:00',
        fin: '19:00',
        titulo: 'CIA abierto',
        descripcion: 'Recta final de desarrollo y mentorías de producto y pitch.',
        sede: 'cia',
      },
      {
        hora: '09:00',
        fin: '19:00',
        titulo: 'Acceso a oficina M',
        descripcion: 'Espacio de apoyo para equipos y organización.',
        sede: 'oficina-m',
      },
      {
        hora: '11:00',
        fin: '17:00',
        titulo: 'PC Puma M / PC Puma I',
        descripcion: 'Salas de cómputo disponibles para quien no traiga equipo.',
        sede: 'pc-puma',
      },
    ],
  },
  {
    id: 'dia-4',
    fecha: '2026-09-25',
    etiqueta: 'Viernes 25 · Entrega',
    items: [
      {
        hora: '09:00',
        fin: '17:00',
        titulo: 'CIA abierto',
        descripcion: 'Última jornada de construcción y ensayo de pitches.',
        sede: 'cia',
      },
      {
        hora: '09:00',
        fin: '17:00',
        titulo: 'Acceso a oficina M',
        descripcion: 'Espacio de apoyo para equipos y organización.',
        sede: 'oficina-m',
      },
      {
        hora: '11:00',
        fin: '17:00',
        titulo: 'PC Puma M / PC Puma I',
        descripcion: 'Salas de cómputo disponibles para quien no traiga equipo.',
        sede: 'pc-puma',
      },
      {
        hora: '17:00',
        titulo: 'Cierre de entregas',
        descripcion: 'Límite para enviar el proyecto. Se bloquea el envío de BUIDLs.',
        hito: true,
      },
    ],
  },
  {
    id: 'dia-5',
    fecha: '2026-09-26',
    etiqueta: 'Sábado 26 · Clausura',
    items: [
      {
        hora: '10:00',
        fin: '13:00',
        titulo: 'Demo Day, premiación y clausura',
        descripcion: 'Pitches de 5 minutos ante el jurado, deliberación y entrega de premios.',
        sede: 'auditorio',
        hito: true,
      },
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

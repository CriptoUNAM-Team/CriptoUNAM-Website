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
        logo: '/images/hackathon/sponsors/tangem.png',
        url: 'https://tangem.com',
      },
    ],
    premio: {
      monto: 'Hasta $175 USD',
      detalle: '3 ganadores: $100 · $50 · $25 USD.',
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
        logo: '/images/hackathon/sponsors/stellar.png',
        url: 'https://developers.stellar.org/',
      },
      {
        id: 'avalanche',
        nombre: 'Avalanche',
        descripcion:
          'Despliega en Fuji o C-Chain: smart contracts, DeFi, NFTs o infra que aproveche la red de CriptoUNAM y $PUMA.',
        logo: '/images/hackathon/sponsors/avalanche.png',
        url: 'https://build.avax.network/docs',
      },
      {
        id: 'pollar',
        nombre: 'Pollar',
        descripcion:
          'Producto on-chain con impacto en comunidad: gobernanza, participación o herramientas para builders latinoamericanos.',
        logo: '/images/hackathon/sponsors/pollar.png',
        url: 'https://www.pollar.finance/',
      },
    ],
    premio: {
      monto: 'Hasta $175 USD',
      detalle: '3 ganadores: $100 · $50 · $25 USD.',
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
      monto: '10M+ $PUMA',
      detalle: '3 ganadores · bolsa en $PUMA y USD.',
      etiqueta: '$PUMA',
    },
  },
]
/**
 * Kickoff: martes 22 a las 10:00, cuando abre el Auditorio. Coincide con
 * `hackathons.starts_at` en Supabase.
 */
const ARRANQUE = '2026-09-22T10:00:00-06:00'
/**
 * Límite para enviar el proyecto: viernes 25 a las 14:00 (deadline del
 * programa oficial Semana DIE × GOYA HACK).
 */
const CIERRE_ENTREGAS = '2026-09-25T14:00:00-06:00'
/** Fin del evento: viernes 25 tras clausura y anuncio de ganadores. */
const FIN = '2026-09-25T20:00:00-06:00'

/**
 * Duración de la ventana de construcción, en horas.
 *
 * Se deriva de las dos fechas de arriba en vez de escribirse a mano: cada
 * página tenía la suya y llegaron a anunciar 48 h mientras la landing decía 72,
 * con las tres visibles en producción a la vez. Calculándola, mover un horario
 * actualiza el número en todo el sitio.
 *
 * Con el horario actual (mar 22 10:00 → vie 25 14:00) son ~76 h.
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
  location: 'Facultad de Ingeniería, UNAM · CDMX — y en línea',
  /** Sede física, sin la coletilla de modalidad. Para mapas y el campo LOCATION del .ics. */
  sedeFisica: 'Facultad de Ingeniería, UNAM · Ciudad Universitaria, CDMX',
  /**
   * El evento es híbrido: se construye en el CIA y, en paralelo, se participa
   * en remoto. Talleres, mentorías y main stages se transmiten; los stands son
   * los únicos bloques que solo existen en la Facultad.
   */
  modalidad: 'híbrido' as const,
  event: 'Semana DIE',
  prizePool: '3 ganadores por track · hasta $175 USD + 17.5M $PUMA en Innovación',
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
/* Tangem — patrocinador principal                                             */
/* ========================================================================== */

/**
 * Tangem es el patrocinador principal de GOYA HACK, y de ahí sale un requisito
 * obligatorio para participar.
 *
 * ⚠️ `enlaceApp` es un enlace de referido: es el que atribuye la descarga al
 * hackathon. Una instalación hecha desde la App Store o Google Play no queda
 * atribuida y, a efectos del requisito, es como si no existiera. Por eso el
 * enlace vive aquí una sola vez y TODA la interfaz —botones, QR, FAQ— tira de
 * esta constante: si cambia, cambia en un sitio y no quedan copias viejas
 * repartidas por la landing enviando gente a la tienda genérica.
 *
 * Por lo mismo, en la sección de Tangem no se ponen insignias de App Store ni
 * de Google Play: invitan justo a la descarga que no cuenta.
 */
export const TANGEM = {
  nombre: 'Tangem',
  /** El único enlace válido de descarga. No sustituir por la ficha de tienda. */
  enlaceApp: 'https://join.tangem.com/MsTz/7h5fwkzf?af_qr=true',
  /** QR del mismo enlace, generado desde él y verificado decodificándolo. */
  qr: '/images/Tangem/qr-tangem.svg',
  sitio: 'https://tangem.com',
  /*
   * OJO con la caja: la carpeta es `Tangem` con T mayúscula. macOS no
   * distingue mayúsculas y Vercel sí, así que `/images/tangem/...` funciona en
   * local y da 404 en producción.
   */
  video: '/video/tangem-stand.mp4',
  videoPoster: '/images/Tangem/stand-poster.jpg',
  tarjetas: '/images/Tangem/tarjetas.png',
  pago: '/images/Tangem/pago-nfc.webp',
}

/** Los tres pasos del requisito, en el orden en que hay que hacerlos. */
export interface PasoTangem {
  id: string
  titulo: string
  descripcion: string
  /** Se marca el paso que no se puede hacer de otra forma. */
  critico?: boolean
}

export const TANGEM_PASOS: PasoTangem[] = [
  {
    id: 'descarga',
    titulo: 'Descarga la app desde nuestro enlace',
    descripcion:
      'Es el único paso que no admite atajo: tiene que ser desde el enlace o el QR de esta página. Si la instalas desde la App Store o Google Play, la descarga no queda registrada como de GOYA HACK y el requisito no cuenta. Si ya tenías la app instalada de antes, desinstálala y vuelve a instalarla desde aquí.',
    critico: true,
  },
  {
    id: 'wallet',
    titulo: 'Crea tu wallet',
    descripcion:
      'Abre la app y crea tu wallet siguiendo los pasos. Guarda bien tu frase de recuperación: nadie de la organización te la va a pedir nunca, ni Tangem tampoco.',
  },
  {
    id: 'tangempay',
    titulo: 'Activa TangemPay y verifica tu identidad',
    descripcion:
      'Solicita la tarjeta en línea de TangemPay desde la propia app y completa la verificación de identidad (KYC). Ten a mano una identificación oficial vigente. Es lo que más tarda, así que no lo dejes para el día del kickoff.',
  },
]

/* ========================================================================== */
/* Modalidad híbrida                                                           */
/* ========================================================================== */

export interface CanalRemoto {
  id: string
  /** Nombre del canal tal y como se anuncia. */
  nombre: string
  descripcion: string
  /**
   * URL del canal. Se deja vacía hasta que la organización publique el enlace:
   * la UI lo detecta y muestra "próximamente" en vez de un enlace roto, así que
   * rellenarla aquí es lo único que hace falta para activarlo en todo el sitio.
   */
  url?: string
  /** Etiqueta del botón cuando hay `url`. */
  cta?: string
}

/**
 * Cómo se sigue GOYA HACK sin estar en Ciudad Universitaria.
 *
 * Vive junto a la agenda porque es la otra mitad de cada bloque híbrido: la
 * línea de tiempo enlaza aquí cuando un evento se puede seguir en remoto.
 */
export const TRANSMISION = {
  /** Enlace general del directo. Sin él, los bloques híbridos avisan de que falta. */
  url: undefined as string | undefined,
  plataforma: 'Transmisión en vivo',
  /** Canales de la parte en línea del evento. */
  canales: [
    {
      id: 'directo',
      nombre: 'Directo',
      descripcion:
        'Kickoff, talleres, main stages y clausura se transmiten en vivo. Quedan grabados para verlos después.',
      cta: 'Ver el directo',
    },
    {
      id: 'comunidad',
      nombre: 'Comunidad',
      descripcion:
        'Canal de texto y voz del hackathon: soporte, formación de equipos, anuncios y mentorías en remoto.',
      cta: 'Entrar al canal',
    },
    {
      id: 'entrega',
      nombre: 'Entrega en plataforma',
      descripcion:
        'El proyecto se envía desde el panel del hacker, estés donde estés. Mismo deadline para todos: viernes 14:00 (CDMX).',
      url: '/hackathon/dashboard',
      cta: 'Ir al panel',
    },
  ] as CanalRemoto[],
}

/** Enlace remoto efectivo de un bloque: el suyo propio o el directo general. */
export const enlaceRemoto = (item: { enlace?: string }): string | undefined =>
  item.enlace ?? TRANSMISION.url

/* ========================================================================== */
/* Premios                                                                     */
/* ========================================================================== */

export interface LugarPremio {
  lugar: 1 | 2 | 3
  usd?: number
  puma?: number
}

/** Tres ganadores por track. Montos confirmados para Goya Hack 2026. */
export const PREMIOS_POR_TRACK: Record<string, LugarPremio[]> = {
  ai: [
    { lugar: 1, usd: 100 },
    { lugar: 2, usd: 50 },
    { lugar: 3, usd: 25 },
  ],
  blockchain: [
    { lugar: 1, usd: 100 },
    { lugar: 2, usd: 50 },
    { lugar: 3, usd: 25 },
  ],
  innovacion: [
    { lugar: 1, usd: 50, puma: 10_000_000 },
    { lugar: 2, usd: 25, puma: 5_000_000 },
    { lugar: 3, puma: 2_500_000 },
  ],
}

const fmtUsd = (n: number) => `$${n} USD`
const fmtPuma = (n: number) => `${n.toLocaleString('es-MX')} $PUMA`

/** Texto legible de un premio por lugar. */
export const textoPremioLugar = (p: LugarPremio): string => {
  const partes: string[] = []
  if (p.usd) partes.push(fmtUsd(p.usd))
  if (p.puma) partes.push(fmtPuma(p.puma))
  return partes.join(' + ')
}

export interface PremioExtra {
  id: string
  titulo: string
  monto: string
  descripcion: string
}

/** Reconocimientos que no dependen del track. */
export const PREMIOS_EXTRA: PremioExtra[] = [
  {
    id: 'poap-participacion',
    titulo: 'POAP + $PUMA para todos',
    monto: 'Quien entrega un BUIDL',
    descripcion:
      'POAP conmemorativo y drop de $PUMA en Avalanche para cada equipo con entrega válida.',
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
  /** Vídeo del espacio (MP4 para web). */
  video?: string
  /** Respaldo QuickTime para Safari u otros navegadores. */
  videoMov?: string
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
    /*
     * JPEG y no los PNG originales: son fotografías, y en PNG pesaban 1,2 y
     * 1,5 MB. Ahora que la galería se muestra en la propia sección, eran 2,7 MB
     * de descarga para dos imágenes.
     */
    imagen: '/images/hackathon/sedes/cia-1.jpg',
    galeria: ['/images/hackathon/sedes/cia-1.jpg', '/images/hackathon/sedes/cia-2.jpg'],
    video: '/video/CIA.mp4',
    videoMov: '/video/CIA.mov',
    videoPoster: '/images/hackathon/sedes/cia-1.jpg',
    mapsUrl: 'https://maps.google.com/?q=Centro+de+Ingenier%C3%ADa+Avanzada+UNAM+Facultad+de+Ingenier%C3%ADa',
    horario: 'Mar 14:00–19:00 · Mié y jue 9:00–19:00 · Vie 9:00–14:00',
    principal: true,
  },
  {
    id: 'auditorio',
    nombre: 'Auditorio',
    nombreLargo: 'Auditorio · Facultad de Ingeniería',
    descripcion: 'Kickoff del martes y, el viernes, clausura y anuncio de ganadores.',
    imagen: '/images/semanadie/sponsorship/auditorio-conferencia.png',
    horario: 'Mar 10:00 · Vie 18:00',
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
   * pone detrás una placa clara y se deja el logo en su color.
   */
  fondoOpaco?: boolean
  /**
   * No pasar por el filtro de silueta: el logo ya viene en su color definitivo
   * y aplanarlo a blanco perdería información (un lockup en ámbar, por
   * ejemplo). Implica fondo transparente.
   */
  colorPropio?: boolean
  /** Lockup apaisado o con texto apilado: se le da más alto en la retícula. */
  ancho?: boolean
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
 * ⚠️ Los logos vienen de `public/images/hackathon/sponsors/`, procesados desde
 * los oficiales de `public/images/sponsors-goyahack/`. NO usar
 * `public/images/hackathon/logos/`: ahí `avalanche.png` y `stellar.png` son
 * ilustraciones de stock sin relación con las marcas, y `team1.png` es el
 * escudo de "Michigan Team-1", que es otra organización.
 *
 * ⚠️ Cuidado también con los nombres de archivo de public/images/semanadie/:
 * pese a llamarse así, `escudo-fi.png` contiene el escudo de la BUAP y
 * `escudo-unam.png` el de la Facultad de Ciencias Políticas de la UAQ. Los
 * correctos son `escudofi_azul-modified.png` y `Logo-UNAM.png`.
 */
export const SPONSORS: Sponsor[] = [
  {
    id: 'criptounam',
    nombre: 'CriptoUNAM',
    /*
     * Variante 3 y no `logo-criptounam-marca.png`: es la única con fondo
     * transparente y la marca ya en ámbar sobre blanco, que es la paleta del
     * cartel. Las otras traen fondo blanco o el texto en tinta oscura, que
     * sobre el panel negro desaparece.
     */
    logo: '/images/LogosCriptounam3.svg',
    tier: 'organizador',
    url: 'https://criptounam.xyz',
    /*
     * El lockup ya viene en su color: pasarlo por el filtro de silueta lo
     * aplanaría a blanco y se perdería el ámbar del circuito.
     */
    colorPropio: true,
    /* Lockup apaisado (~3:1) con el texto debajo del emblema: necesita más
     * alto que un logotipo suelto o el nombre queda ilegible. */
    ancho: true,
  },
  {
    id: 'facultad-ingenieria',
    nombre: 'Facultad de Ingeniería, UNAM',
    /* Recortado del maestro de semanadie/: el original trae tanto margen
     * transparente que dentro de la tarjeta el escudo quedaba diminuto. */
    logo: '/images/hackathon/sponsors/facultad-ingenieria.png',
    tier: 'organizador',
  },
  {
    id: 'unam',
    nombre: 'UNAM',
    logo: '/images/hackathon/sponsors/unam.png',
    tier: 'organizador',
  },
  {
    /*
     * Semana DIE organiza, no es comunidad aliada: GOYA HACK ocurre dentro de
     * su programa y comparte sede y calendario.
     */
    id: 'semana-die',
    nombre: 'Semana DIE',
    logo: '/images/hackathon/sponsors/semana-die.png',
    tier: 'organizador',
    /* Lockup apaisado, como el de CriptoUNAM. */
    ancho: true,
  },
  {
    id: 'tangem',
    nombre: 'Tangem',
    logo: '/images/hackathon/sponsors/tangem.png',
    tier: 'patrocinador',
    url: 'https://tangem.com',
  },
  {
    id: 'avalanche',
    nombre: 'Avalanche',
    logo: '/images/hackathon/sponsors/avalanche.png',
    tier: 'patrocinador',
    url: 'https://www.avax.network/',
  },
  {
    id: 'stellar',
    nombre: 'Stellar',
    logo: '/images/hackathon/sponsors/stellar.png',
    tier: 'patrocinador',
    url: 'https://stellar.org/',
  },
  {
    id: 'baf',
    nombre: 'BAF',
    logo: '/images/hackathon/sponsors/baf.png',
    tier: 'patrocinador',
    url: 'https://www.linkedin.com/company/thebafnetwork/',
  },
  {
    id: 'elevenlabs',
    nombre: 'ElevenLabs',
    logo: '/images/hackathon/sponsors/elevenlabs.png',
    tier: 'patrocinador',
    url: 'https://elevenlabs.io/',
  },
  {
    id: 'pollar',
    nombre: 'Pollar',
    logo: '/images/hackathon/sponsors/pollar.png',
    tier: 'patrocinador',
    url: 'https://www.pollar.finance/',
  },
  {
    id: 'team1',
    nombre: 'Team1',
    logo: '/images/hackathon/sponsors/team1.png',
    tier: 'patrocinador',
    url: 'https://team1.org/',
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
   * Ruta bajo /public. Opcional: sin archivo, la retícula pinta el nombre en
   * versalitas, que es mejor que un hueco roto mientras llega el logo.
   */
  logo?: string
  url?: string
}

/*
 * No hay marca de "fondo": todas las tarjetas llevan la misma placa clara y
 * cada logo sale en su color. Lo que sí exige el formato es que el archivo se
 * lea SOBRE CLARO — un logotipo en blanco desaparecería. Ver el README de
 * `public/images/hackathon/comunidades/`.
 */

/**
 * Comunidades y colectivos que acompañan GOYA HACK.
 *
 * Van en su propia lista y no como un nivel más de `SPONSORS`: difunden el
 * evento y traen gente, no ponen premios. Semana DIE sí está en `SPONSORS`,
 * como organizador: GOYA HACK ocurre dentro de su programa.
 *
 * Los archivos salen de `public/images/communitypartners/` —los que envían las
 * propias comunidades por el formulario— procesados a
 * `public/images/hackathon/comunidades/` con el nombre normalizado, porque los
 * originales llegan de Drive con espacios, acentos y el nombre de quien los
 * subió pegado detrás.
 *
 * El nombre de cada entrada es el que se lee EN el logo, no el del archivo:
 * varios llegan bautizados con el nombre de quien rellenó el formulario.
 */
export const COMUNIDADES: Comunidad[] = [
  {
    id: 'ethereum-mexico',
    nombre: 'Ethereum México',
    logo: '/images/hackathon/comunidades/ethereum-mexico.png',
    url: 'https://ethmexico.org/',
  },
  {
    id: 'ethereum-lima',
    nombre: 'Ethereum Lima',
    logo: '/images/hackathon/comunidades/ethereum-lima.png',
  },
  {
    id: 'banda-web3',
    nombre: 'Banda Web3',
    logo: '/images/hackathon/comunidades/banda-web3.png',
    url: 'https://mexi.wtf',
  },
  {
    id: 'celo-mexico',
    nombre: 'Celo México',
    logo: '/images/hackathon/comunidades/celo-mexico.png',
  },
  {
    id: 'motusdao',
    nombre: 'MotusDAO',
    logo: '/images/hackathon/comunidades/motusdao.png',
  },
  {
    id: 'frutero-club',
    nombre: 'Frutero Club',
    logo: '/images/hackathon/comunidades/frutero-club.png',
  },
  {
    id: 'unlock',
    nombre: 'UNLOCK Summit',
    logo: '/images/hackathon/comunidades/unlock.png',
    url: 'https://unlocksummit.io/',
  },
  {
    id: 'cartagena-onchain',
    nombre: 'Cartagena Onchain',
    logo: '/images/hackathon/comunidades/cartagena-onchain.jpg',
    url: 'https://cartagenaonchain.org/',
  },
  {
    id: 'medellin-blockchain',
    nombre: 'Medellín Blockchain Community',
    logo: '/images/hackathon/comunidades/medellin-blockchain.jpg',
  },
  {
    id: 'hello-world',
    nombre: 'Hello World UNAM',
    logo: '/images/hackathon/comunidades/hello-world.jpg',
    url: 'https://helloworld-unam.tech/',
  },
  {
    id: 'mi-primera-chamba',
    nombre: 'Mi Primera Chamba AI',
    logo: '/images/hackathon/comunidades/mi-primera-chamba.jpg',
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
    logo: '/images/hackathon/comunidades/casa-blanca.jpg',
    url: 'https://x.com/casaweb3',
  },
  {
    id: 'calmecac',
    nombre: 'Calmecac',
    logo: '/images/hackathon/comunidades/calmecac.png',
  },
  {
    id: 'anber',
    nombre: 'Anber',
    logo: '/images/hackathon/comunidades/anber.png',
  },
  {
    id: 'dev3pack',
    nombre: 'Dev3Pack',
    logo: '/images/hackathon/comunidades/dev3pack.png',
  },
  {
    id: 'escuela-bitcoin',
    nombre: 'Escuela Bitcoin México',
    logo: '/images/hackathon/comunidades/escuela-bitcoin.jpg',
  },
  {
    id: 'embajadores-web3',
    nombre: 'Embajadores Web3',
    logo: '/images/hackathon/comunidades/embajadores-web3.jpg',
  },
  {
    id: 'hola-tia',
    nombre: 'Hola TIA',
    logo: '/images/hackathon/comunidades/hola-tia.png',
  },
  {
    id: 'mongli-dao',
    nombre: 'Mongli DAO',
    logo: '/images/hackathon/comunidades/mongli-dao.jpg',
  },
  {
    id: 'oportuni',
    nombre: 'Oportuni',
    logo: '/images/hackathon/comunidades/oportuni.png',
  },
  {
    id: 'utonoma',
    nombre: 'Utonoma',
    logo: '/images/hackathon/comunidades/utonoma.svg',
  },
  {
    id: 'seyf',
    nombre: 'SEYF',
    logo: '/images/hackathon/comunidades/seyf.svg',
  },
  {
    id: 'relotto',
    nombre: 'Relotto',
    logo: '/images/hackathon/comunidades/relotto.svg',
  },
  {
    id: 'cisco-aula-hibrida',
    nombre: 'Aula Híbrida Cisco',
    logo: '/images/hackathon/comunidades/cisco-aula-hibrida.svg',
  },
  {
    id: 'sebef',
    nombre: 'SEBEF',
    url: 'https://www.linkedin.com/company/sebef-nacional',
  },
]

/* ========================================================================== */
/* Agenda                                                                      */
/* ========================================================================== */

export type AgendaTipo = 'taller' | 'stand' | 'mentoria' | 'hack' | 'hito' | 'mainstage' | 'registro'

export const AGENDA_TIPO_LABEL: Record<AgendaTipo, string> = {
  taller: 'Taller',
  stand: 'Stand',
  mentoria: 'Mentoría',
  hack: 'Área hack',
  hito: 'Hito',
  mainstage: 'Main stage',
  registro: 'Registro',
}

/**
 * Cómo se puede asistir a un bloque del programa.
 *
 * - `presencial`: solo en la Facultad. Los stands son físicos y no se transmiten.
 * - `online`: solo desde la plataforma (el deadline de entrega, por ejemplo).
 * - `hibrido`: pasa en la sede y además se transmite / se atiende en remoto.
 */
export type AgendaModalidad = 'presencial' | 'online' | 'hibrido'

export const AGENDA_MODALIDAD_LABEL: Record<AgendaModalidad, string> = {
  presencial: 'Presencial',
  online: 'En línea',
  hibrido: 'Híbrido',
}

/** Texto corto para los chips de la línea de tiempo, donde no cabe la etiqueta larga. */
export const AGENDA_MODALIDAD_CORTA: Record<AgendaModalidad, string> = {
  presencial: 'Presencial',
  online: 'Online',
  hibrido: 'Presencial + online',
}

export interface AgendaItem {
  /** Hora de inicio, "HH:MM". Es la que se rotula sobre el eje. */
  hora: string
  /** Hora de cierre del bloque. Opcional: los hitos son instantáneos. */
  fin?: string
  titulo: string
  descripcion?: string
  /** `id` de una entrada de SEDES. Pinta el chip de lugar del bloque. */
  sede?: string
  /** Categoría para filtros y el reloj en vivo. */
  tipo: AgendaTipo
  /**
   * Cómo se asiste. Si falta se asume `presencial`: es el caso por defecto de
   * lo que pasa físicamente en la Facultad y no se transmite.
   */
  modalidad?: AgendaModalidad
  /**
   * Enlace propio del bloque para quien lo sigue en remoto. Si falta, la UI
   * cae al enlace general de `TRANSMISION`.
   */
  enlace?: string
  /** Resalta hitos como el kickoff o el cierre de entregas. */
  hito?: boolean
}

/** Modalidad efectiva de un bloque, con el valor por defecto ya aplicado. */
export const agendaModalidad = (item: AgendaItem): AgendaModalidad =>
  item.modalidad ?? 'presencial'

/** ¿Se puede seguir este bloque sin estar en la Facultad? */
export const agendaEsRemoto = (item: AgendaItem): boolean =>
  agendaModalidad(item) !== 'presencial'

export interface AgendaDia {
  id: string
  /** YYYY-MM-DD en zona CDMX. */
  fecha: string
  etiqueta: string
  items: AgendaItem[]
}

/** Convierte `fecha` + `HH:MM` a Date en America/Mexico_City (−06:00). */
export const agendaADate = (fecha: string, hora: string): Date =>
  new Date(`${fecha}T${hora}:00-06:00`)

export const agendaFinDate = (dia: AgendaDia, item: AgendaItem): Date => {
  if (item.fin) return agendaADate(dia.fecha, item.fin)
  // Hitos / bloques sin fin: ventana de 45 min para el reloj.
  return new Date(agendaADate(dia.fecha, item.hora).getTime() + 45 * 60_000)
}

/**
 * Programa oficial Semana DIE × GOYA HACK (lun 21 – vie 25 sep 2026).
 * Talleres, stands, mentorías, área de hack y main stages pueden solaparse.
 */
export const AGENDA: AgendaDia[] = [
  {
    id: 'dia-1',
    fecha: '2026-09-21',
    etiqueta: 'Lunes 21 · Semana DIE',
    items: [
      {
        hora: '09:00',
        fin: '18:00',
        titulo: 'Stand CriptoUNAM · Semana DIE',
        descripcion: 'Arranca Semana DIE. Stand de CriptoUNAM: conoce GOYA HACK, tracks y cómo registrarte.',
        tipo: 'stand',
        modalidad: 'presencial',
        sede: 'cia',
      },
    ],
  },
  {
    id: 'dia-2',
    fecha: '2026-09-22',
    etiqueta: 'Martes 22 · Kickoff',
    items: [
      {
        hora: '09:00',
        fin: '18:00',
        titulo: 'Stand BAF / CriptoUNAM',
        descripcion: 'Stand conjunto BAF × CriptoUNAM durante la apertura.',
        tipo: 'stand',
        modalidad: 'presencial',
      },
      {
        hora: '10:00',
        fin: '11:00',
        titulo: 'Kickoff · GOYA HACK',
        descripcion: 'Bienvenida oficial, tracks, retos y reglas. Arranca el reloj del hackathon.',
        tipo: 'hito',
        modalidad: 'hibrido',
        sede: 'auditorio',
        hito: true,
      },
      {
        hora: '12:00',
        fin: '14:00',
        titulo: 'Registro',
        descripcion: 'Check-in de equipos y acreditación de participantes.',
        tipo: 'registro',
        modalidad: 'hibrido',
      },
      {
        hora: '14:00',
        fin: '19:00',
        titulo: 'Área de hack',
        descripcion: 'Se abre la zona de construcción: forma equipo, monta tu stack y empieza a buildear.',
        tipo: 'hack',
        modalidad: 'hibrido',
        sede: 'cia',
      },
    ],
  },
  {
    id: 'dia-3',
    fecha: '2026-09-23',
    etiqueta: 'Miércoles 23 · Talleres',
    items: [
      {
        hora: '09:00',
        fin: '10:00',
        titulo: 'Taller 1 · Envío de proyectos CriptoUNAM',
        descripcion: 'Cómo entregar tu BUIDL en la plataforma: checklist, requisitos y tips.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '09:00',
        fin: '18:00',
        titulo: 'Stand Tangem',
        descripcion: 'Stand del patrocinador de premios y track AI. Cuenta Tangem + TangemPAY.',
        tipo: 'stand',
        modalidad: 'presencial',
      },
      {
        hora: '09:00',
        fin: '19:00',
        titulo: 'Área de hack',
        descripcion: 'Mesas de trabajo abiertas todo el día.',
        tipo: 'hack',
        modalidad: 'hibrido',
        sede: 'cia',
      },
      {
        hora: '09:00',
        fin: '18:00',
        titulo: 'Mentorías por mentor',
        descripcion: 'Rondas de mentoría durante el día. Agenda con el mentor de tu track.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
        sede: 'cia',
      },
      {
        hora: '10:00',
        fin: '12:00',
        titulo: 'Taller 2 · Stellar',
        descripcion: 'Pagos, assets y Soroban: taller técnico del ecosistema Stellar / BAF.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '12:00',
        fin: '13:00',
        titulo: 'Taller 3 · Eleven Labs',
        descripcion: 'IA de voz y agentes: integra Eleven Labs en tu producto.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '13:00',
        fin: '14:00',
        titulo: 'Taller 4 · Pollar',
        descripcion: 'Wallets embebidas y pagos Stellar para builders LATAM.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '14:00',
        fin: '15:00',
        titulo: 'Taller 5 · Modelo de negocio',
        descripcion: 'De demo a producto: propuesta de valor, usuarios y pitch.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '15:00',
        fin: '16:00',
        titulo: 'Taller 6 · Avalanche',
        descripcion: 'Despliega en Fuji / C-Chain: contratos, DeFi e infra Avalanche.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '16:00',
        fin: '17:00',
        titulo: 'Taller 8 · GrantFox',
        descripcion: 'Grants y financiamiento para builders: cómo aplicar y qué buscan.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
      {
        hora: '17:00',
        fin: '18:00',
        titulo: 'Taller 7 · Tangem',
        descripcion: 'Wallets, TangemPAY y cómo preparar tu producto para premios.',
        tipo: 'taller',
        modalidad: 'hibrido',
      },
    ],
  },
  {
    id: 'dia-4',
    fecha: '2026-09-24',
    etiqueta: 'Jueves 24 · Mentorías',
    items: [
      {
        hora: '09:00',
        fin: '18:00',
        titulo: 'Stand Avalanche',
        descripcion: 'Stand Avax: docs, Fuji y soporte para el reto Blockchain.',
        tipo: 'stand',
        modalidad: 'presencial',
      },
      {
        hora: '09:00',
        fin: '19:00',
        titulo: 'Área de hack',
        descripcion: 'Recta de construcción con mentorías en paralelo.',
        tipo: 'hack',
        modalidad: 'hibrido',
        sede: 'cia',
      },
      {
        hora: '10:00',
        fin: '11:00',
        titulo: 'Mentoría Stellar',
        descripcion: 'Office hours del ecosistema Stellar / BAF.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
      },
      {
        hora: '11:00',
        fin: '12:00',
        titulo: 'Mentoría Eleven Labs',
        descripcion: 'Dudas técnicas de integración de voz e IA.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
      },
      {
        hora: '12:00',
        fin: '13:00',
        titulo: 'Mentoría modelo de negocio',
        descripcion: 'Feedback de producto, mercado y narrativa.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
      },
      {
        hora: '13:00',
        fin: '14:00',
        titulo: 'Mentoría contratos inteligentes',
        descripcion: 'Revisión de Solidity / Soroban / arquitectura on-chain.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
      },
      {
        hora: '14:00',
        fin: '15:00',
        titulo: 'Main stage · Tangem',
        descripcion: 'Keynote / sesión en main stage con Tangem.',
        tipo: 'mainstage',
        modalidad: 'hibrido',
        sede: 'auditorio',
        hito: true,
      },
      {
        hora: '14:00',
        fin: '16:00',
        titulo: 'Mentorías abiertas',
        descripcion: 'Bloque libre de mentoría mientras corre el main stage.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
        sede: 'cia',
      },
      {
        hora: '15:00',
        fin: '18:00',
        titulo: 'Stand Tangem',
        descripcion: 'Stand Tangem abierto en la tarde.',
        tipo: 'stand',
        modalidad: 'presencial',
      },
    ],
  },
  {
    id: 'dia-5',
    fecha: '2026-09-25',
    etiqueta: 'Viernes 25 · Entrega',
    items: [
      {
        hora: '09:00',
        fin: '14:00',
        titulo: 'Área de hack',
        descripcion: 'Última ventana de construcción antes del deadline.',
        tipo: 'hack',
        modalidad: 'hibrido',
        sede: 'cia',
      },
      {
        hora: '09:00',
        fin: '14:00',
        titulo: 'Mentorías finales · dudas de envío',
        descripcion: 'Últimas dudas técnicas y de entrega en plataforma.',
        tipo: 'mentoria',
        modalidad: 'hibrido',
        sede: 'cia',
      },
      {
        hora: '14:00',
        fin: '15:00',
        titulo: 'Main stage · BAF × Stellar',
        descripcion: 'Sesión en main stage con BAF × Stellar.',
        tipo: 'mainstage',
        modalidad: 'hibrido',
        sede: 'auditorio',
        hito: true,
      },
      {
        hora: '14:00',
        titulo: 'Deadline · cierre de entregas',
        descripcion: 'Límite para enviar el proyecto. Se bloquea el envío de BUIDLs.',
        tipo: 'hito',
        modalidad: 'online',
        hito: true,
      },
      {
        hora: '15:00',
        fin: '18:00',
        titulo: 'Stand Avalanche',
        descripcion: 'Stand Avax en la tarde de entrega.',
        tipo: 'stand',
        modalidad: 'presencial',
      },
      {
        hora: '18:00',
        fin: '20:00',
        titulo: 'Clausura y anuncio de ganadores',
        descripcion: 'Cierre de GOYA HACK · Semana DIE 2026. Premiación por tracks.',
        tipo: 'hito',
        modalidad: 'hibrido',
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
 * El rango de fechas tal y como aparece en el cartel: "22 – 25" y
 * "DE SEPTIEMBRE" por separado, que es como está maquetado.
 *
 * Se deriva de `startsAt`/`endsAt` en vez de escribirse a mano: son las mismas
 * dos fechas que alimentan la cuenta atrás, así que no pueden discrepar.
 */
const dia = (iso: string) => new Date(iso).getDate()
const mes = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { month: 'long' })

export const FECHAS_CARTEL = {
  /** "22 – 25" */
  rango: `${dia(HACKATHON_INFO.startsAt)} – ${dia(HACKATHON_INFO.endsAt)}`,
  /** "de septiembre" */
  mes: `de ${mes(HACKATHON_INFO.startsAt)}`,
  /** "22 – 25 de septiembre" — para copy en línea. */
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

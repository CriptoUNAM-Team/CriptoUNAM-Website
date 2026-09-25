/**
 * Contenido de la presentación pública GOYA HACK.
 * Ruta: /hackathon/presentacion — navegar con ← → o espacio.
 */

export type SlideKind =
  | 'portada'
  | 'texto'
  | 'fotos'
  | 'logos'
  | 'grid'
  | 'lista'
  | 'premios'
  | 'cierre'

export interface SlideFoto {
  src: string
  alt: string
  caption?: string
}

export interface SlideLogo {
  src: string
  nombre: string
  colorPropio?: boolean
}

export interface SlideItem {
  titulo: string
  detalle?: string
  meta?: string
}

export interface PresentacionSlide {
  id: string
  kind: SlideKind
  rotulo?: string
  titulo: string
  subtitulo?: string
  cuerpo?: string
  bullets?: string[]
  fotos?: SlideFoto[]
  logos?: SlideLogo[]
  items?: SlideItem[]
  /** Fondo fotográfico (portada / cierre). */
  fondo?: string
}

export const PRESENTACION_GOYA: PresentacionSlide[] = [
  {
    id: 'portada',
    kind: 'portada',
    rotulo: 'Semana DIE · FI-UNAM · 2026',
    titulo: 'GOYA HACK',
    subtitulo: '22–25 de septiembre · Facultad de Ingeniería',
    cuerpo: 'Hackathon universitario · presencial y en línea',
    fondo: '/video/hackathon-hero-poster.jpg',
  },
  {
    id: 'quienes',
    kind: 'texto',
    rotulo: 'Quiénes somos',
    titulo: 'CriptoUNAM',
    subtitulo: 'La comunidad blockchain e IA de la UNAM',
    cuerpo:
      'Somos estudiantes y builders que acercan Web3 e inteligencia artificial a la universidad: educación, eventos, hackathons y proyectos que salen del campus al ecosistema.',
    bullets: [
      'Comunidad abierta · Facultad de Ingeniería y más allá',
      'Formación práctica: cursos, talleres y mentorías',
      'Puente entre la UNAM y el ecosistema crypto latinoamericano',
    ],
  },
  {
    id: 'equipo',
    kind: 'fotos',
    rotulo: 'El equipo',
    titulo: 'Quién construye CriptoUNAM',
    fotos: [
      { src: '/images/Equipo/GerardoVela.jpg', alt: 'Gerardo Vela', caption: 'Gerardo · Founder' },
      { src: '/images/Equipo/FernandaTello.jpg', alt: 'Fernanda Tello', caption: 'Fernanda · COO' },
      { src: '/images/Equipo/AArmenta.png', alt: 'Adrian Armenta', caption: 'Adrian · CTO' },
      { src: '/images/Equipo/Kubs.png', alt: 'Daniel Cruz', caption: 'Daniel · CMO' },
      { src: '/images/Equipo/AndresRodriguez.jpg', alt: 'Andrés Rodríguez', caption: 'Andrés · Research' },
      { src: '/images/Equipo/IanHernandes.jpg', alt: 'Ian Hernández', caption: 'Ian · Smart contracts' },
    ],
  },
  {
    id: 'hecho-fotos',
    kind: 'fotos',
    rotulo: 'Lo que hemos hecho',
    titulo: 'Comunidad en acción',
    subtitulo: 'Eventos, talleres y encuentros en campus',
    fotos: [
      {
        src: '/images/AGOSTO_CRIPTOUNAM/IMG_5210.jpg',
        alt: 'Evento CriptoUNAM',
        caption: 'Talleres en campus',
      },
      {
        src: '/images/AGOSTO_CRIPTOUNAM/IMG_5269.jpg',
        alt: 'Comunidad CriptoUNAM',
        caption: 'Sesiones con builders',
      },
      {
        src: '/images/OCTUBRE_CRIPTOUNAM/IMG_6710.jpg',
        alt: 'Meetup CriptoUNAM',
        caption: 'Meetups y networking',
      },
      {
        src: '/images/OCTUBRE_CRIPTOUNAM/IMG_6784.jpg',
        alt: 'Comunidad en evento',
        caption: 'Comunidad UNAM',
      },
      {
        src: '/images/hackathon/sedes/cia-1.jpg',
        alt: 'CIA Facultad de Ingeniería',
        caption: 'CIA · sede del hack',
      },
      {
        src: '/images/CIA1.png',
        alt: 'Centro de Ingeniería Avanzada',
        caption: 'Espacio de construcción',
      },
    ],
  },
  {
    id: 'proyectos',
    kind: 'grid',
    rotulo: 'Trayectoria',
    titulo: 'Proyectos nacidos en hackathons',
    subtitulo: 'Startups y BUIDLs de la comunidad',
    items: [
      { titulo: 'UTONOMA', detalle: 'Video educativo descentralizado', meta: 'Web3' },
      { titulo: 'Faro', detalle: 'Producto sobre Stellar', meta: 'Stellar' },
      { titulo: 'La Kiniela', detalle: 'Predicciones on-chain', meta: 'Web3' },
      { titulo: 'PumaPay', detalle: 'Wallet universitaria', meta: 'Stellar' },
      { titulo: 'Blueprint', detalle: 'Hackathon Mantle', meta: 'Mantle' },
      { titulo: 'Skillhub ID', detalle: 'Identidad y reputación', meta: 'Web3' },
    ],
  },
  {
    id: 'que-es',
    kind: 'texto',
    rotulo: 'El evento',
    titulo: '¿De qué trata GOYA HACK?',
    subtitulo: '~76 horas · 22–25 septiembre · híbrido',
    cuerpo:
      'Hackathon universitario dentro de Semana DIE: construyes en el CIA o en línea, eliges uno o más tracks, entregas un BUIDL y presentas ante jurado. Mismos premios presencial y remoto.',
    bullets: [
      'Tracks: AI · Blockchain · Contenido',
      'Equipos de 1 a 5 · registro gratis',
      'Kickoff martes 22 · deadline domingo 27 · 23:29',
      'Requisito: wallet Tangem desde el enlace de GOYA HACK',
    ],
  },
  {
    id: 'tracks',
    kind: 'lista',
    rotulo: 'Tracks',
    titulo: 'Elige tu terreno',
    items: [
      {
        titulo: 'AI · CriptoUNAM',
        detalle: 'Agentes, LLMs, copilots. Bolsa 85M $PUMA (50M · 25M · 10M).',
        meta: '$PUMA',
      },
      {
        titulo: 'Blockchain',
        detalle: 'Stellar ($150·100·80) · Avalanche ($50·25·10) · Pollar ($125·$75).',
        meta: '3 retos',
      },
      {
        titulo: 'Contenido · Tangem',
        detalle: 'Narrativa, educación y media. Podio $50 · $25 · $10 USD.',
        meta: 'USD',
      },
    ],
  },
  {
    id: 'sponsors',
    kind: 'logos',
    rotulo: 'Aliados',
    titulo: 'Patrocinadores oficiales',
    subtitulo: 'Quien organiza y quien pone los premios',
    logos: [
      { src: '/images/LogosCriptounam3.svg', nombre: 'CriptoUNAM', colorPropio: true },
      { src: '/images/hackathon/sponsors/facultad-ingenieria.png', nombre: 'FI-UNAM' },
      { src: '/images/hackathon/sponsors/unam.png', nombre: 'UNAM' },
      { src: '/images/hackathon/sponsors/semana-die.png', nombre: 'Semana DIE' },
      { src: '/images/hackathon/sponsors/tangem.png', nombre: 'Tangem' },
      { src: '/images/hackathon/sponsors/stellar.png', nombre: 'Stellar' },
      { src: '/images/hackathon/sponsors/baf.png', nombre: 'BAF' },
      { src: '/images/hackathon/sponsors/avalanche.png', nombre: 'Avalanche' },
      { src: '/images/hackathon/sponsors/pollar.png', nombre: 'Pollar' },
    ],
  },
  {
    id: 'premios',
    kind: 'premios',
    rotulo: 'Premios',
    titulo: 'Lo que hay en juego',
    subtitulo: '85M $PUMA + $700 USD + extras',
    items: [
      { titulo: 'AI', detalle: '50M · 25M · 10M $PUMA', meta: 'CriptoUNAM' },
      { titulo: 'Stellar', detalle: '$150 · $100 · $80 + aceleradora Instaward', meta: 'BAF' },
      { titulo: 'Avalanche', detalle: '$50 · $25 · $10', meta: 'AVAX' },
      { titulo: 'Pollar', detalle: '$125 · $75 · mejor integración', meta: '2 lugares' },
      { titulo: 'Contenido', detalle: '$50 · $25 · $10', meta: 'Tangem' },
      { titulo: 'Extras', detalle: '3 MoureDev Pro · certificado on-chain + drop $PUMA', meta: 'Axolotech' },
    ],
  },
  {
    id: 'horarios',
    kind: 'lista',
    rotulo: 'Horarios',
    titulo: 'Cuatro días en la FI',
    items: [
      {
        titulo: 'Martes 22',
        detalle: 'Kickoff 10:00 Auditorio Barros Sierra · registro CIA 11:00–14:00 · hack desde 14:00',
        meta: 'Arranque',
      },
      {
        titulo: 'Miércoles 23',
        detalle: 'CIA 09:00–17:00 · talleres Stellar, Pollar, negocio, Avalanche L1 · main stage Tangem',
        meta: 'Talleres',
      },
      {
        titulo: 'Jueves 24',
        detalle: 'CIA 09:00–17:00 · APEX, Office Hours AVAX, GrantFox · main stage Stellar×BAF',
        meta: 'Build',
      },
      {
        titulo: 'Viernes 25',
        detalle: 'CIA hasta 14:00 · clausura 18:00 · entrega hasta domingo 23:29',
        meta: 'Cierre',
      },
    ],
  },
  {
    id: 'actividades',
    kind: 'texto',
    rotulo: 'Actividades',
    titulo: 'Más que buildear',
    cuerpo: 'Durante Semana DIE el stand y el CIA conviven con el área de hack.',
    bullets: [
      'Stand CriptoUNAM + Tangem: VR, rifas e info Avalanche',
      'Mentorías en vivo (presencial y remoto)',
      'Main stages: Tangem (mié) y Stellar × BAF (jue) 14:00–15:00',
      'Demo day y pitch ante jurado',
      'Networking con comunidades aliadas',
    ],
  },
  {
    id: 'talleres',
    kind: 'lista',
    rotulo: 'Talleres',
    titulo: 'Programa Luma',
    subtitulo: 'Inscripción en luma.com/goyahack',
    items: [
      { titulo: 'Stellar', detalle: 'Contratos, wallets y Testnet', meta: 'Mié 11:00' },
      { titulo: 'POLLAR', detalle: 'Smart Wallets', meta: 'Mié 13:00' },
      { titulo: 'Modelo de negocio', detalle: 'De demo a producto', meta: 'Mié 14:00' },
      { titulo: 'Avalanche L1', detalle: 'Despliega tu L1 · Team1', meta: 'Mié 15:00' },
      { titulo: 'APEX + Office Hours', detalle: 'Entrega del proyecto · dudas AVAX', meta: 'Jue 11:00' },
      { titulo: 'GrantFox', detalle: 'De cero a contributor', meta: 'Jue 12:00' },
    ],
  },
  {
    id: 'oportunidades',
    kind: 'texto',
    rotulo: 'Oportunidades',
    titulo: 'Qué te llevas',
    bullets: [
      'Premios en $PUMA y USD + certificaciones MoureDev Pro',
      'Ganadores Stellar: acceso a aceleradora Instaward',
      'Certificado oficial en blockchain + drop de $PUMA por BUIDL válido',
      'Portfolio real ante jurado y sponsors',
      'Red con builders, comunidades y el ecosistema UNAM',
      'Experiencia híbrida: compites igual desde donde estés',
    ],
  },
  {
    id: 'cierre',
    kind: 'cierre',
    rotulo: 'Regístrate',
    titulo: 'Nos vemos en GOYA HACK',
    subtitulo: 'criptounam.xyz/hackathon',
    cuerpo: 'Panel · equipos · Luma goyahack · Guía del Hacker',
    fondo: '/images/hackathon/sedes/cia-2.jpg',
  },
]

/**
 * Proyectos / startups CriptoUNAM nacidos en hackathones.
 * Imágenes en: public/images/Proyectos_Hacks/
 * Editar aquí para actualizar en /proyectos y en el banner del Home.
 *
 * El orden controla la prioridad de aparición en el banner del Home y en /proyectos.
 * Las "startups en desarrollo activo" van primero.
 */
const IMG = '/images/Proyectos_Hacks'

export interface EnlaceProyecto {
  label: string
  href: string
}

export interface CapturaProyecto {
  src: string
  alt: string
  /** `movil` = captura vertical de la app; `web` = apaisada. */
  formato: 'movil' | 'web'
}

export interface ProyectoHackItem {
  id: string
  nombre: string
  descripcion: string
  demo?: string
  repo?: string
  red: string
  imagen: string
  /**
   * Proyecto insignia de la comunidad: se destaca arriba en el home y en
   * /proyectos con capturas, enlaces oficiales y descripción larga.
   */
  insignia?: {
    tagline: string
    /** Párrafos de la ficha larga. */
    resumen: string[]
    /** Logo pensado para fondo oscuro (el `imagen` de la tarjeta puede no serlo). */
    logo: string
    /** El logo trae fondo claro / tinta oscura: se monta en una placa clara. */
    logoPlacaClara?: boolean
    /** Chips de tecnologías / integraciones. */
    stack: string[]
    capturas: CapturaProyecto[]
    enlaces: EnlaceProyecto[]
  }
}

export const proyectosHacksData: ProyectoHackItem[] = [
  // ---------- Proyectos insignia (SEYF y UTONOMA) y startups activas ----------
  {
    id: 'seyf',
    nombre: 'SEYF',
    descripcion:
      'Ahorro en USDC con rendimiento real en Stellar mainnet y adelanto de ese rendimiento hoy, sin frase semilla ni XLM.',
    demo: 'https://www.seyf.app',
    repo: 'https://github.com/Seyfert-Labs/SEYF-P',
    red: 'Stellar',
    imagen: `${IMG}/seyf/seyf-logo.png`,
    insignia: {
      tagline: 'Buy now, pay never · ahorro que te paga hoy',
      resumen: [
        'Entras con tu correo y Pollar te crea una wallet de Stellar co-firmada: sin frase semilla, sin extensión y sin XLM, porque SEYF patrocina reservas y comisiones.',
        'Tus USDC van a una bóveda de DeFindex que los presta en Blend y generan rendimiento real. El contrato Soroban seyf_advance te adelanta hoy el rendimiento de los próximos 1 a 30 días sin tocar tu capital.',
        'Construido por Seyfert Labs, equipo de la comunidad CriptoUNAM, y presentado en HackMeridian 2026 (Lisboa) en el track Stellar Composed.',
      ],
      logo: `${IMG}/seyf/seyf-logo.png`,
      stack: ['Stellar mainnet', 'Soroban', 'DeFindex', 'Blend', 'Pollar', 'USDC'],
      capturas: [
        { src: `${IMG}/seyf/hero.jpg`, alt: 'Landing de SEYF: tu dinero, protegido y creciendo en piloto automático', formato: 'web' },
        { src: `${IMG}/seyf/01-home.jpg`, alt: 'Inicio de la app SEYF con el saldo', formato: 'movil' },
        { src: `${IMG}/seyf/05-ahorro.jpg`, alt: 'Pantalla de ahorro en la bóveda', formato: 'movil' },
        { src: `${IMG}/seyf/09-adelanto.jpg`, alt: 'Adelanto del rendimiento', formato: 'movil' },
        { src: `${IMG}/seyf/04-enviar.jpg`, alt: 'Enviar USDC', formato: 'movil' },
      ],
      enlaces: [
        { label: 'Abrir la app', href: 'https://www.seyf.app/app' },
        { label: 'seyf.app', href: 'https://www.seyf.app' },
        { label: 'Código', href: 'https://github.com/Seyfert-Labs/SEYF-P' },
        {
          label: 'Contrato en mainnet',
          href: 'https://stellar.expert/explorer/public/contract/CCZ77VBEZZIRBK3Z7RO4W227764G76ILXKO664R622FOSJTE7BX4CWXH',
        },
      ],
    },
  },
  {
    id: 'utonoma',
    nombre: 'UTONOMA',
    descripcion:
      'Red social descentralizada: publica contenido útil, recibe likes y gana cripto, con moderación democrática on-chain.',
    demo: 'https://utonoma.com/',
    red: 'Web3',
    imagen: `${IMG}/UTONOMA.svg`,
    insignia: {
      tagline: 'Publica, vota y gana cripto en una red descentralizada',
      resumen: [
        'Utonoma premia el contenido útil: quien publica recibe likes que se convierten en cripto, y la comunidad modera de forma democrática y on-chain.',
        'Nació en la comunidad CriptoUNAM como plataforma de video para contenido educativo y hoy sigue en desarrollo activo con una experiencia pensada para cualquiera, no solo para gente cripto.',
      ],
      logo: `${IMG}/UTONOMA.svg`,
      logoPlacaClara: true,
      stack: ['Smart contracts', 'Moderación on-chain', 'Video', 'Recompensas cripto'],
      capturas: [
        { src: `${IMG}/utonoma/hero.jpg`, alt: 'Portada de utonoma.com', formato: 'web' },
      ],
      enlaces: [{ label: 'utonoma.com', href: 'https://utonoma.com/' }],
    },
  },
  {
    id: 'faro',
    nombre: 'Faro',
    descripcion: 'Proyecto sobre la red Stellar.',
    demo: 'https://faro-gamma.vercel.app/',
    repo: 'https://github.com/MarxMad/Faro',
    red: 'Stellar',
    imagen: `${IMG}/Faro.svg`,
  },
  {
    id: 'lakiniela',
    nombre: 'La Kiniela',
    descripcion: 'Plataforma de predicciones y quinielas descentralizadas.',
    red: 'Web3',
    imagen: `${IMG}/Kiniela.svg`,
  },

  // ---------- Resto de proyectos de hackathones ----------
  {
    id: 'blueprint',
    nombre: 'Blueprint',
    descripcion: 'Proyecto desarrollado en el hackathon de Mantle.',
    demo: 'https://blueprint-1-six.vercel.app/',
    repo: 'https://github.com/Mantle-Hackaton/Blueprint',
    red: 'Mantle',
    imagen: `${IMG}/BluePrint.svg`,
  },
  {
    id: 'econosfera',
    nombre: 'Econosfera',
    descripcion: 'Herramienta para economistas.',
    demo: 'https://econosfera.vercel.app/',
    repo: 'https://github.com/MarxMad/Econosfera',
    red: 'Herramienta para economistas',
    imagen: `${IMG}/Econosfera.svg`,
  },
  {
    id: 'pumapay',
    nombre: 'PumaPay',
    descripcion: 'Wallet universitaria para pagos en campus.',
    demo: 'https://puma-pay-campus-wallet.vercel.app/',
    repo: 'https://github.com/MarxMad/puma-pay-campus-wallet',
    red: 'Stellar',
    imagen: `${IMG}/PumaPay.svg`,
  },
  {
    id: 'unbox',
    nombre: 'Unbox',
    descripcion: 'Tokenización de streetwear y art toys en Solana.',
    demo: 'https://unbo-x.vercel.app/',
    repo: 'https://github.com/MarxMad/UnboX/tree/main',
    red: 'Solana',
    imagen: `${IMG}/Unbox.svg`,
  },
  {
    id: 'mydentalvault',
    nombre: 'My Dental Vault',
    descripcion: 'Registro dental e historia médica en blockchain.',
    demo: 'https://nerd-camp.vercel.app/',
    repo: 'https://github.com/MarxMad/NerdCamp',
    red: 'Polkadot',
    imagen: `${IMG}/MyDentalVault.svg`,
  },
  {
    id: 'premio',
    nombre: 'Premio.xyz',
    descripcion: 'Plataforma de sorteos y premios descentralizados.',
    demo: 'https://celo-build-web-8rej.vercel.app/',
    repo: 'https://github.com/MarxMad/CeloBuild-/tree/main/apps/web',
    red: 'Celo',
    imagen: `${IMG}/Premioxyz.svg`,
  },
  {
    id: 'cirkula',
    nombre: 'CirKula',
    descripcion: 'Proyecto desarrollado en ETH México.',
    demo: 'https://eth-mex2025.vercel.app/',
    repo: 'https://github.com/MarxMad/EthMex2025',
    red: 'Arbitrum',
    imagen: `${IMG}/Cirkula.svg`,
  },
  {
    id: 'evvm',
    nombre: 'EVVM Explorer',
    descripcion: 'Explorador de bloques para EVVM.',
    demo: 'https://evvm-blockexplorer.vercel.app/',
    repo: 'https://github.com/MarxMad/EVVM-Blockexplorer',
    red: 'EVVM',
    imagen: `${IMG}/EVVM_Explorer.svg`,
  },
  {
    id: 'campuscoin',
    nombre: 'CampusCoin',
    descripcion: 'Token universitario para incentivos y gobernanza.',
    demo: 'https://base-batches-miniapp-cc.vercel.app/',
    repo: 'https://github.com/MarxMad/BaseBatches-MiniappCC',
    red: 'Base',
    imagen: `${IMG}/CampusCoin.svg`,
  },
  {
    id: 'copamundial',
    nombre: 'CopaMundial',
    descripcion: 'Predicciones y apuestas para el mundial.',
    demo: 'https://mundial-buzz.vercel.app/',
    repo: 'https://github.com/MarxMad/mundial-buzz',
    red: 'Chiliz',
    imagen: `${IMG}/CopaMundial.svg`,
  },
  {
    id: 'corewaves',
    nombre: 'Corewaves Agent',
    descripcion: 'Agentes y TokenLauncher sobre Core.',
    demo: 'https://coreweave-agents.vercel.app/dashboard',
    repo: 'https://github.com/MarxMad/coreweave-agents',
    red: 'Core',
    imagen: `${IMG}/Sinter.svg`,
  },
  {
    id: 'verifica',
    nombre: 'Verifica.XYZ',
    descripcion: 'Transparencia institucional con ENS. Ganador de 3 tracks en ETH México Monterrey.',
    red: 'Ethereum',
    imagen: `${IMG}/Verifica.svg`,
  },
  {
    id: 'skillhub',
    nombre: 'SkillHub ID',
    descripcion: 'Certificación de habilidades a través de la comunidad.',
    demo: 'https://skill-hub-id.vercel.app/',
    repo: 'https://github.com/MarxMad/SkillHubID/tree/main/frontend-skillchain',
    red: 'Stellar',
    imagen: `${IMG}/SkilhubID.svg`,
  },
]

/** Los proyectos insignia de la comunidad, en el orden en que se destacan. */
export const proyectosInsignia = proyectosHacksData.filter(
  (p): p is ProyectoHackItem & { insignia: NonNullable<ProyectoHackItem['insignia']> } => Boolean(p.insignia),
)

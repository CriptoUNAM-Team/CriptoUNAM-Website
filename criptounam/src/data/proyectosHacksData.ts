/**
 * Proyectos / startups CriptoUNAM nacidos en hackathones.
 * Imágenes en: public/images/Proyectos_Hacks/
 * Editar aquí para actualizar en /proyectos y en el banner del Home.
 *
 * El orden controla la prioridad de aparición en el banner del Home y en /proyectos.
 * Las "startups en desarrollo activo" van primero.
 */
const IMG = '/images/Proyectos_Hacks'

export interface ProyectoHackItem {
  id: string
  nombre: string
  descripcion: string
  demo?: string
  repo?: string
  red: string
  imagen: string
}

export const proyectosHacksData: ProyectoHackItem[] = [
  // ---------- Startups en desarrollo activo ----------
  {
    id: 'utonoma',
    nombre: 'UTONOMA',
    descripcion: 'Plataforma de videos descentralizada para contenido educativo.',
    demo: 'https://utonoma.com/',
    red: 'Web3',
    imagen: `${IMG}/UTONOMA.svg`,
  },
  {
    id: 'seyf',
    nombre: 'SEYF',
    descripcion: 'Startup nueva construida sobre Stellar por la comunidad CriptoUNAM.',
    red: 'Stellar',
    imagen: `${IMG}/SEYF.svg`, // pendiente — añadir SVG en public/images/Proyectos_Hacks/
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

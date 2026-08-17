/**
 * Contenido de la Guía del Hacker (/hackathon/guia).
 *
 * Todo el texto vive aquí: para actualizar la guía no hace falta tocar la
 * página. Cada sección es una tarjeta; los `items` son viñetas y los `links`
 * salen como botones al final de la sección.
 */

export interface GuiaLink {
  label: string
  url: string
}

export interface GuiaSection {
  id: string
  /** Nombre del icono de Font Awesome soportado en la página (ver ICONS en HackathonGuia). */
  icon: 'rocket' | 'code' | 'brain' | 'cube' | 'upload' | 'microphone' | 'shield' | 'book'
  title: string
  intro?: string
  items?: string[]
  links?: GuiaLink[]
}

export const GUIA_SECTIONS: GuiaSection[] = [
  {
    id: 'antes-de-empezar',
    icon: 'rocket',
    title: 'Antes de empezar',
    intro:
      'Todo pasa en este sitio: aquí te registras, formas o te unes a un equipo y entregas tu BUIDL.',
    items: [
      'Regístrate desde tu panel antes del kickoff: entras con tu correo o tu wallet.',
      'Arma equipo de 1 a 5 personas. Puedes llegar solo: en el kickoff hay dinámica de formación de equipos.',
      'Elige un track (AI & Agentes, Web3/DeFi o Impacto Social) — puedes cambiarlo hasta la entrega.',
      'Ten listo tu entorno antes del día 1: perder las primeras horas instalando cosas se paga caro.',
    ],
  },
  {
    id: 'setup',
    icon: 'code',
    title: 'Setup mínimo recomendado',
    intro: 'Con esto puedes construir en cualquiera de los tres tracks sin pelearte con el entorno.',
    items: [
      'Node.js 20+ y pnpm (o npm). Git y una cuenta de GitHub con el repo del proyecto en público.',
      'Editor con asistente de IA: VS Code + Copilot, Cursor o Claude Code.',
      'Wallet: Core o MetaMask con la red Avalanche Fuji (testnet) activada.',
      'AVAX de prueba desde el faucet de Fuji para desplegar y firmar transacciones.',
      'Para agentes: una API key de tu proveedor de LLM y un repo base (Vercel AI SDK, LangChain o similar).',
    ],
    links: [
      { label: 'Faucet Avalanche Fuji', url: 'https://faucet.avax.network/' },
      { label: 'Core Wallet', url: 'https://core.app/' },
    ],
  },
  {
    id: 'web3',
    icon: 'cube',
    title: 'Stack Web3 (Avalanche)',
    intro: 'Los retos de blockchain se despliegan en Avalanche. Fuji para desarrollar, mainnet solo si el reto lo pide.',
    items: [
      'Contratos: Solidity con Foundry o Hardhat. Despliega en Fuji (chain ID 43113) y verifica en Snowtrace.',
      'Frontend: viem + wagmi para lecturas y escrituras; evita librerías pesadas que no vas a terminar de configurar.',
      'Guarda las direcciones desplegadas y los hashes de las transacciones: los vas a necesitar en la entrega.',
      'Si tu proyecto usa tokens, prueba primero con montos ridículamente pequeños.',
    ],
    links: [
      { label: 'Docs de Avalanche', url: 'https://build.avax.network/docs' },
      { label: 'Snowtrace Fuji', url: 'https://testnet.snowtrace.io/' },
      { label: 'Foundry Book', url: 'https://book.getfoundry.sh/' },
    ],
  },
  {
    id: 'ia',
    icon: 'brain',
    title: 'Stack de IA y agentes',
    intro: 'Un agente que hace una cosa bien vale más que uno que promete diez y no demuestra ninguna.',
    items: [
      'Define la tarea concreta que resuelve tu agente y qué herramientas puede llamar.',
      'Empieza con un flujo determinista y agrega autonomía solo donde aporte.',
      'Registra las llamadas del agente (logs) — sirven de evidencia en el pitch.',
      'Cuida las llaves: nunca las subas al repo ni las pegues en el frontend.',
    ],
    links: [{ label: 'Vercel AI SDK', url: 'https://ai-sdk.dev/docs' }],
  },
  {
    id: 'entrega',
    icon: 'upload',
    title: 'Qué se entrega',
    intro:
      'La entrega se hace desde tu panel antes del cierre. Revisa dos veces que los enlaces sean públicos.',
    items: [
      'Repositorio de GitHub público con README que explique cómo correr el proyecto.',
      'Video demo de máximo 3 minutos mostrando el producto funcionando (no diapositivas).',
      'Dirección del contrato desplegado y/o URL del demo en vivo, si aplica.',
      'Descripción del proyecto, track elegido e integrantes del equipo.',
    ],
  },
  {
    id: 'pitch',
    icon: 'microphone',
    title: 'El pitch final',
    intro: '5 minutos ante el jurado. Se evalúa implementación técnica, innovación, impacto y demo funcional.',
    items: [
      'Primeros 30 segundos: qué problema resuelves y para quién. Sin historia larga.',
      'Enseña el producto funcionando antes de explicar la arquitectura.',
      'Ten un plan B grabado por si falla el internet en la sede.',
      'Cierra diciendo qué construirías con más tiempo: el jurado premia visión.',
    ],
  },
  {
    id: 'reglas',
    icon: 'shield',
    title: 'Reglas y sentido común',
    items: [
      'El código se escribe durante el hackathon. Puedes usar librerías, plantillas y asistentes de IA, pero declara lo que reutilizas.',
      'Un proyecto por equipo y un equipo por persona.',
      'Todo el equipo debe estar registrado en la plataforma para poder recibir premio.',
      'Respeto en la sede y en los canales: cero tolerancia a acoso.',
    ],
  },
]

/** Canal de dudas durante el evento (antes vivía en el foro del sitio). */
export const GUIA_SOPORTE = {
  telegram: 'https://t.me/+US3WLlw1uuU0ZjUx',
  descripcion:
    'Dudas técnicas, mentorías y anuncios durante el hackathon se resuelven en el Telegram de CriptoUNAM y en la sección de Dudas del sitio.',
}

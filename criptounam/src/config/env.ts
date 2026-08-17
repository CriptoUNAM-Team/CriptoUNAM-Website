// Variables de entorno (Vite). No incluir secretos reales en el repo: usa .env local y Vercel.
//
// IMPORTANTE — por qué cada variable se lee por su nombre y no con `env[clave]`:
// aquí había un `envStr(clave)` que hacía `import.meta.env[clave]`. Al ser un
// acceso dinámico, Vite no puede saber qué variable se usa y mete el objeto
// `import.meta.env` ENTERO en el bundle. Resultado: cualquier variable definida
// en Vercel con prefijo `VITE_` acababa publicada, la usara el código o no
// —incluidas las de sistema de Vercel y la vieja `VITE_ADMIN_EMAILS`—.
// Escritas una a una, Vite solo incrusta las que de verdad se leen.

function str(v: unknown): string {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : ''
}

function num(v: unknown, porDefecto: number): number {
  const n = parseInt(str(v) || String(porDefecto), 10)
  return Number.isNaN(n) ? porDefecto : n
}

export const ENV_CONFIG = {
  // OJO: una API key de Resend en el navegador es pública. Mientras esto siga
  // aquí, `VITE_RESEND_API_KEY` debe quedarse VACÍA en Vercel; mandar correo es
  // trabajo de una función de `api/`, no del bundle.
  RESEND_API_KEY: str(import.meta.env.VITE_RESEND_API_KEY),
  RESEND_FROM_EMAIL: str(import.meta.env.VITE_RESEND_FROM_EMAIL) || 'noreply@criptounam.com',

  SUPABASE_URL: str(import.meta.env.VITE_SUPABASE_URL),
  SUPABASE_ANON_KEY:
    str(import.meta.env.VITE_SUPABASE_ANON_KEY) || str(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),

  APP_URL: str(import.meta.env.VITE_API_BASE_URL) || 'https://criptounam.xyz',
  APP_NAME: str(import.meta.env.VITE_APP_NAME) || 'CriptoUNAM',

  // Mismo caso que Resend: el token del bot manda mensajes en nombre del canal.
  // Dejar vacío en producción hasta que el envío viva en `api/`.
  TELEGRAM_BOT_TOKEN: str(import.meta.env.VITE_TELEGRAM_BOT_TOKEN),
  TELEGRAM_CHAT_ID: str(import.meta.env.VITE_TELEGRAM_CHAT_ID),

  WALLET_CONNECT_PROJECT_ID: str(import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID),

  // Privy: login por email/OTP con wallet embebida. El App ID es público (no secreto);
  // el App Secret vive solo en el backend serverless (PRIVY_APP_SECRET, sin prefijo VITE_).
  PRIVY_APP_ID: str(import.meta.env.VITE_PRIVY_APP_ID),

  EMAIL_TEMPLATE_WELCOME: 'welcome_template',
  EMAIL_TEMPLATE_NEWSLETTER: 'newsletter_template',
  EMAIL_TEMPLATE_NOTIFICATION: 'notification_template',

  // Fallbacks = set v2 desplegado en Avalanche Fuji (43113). Son contratos públicos
  // de testnet (no secretos), así que sirven de default cuando Vercel/entorno no
  // define las VITE_*. Para mainnet, sobreescribir con las env vars correspondientes.
  PUMA_TOKEN_ADDRESS:
    str(import.meta.env.VITE_PUMA_TOKEN_ADDRESS) || '0xF5F8b95cA7708f092a6D70751A4BE1545472Ee1F',
  BADGES_CONTRACT_ADDRESS:
    str(import.meta.env.VITE_BADGES_CONTRACT_ADDRESS) || '0x44F13D4ECd24515beFB64924A7483E2C0Fb768b2',
  DROPS_CONTRACT_ADDRESS:
    str(import.meta.env.VITE_DROPS_CONTRACT_ADDRESS) || '0x98BfbdBfE5626c391f56B324b01B00f310A70370',
  /** Endpoint serverless que firma mints del Badge desde la wallet MINTER. Vacío = no disponible. */
  BADGES_CLAIM_ENDPOINT: str(import.meta.env.VITE_BADGES_CLAIM_ENDPOINT),
  /** Base URL para metadata IPFS/HTTP de los badges (ej. ipfs://CID/ o https://criptounam.xyz/badges/). */
  BADGES_METADATA_BASE: str(import.meta.env.VITE_BADGES_METADATA_BASE),
  /** Endpoint serverless que ejecuta burnReward para confirmar pago de curso en PUMA. */
  COURSE_PAYMENT_ENDPOINT: str(import.meta.env.VITE_COURSE_PAYMENT_ENDPOINT),
  /** @deprecated La UI lista todas las misiones desde el contrato; puedes dejar vacío. */
  PUMA_WELCOME_MISSION_ID: str(import.meta.env.VITE_PUMA_WELCOME_MISSION_ID),
  PUMA_TOKEN_DECIMALS: num(import.meta.env.VITE_PUMA_TOKEN_DECIMALS, 18),
  PUMA_REWARD_RATE: num(import.meta.env.VITE_PUMA_REWARD_RATE, 100),

  LIKE_COOLDOWN: num(import.meta.env.VITE_LIKE_COOLDOWN, 5000),
  MAX_LIKES_PER_USER: num(import.meta.env.VITE_MAX_LIKES_PER_USER, 100),
  LIKE_REWARD_AMOUNT: num(import.meta.env.VITE_LIKE_REWARD_AMOUNT, 10),

  // Default = Avalanche Fuji (43113), donde vive el set de contratos v2 actual.
  // Para producción en mainnet, definir VITE_CHAIN_ID=43114 y sus RPC/explorer.
  CHAIN_ID: num(import.meta.env.VITE_CHAIN_ID, 43113),
  RPC_URL: str(import.meta.env.VITE_RPC_URL) || 'https://api.avax-test.network/ext/bc/C/rpc',
  INFURA_ID: str(import.meta.env.VITE_INFURA_ID),
  EXPLORER_URL: str(import.meta.env.VITE_EXPLORER_URL) || 'https://testnet.snowtrace.io',
  // Aquí estuvo `ADMIN_PRIVATE_KEY: VITE_ADMIN_PRIVATE_KEY`. Nadie la usaba, y
  // una llave privada con prefijo VITE_ se publica en el bundle: quien la
  // definiera regalaba la wallet. Las llaves que firman viven en las funciones
  // de `api/` (MINTER_PRIVATE_KEY, sin prefijo).
}

export default ENV_CONFIG

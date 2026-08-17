/**
 * Autenticación con Privy para las Vercel Functions.
 *
 * Todo el sitio inicia sesión con Privy (ver `src/context/WalletContext.tsx`),
 * así que el navegador siempre puede mandar `Authorization: Bearer <token>` con
 * `getAccessToken()`. Los endpoints que escriben o que gastan gas verifican ese
 * token aquí antes de tocar nada.
 *
 * Env (sin prefijo VITE_):
 *   PRIVY_APP_ID, PRIVY_APP_SECRET, HACKATHON_ADMIN_EMAILS
 */
import { PrivyClient } from '@privy-io/server-auth'
import { HttpError } from './http'

export type AuthedUser = {
  privyId: string
  email: string | null
  /** Wallet principal según Privy. */
  wallet: string | null
  /** Todas las wallets enlazadas a la cuenta, en minúsculas. */
  wallets: string[]
}

let _privy: PrivyClient | null = null

function getPrivy(): PrivyClient {
  if (_privy) return _privy
  const appId = process.env.PRIVY_APP_ID
  const appSecret = process.env.PRIVY_APP_SECRET
  if (!appId || !appSecret) {
    throw new HttpError(500, 'Backend mal configurado (faltan envs de Privy)')
  }
  _privy = new PrivyClient(appId, appSecret)
  return _privy
}

function bearer(req: any): string {
  const header = req.headers?.authorization || req.headers?.Authorization || ''
  const token = String(header).replace(/^Bearer\s+/i, '').trim()
  if (!token) throw new HttpError(401, 'Falta el token de autenticación')
  return token
}

/**
 * Verifica el token y devuelve el privyId. Si `withProfile` es true, además
 * consulta el perfil (email + wallets) — úsalo solo cuando lo necesites
 * (registro, gating de admin, verificar propiedad de una wallet) para evitar
 * rate limits de la API de Privy.
 */
export async function authenticate(
  req: any,
  opts: { withProfile?: boolean } = {}
): Promise<AuthedUser> {
  const token = bearer(req)
  const privy = getPrivy()

  let privyId: string
  try {
    const claims = await privy.verifyAuthToken(token)
    privyId = claims.userId
  } catch {
    throw new HttpError(401, 'Token inválido o expirado')
  }

  let email: string | null = null
  let wallet: string | null = null
  let wallets: string[] = []

  if (opts.withProfile) {
    try {
      const user: any = await privy.getUser(privyId)
      email = user.email?.address ?? null
      wallet = user.wallet?.address ?? null
      const linked = Array.isArray(user.linkedAccounts) ? user.linkedAccounts : []
      wallets = [
        ...(wallet ? [wallet] : []),
        ...linked
          .filter((a: any) => a?.type === 'wallet' && typeof a.address === 'string')
          .map((a: any) => a.address),
      ].map((a: string) => a.toLowerCase())
      wallets = [...new Set(wallets)]
    } catch {
      /* si falla el fetch de perfil, seguimos solo con el privyId */
    }
  }

  return { privyId, email, wallet, wallets }
}

/**
 * Exige que la wallet que manda el cliente sea de verdad suya.
 *
 * Sin esto, cualquiera podría pedir el certificado (y la recompensa en PUMA)
 * de la wallet de otra persona con solo escribir su dirección en el body.
 */
export function assertWalletOwned(user: AuthedUser, wallet: string): void {
  const target = wallet.toLowerCase()
  if (!user.wallets.includes(target)) {
    throw new HttpError(403, 'Esa wallet no está enlazada a tu cuenta')
  }
}

export function adminEmails(): string[] {
  return (process.env.HACKATHON_ADMIN_EMAILS || process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null): boolean {
  if (!email) return false
  return adminEmails().includes(email.trim().toLowerCase())
}

/**
 * Wallets de administración (`ADMIN_WALLETS`, coma-separado).
 *
 * El panel de PUMA existe para repartir recompensas y drops, y ahí la identidad
 * del admin es la wallet: los permisos que cuentan son los roles on-chain
 * (AccessControl), no un correo. Si la API solo mirara `ADMIN_EMAILS`, quien
 * entra con wallet vería el panel y recibiría 403 al pedir los datos.
 */
export function adminWallets(): string[] {
  return (process.env.ADMIN_WALLETS || '')
    .split(',')
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean)
}

/** True si alguna de las wallets enlazadas a la cuenta está en la allowlist. */
export function isAdminWallet(user: AuthedUser): boolean {
  const permitidas = adminWallets()
  if (permitidas.length === 0) return false
  return user.wallets.some((w) => permitidas.includes(w))
}

/** Organizador por correo o wallet: las dos vías valen. */
export function isAdmin(user: AuthedUser): boolean {
  return isAdminEmail(user.email) || isAdminWallet(user)
}

/** Verifica token + perfil y exige estar en alguna de las dos allowlists. */
export async function requireAdmin(req: any): Promise<AuthedUser> {
  const user = await authenticate(req, { withProfile: true })
  if (!isAdmin(user)) {
    throw new HttpError(403, 'Acceso restringido a organizadores')
  }
  return user
}

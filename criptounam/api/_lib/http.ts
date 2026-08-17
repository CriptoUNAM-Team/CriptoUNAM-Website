/**
 * Utilidades HTTP compartidas por todas las Vercel Functions.
 *
 * Los archivos y carpetas con prefijo "_" NO se publican como endpoints.
 */

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Orígenes autorizados a llamar la API desde el navegador.
 *
 * Antes se respondía `Access-Control-Allow-Origin: *`, así que cualquier página
 * podía llamar a la API con un token robado del usuario. La autenticación es
 * por Bearer (no cookies), así que esto no es la defensa principal, pero cierra
 * el abuso desde sitios de terceros.
 *
 * `ALLOWED_ORIGINS` (coma-separado) permite añadir dominios sin tocar código.
 */
const DEFAULT_ORIGINS = [
  'https://criptounam.xyz',
  'https://www.criptounam.xyz',
  'http://localhost:5173',
  'http://localhost:3000',
]

function allowedOrigins(): string[] {
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  return [...DEFAULT_ORIGINS, ...extra]
}

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins().includes(origin)) return true
  // Previews en Vercel: https://<algo>.vercel.app. Solo fuera de producción —
  // cualquiera puede desplegar en vercel.app, así que en el dominio real esto
  // sería abrir la API a un origen que no controlamos.
  if (process.env.VERCEL_ENV === 'production') return false
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
}

export function setCors(res: any, req?: any) {
  const origin = String(req?.headers?.origin || '')
  // Sin Origin (llamada servidor a servidor o same-origin) no hace falta CORS.
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}

export function sendError(res: any, err: unknown) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message })
  }
  console.error('API error:', err)
  return res.status(500).json({ error: 'Error interno del servidor' })
}

export function readBody(req: any): any {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

/**
 * IP del cliente según el edge de Vercel. `x-forwarded-for` puede venir con
 * varias IPs encadenadas: la primera es la del cliente real.
 */
export function clientIp(req: any): string {
  const header =
    req.headers?.['x-real-ip'] ||
    req.headers?.['x-forwarded-for'] ||
    req.socket?.remoteAddress ||
    ''
  return String(header).split(',')[0].trim() || 'desconocida'
}

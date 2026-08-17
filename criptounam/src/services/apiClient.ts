/**
 * Cliente HTTP para las Vercel Functions del sitio (`/api/*`).
 *
 * Desde que Supabase dejó de aceptar escrituras con la anon key, todo lo que
 * escribe (progreso de cursos, likes, listados de admin) pasa por aquí con el
 * access token de Privy. `src/services/hackathon.service.ts` mantiene su propio
 * helper porque tiene mensajes de error propios del hackathon.
 */
import { getAccessToken } from '@privy-io/react-auth'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(
  path: string,
  opts: { method?: string; body?: unknown; query?: Record<string, string>; auth?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, query, auth = true } = opts
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = await getAccessToken()
    if (!token) throw new ApiError(401, 'Debes iniciar sesión')
    headers.Authorization = `Bearer ${token}`
  }

  const qs = query ? `?${new URLSearchParams(query).toString()}` : ''
  const res = await fetch(`/api${path}${qs}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    // Un 404 aquí no es "no encontrado": significa que las funciones de `api/`
    // no están desplegadas (Root Directory del proyecto de Vercel apuntando
    // fuera de `criptounam/`). Ver docs/PLATAFORMA_HACKATHON_DESPLIEGUE.md.
    if (res.status === 404) {
      throw new ApiError(404, 'Esta función del sitio no está disponible ahora mismo. Inténtalo más tarde.')
    }
    let msg = `Error ${res.status}`
    try {
      const json = await res.json()
      msg = json.error || msg
    } catch {
      /* respuesta sin JSON */
    }
    throw new ApiError(res.status, msg)
  }

  return (await res.json()) as T
}

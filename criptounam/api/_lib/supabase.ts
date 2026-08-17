/**
 * Cliente de Supabase con service role para las Vercel Functions.
 *
 * El service role bypassa RLS: es la única vía de escritura del sitio desde que
 * las policies dejaron de aceptar escrituras con la anon key. Nunca debe
 * exponerse al navegador (env sin prefijo VITE_).
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { HttpError } from './http.js'

let _supabase: SupabaseClient | null = null

export function getSupabaseAdmin(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    // Decir CUÁL falta: con el mensaje genérico había que adivinar entre la URL
    // y la service role key, y son dos problemas distintos de configuración.
    const faltan = [!url && 'SUPABASE_URL', !key && 'SUPABASE_SERVICE_ROLE_KEY']
      .filter(Boolean)
      .join(' y ')
    throw new HttpError(500, `Backend mal configurado: falta ${faltan}`)
  }
  _supabase = createClient(url, key, { auth: { persistSession: false } })
  return _supabase
}

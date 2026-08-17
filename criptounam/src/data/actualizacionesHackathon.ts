/**
 * Anuncios del Hackathon UNAM 2026.
 *
 * Se muestran en la landing en orden cronológico inverso (la más reciente
 * arriba); el orden del array no importa, la sección ordena por fecha.
 *
 * Nota: al ser contenido estático, publicar una actualización requiere deploy.
 * Si durante el evento eso resulta lento, la tabla `hackathon_notifications` ya
 * existe en Supabase para mover esta sección sin rehacer los componentes.
 */

export type ActualizacionTipo = 'anuncio' | 'importante' | 'recordatorio'

export interface Actualizacion {
  id: string
  /** ISO 8601 con zona horaria. */
  fecha: string
  tipo: ActualizacionTipo
  titulo: string
  contenido: string
  /** Enlace opcional a más detalle. */
  url?: string
  urlLabel?: string
}

export const ACTUALIZACION_TIPO_LABEL: Record<ActualizacionTipo, string> = {
  anuncio: 'Anuncio',
  importante: 'Importante',
  recordatorio: 'Recordatorio',
}

export const ACTUALIZACIONES: Actualizacion[] = [
  {
    id: 'registro-abierto',
    fecha: '2026-08-09T12:00:00-06:00',
    tipo: 'importante',
    titulo: 'Registro abierto',
    contenido:
      'Ya puedes registrarte a Goya Hack. Crea tu cuenta, completa tu perfil y forma tu equipo desde el panel.',
    url: '/hackathon/dashboard',
    urlLabel: 'Ir al registro',
  },
  {
    id: 'convocatoria',
    fecha: '2026-08-01T10:00:00-06:00',
    tipo: 'anuncio',
    titulo: 'Convocatoria publicada',
    contenido:
      'Tres tracks: AI & Autonomous Agents, Web3 & DeFi, e Impacto Social. Revisa la Guía del Hacker para conocer los criterios de evaluación.',
    url: '/hackathon/guia',
    urlLabel: 'Ver la guía',
  },
]

/** Más recientes primero. */
export const actualizacionesOrdenadas = (): Actualizacion[] =>
  [...ACTUALIZACIONES].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

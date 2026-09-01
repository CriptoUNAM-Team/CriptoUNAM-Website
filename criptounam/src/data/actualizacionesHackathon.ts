/**
 * Vídeos de actualización del Hackathon UNAM 2026.
 *
 * Cuatro slots reservados en la landing. Añade `videoUrl` y opcionalmente
 * `posterUrl` cuando el vídeo esté listo; sin URL se muestra placeholder.
 */

export interface VideoActualizacion {
  id: string
  titulo: string
  /** Ruta bajo /public o URL externa. */
  videoUrl?: string
  posterUrl?: string
  fecha?: string
  duracion?: string
}

/** Cuatro espacios para vídeos del evento. */
export const VIDEOS_ACTUALIZACION: VideoActualizacion[] = [
  {
    id: 'video-1',
    titulo: 'Kickoff y bienvenida',
    fecha: '2026-09-22',
  },
  {
    id: 'video-2',
    titulo: 'Día de construcción',
    fecha: '2026-09-23',
  },
  {
    id: 'video-3',
    titulo: 'Mentorías y avances',
    fecha: '2026-09-24',
  },
  {
    id: 'video-4',
    titulo: 'Demo Day y premiación',
    fecha: '2026-09-26',
  },
]

/** Anuncios de texto legacy — ya no se renderizan; la sección es solo vídeo. */
export type ActualizacionTipo = 'anuncio' | 'importante' | 'recordatorio'

export interface Actualizacion {
  id: string
  fecha: string
  tipo: ActualizacionTipo
  titulo: string
  contenido: string
  url?: string
  urlLabel?: string
}

export const ACTUALIZACION_TIPO_LABEL: Record<ActualizacionTipo, string> = {
  anuncio: 'Anuncio',
  importante: 'Importante',
  recordatorio: 'Recordatorio',
}

export const ACTUALIZACIONES: Actualizacion[] = []

export const actualizacionesOrdenadas = (): Actualizacion[] =>
  [...ACTUALIZACIONES].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

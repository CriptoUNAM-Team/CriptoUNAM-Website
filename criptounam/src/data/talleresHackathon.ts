/**
 * Talleres virtuales rumbo al Hackathon UNAM 2026.
 *
 * Se muestran con el embed de Luma (mismo patrón que los eventos del sitio):
 * el registro y el recordatorio los maneja Luma, aquí solo se listan.
 *
 * Para agregar un taller: crea el evento en Luma, copia el ID de la URL del
 * embed (empieza con `evt-`) y añade una entrada a `TALLERES_HACKATHON`.
 * Marca `estado: 'proximo'` mientras no haya pasado y `'grabado'` después,
 * para que aparezca en la sección correcta.
 */

export interface TallerHackathon {
  id: string
  title: string
  /** ID del evento en Luma (`evt-...`). Sin esto no se puede embeber. */
  lumaEventId: string
  /** Fecha legible; el dato exacto lo muestra el propio embed de Luma. */
  date: string
  ponente?: string
  description?: string
  /** Tema para agrupar/etiquetar visualmente. */
  tag?: 'IA' | 'Web3' | 'Producto' | 'General'
  estado: 'proximo' | 'grabado'
}

export const TALLERES_HACKATHON: TallerHackathon[] = []

export const talleresProximos = () => TALLERES_HACKATHON.filter((t) => t.estado === 'proximo')
export const talleresGrabados = () => TALLERES_HACKATHON.filter((t) => t.estado === 'grabado')

/**
 * Calendario de Luma de CriptoUNAM (ej. https://lu.ma/tu-calendario).
 * Vacío = no se muestra el botón "Ver calendario completo".
 */
export const LUMA_CALENDAR_URL = ''

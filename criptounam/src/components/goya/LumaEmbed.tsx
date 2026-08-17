import React from 'react'

type Props = {
  /** Id del evento en Luma, con el prefijo `evt-`. */
  eventId: string
  /** Título accesible del marco. */
  titulo?: string
  className?: string
  /** Alto del marco en píxeles. Luma no lo ajusta al contenido. */
  alto?: number
}

/**
 * Tarjeta de inscripción de Luma embebida.
 *
 * Deja registrarse sin salir de la página ni abrir la capa del checkout, que
 * es lo que hace `LumaCheckout`. Se usan las dos: el botón donde solo cabe una
 * llamada a la acción, y esta tarjeta donde el bloque es la inscripción.
 *
 * El original de Luma viene con `width="600"` fijo; aquí va al 100 % con tope,
 * porque a 600 px se sale de la caja en móvil. `loading="lazy"` evita traer el
 * marco cuando está por debajo del pliegue.
 */
const LumaEmbed: React.FC<Props> = ({
  eventId,
  titulo = 'Inscripción al evento',
  className = '',
  alto = 450,
}) => (
  <iframe
    src={`https://luma.com/embed/event/${eventId}/simple`}
    title={titulo}
    height={alto}
    loading="lazy"
    frameBorder="0"
    allow="fullscreen; payment"
    className={`w-full max-w-[600px] ${className}`}
    style={{ border: '1px solid rgba(233, 175, 60, 0.28)' }}
  />
)

export default LumaEmbed

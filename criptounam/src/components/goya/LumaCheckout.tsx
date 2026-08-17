import React, { useEffect } from 'react'

const SCRIPT_SRC = 'https://embed.lu.ma/checkout-button.js'
const SCRIPT_ID = 'luma-checkout'

type Props = {
  /** Id del evento en Luma, con el prefijo `evt-`. */
  eventId: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Botón de inscripción de Luma.
 *
 * Abre el checkout de Luma en una capa sobre la página, sin sacar al visitante
 * del sitio. El `<a>` lleva las clases y los `data-` que espera su script; el
 * enlace apunta al evento, así que si el script no carga —bloqueador, red
 * caída— el botón sigue llevando a Luma en vez de no hacer nada.
 *
 * El script se inyecta desde el efecto, no en el HTML: así se garantiza que el
 * elemento ya existe en el DOM cuando el script arranca, y solo se descarga en
 * las páginas donde de verdad hay un botón. `SCRIPT_ID` evita duplicarlo
 * cuando hay varios botones en la misma página.
 */
const LumaCheckout: React.FC<Props> = ({ eventId, children, className = '', style }) => {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return
    const s = document.createElement('script')
    s.id = SCRIPT_ID
    s.src = SCRIPT_SRC
    s.async = true
    document.body.appendChild(s)
    // No se elimina al desmontar: el script es global y volver a inyectarlo en
    // cada navegación provocaría descargas repetidas.
  }, [])

  return (
    <a
      href={`https://luma.com/event/${eventId}`}
      target="_blank"
      rel="noreferrer"
      className={`luma-checkout--button ${className}`}
      data-luma-action="checkout"
      data-luma-event-id={eventId}
      style={style}
    >
      {children}
    </a>
  )
}

export default LumaCheckout

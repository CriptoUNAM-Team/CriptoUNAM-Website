import React, { useEffect, useId, useRef, useState } from 'react'
import { CalendarPlus, Check, Download } from 'lucide-react'
import {
  descargarICS,
  nombreArchivo,
  urlGoogleCalendar,
  urlOutlookCalendar,
  type EventoCalendario,
} from '../../../lib/calendario'
import { goyaMenuIn } from '../../../lib/goyaAnime'

type Variante = 'icono' | 'boton' | 'sutil'

type Props = {
  /** Uno o varios eventos. Con más de uno solo se ofrece el `.ics`. */
  eventos: EventoCalendario[]
  /** Texto del botón. En la variante `icono` solo se usa como etiqueta accesible. */
  etiqueta?: string
  variante?: Variante
  /** Lado por el que se despliega el menú, para que no se salga del panel. */
  alineacion?: 'izquierda' | 'derecha'
  className?: string
}

const OPCION =
  'flex w-full items-center gap-2.5 bg-transparent px-3.5 py-2.5 text-left font-mono text-[10px] uppercase tracking-label text-slate-300 no-underline transition-colors duration-200 hover:bg-goya-amber/15 hover:text-goya-amber focus-visible:bg-goya-amber/15 focus-visible:text-goya-amber'

/** Marca de Google Calendar. Lucide no trae logos de marca. */
const IconoGoogle = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="currentColor">
    <path d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3Zm0 16.5h-15v-12h15v12ZM8.6 16.2v-1.5h1.6c.6 0 1-.3 1-.8s-.4-.8-1.1-.8H9v-1.4h1c.6 0 1-.3 1-.7s-.3-.7-.9-.7c-.5 0-.9.2-1.2.6l-1.1-1c.5-.7 1.3-1 2.3-1 1.4 0 2.4.7 2.4 1.9 0 .7-.4 1.2-1 1.5.8.2 1.3.8 1.3 1.6 0 1.3-1.1 2.1-2.6 2.1-.8 0-1.5-.2-2.1-.6Zm6.6.1V11l-1.2.8-.6-1.2 2-1.4h1.3v7.1h-1.5Z" />
  </svg>
)

/** Marca de Outlook, reducida al sobre azul con la "O". */
const IconoOutlook = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="currentColor">
    <path d="M13 5.2 22 7v10l-9 1.8V5.2ZM14.4 9v6h1.4c1.6 0 2.7-1.2 2.7-3s-1.1-3-2.7-3h-1.4Zm-8.7-.6C3.6 8.4 2 10 2 12.3s1.6 3.9 3.7 3.9 3.7-1.6 3.7-3.9-1.6-3.9-3.7-3.9Zm0 1.6c1.1 0 1.9.9 1.9 2.3S6.8 14.6 5.7 14.6s-1.9-1-1.9-2.3.8-2.3 1.9-2.3Z" />
  </svg>
)

/**
 * Botón "añadir al calendario" con menú de Google, Outlook y `.ics`.
 *
 * El menú se monta dentro de un contenedor `relative`, así que quien lo use
 * debe dejarle sitio: en la línea de tiempo va en la propia fila, fuera del
 * botón que selecciona el bloque (un `<button>` no puede anidar otro).
 */
const AgregarCalendario: React.FC<Props> = ({
  eventos,
  etiqueta = 'Añadir al calendario',
  variante = 'icono',
  alineacion = 'derecha',
  className = '',
}) => {
  const [abierto, setAbierto] = useState(false)
  const [descargado, setDescargado] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const uno = eventos.length === 1 ? eventos[0] : null

  useEffect(() => {
    if (!abierto) return

    const fuera = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false)
    }

    document.addEventListener('mousedown', fuera)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('mousedown', fuera)
      document.removeEventListener('keydown', tecla)
    }
  }, [abierto])

  useEffect(() => {
    if (abierto) goyaMenuIn(menu.current)
  }, [abierto])

  // El "hecho" del .ics vuelve a su estado normal solo.
  useEffect(() => {
    if (!descargado) return
    const id = window.setTimeout(() => setDescargado(false), 2400)
    return () => window.clearTimeout(id)
  }, [descargado])

  if (eventos.length === 0) return null

  const bajarICS = () => {
    // `nombreArchivo` ya normaliza el título; el prefijo lo pone esta línea.
    descargarICS(
      eventos,
      `goya-hack-${nombreArchivo(uno ? uno.titulo : 'programa')}`,
      uno ? uno.titulo : 'Goya Hack · Programa'
    )
    setDescargado(true)
    setAbierto(false)
  }

  /*
   * El `p-0` es obligatorio, no cosmético: global.css le da a todo `<button>`
   * un `padding: 0.9rem 1.8rem` que también llega aquí dentro. En las variantes
   * con `px-*`/`py-*` la utilidad lo pisa, pero el botón de icono no llevaba
   * ninguna y esos 28.8 px por lado aplastaban el SVG a 0 px de ancho: se veía
   * un recuadro vacío.
   */
  const disparador =
    variante === 'icono'
      ? `goya-cut inline-flex h-8 w-8 shrink-0 items-center justify-center border p-0 transition-colors duration-300 ${
          abierto
            ? 'border-goya-amber bg-goya-amber/15 text-goya-amber'
            : 'border-goya-amber/25 bg-transparent text-slate-500 hover:border-goya-amber hover:text-goya-amber'
        }`
      : variante === 'boton'
        ? `goya-cut inline-flex items-center gap-2 border px-3.5 py-2 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
            abierto
              ? 'border-goya-amber bg-goya-amber/15 text-goya-amber'
              : 'border-goya-amber/35 bg-transparent text-goya-paper hover:border-goya-amber hover:text-goya-amber'
          }`
        : 'inline-flex items-center gap-1.5 bg-transparent p-0 font-mono text-[10px] uppercase tracking-label text-slate-500 transition-colors duration-300 hover:text-goya-amber'

  return (
    <div ref={contenedor} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        aria-controls={abierto ? menuId : undefined}
        aria-label={variante === 'icono' ? etiqueta : undefined}
        title={variante === 'icono' ? etiqueta : undefined}
        className={disparador}
        style={variante !== 'sutil' ? { ['--cut' as string]: '5px' } : undefined}
      >
        {descargado && variante === 'icono' ? (
          <Check size={13} className="shrink-0" />
        ) : (
          <CalendarPlus size={variante === 'icono' ? 13 : 12} className="shrink-0" />
        )}
        {variante !== 'icono' && <span>{descargado ? 'Descargado' : etiqueta}</span>}
      </button>

      {abierto && (
        <div
          ref={menu}
          id={menuId}
          role="menu"
          className={`goya-panel absolute top-[calc(100%+6px)] z-30 w-[208px] overflow-hidden py-1 ${
            alineacion === 'derecha' ? 'right-0' : 'left-0'
          }`}
          style={{ ['--cut' as string]: '8px' }}
        >
          {uno ? (
            <>
              <a
                role="menuitem"
                href={urlGoogleCalendar(uno)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setAbierto(false)}
                className={OPCION}
              >
                <IconoGoogle />
                Google Calendar
              </a>
              <a
                role="menuitem"
                href={urlOutlookCalendar(uno)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setAbierto(false)}
                className={OPCION}
              >
                <IconoOutlook />
                Outlook
              </a>
            </>
          ) : (
            <p className="m-0 px-3.5 py-2 font-mono text-[9px] uppercase leading-relaxed tracking-label text-slate-500">
              {eventos.length} bloques en un archivo
            </p>
          )}
          <button role="menuitem" type="button" onClick={bajarICS} className={OPCION}>
            <Download size={13} />
            Apple · .ics
          </button>
        </div>
      )}
    </div>
  )
}

export default AgregarCalendario

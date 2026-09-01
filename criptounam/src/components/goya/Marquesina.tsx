import React, { useCallback, useState } from 'react'

export interface LogoMarquesina {
  id: string
  nombre: string
  /** Ruta bajo /public. Sin ella, la tarjeta muestra el nombre en versalitas. */
  logo?: string
  url?: string
  /**
   * El archivo trae fondo claro opaco en vez de transparencia. Ver la nota de
   * `Sponsor.fondoOpaco` en data/hackathonInfo.ts.
   */
  fondoOpaco?: boolean
}

type Props = {
  logos: LogoMarquesina[]
  /** Alto de la caja de cada logo. `grande` es para patrocinadores. */
  tamano?: 'normal' | 'grande'
  /** Segundos que tarda la cinta en dar una vuelta. */
  duracion?: number
  className?: string
}

/**
 * Mínimo de logos para que la cinta se mueva.
 *
 * Con uno o dos, la marquesina no aporta nada y encima delata lo vacía que
 * está: el logo entra, se va y vuelve, y a media animación no hay nada en
 * pantalla. Por debajo de este número se pinta una fila fija, y el bloque pasa
 * a cinta solo cuando hay material para llenarla.
 */
const MINIMO_PARA_CINTA = 3

const MEDIDAS = {
  normal: { caja: 'w-[150px] min-h-[92px]', logo: 'max-h-11', texto: 'text-sm' },
  grande: { caja: 'w-[240px] min-h-[140px]', logo: 'max-h-20', texto: 'text-xl' },
}

/**
 * Cinta de logos en bucle.
 *
 * La lista se pinta dos veces seguidas y la animación desplaza media pista, que
 * es lo que hace que el bucle no dé un salto visible. El duplicado sale del
 * árbol de accesibilidad con `aria-hidden` para que un lector de pantalla no
 * lea cada aliado dos veces.
 *
 * Los logos sin archivo salen como su nombre en la display achaflanada: una
 * comunidad confirmada tiene que poder aparecer aunque su logo aún no esté en
 * el repo, y un hueco roto se vería peor que el nombre.
 */
const Marquesina: React.FC<Props> = ({
  logos,
  tamano = 'normal',
  duracion = 40,
  className = '',
}) => {
  /**
   * Logos cuyo archivo no está en el repo todavía.
   *
   * Las comunidades se confirman antes de que llegue su logo, así que la lista
   * apunta a archivos que pueden faltar. En vez de dejar el hueco roto, el
   * primer fallo de carga apunta el `id` aquí y la tarjeta pasa a mostrar el
   * nombre, que es lo que hay que comunicar de todos modos.
   */
  const [sinArchivo, setSinArchivo] = useState<Record<string, boolean>>({})
  const marcarFallo = useCallback(
    (id: string) => setSinArchivo((prev) => (prev[id] ? prev : { ...prev, [id]: true })),
    []
  )

  if (logos.length === 0) return null

  const m = MEDIDAS[tamano]

  const tarjeta = (l: LogoMarquesina, duplicado: boolean) => {
    const contenido = l.logo && !sinArchivo[l.id] ? (
      <img
        src={l.logo}
        alt={duplicado ? '' : l.nombre}
        loading="lazy"
        onError={() => marcarFallo(l.id)}
        className={
          // Con fondo transparente basta la silueta: todo a negro y luego
          // invertido, que deja el logo en blanco. Con fondo opaco esa receta
          // pintaría un rectángulo blanco sólido, así que se invierte sin más.
          l.fondoOpaco
            ? `${m.logo} max-w-full object-contain opacity-70 transition-opacity duration-300 [filter:invert(1)_grayscale(1)] group-hover:opacity-100`
            : `${m.logo} max-w-full object-contain opacity-65 transition-opacity duration-300 [filter:brightness(0)_invert(1)] group-hover:opacity-100`
        }
      />
    ) : (
      <span
        className={`${m.texto} px-2 text-center font-display uppercase leading-tight tracking-wide text-goya-paper/70 transition-colors duration-300 group-hover:text-goya-amber`}
      >
        {l.nombre}
      </span>
    )

    const clase = `goya-panel goya-panel-hover group mx-2 shrink-0 ${m.caja} transition-colors duration-300`
    const interior = (
      <span className={`flex ${m.caja.split(' ')[1]} items-center justify-center p-5`}>
        {contenido}
      </span>
    )

    return l.url ? (
      <a
        key={`${l.id}${duplicado ? '-dup' : ''}`}
        href={l.url}
        target="_blank"
        rel="noreferrer"
        className={clase}
        title={l.nombre}
        tabIndex={duplicado ? -1 : undefined}
      >
        {interior}
      </a>
    ) : (
      <div key={`${l.id}${duplicado ? '-dup' : ''}`} className={clase} title={l.nombre}>
        {interior}
      </div>
    )
  }

  if (logos.length < MINIMO_PARA_CINTA) {
    return (
      <div className={`flex flex-wrap items-center ${className}`}>
        {logos.map((l) => tarjeta(l, false))}
      </div>
    )
  }

  return (
    <div className={`goya-marquesina relative w-full overflow-hidden ${className}`}>
      <div
        className="goya-marquesina-pista py-1"
        style={{ ['--marquesina-dur' as string]: `${duracion}s` }}
      >
        <div className="flex shrink-0">{logos.map((l) => tarjeta(l, false))}</div>
        {/* Segundo juego: solo existe para que el bucle empalme. */}
        <div className="flex shrink-0" aria-hidden="true">
          {logos.map((l) => tarjeta(l, true))}
        </div>
      </div>
    </div>
  )
}

export default Marquesina

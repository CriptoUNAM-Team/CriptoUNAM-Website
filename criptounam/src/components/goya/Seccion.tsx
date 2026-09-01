import React from 'react'
import Reveal from '../Reveal'
import { Rotulo } from './adornos'

type Props = {
  id?: string
  /** Etiqueta corta que encabeza el bloque. */
  rotulo: string
  /** Titular grande, en la display achaflanada. */
  titulo: React.ReactNode
  /** Párrafo de entrada, alineado a la derecha en pantallas anchas. */
  intro?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Envoltorio común de las secciones de la landing.
 *
 * Todas repiten la misma cabecera del cartel — etiqueta en mono a la izquierda,
 * titular en versalitas bajo la regla ámbar, y el párrafo de entrada descolgado
 * a la derecha — así que vive en un solo sitio en vez de copiarse ocho veces.
 */
const Seccion: React.FC<Props> = ({
  id,
  rotulo,
  titulo,
  intro,
  children,
  className = '',
}) => (
  <section
    id={id}
    className={`goya-anchor mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8 md:px-12 md:py-28 ${className}`}
  >
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
      <div className="min-w-0">
        <Reveal as="div" delay={100}>
          <Rotulo>{rotulo}</Rotulo>
        </Reveal>

        <Reveal as="h2" delay={180} className="goya-rule mt-4 w-fit max-w-full">
          <span className="block font-display text-3xl uppercase leading-[1.05] tracking-wide text-goya-paper sm:text-4xl md:text-5xl">
            {titulo}
          </span>
        </Reveal>
      </div>

      {intro && (
        <Reveal
          as="p"
          delay={260}
          className="max-w-md text-sm leading-relaxed text-slate-400 lg:text-right lg:text-base"
        >
          {intro}
        </Reveal>
      )}
    </div>

    <div className="mt-12 md:mt-16">{children}</div>
  </section>
)

export default Seccion

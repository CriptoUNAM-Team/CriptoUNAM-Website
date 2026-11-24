import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

type Bloque = {
  titulo: string
  bajada: string
  enlace: { to: string; texto: string; anclas?: string[] }
  fotos: { src: string; alt: string }[]
}

const B = '/images/bitacora'
const C = '/images/campus'

const BLOQUES: Bloque[] = [
  {
    titulo: 'Cursos y talleres',
    bajada: 'De tu primera wallet a desplegar contratos. Gratis, en salón o en línea.',
    enlace: { to: '/cursos', texto: 'Ver cursos' },
    fotos: [
      { src: `${B}/abril-1.jpg`, alt: 'Clase de introducción a blockchain en un salón' },
      { src: `${B}/octubre-2.jpg`, alt: 'Taller frente a la pantalla' },
      { src: `${B}/febrero-1.jpg`, alt: 'Conferencia con el estandarte de CriptoUNAM' },
      { src: `${B}/marzo-2.jpg`, alt: 'Público en un auditorio' },
      { src: `${B}/abril-2.jpg`, alt: 'Ponente explicando en el salón' },
    ],
  },
  {
    titulo: 'Hackathones',
    bajada: 'Equipos que construyen en un fin de semana lo que otros planean en un año.',
    enlace: { to: '/hackathon', texto: 'Ver Goya Hack' },
    fotos: [
      { src: `${B}/enero-1.jpg`, alt: 'Escenario del hackathon' },
      { src: `${B}/julio-1.jpg`, alt: 'Equipos programando' },
      { src: `${B}/octubre-1.jpg`, alt: 'Sesión de trabajo en un café' },
      { src: `${B}/mayo-1.jpg`, alt: 'Ganadores con sus reconocimientos' },
      { src: `${B}/julio-2.jpg`, alt: 'Sticker de CriptoUNAM en una conferencia' },
    ],
  },
  {
    titulo: 'Comunidad',
    bajada: 'Meetups, viajes y fiestas: más de 500 personas que se encuentran fuera de la pantalla.',
    enlace: { to: '/eventos', texto: 'Ver eventos' },
    fotos: [
      { src: `${B}/marzo-1.jpg`, alt: 'Foto grupal con la bandera de CriptoUNAM' },
      { src: `${B}/diciembre-1.jpg`, alt: 'Posada de la comunidad' },
      { src: `${B}/mayo-2.jpg`, alt: 'La comunidad en Uniswap House' },
      { src: `${B}/junio-1.jpg`, alt: 'Celebración con globos' },
      { src: `${B}/septiembre-2.jpg`, alt: 'Stand en una feria' },
    ],
  },
  {
    titulo: 'Campus virtual',
    bajada: 'Un campus en pixel art para vernos todos los días, con Pumabús a Ciudad Universitaria.',
    enlace: { to: '#campus', texto: 'Conoce el campus', anclas: ['campus', 'campus-movil'] },
    fotos: [
      { src: `${C}/01-plaza.jpg`, alt: 'Plaza central del campus virtual' },
      { src: `${C}/02-auditorio.jpg`, alt: 'Auditorio del campus virtual' },
      { src: `${C}/04-laboratorio.jpg`, alt: 'Laboratorio Web3 del campus virtual' },
      { src: `${C}/10-cu.jpg`, alt: 'Ciudad Universitaria en pixel art' },
      { src: `${C}/11-biblioteca.jpg`, alt: 'Biblioteca Central en pixel art' },
    ],
  },
]

/**
 * Lo que hacemos, en imágenes: cada bloque se queda fijo arriba y el siguiente
 * sube encima, como una pila de tarjetas. Título grande, una línea y una tira
 * de cinco fotos achaflanadas.
 */
const LoQueHacemos: React.FC = () => (
  <section aria-label="Lo que hacemos" className="relative">
    {BLOQUES.map((b, i) => (
      <div
        key={b.titulo}
        className="sticky top-[70px] flex min-h-[calc(100svh-70px)] items-center border-t border-goya-amber/15 bg-[#081124] shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]"
        style={{ zIndex: i + 1 }}
      >
        <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 md:px-12">
          <p className="m-0 text-center font-mono text-[11px] uppercase tracking-label text-goya-amber">
            {String(i + 1).padStart(2, '0')} / {String(BLOQUES.length).padStart(2, '0')}
          </p>
          <h2 className="m-0 mt-4 text-center font-display text-[clamp(2.2rem,6.5vw,6rem)] font-semibold uppercase leading-[0.95] tracking-tight text-goya-paper">
            {b.titulo}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-slate-400 md:text-base">
            {b.bajada}
          </p>

          <ul className="m-0 mt-10 flex list-none snap-x gap-3 overflow-x-auto p-0 pb-2 md:mt-14 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
            {b.fotos.map((f, k) => (
              <li
                key={f.src}
                className="goya-cut group relative aspect-[4/5] w-[62vw] shrink-0 snap-start overflow-hidden bg-goya-navy sm:w-[38vw] md:w-auto"
                style={{ ['--cut' as string]: '14px', transform: `translateY(${k % 2 ? 18 : 0}px)` }}
              >
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </li>
            ))}
          </ul>

          <div className="mt-12 flex justify-center">
            <Link
              to={b.enlace.to}
              onClick={(e) => {
                // El campus tiene una versión de escritorio y otra móvil; se
                // va a la que esté visible.
                const destino = b.enlace.anclas
                  ?.map((id) => document.getElementById(id))
                  .find((el) => el && el.offsetParent !== null)
                if (destino) {
                  e.preventDefault()
                  destino.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="goya-cut group inline-flex items-center gap-3 border border-goya-amber/45 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
              style={{ ['--cut' as string]: '9px' }}
            >
              {b.enlace.texto}
              <FontAwesomeIcon icon={faArrowRight} className="text-[0.65rem] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    ))}
  </section>
)

export default LoQueHacemos

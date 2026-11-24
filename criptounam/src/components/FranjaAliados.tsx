import React from 'react'
import { partnersData } from '../data/partnersData'

/**
 * Franja de aliados justo bajo la portada: logos sueltos, sin tarjeta, que
 * pasan en bucle y se desvanecen en los bordes. Reutiliza la animación de la
 * Marquesina (`.goya-marquesina-pista`), que se detiene al pasar el ratón y
 * con reduced-motion.
 */
const FranjaAliados: React.FC = () => {
  const fila = (duplicado: boolean) => (
    <ul
      aria-hidden={duplicado || undefined}
      className="m-0 flex shrink-0 list-none items-center gap-14 p-0 pr-14 md:gap-20 md:pr-20"
    >
      {partnersData.map((p, i) => (
        <li key={i} className="shrink-0">
          <img
            src={p.img}
            alt={duplicado ? '' : p.alt}
            loading="lazy"
            className="h-10 w-auto max-w-[160px] object-contain opacity-60 transition-opacity duration-300 [filter:brightness(0)_invert(1)] hover:opacity-100 md:h-12"
          />
        </li>
      ))}
    </ul>
  )

  return (
    <section
      aria-label="Aliados de CriptoUNAM"
      className="relative mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 md:px-12"
    >
      <p className="m-0 mb-7 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-label text-slate-400">
        <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-goya-amber" />
        Nos acompañan
        <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-goya-amber" />
      </p>
      <div
        className="goya-marquesina relative overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <div className="goya-marquesina-pista py-2" style={{ ['--marquesina-dur' as string]: '60s' }}>
          {fila(false)}
          {fila(true)}
        </div>
      </div>
    </section>
  )
}

export default FranjaAliados

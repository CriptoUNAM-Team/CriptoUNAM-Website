import React, { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { proyectosInsignia } from '../data/proyectosHacksData'
import Reveal from './Reveal'

type Insignia = (typeof proyectosInsignia)[number]

/**
 * Ficha grande de un proyecto insignia: logo oficial, resumen, stack, enlaces
 * y una galería de capturas (la principal grande y miniaturas para cambiarla).
 */
const FichaInsignia: React.FC<{ p: Insignia; invertida?: boolean }> = ({ p, invertida }) => {
  const { insignia } = p
  const [activa, setActiva] = useState(0)
  const captura = insignia.capturas[activa] ?? insignia.capturas[0]

  return (
    <article className="goya-panel goya-panel-lit overflow-hidden" style={{ ['--cut' as string]: '24px' }}>
      <div
        className={`grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] ${
          invertida ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        {/* Texto */}
        <div className="flex flex-col p-7 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            {insignia.logoPlacaClara ? (
              <span
                className="goya-cut flex h-16 w-16 shrink-0 items-center justify-center bg-white p-1.5 sm:h-20 sm:w-20"
                style={{ ['--cut' as string]: '8px' }}
              >
                <img src={insignia.logo} alt={p.nombre} loading="lazy" className="h-full w-full object-contain" />
              </span>
            ) : (
              <img
                src={insignia.logo}
                alt={p.nombre}
                loading="lazy"
                className="h-14 w-auto max-w-[220px] object-contain sm:h-16"
              />
            )}
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-goya-amber">
              Proyecto insignia · {p.red}
            </span>
          </div>

          <p className="mt-6 font-display text-xl uppercase leading-tight tracking-wide text-goya-paper sm:text-2xl">
            {insignia.tagline}
          </p>

          <div className="mt-4 space-y-3">
            {insignia.resumen.map((parrafo) => (
              <p key={parrafo.slice(0, 32)} className="text-sm leading-relaxed text-slate-400">
                {parrafo}
              </p>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologías">
            {insignia.stack.map((t) => (
              <li
                key={t}
                className="goya-cut border border-goya-amber/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-slate-300"
                style={{ ['--cut' as string]: '5px' }}
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            {insignia.enlaces.map((e, i) => (
              <a
                key={e.href}
                href={e.href}
                target="_blank"
                rel="noreferrer"
                className={`goya-cut group inline-flex items-center gap-1.5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-label no-underline transition-colors duration-300 ${
                  i === 0
                    ? 'bg-goya-amber font-bold text-goya-void hover:bg-goya-paper'
                    : 'border border-goya-amber/40 text-goya-paper hover:border-goya-amber hover:text-goya-amber'
                }`}
                style={{ ['--cut' as string]: '8px' }}
              >
                {e.label}
                <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Galería */}
        <div className="flex flex-col gap-3 border-t border-goya-amber/15 bg-goya-void/50 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <img
              key={captura.src}
              src={captura.src}
              alt={captura.alt}
              loading="lazy"
              className={`goya-cut w-auto object-contain ${
                captura.formato === 'movil' ? 'max-h-[460px]' : 'max-h-[460px] w-full'
              }`}
              style={{ ['--cut' as string]: '12px' }}
            />
          </div>

          {insignia.capturas.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={`Capturas de ${p.nombre}`}>
              {insignia.capturas.map((c, i) => (
                <button
                  key={c.src}
                  type="button"
                  role="tab"
                  aria-selected={i === activa}
                  aria-label={c.alt}
                  onClick={() => setActiva(i)}
                  className={`goya-cut block shrink-0 overflow-hidden border p-0 transition-colors duration-300 ${
                    i === activa ? 'border-goya-amber' : 'border-goya-amber/20 opacity-60 hover:opacity-100'
                  }`}
                  style={{ ['--cut' as string]: '5px', width: c.formato === 'movil' ? 44 : 96, height: 64 }}
                >
                  <img
                    src={c.src}
                    alt=""
                    loading="lazy"
                    className="block object-cover object-top"
                    style={{ width: '100%', height: '100%', maxWidth: 'none' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/** Los proyectos insignia de la comunidad (SEYF y UTONOMA), uno tras otro. */
const ProyectosInsignia: React.FC = () => (
  <div className="flex flex-col gap-8">
    {proyectosInsignia.map((p, i) => (
      <Reveal key={p.id} as="div" delay={150 + i * 120}>
        <FichaInsignia p={p} invertida={i % 2 === 1} />
      </Reveal>
    ))}
  </div>
)

export default ProyectosInsignia

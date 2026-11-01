import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CAMPUS, SALAS_CAMPUS } from '../data/campusData'
import Reveal from './Reveal'
import Caminantes from './goya/Caminantes'
import { Rotulo } from './goya/adornos'

const menosMovimiento = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * El Campus de CriptoUNAM, contado sala por sala.
 *
 * En escritorio la sección se queda fija mientras se hace scroll y cada tramo
 * del recorrido enciende una sala: la lista de la izquierda marca dónde vas y
 * el panel cambia la captura. En móvil, donde una sección fija estorba, las
 * salas van una debajo de otra.
 */
const CampusScroll: React.FC = () => {
  const caja = useRef<HTMLElement>(null)
  const [paso, setPaso] = useState(0)
  const n = SALAS_CAMPUS.length

  const medir = useCallback(() => {
    const nodo = caja.current
    if (!nodo || window.innerWidth < 1024) return
    const r = nodo.getBoundingClientRect()
    const recorrido = r.height - window.innerHeight
    if (recorrido <= 0) return
    const p = Math.min(Math.max(-r.top / recorrido, 0), 0.9999)
    setPaso(Math.floor(p * n))
  }, [n])

  useEffect(() => {
    let cuadro = 0
    const alMover = () => {
      cancelAnimationFrame(cuadro)
      cuadro = requestAnimationFrame(medir)
    }
    window.addEventListener('scroll', alMover, { passive: true })
    window.addEventListener('resize', alMover)
    medir()
    return () => {
      cancelAnimationFrame(cuadro)
      window.removeEventListener('scroll', alMover)
      window.removeEventListener('resize', alMover)
    }
  }, [medir])

  const irA = (k: number) => {
    const nodo = caja.current
    if (!nodo) return
    const r = nodo.getBoundingClientRect()
    const recorrido = r.height - window.innerHeight
    const destino = window.scrollY + r.top + ((k + 0.5) / n) * recorrido
    window.scrollTo({ top: destino, behavior: menosMovimiento() ? 'auto' : 'smooth' })
  }

  const sala = SALAS_CAMPUS[paso]

  const cabecera = (compacta: boolean) => (
    <div>
      <Rotulo>Workspace · {CAMPUS.estado}</Rotulo>
      <h2 className="goya-rule mt-4 w-fit max-w-full font-display text-3xl uppercase leading-[1.05] tracking-wide text-goya-paper sm:text-4xl md:text-5xl">
        {CAMPUS.nombre}
      </h2>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">{CAMPUS.resumen}</p>
      <ul className={`mt-5 flex-wrap gap-2 ${compacta ? 'hidden' : 'flex'}`}>
        {CAMPUS.rasgos.map((r) => (
          <li
            key={r}
            className="goya-cut border border-goya-amber/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-slate-300"
            style={{ ['--cut' as string]: '5px' }}
          >
            {r}
          </li>
        ))}
      </ul>
      {CAMPUS.url ? (
        <a
          href={CAMPUS.url}
          target="_blank"
          rel="noreferrer"
          className="goya-cut group mt-7 inline-flex items-center gap-2 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
          style={{ ['--cut' as string]: '9px' }}
        >
          Entrar al campus
          <ArrowUpRight size={13} />
        </a>
      ) : (
        <p className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-goya-amber">
          <span className="goya-blink inline-block h-1.5 w-1.5 bg-goya-amber" aria-hidden="true" />
          Abre pronto para toda la comunidad
        </p>
      )}
    </div>
  )

  return (
    <>
      {/* ---------- Escritorio: sección fija con recorrido ---------- */}
      <section
        ref={caja}
        id="campus"
        className="goya-anchor relative hidden lg:block"
        style={{ height: `${n * 70 + 100}vh` }}
        aria-label={CAMPUS.nombre}
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] items-center gap-12 px-12">
            <div className="flex flex-col gap-7">
              {cabecera(true)}

              <ol className="m-0 flex list-none flex-col border-l border-goya-amber/20 p-0">
                {SALAS_CAMPUS.map((s, k) => {
                  const activo = k === paso
                  return (
                    <li key={s.id} className="m-0 list-none p-0">
                      <button
                        type="button"
                        onClick={() => irA(k)}
                        aria-current={activo ? 'step' : undefined}
                        className={`-ml-px flex w-full items-baseline gap-3 border-l-2 py-1 pl-4 text-left transition-colors duration-300 ${
                          activo ? 'border-goya-amber' : 'border-transparent hover:border-goya-amber/40'
                        }`}
                      >
                        <span
                          className={`font-mono text-[10px] tracking-label ${
                            activo ? 'text-goya-amber' : 'text-slate-600'
                          }`}
                        >
                          {String(k + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-display text-sm uppercase tracking-wide transition-colors duration-300 ${
                            activo ? 'text-goya-paper' : 'text-slate-500'
                          }`}
                        >
                          {s.nombre}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Panel */}
            <div className="goya-panel goya-panel-lit relative overflow-hidden" style={{ ['--cut' as string]: '24px' }}>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0b0d14]">
                {SALAS_CAMPUS.map((s, k) => (
                  <img
                    key={s.id}
                    src={s.imagen}
                    alt={k === paso ? `${s.nombre} del CriptoUNAM Campus` : ''}
                    aria-hidden={k === paso ? undefined : true}
                    loading={k < 2 ? 'eager' : 'lazy'}
                    className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out"
                    style={{
                      opacity: k === paso ? 1 : 0,
                      transform: k === paso ? 'scale(1)' : 'scale(1.04)',
                    }}
                  />
                ))}
                {/* Viñeta para que el texto se lea sobre la captura */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#010004] via-[#010004]/70 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6">
                  <div key={sala.id} className="cripto-sala-in max-w-lg">
                    <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">{sala.etiqueta}</p>
                    <h3 className="mt-1.5 font-display text-2xl uppercase tracking-wide text-goya-paper">{sala.nombre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{sala.texto}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tracking-label text-slate-400">
                    {String(paso + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="border-t border-goya-amber/15 px-4 pt-3">
                <Caminantes cantidad={9} alto="h-8" className="h-14" />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .cripto-sala-in { animation: criptoSalaIn 520ms cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes criptoSalaIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) { .cripto-sala-in { animation: none; } }
        `}</style>
      </section>

      {/* ---------- Móvil y tablet: salas en columna ---------- */}
      <section
        id="campus-movil"
        className="goya-anchor mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8 md:px-12 lg:hidden"
        aria-label={CAMPUS.nombre}
      >
        <Reveal as="div" delay={100}>
          {cabecera(false)}
        </Reveal>

        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8">
          {SALAS_CAMPUS.map((s, k) => (
            <Reveal
              key={s.id}
              as="article"
              delay={120}
              className="goya-panel w-[82%] shrink-0 snap-start overflow-hidden sm:w-[60%]"
            >
              <img src={s.imagen} alt={`${s.nombre} del CriptoUNAM Campus`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                  {String(k + 1).padStart(2, '0')} · {s.etiqueta}
                </p>
                <h3 className="mt-1.5 font-display text-xl uppercase tracking-wide text-goya-paper">{s.nombre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8">
          <Caminantes cantidad={6} alto="h-8" className="h-14" />
        </div>
      </section>
    </>
  )
}

export default CampusScroll

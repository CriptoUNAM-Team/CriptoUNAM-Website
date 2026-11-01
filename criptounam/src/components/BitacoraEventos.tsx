import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import Seccion from './goya/Seccion'

/**
 * Lo que hizo la comunidad en 2025, mes por mes. Los títulos son los de
 * /comunidad; las fotos son copias reducidas (public/images/bitacora/) de las
 * carpetas *_CRIPTOUNAM, dos por mes.
 */
const MESES = [
  { mes: 'Enero', titulo: 'Hackathon De VARA en ITAM' },
  { mes: 'Febrero', titulo: 'Eventos en Economía UNAM' },
  { mes: 'Marzo', titulo: 'Argentina, bootcamps y workshops' },
  { mes: 'Abril', titulo: 'Expansión interuniversitaria' },
  { mes: 'Mayo', titulo: 'Hackathones LatAm' },
  { mes: 'Junio', titulo: 'Nouns, Diputados y Demo Day BaseBatch' },
  { mes: 'Julio', titulo: 'Summer Builders' },
  { mes: 'Agosto', titulo: 'Bitso Win, ETH Global NYC y Monad' },
  { mes: 'Septiembre', titulo: 'Meridian Rio y CU Islas' },
  { mes: 'Octubre', titulo: 'BASE, Starknet, Solana y ETH México' },
  { mes: 'Noviembre', titulo: 'Devconnect, Foro Blockchain y ETH Global Argentina' },
  { mes: 'Diciembre', titulo: 'Cierre de año' },
].map((m) => {
  const base = `/images/bitacora/${m.mes.toLowerCase()}`
  return { ...m, fotos: [`${base}-1.jpg`, `${base}-2.jpg`] }
})

const DURACION = 5500

const BitacoraEventos: React.FC = () => {
  const raiz = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(0)
  const [pausa, setPausa] = useState(false)
  const [enVista, setEnVista] = useState(false)
  const [reducido, setReducido] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia === 'function') {
      setReducido(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
    const nodo = raiz.current
    if (!nodo || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setEnVista(e.isIntersecting), { threshold: 0.35 })
    io.observe(nodo)
    return () => io.disconnect()
  }, [])

  // Avanza solo mientras se ve, nadie lo está leyendo y no hay reduced-motion.
  const corre = enVista && !pausa && !reducido
  useEffect(() => {
    if (!corre) return
    const t = window.setTimeout(() => setActivo((a) => (a + 1) % MESES.length), DURACION)
    return () => window.clearTimeout(t)
  }, [activo, corre])

  // Solo se descargan el mes visible y el siguiente; los demás, al llegar.
  const [cargados, setCargados] = useState<ReadonlySet<number>>(() => new Set([0, 1]))
  useEffect(() => {
    setCargados((c) => {
      const sig = (activo + 1) % MESES.length
      if (c.has(activo) && c.has(sig)) return c
      return new Set([...c, activo, sig])
    })
  }, [activo])

  const ir = (d: number) => setActivo((a) => (a + d + MESES.length) % MESES.length)
  const m = MESES[activo]

  return (
    <Seccion
      id="bitacora"
      rotulo="Bitácora 2025"
      titulo="Un año en la calle"
      intro="Hackathones, viajes, aulas y escenarios. Doce meses de CriptoUNAM, uno por uno."
    >
      <div
        ref={raiz}
        className="goya-panel goya-panel-lit overflow-hidden"
        style={{ ['--cut' as string]: '24px' }}
        onMouseEnter={() => setPausa(true)}
        onMouseLeave={() => setPausa(false)}
        onFocus={() => setPausa(true)}
        onBlur={() => setPausa(false)}
        aria-roledescription="carrusel"
        aria-label="Eventos de 2025"
      >
        <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Fotos: la principal grande y la segunda encima, desplazada */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0b0d14] sm:aspect-[16/10]">
            {MESES.map((mm, k) => cargados.has(k) && (
              <img
                key={mm.mes}
                src={mm.fotos[0]}
                alt={k === activo ? `${mm.mes} 2025: ${mm.titulo}` : ''}
                aria-hidden={k === activo ? undefined : true}
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-out"
                style={{ opacity: k === activo ? 1 : 0, transform: k === activo ? 'scale(1.02)' : 'scale(1.08)' }}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#010004]/80 via-transparent to-transparent" />
            <img
              key={`b-${m.mes}`}
              src={m.fotos[1]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="cripto-foto-b goya-cut absolute bottom-5 right-5 hidden w-[34%] border border-goya-amber/50 object-cover shadow-[0_10px_40px_rgba(0,0,0,0.6)] sm:block"
              style={{ ['--cut' as string]: '10px', aspectRatio: '4 / 3' }}
            />
            <span className="absolute left-5 top-5 font-display text-6xl uppercase leading-none text-goya-paper/90 sm:text-7xl">
              {String(activo + 1).padStart(2, '0')}
            </span>
          </div>

          {/* Texto y controles */}
          <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
            <div key={m.mes} className="cripto-mes-in" aria-live="polite">
              <p className="font-mono text-[11px] uppercase tracking-label text-goya-amber">{m.mes} · 2025</p>
              <h3 className="mt-3 font-display text-3xl uppercase leading-[1.05] tracking-wide text-goya-paper sm:text-4xl">
                {m.titulo}
              </h3>
            </div>

            <div>
              {/* Barras de progreso, una por mes */}
              <div className="flex gap-1" role="tablist" aria-label="Meses">
                {MESES.map((mm, k) => (
                  <button
                    key={mm.mes}
                    type="button"
                    role="tab"
                    aria-selected={k === activo}
                    aria-label={mm.mes}
                    onClick={() => setActivo(k)}
                    className="relative h-6 flex-1 cursor-pointer"
                    style={{ padding: 0, minWidth: 0 }}
                  >
                    <span
                      className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden"
                      style={{ background: 'rgba(236,247,255,0.16)' }}
                    >
                      <span
                        className={`block h-full bg-goya-amber ${k === activo && corre ? 'cripto-barra' : ''}`}
                        style={{ width: k < activo ? '100%' : k === activo ? (corre ? undefined : '100%') : '0%' }}
                      />
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  {[
                    { d: -1, Icono: ArrowLeft, label: 'Mes anterior' },
                    { d: 1, Icono: ArrowRight, label: 'Mes siguiente' },
                  ].map(({ d, Icono, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => ir(d)}
                      aria-label={label}
                      className="goya-cut flex items-center justify-center border border-goya-amber/40 text-goya-paper transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                      style={{ ['--cut' as string]: '6px', width: 40, height: 40, padding: 0 }}
                    >
                      <Icono size={15} style={{ width: 15, height: 15, flexShrink: 0 }} />
                    </button>
                  ))}
                  {!reducido && (
                    <button
                      type="button"
                      onClick={() => setPausa((p) => !p)}
                      aria-label={pausa ? 'Reanudar' : 'Pausar'}
                      className="flex items-center justify-center text-slate-400 transition-colors hover:text-goya-amber"
                      style={{ width: 40, height: 40, padding: 0 }}
                    >
                      {pausa ? (
                        <Play size={14} style={{ width: 14, height: 14 }} />
                      ) : (
                        <Pause size={14} style={{ width: 14, height: 14 }} />
                      )}
                    </button>
                  )}
                </div>
                <Link
                  to="/comunidad"
                  className="font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors hover:text-goya-paper"
                >
                  Ver todas las fotos →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cripto-barra { width: 0; animation: criptoBarra ${DURACION}ms linear forwards; }
        @keyframes criptoBarra { to { width: 100%; } }
        .cripto-mes-in { animation: criptoMesIn 600ms cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes criptoMesIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .cripto-foto-b { animation: criptoFotoB 700ms cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes criptoFotoB { from { opacity: 0; transform: translate(14px, 14px) rotate(2deg); } to { opacity: 1; transform: rotate(-1.5deg); } }
        .cripto-foto-b { transform: rotate(-1.5deg); }
        @media (prefers-reduced-motion: reduce) {
          .cripto-mes-in, .cripto-foto-b { animation: none; }
        }
      `}</style>
    </Seccion>
  )
}

export default BitacoraEventos

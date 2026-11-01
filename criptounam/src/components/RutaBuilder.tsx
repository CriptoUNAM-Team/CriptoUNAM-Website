import React, { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import { Rotulo } from './goya/adornos'
import { BITMAP_G, BITMAP_MONEDA } from './goya/bitmaps'

/**
 * La ruta de quien llega a CriptoUNAM, contada como un viaje.
 *
 * Tomada de la sección "método" de la landing de IGE y llevada al lenguaje
 * del cartel: las cinco etapas viven a lo largo de un solo hilo ámbar y el
 * panel es una ventana que viaja por él. Un círculo de luz recorre el hilo
 * con el scroll, la cámara lo sigue con retraso y seis cuadros pixel —la
 * comunidad— se reacomodan en cada parada.
 *
 * En escritorio la sección se queda fija mientras se recorre; en móvil, las
 * etapas van como tarjetas (una sección fija en un teléfono estorba).
 */

interface EtapaRuta {
  verbo: string
  titulo: string
  cuerpo: string
  etiqueta: string
  to: string
  cta: string
}

const ETAPAS_RUTA: EtapaRuta[] = [
  {
    verbo: 'Aprende',
    titulo: 'Cursos gratuitos',
    cuerpo: 'Blockchain, Solidity, DeFi y NFTs desde cero. Sin costo y con certificado on-chain al terminar.',
    etiqueta: 'Cursos · desde cero',
    to: '/cursos',
    cta: 'Ver cursos',
  },
  {
    verbo: 'Conecta',
    titulo: 'Eventos y talleres',
    cuerpo: 'Meetups, workshops y sesiones presenciales en Ciudad Universitaria durante todo el año.',
    etiqueta: 'Comunidad · CU',
    to: '/eventos',
    cta: 'Ver eventos',
  },
  {
    verbo: 'Compite',
    titulo: 'Hackathones',
    cuerpo: 'Competimos y ganamos. En Goya Hack, nuestro hackathon, se entregaron 21 proyectos.',
    etiqueta: 'Goya Hack · 2026',
    to: '/hackathon',
    cta: 'Ver ganadores',
  },
  {
    verbo: 'Gana',
    titulo: 'Recompensas $PUMA',
    cuerpo: 'Misiones, sesiones y hackathones pagan en $PUMA. Canjéalo por cursos premium y acceso a eventos.',
    etiqueta: '$PUMA · Avalanche',
    to: '/recompensas',
    cta: 'Gana $PUMA',
  },
  {
    verbo: 'Lanza',
    titulo: 'Tu startup',
    cuerpo: 'De los hackathones salen proyectos que siguen vivos. SEYF y UTONOMA son nuestros proyectos insignia.',
    etiqueta: 'Startups · insignia',
    to: '/proyectos',
    cta: 'Ver proyectos',
  },
]

/* ------------------------------------------------------------------ mundo */

const AMBAR = '#E9AF3C'
const PAPEL = '#ecf7ff'
const CENTRO: [number, number] = [300, 240]

/** Dónde queda cada etapa en el mundo: alternan arriba y abajo para que el hilo ondule. */
const ESTACIONES: [number, number][] = [0, 1, 2, 3, 4].map((k) => [300 + k * 680, k % 2 ? 500 : 240])

const HILO = (() => {
  const [x0, y0] = ESTACIONES[0]
  let d = `M ${x0 - 420} ${y0 - 190} C ${x0 - 220} ${y0 - 170} ${x0 - 160} ${y0} ${x0} ${y0}`
  for (let k = 1; k < ESTACIONES.length; k++) {
    const [ax, ay] = ESTACIONES[k - 1]
    const [bx, by] = ESTACIONES[k]
    d += ` C ${ax + 320} ${ay} ${bx - 320} ${by} ${bx} ${by}`
  }
  const [xn, yn] = ESTACIONES[ESTACIONES.length - 1]
  return `${d} C ${xn + 160} ${yn} ${xn + 220} ${yn - 170} ${xn + 420} ${yn - 190}`
})()

const anillo = (r: number, giro = 0): [number, number][] =>
  Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + giro
    return [CENTRO[0] + r * Math.cos(a), CENTRO[1] + r * Math.sin(a)]
  })

/** Dónde se acomodan los seis cuadros de la comunidad en cada etapa (coordenadas locales). */
const FORMACIONES: [number, number][][] = [
  anillo(150, -Math.PI / 2),
  [
    [165, 135],
    [445, 120],
    [490, 300],
    [340, 395],
    [135, 330],
    [300, 75],
  ],
  [
    [175, 150],
    [175, 240],
    [175, 330],
    [425, 150],
    [425, 240],
    [425, 330],
  ],
  anillo(135, Math.PI / 6),
  Array.from({ length: 6 }, (_, i) => [170 + i * 60, 385 - i * 56] as [number, number]),
]

/** Se queda quieto en cada etapa y viaja solo en la franja del cambio. */
function tramo(avance: number, n: number) {
  const c = Math.min(Math.max(avance - 0.5, 0), n - 1)
  const k = Math.min(Math.floor(c), n - 2)
  const f = Math.min(Math.max((c - k - 0.22) / 0.56, 0), 1)
  return { k, e: f * f * (3 - 2 * f) }
}

const menosMovimiento = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Celdas de un bitmap como rects, centradas en (cx, cy). */
const celdas = (bitmap: readonly string[], lado: number, cx: number, cy: number, sep = 2) => {
  const cols = Math.max(...bitmap.map((f) => f.length))
  const x0 = cx - (cols * lado) / 2
  const y0 = cy - (bitmap.length * lado) / 2
  const out: { x: number; y: number; a: boolean; k: number }[] = []
  bitmap.forEach((fila, y) =>
    [...fila].forEach((c, x) => {
      if (c === '.' || c === '0') return
      out.push({ x: x0 + x * lado + sep / 2, y: y0 + y * lado + sep / 2, a: c === 'A', k: x + y })
    })
  )
  return { out, lado: lado - sep }
}

const G = celdas(BITMAP_G, 15, CENTRO[0], CENTRO[1])
const MONEDA = celdas(BITMAP_MONEDA, 22, CENTRO[0], CENTRO[1], 3)

const Escena: React.FC<{ paso: number; avance: RefObject<number> }> = ({ paso, avance }) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const hilo = useRef<SVGPathElement>(null)
  const recorrido = useRef<SVGPathElement>(null)
  const camara = useRef<SVGGElement>(null)
  const viajero = useRef<SVGGElement>(null)
  const grupo = useRef<(SVGGElement | null)[]>([])
  const [nudos, setNudos] = useState<[number, number][]>([])

  useEffect(() => {
    const ruta = hilo.current
    if (!ruta) return
    const total = ruta.getTotalLength()

    const largos = ESTACIONES.map(([x, y]) => {
      let mejor = 0
      let dist = Infinity
      for (let l = 0; l <= total; l += 2) {
        const p = ruta.getPointAtLength(l)
        const d = (p.x - x) ** 2 + (p.y - y) ** 2
        if (d < dist) [dist, mejor] = [d, l]
      }
      return mejor
    })
    const marcas: [number, number][] = []
    for (let l = 90; l < total; l += 150) {
      const p = ruta.getPointAtLength(l)
      if (ESTACIONES.every(([x, y]) => (p.x - x) ** 2 + (p.y - y) ** 2 > 60 ** 2)) marcas.push([p.x, p.y])
    }
    setNudos(marcas)
    recorrido.current?.style.setProperty('stroke-dasharray', `${total}`)

    const quieto = menosMovimiento()
    let u = 0
    let cx = ESTACIONES[0][0]
    let cy = ESTACIONES[0][1]
    let [fx, fy] = [Infinity, Infinity]
    let cuadro = 0
    const mover = () => {
      const { k, e } = tramo(avance.current ?? 0, ESTACIONES.length)
      cuadro = requestAnimationFrame(mover)
      if (Math.abs(k + e - u) < 0.0005 && Math.abs(fx - cx) + Math.abs(fy - cy) < 0.05) return
      u += (k + e - u) * (quieto ? 1 : 0.16)
      const a = Math.min(Math.floor(u), ESTACIONES.length - 2)
      const f = u - a
      const largo = largos[a] + (largos[a + 1] - largos[a]) * f
      const p = ruta.getPointAtLength(largo)
      ;[fx, fy] = [p.x, p.y]
      // La cámara va detrás del círculo: se le ve adelantarse y luego llegar.
      cx += (p.x - cx) * (quieto ? 1 : 0.09)
      cy += (p.y - cy) * (quieto ? 1 : 0.09)
      viajero.current?.setAttribute('transform', `translate(${p.x} ${p.y})`)
      camara.current?.setAttribute('transform', `translate(${(300 - cx).toFixed(2)} ${(240 - cy).toFixed(2)})`)
      recorrido.current?.style.setProperty('stroke-dashoffset', `${total - largo}`)
      grupo.current.forEach((nodo, i) => {
        const g = Math.min(Math.max((f - i * 0.05) / 0.75, 0), 1)
        const s = g * g * (3 - 2 * g)
        const [ax, ay] = FORMACIONES[a][i]
        const [bx, by] = FORMACIONES[a + 1][i]
        const x0 = ESTACIONES[a][0] - CENTRO[0] + ax
        const y0 = ESTACIONES[a][1] - CENTRO[1] + ay
        const x1 = ESTACIONES[a + 1][0] - CENTRO[0] + bx
        const y1 = ESTACIONES[a + 1][1] - CENTRO[1] + by
        nodo?.setAttribute('transform', `translate(${(x0 + (x1 - x0) * s).toFixed(2)} ${(y0 + (y1 - y0) * s).toFixed(2)})`)
      })
    }
    mover()
    return () => cancelAnimationFrame(cuadro)
  }, [avance])

  const capa = (n: number): React.CSSProperties => ({
    opacity: paso === n ? 1 : 0.18,
    transition: 'opacity 700ms ease',
  })
  const en = (n: number) => `translate(${ESTACIONES[n][0] - CENTRO[0]} ${ESTACIONES[n][1] - CENTRO[1]})`

  return (
    <svg viewBox="0 0 600 480" aria-hidden="true" className="ruta-escena block h-full w-full">
      <defs>
        <filter id={`b${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <radialGradient id={`h${id}`}>
          <stop offset="0" stopColor={AMBAR} stopOpacity="0.3" />
          <stop offset="1" stopColor={AMBAR} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g ref={camara} transform={`translate(${300 - ESTACIONES[0][0]} ${240 - ESTACIONES[0][1]})`}>
        {/* Retícula del cartel: al pasar de largo es lo que cuenta que hay viaje. */}
        {Array.from({ length: 42 }, (_, k) => (
          <line key={`v${k}`} x1={k * 100 - 600} y1="-600" x2={k * 100 - 600} y2="1300" stroke="#3870BD" strokeOpacity="0.16" />
        ))}
        {Array.from({ length: 17 }, (_, k) => (
          <line key={`h${k}`} x1="-600" y1={k * 120 - 600} x2="3700" y2={k * 120 - 600} stroke="#3870BD" strokeOpacity="0.16" />
        ))}

        <path ref={hilo} d={HILO} fill="none" stroke={AMBAR} strokeOpacity="0.28" strokeWidth="1.5" strokeDasharray="2 6" />
        <path ref={recorrido} d={HILO} fill="none" stroke={AMBAR} strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" />
        {nudos.map(([x, y], i) => (
          <rect key={i} x={x - 4.5} y={y - 4.5} width="9" height="9" fill="#0b1324" stroke={AMBAR} strokeOpacity="0.6" strokeWidth="1.4" />
        ))}

        {/* 1 · Aprende: ondas que salen del centro y líneas de código */}
        <g transform={en(0)} style={capa(0)}>
          {[70, 140, 210].map((r, k) => (
            <circle
              key={r}
              cx={CENTRO[0]}
              cy={CENTRO[1]}
              r={r}
              fill="none"
              stroke={PAPEL}
              strokeOpacity={0.35 - k * 0.09}
              strokeDasharray="3 7"
              className="ruta-onda"
              style={{ animationDelay: `${k * 0.6}s` }}
            />
          ))}
          <circle cx={CENTRO[0]} cy={CENTRO[1]} r="80" fill={`url(#h${id})`} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={40} y={60 + k * 16} width={[90, 60, 110, 44][k]} height="6" fill={k === 2 ? AMBAR : PAPEL} fillOpacity={k === 2 ? 0.8 : 0.25} />
          ))}
          <rect x={40 + 48} y={60 + 3 * 16} width="7" height="6" fill={AMBAR} className="ruta-cursor" />
        </g>

        {/* 2 · Conecta: la red de la comunidad */}
        <g transform={en(1)} style={capa(1)}>
          {FORMACIONES[1].map(([x, y], i) => (
            <line key={`c${i}`} x1={CENTRO[0]} y1={CENTRO[1]} x2={x} y2={y} stroke={PAPEL} strokeOpacity="0.45" strokeDasharray="4 8" className="ruta-flujo" />
          ))}
          {FORMACIONES[1].map(([x, y], i) => {
            const [bx, by] = FORMACIONES[1][(i + 1) % 6]
            return <line key={`a${i}`} x1={x} y1={y} x2={bx} y2={by} stroke={AMBAR} strokeOpacity="0.18" />
          })}
          <circle cx={CENTRO[0]} cy={CENTRO[1]} r="34" fill="none" stroke={PAPEL} strokeOpacity="0.6" />
          <circle cx={CENTRO[0]} cy={CENTRO[1]} r="60" fill={`url(#h${id})`} />
        </g>

        {/* 3 · Compite: la G de Goya Hack */}
        <g transform={en(2)} style={capa(2)}>
          {G.out.map((c, i) => (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width={G.lado}
              height={G.lado}
              fill={AMBAR}
              fillOpacity="0.55"
              className="ruta-pixel"
              style={{ animationDelay: `${(c.k % 12) * 90}ms` }}
            />
          ))}
          <rect x="120" y="100" width="360" height="280" fill="none" stroke={PAPEL} strokeOpacity="0.25" strokeDasharray="6 6" />
        </g>

        {/* 4 · Gana: la moneda $PUMA en órbita */}
        <g transform={en(3)} style={capa(3)}>
          <circle cx={CENTRO[0]} cy={CENTRO[1]} r="120" fill={`url(#h${id})`} />
          <g className="ruta-orbita" style={{ transformOrigin: `${CENTRO[0]}px ${CENTRO[1]}px` }}>
            <circle cx={CENTRO[0]} cy={CENTRO[1]} r="135" fill="none" stroke={AMBAR} strokeOpacity="0.4" strokeDasharray="2 10" />
          </g>
          {MONEDA.out.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={MONEDA.lado} height={MONEDA.lado} fill={c.a ? AMBAR : '#0b1324'} fillOpacity={c.a ? 0.9 : 1} />
          ))}
        </g>

        {/* 5 · Lanza: la flecha que despega */}
        <g transform={en(4)} style={capa(4)}>
          <line
            x1="140"
            y1="410"
            x2="500"
            y2="70"
            stroke={AMBAR}
            strokeWidth="5"
            style={{ strokeDasharray: 496, strokeDashoffset: paso === 4 ? 0 : 496, transition: 'stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1)' }}
          />
          <polygon
            points="540,32 492,46 526,80"
            fill={AMBAR}
            style={{ opacity: paso === 4 ? 1 : 0, transition: 'opacity 300ms 700ms' }}
          />
          {[
            [460, 200],
            [210, 140],
            [520, 330],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="8" height="8" fill={PAPEL} className="ruta-estrella" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>

        {/* Cada etapa es una parada del hilo. */}
        {ESTACIONES.map(([x, y], k) => (
          <rect
            key={k}
            x={x - 16}
            y={y - 16}
            width="32"
            height="32"
            fill="none"
            stroke={AMBAR}
            strokeOpacity={k <= paso ? 0.85 : 0.3}
            strokeWidth="1.5"
            transform={`rotate(45 ${x} ${y})`}
            style={{ transition: 'stroke-opacity 500ms ease' }}
          />
        ))}

        {/* La comunidad: seis cuadros pixel que viajan con el hilo */}
        {FORMACIONES[0].map(([x, y], i) => (
          <g
            key={i}
            ref={(nodo) => {
              grupo.current[i] = nodo
            }}
            transform={`translate(${x + ESTACIONES[0][0] - CENTRO[0]} ${y + ESTACIONES[0][1] - CENTRO[1]})`}
          >
            <rect x="-11" y="-11" width="22" height="22" fill={AMBAR} opacity="0.35" filter={`url(#b${id})`} />
            <rect x="-6" y="-6" width="12" height="12" fill={i % 3 === 0 ? AMBAR : PAPEL} opacity="0.92" />
          </g>
        ))}

        <g ref={viajero} transform={`translate(${ESTACIONES[0][0]} ${ESTACIONES[0][1]})`}>
          <circle r="26" fill={AMBAR} opacity="0.5" filter={`url(#b${id})`} />
          <circle r="9" fill={paso === 4 ? AMBAR : '#fff8ea'} style={{ transition: 'fill 500ms ease' }} />
        </g>
      </g>

      <style>{`
        .ruta-onda { animation: rutaOnda 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
        @keyframes rutaOnda { 0%,100% { opacity: .35 } 50% { opacity: 1 } }
        .ruta-flujo { animation: rutaFlujo 1.6s linear infinite; }
        @keyframes rutaFlujo { to { stroke-dashoffset: -24; } }
        .ruta-cursor { animation: rutaCursor 1s steps(1) infinite; }
        @keyframes rutaCursor { 50% { opacity: 0 } }
        .ruta-pixel { animation: rutaPixel 2.4s ease-in-out infinite; }
        @keyframes rutaPixel { 0%,100% { fill-opacity: .4 } 50% { fill-opacity: .95 } }
        .ruta-orbita { animation: rutaOrbita 18s linear infinite; }
        @keyframes rutaOrbita { to { transform: rotate(360deg); } }
        .ruta-estrella { animation: rutaEstrella 1.8s ease-in-out infinite; }
        @keyframes rutaEstrella { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .ruta-onda, .ruta-flujo, .ruta-cursor, .ruta-pixel, .ruta-orbita, .ruta-estrella { animation: none; }
        }
      `}</style>
    </svg>
  )
}

/* -------------------------------------------------------------- sección */

const RutaBuilder: React.FC = () => {
  const caja = useRef<HTMLElement>(null)
  const avance = useRef(0)
  const [paso, setPaso] = useState(0)
  const n = ETAPAS_RUTA.length

  const medir = useCallback(() => {
    const nodo = caja.current
    if (!nodo || window.innerWidth < 1024) return
    const r = nodo.getBoundingClientRect()
    const recorrido = r.height - window.innerHeight
    if (recorrido <= 0) return
    const p = Math.min(Math.max(-r.top / recorrido, 0), 0.9999)
    avance.current = p * n
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

  const cabecera = (
    <>
      <Rotulo>Qué hacemos · la ruta</Rotulo>
      <h2 className="goya-rule mt-4 w-fit max-w-full font-display text-3xl uppercase leading-[1.05] tracking-wide text-goya-paper sm:text-4xl xl:text-5xl">
        Aprende, construye, gana
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
        Todo lo que ofrece CriptoUNAM es gratuito y abierto. No necesitas experiencia previa para empezar.
      </p>
    </>
  )

  return (
    <>
      {/* ---------- Escritorio ---------- */}
      <section
        ref={caja}
        id="ruta"
        className="goya-anchor relative hidden lg:block"
        style={{ height: `${n * 80 + 100}vh` }}
        aria-label="La ruta en CriptoUNAM"
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)] items-center gap-12 px-12">
            <div className="flex flex-col gap-8">
              <div>{cabecera}</div>

              <ol className="m-0 flex list-none flex-col p-0">
                {ETAPAS_RUTA.map((e, k) => {
                  const activo = k === paso
                  return (
                    <li key={e.verbo} className="m-0 list-none p-0">
                      <button
                        type="button"
                        onClick={() => irA(k)}
                        aria-current={activo ? 'step' : undefined}
                        className={`flex w-full items-baseline gap-3 border-l-2 pl-4 text-left transition-all duration-500 ${
                          activo ? 'border-goya-amber py-2' : 'border-goya-amber/15 py-1 hover:border-goya-amber/40'
                        }`}
                      >
                        <span
                          className={`font-display leading-none transition-all duration-500 ${
                            activo ? 'text-4xl text-goya-amber' : 'text-base text-slate-600'
                          }`}
                        >
                          {k + 1}
                        </span>
                        <span
                          className={`font-display uppercase tracking-wide transition-colors duration-500 ${
                            activo ? 'text-lg text-goya-paper' : 'text-sm text-slate-500'
                          }`}
                        >
                          {e.verbo}
                          <span className={activo ? 'text-goya-amber' : 'text-slate-600'}> · {e.titulo}</span>
                        </span>
                      </button>
                      <div
                        className="grid border-l-2 border-goya-amber pl-4 transition-[grid-template-rows,opacity] duration-500"
                        style={{ gridTemplateRows: activo ? '1fr' : '0fr', opacity: activo ? 1 : 0, borderColor: activo ? undefined : 'transparent' }}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-sm pb-2 pl-9 text-sm leading-relaxed text-slate-400">{e.cuerpo}</p>
                          <Link
                            to={e.to}
                            tabIndex={activo ? 0 : -1}
                            className="group mb-2 ml-9 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors hover:text-goya-paper"
                          >
                            {e.cta}
                            <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div
              className="goya-panel goya-panel-lit relative aspect-[5/4] overflow-hidden"
              style={{ ['--cut' as string]: '24px', background: 'radial-gradient(120% 90% at 50% 40%, #12203a 0%, #070a14 70%)' }}
            >
              <div className="relative h-full w-full">
<Escena paso={paso} avance={avance} />
              <span
                key={paso}
                className="ruta-chip goya-cut absolute left-6 top-6 border border-goya-amber/50 bg-[#070a14]/80 px-4 py-2 font-mono text-[11px] uppercase tracking-label text-goya-paper"
                style={{ ['--cut' as string]: '7px' }}
              >
                {ETAPAS_RUTA[paso].etiqueta}
              </span>
              <span className="absolute bottom-5 right-6 font-mono text-[11px] tracking-label text-slate-400">
                {String(paso + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
</div>
            </div>
          </div>
        </div>

        <style>{`
          .ruta-chip { animation: rutaChip 520ms cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes rutaChip { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
          @media (prefers-reduced-motion: reduce) { .ruta-chip { animation: none; } }
        `}</style>
      </section>

      {/* ---------- Móvil ---------- */}
      <section className="goya-anchor mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8 md:px-12 lg:hidden">
        <Reveal as="div" delay={100}>
          {cabecera}
        </Reveal>
        <ol className="m-0 mt-10 flex list-none flex-col gap-4 p-0">
          {ETAPAS_RUTA.map((e, k) => (
            <li key={e.verbo} className="m-0 list-none p-0">
            <Reveal as="div" delay={120 + k * 60} className="goya-panel">
              <div className="flex gap-4 p-5">
                <span className="font-display text-3xl leading-none text-goya-amber">{k + 1}</span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg uppercase tracking-wide text-goya-paper">
                    {e.verbo} <span className="text-goya-amber">· {e.titulo}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{e.cuerpo}</p>
                  <Link
                    to={e.to}
                    className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline"
                  >
                    {e.cta}
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

export default RutaBuilder

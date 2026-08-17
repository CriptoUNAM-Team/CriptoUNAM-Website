import { useState, useMemo, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { obtenerInscripcionesUsuario, type InscripcionResumen } from '../services/progresoCurso.service'
import { resolveLearnerId } from '../utils/learnerIdentity'
import { Link } from 'react-router-dom'
import { cursosData, getLeccionesFlat, type Curso } from '../constants/cursosData'
import Reveal from '../components/Reveal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faGraduationCap,
  faClock,
  faCoins,
  faAward,
  faArrowRight,
  faMagnifyingGlass,
  faGift,
  faCheckCircle,
  faSeedling,
  faLayerGroup,
  faRocket,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const NIVELES = ['todos', 'principiante', 'intermedio', 'avanzado'] as const
const CATEGORIAS_LIST = [
  'todas',
  'Sesiones en vivo',
  'Blockchain',
  'Ethereum',
  'L2',
  'Arbitrum',
  'Solana',
  'Avalanche',
  'Stellar',
  'Sui',
  'Soroban',
  'Subnets',
  'Rollups',
  'DeFi',
  'Smart Contracts',
  'Rust',
  'Move',
  'APIs',
  'Bitso',
  'Etherfuse',
  'Stablecoins',
  'CETES',
  'México',
  'Criptografía',
  'Seguridad',
  'Arquitectura',
  'Backend',
  'Indexers',
  'Oráculos',
  'Claude',
  'IA',
  'Anthropic',
  'Vibecoding',
  'Productividad',
  'Marketing',
  'Growth',
  'Comunidad',
  'Negocio',
  'Modelos de negocio',
  'Estrategia',
  'Tokenomics',
  'Economía',
  'Diseño',
  'UX',
  'Producto',
  'Figma',
  'Canva',
  'Tecnología',
  'Fundamentos',
  'Desarrollo',
  'Finanzas',
  'Trading',
]


const normalizeText = (text?: string) => {
  if (!text) return ''
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

/**
 * Solo mostramos cursos con contenido real (al menos una lecci\u00f3n/secci\u00f3n).
 * Esto deja fuera los placeholders del cat\u00e1logo y prioriza los cursos completos.
 */
const CURSOS_VISIBLES = cursosData.filter((c) => getLeccionesFlat(c).length > 0)

/** Config visual por dificultad \u2014 iconos dorados y azules. */
const NIVEL_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  Principiante: { color: '#60A5FA', bg: 'rgba(96,165,250,0.14)', icon: faSeedling }, // azul
  Intermedio: { color: '#F4D03F', bg: 'rgba(244,208,63,0.14)', icon: faLayerGroup }, // dorado claro
  Avanzado: { color: '#D4AF37', bg: 'rgba(212,175,55,0.16)', icon: faRocket }, // dorado
}
const nivelConf = (nivel?: string) => NIVEL_CONFIG[nivel || 'Principiante'] || NIVEL_CONFIG.Principiante


const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')

  const { address } = useAccount()
  const [inscripciones, setInscripciones] = useState<Record<string, InscripcionResumen>>({})

  useEffect(() => {
    // Identidad: wallet conectada o, sin wallet, el id de email guardado localmente.
    const learnerId = resolveLearnerId(address)
    if (learnerId) {
      obtenerInscripcionesUsuario(learnerId).then(res => {
        const map: Record<string, InscripcionResumen> = {}
        res.forEach(r => { map[r.curso_id] = r })
        setInscripciones(map)
      })
    } else {
      setInscripciones({})
    }
  }, [address])


  const cursosFiltrados = useMemo(() => {
    const busquedaNorm = normalizeText(busqueda);
    return CURSOS_VISIBLES.filter((curso) => {
      const cumpleNivel = filtroNivel === 'todos' || curso.nivel?.toLowerCase() === filtroNivel
      const cumpleBusqueda =
        !busquedaNorm ||
        normalizeText(curso.titulo).includes(busquedaNorm) ||
        normalizeText(curso.descripcion).includes(busquedaNorm)
      const cumpleCategoria =
        categoriaSeleccionada === 'todas' ||
        (curso.categorias && curso.categorias.some((c) => c.toLowerCase() === categoriaSeleccionada.toLowerCase()))
      return cumpleNivel && cumpleBusqueda && cumpleCategoria
    })
  }, [filtroNivel, busqueda, categoriaSeleccionada])

  const totalCursos = CURSOS_VISIBLES.length
  const cursosGratis = CURSOS_VISIBLES.filter((c) => !c.precioPuma || c.precioPuma === 0).length
  const cursosPago = totalCursos - cursosGratis

  const NIVELES = ['todos', 'principiante', 'intermedio', 'avanzado']

  const cifras = [
    { valor: String(totalCursos), etiqueta: 'Cursos' },
    { valor: String(cursosGratis), etiqueta: 'Gratuitos' },
    { valor: String(cursosPago), etiqueta: 'Con $PUMA' },
  ]

  return (
    <div className="goya-scope">
      {/* ---- Cabecera ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 pb-4 pt-8 sm:px-8 md:px-12 md:pt-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal
              inmediato
              as="p"
              delay={100}
              className="font-mono text-[11px] uppercase tracking-label text-goya-amber"
            >
              Catálogo · Credencial NFT al terminar
            </Reveal>

            <Reveal
              inmediato
              as="h1"
              delay={180}
              className="goya-rule mt-3 w-fit font-display text-4xl uppercase leading-none tracking-wide text-goya-paper sm:text-5xl md:text-6xl"
            >
              Cursos
            </Reveal>

            <Reveal
              inmediato
              as="p"
              delay={260}
              className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400"
            >
              Aprende blockchain con contenido hecho por la comunidad. Cada curso
              te da una credencial NFT soulbound on-chain al completarlo.
            </Reveal>
          </div>

          <Reveal inmediato as="div" delay={320} className="flex flex-wrap gap-3">
            {cifras.map((c) => (
              <span
                key={c.etiqueta}
                className="goya-cut flex min-w-[6.5rem] flex-col gap-1 border border-goya-amber/30 px-4 py-3"
                style={{ ['--cut' as string]: '9px' }}
              >
                <span className="font-display text-2xl leading-none text-goya-paper">
                  {c.valor}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-label text-slate-500">
                  {c.etiqueta}
                </span>
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---- Filtros ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-6 sm:px-8 md:px-12">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Buscar cursos</span>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.8rem]"
                style={{ color: '#64748b' }}
              />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por título o descripción…"
                className="goya-cut w-full border border-goya-amber/25 bg-black/40 py-3 pl-11 pr-4 font-mono text-xs text-goya-paper outline-none transition-colors duration-300 placeholder:text-slate-600 focus:border-goya-amber"
                style={{ ['--cut' as string]: '9px', marginBottom: 0 }}
              />
            </label>

            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              aria-label="Categoría"
              className="goya-cut border border-goya-amber/25 bg-black/40 px-4 py-3 font-mono text-xs uppercase tracking-label text-goya-paper outline-none transition-colors duration-300 focus:border-goya-amber sm:w-64"
              style={{ ['--cut' as string]: '9px', marginBottom: 0 }}
            >
              {CATEGORIAS_LIST.map((c) => (
                <option key={c} value={c === 'todas' ? 'todas' : c}>
                  {c === 'todas' ? 'Todas las categorías' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Nivel, como pestañas achaflanadas */}
          <div className="flex flex-wrap gap-2">
            {NIVELES.map((n) => {
              const activo = filtroNivel === n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFiltroNivel(n)}
                  aria-pressed={activo}
                  className={`goya-cut px-4 py-2 font-mono text-[10px] uppercase tracking-label transition-colors duration-300 ${
                    activo
                      ? 'bg-goya-amber text-goya-void'
                      : 'border border-goya-amber/25 text-slate-400 hover:border-goya-amber/60 hover:text-goya-amber'
                  }`}
                  style={{ ['--cut' as string]: '7px' }}
                >
                  {n === 'todos' ? 'Todos los niveles' : n}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---- Catálogo ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 pb-20 sm:px-8 md:px-12">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-label text-slate-500">
          {cursosFiltrados.length}{' '}
          {cursosFiltrados.length === 1 ? 'curso' : 'cursos'}
        </p>

        {cursosFiltrados.length === 0 ? (
          <div className="goya-panel">
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#E9AF3C', fontSize: '1.5rem' }} />
              <p className="text-sm text-slate-400">
                No hay cursos que coincidan. Prueba cambiar el nivel o la categoría.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cursosFiltrados.map((curso: Curso, idx) => {
              const tienePuma = !!curso.precioPuma && curso.precioPuma > 0
              const inscripcion = inscripciones[curso.id]
              const completadas = inscripcion?.lecciones_completadas?.length || 0
              const totalLecciones = getLeccionesFlat(curso).length
              const progreso =
                totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0
              const completado = progreso === 100
              const iniciado = completadas > 0
              const conf = nivelConf(curso.nivel)

              return (
                <Reveal
                  key={curso.id}
                  as="article"
                  delay={120 + (idx % 6) * 80}
                  className="goya-panel goya-panel-hover h-full"
                >
                  <div className="flex h-full flex-col">
                    {/* Miniatura */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={curso.imagen}
                        alt={curso.titulo}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-55 transition-opacity duration-500 hover:opacity-85"
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(4,7,14,0.96) 10%, rgba(4,7,14,0.35) 60%, transparent 100%)',
                        }}
                        aria-hidden="true"
                      />

                      <span
                        className="absolute left-4 top-4 inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label"
                        style={{ background: conf.bg, color: conf.color, border: `1px solid ${conf.color}55` }}
                      >
                        <FontAwesomeIcon icon={conf.icon} style={{ fontSize: '0.6rem' }} />
                        {curso.nivel}
                      </span>

                      {completado && (
                        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 bg-goya-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label text-goya-void">
                          <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '0.6rem' }} />
                          Completado
                        </span>
                      )}
                    </div>

                    {/* Cuerpo */}
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                        {curso.titulo}
                      </h2>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400 [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box] [overflow:hidden]">
                        {curso.descripcion}
                      </p>

                      {/* Datos del curso */}
                      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-label text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.6rem' }} />
                          {curso.duracion}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faListCheck} style={{ fontSize: '0.6rem' }} />
                          {totalLecciones} lecciones
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-goya-amber/80">
                          <FontAwesomeIcon icon={faAward} style={{ fontSize: '0.6rem' }} />
                          NFT
                        </span>
                      </div>

                      {/* Avance */}
                      <div className="mt-5 border-t border-goya-amber/15 pt-4">
                        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-label">
                          <span className="text-slate-500">
                            {completado ? 'Completado' : iniciado ? 'En progreso' : 'Sin empezar'}
                          </span>
                          <span className="text-goya-amber">{progreso}%</span>
                        </div>
                        {/* Barra de avance: rectangular, como la retícula del cartel. */}
                        <div className="mt-2 h-1 w-full bg-white/10">
                          <div
                            className="h-full bg-goya-amber transition-[width] duration-500"
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                        {iniciado && !completado && (
                          <p className="mt-2 font-mono text-[9px] uppercase tracking-label text-slate-600">
                            {completadas}/{totalLecciones} lecciones
                          </p>
                        )}
                      </div>

                      {/* Precio + entrada al curso */}
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-label text-goya-amber">
                          {tienePuma ? (
                            <span className="inline-flex items-center gap-1.5">
                              <FontAwesomeIcon icon={faCoins} style={{ fontSize: '0.65rem' }} />
                              {curso.precioPuma?.toLocaleString('en-US')} $PUMA
                            </span>
                          ) : (
                            'Gratis'
                          )}
                        </span>

                        <Link
                          to={`/registro-curso/${curso.id}`}
                          className="goya-cut group inline-flex items-center gap-2 bg-goya-amber px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
                          style={{ ['--cut' as string]: '8px' }}
                        >
                          {iniciado ? 'Continuar' : 'Ver curso'}
                          <FontAwesomeIcon
                            icon={faArrowRight}
                            className="text-[0.6rem] transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Cursos

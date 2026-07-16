import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { obtenerInscripcionesUsuario, type InscripcionResumen } from '../services/progresoCurso.service'
import { resolveLearnerId } from '../utils/learnerIdentity'
import { Link } from 'react-router-dom'
import { cursosData, getLeccionesFlat, type Curso } from '../constants/cursosData'
import PageHero from '../components/PageHero'
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

  return (
    <>
      <style>{`
        .cursos-layout {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .cursos-toolbar {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 1.5rem;
        }
        .cursos-toolbar__row {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .cursos-search {
          position: relative;
          flex: 1 1 240px;
          min-width: 200px;
        }
        .cursos-chips {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding: 2px 0;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
        .cursos-chips::-webkit-scrollbar { height: 4px; }
        .cursos-chips::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }
        .cursos-chip {
          flex-shrink: 0;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .cursos-chip--lvl {
          background: rgba(255,255,255,0.04);
          color: #cbd5e1;
          border: 1px solid rgba(212,175,55,0.18);
        }
        .cursos-chip--lvl.is-active {
          background: linear-gradient(135deg, #F4D03F, #D4AF37);
          color: #0a0a0a;
          border-color: #F4D03F;
        }
        .cursos-chip--cat {
          background: rgba(212,175,55,0.08);
          color: #D4AF37;
          border: 1px solid rgba(212,175,55,0.25);
        }
        .cursos-chip--cat.is-active {
          background: linear-gradient(135deg, #F4D03F, #D4AF37);
          color: #0a0a0a;
          border-color: #F4D03F;
        }
        .cursos-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .curso-row {
          display: flex;
          align-items: stretch;
          gap: 1.1rem;
          padding: 0.9rem 1rem;
        }
        .curso-row__lead {
          width: 52px;
          min-width: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .curso-row__badge {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
        }
        .curso-row__thumb {
          width: 168px;
          min-width: 168px;
          aspect-ratio: 16 / 10;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          background: rgba(20,20,20,0.8);
        }
        .curso-row__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.45rem; }
        .curso-row__side {
          width: 210px;
          min-width: 210px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.7rem;
        }
        .curso-progress-track {
          height: 7px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .curso-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #60A5FA, #F4D03F, #D4AF37);
          transition: width 0.5s ease;
        }
        @media (max-width: 860px) {
          .curso-row { flex-wrap: wrap; }
          .curso-row__side { width: 100%; min-width: 0; }
        }
        @media (max-width: 620px) {
          .curso-row { flex-direction: column; }
          .curso-row__lead { width: auto; justify-content: flex-start; }
          .curso-row__thumb { width: 100%; min-width: 0; aspect-ratio: 16 / 9; }
        }
      `}</style>

      <div style={{ padding: '0.5rem 0 3rem' }}>
        {/* ============================================================
            HERO
            ============================================================ */}
        <PageHero
          icon={faGraduationCap}
          iconColor="#a78bfa"
          iconGradient="linear-gradient(135deg, #a78bfa, #7c3aed)"
          eyebrow="Catálogo"
          title="Cursos CriptoUNAM"
          description={
            <>
              Aprende blockchain con contenido de la comunidad. Cada curso te da una{' '}
              <strong style={{ color: '#F4D03F' }}>credencial NFT soulbound</strong> on-chain.
            </>
          }
          accentRgba="rgba(124,58,237,0.1)"
          stats={[
            { icon: faBook, label: 'Cursos', value: totalCursos, color: '#a78bfa' },
            { icon: faGift, label: 'Gratis', value: cursosGratis, color: '#4ade80' },
            { icon: faCoins, label: 'En $PUMA', value: cursosPago, color: '#F4D03F' },
          ]}
          cta={{
            to: '/claim',
            label: 'Mis certificaciones',
            icon: faAward,
            variant: 'ghost',
          }}
        />

        {/* ============================================================
            FILTROS + GRID
            ============================================================ */}
        <div className="cursos-layout">
          {/* Toolbar de filtros — compacta y horizontal */}
          <div className="cursos-toolbar puma-fade-in-up">
            <div className="cursos-toolbar__row">
              <div className="cursos-search">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar cursos…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar cursos"
                  className="puma-input"
                  style={{ paddingLeft: 40, marginBottom: 0, height: 40 }}
                />
              </div>
              
              <select
                value={filtroNivel}
                onChange={(e) => setFiltroNivel(e.target.value)}
                className="puma-input"
                style={{ width: 'auto', minWidth: '140px', height: 40, marginBottom: 0, cursor: 'pointer', paddingRight: '2rem' }}
              >
                <option value="todos">Todos los niveles</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>

              {(busqueda || filtroNivel !== 'todos') && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda('')
                    setFiltroNivel('todos')
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <main className="cursos-list puma-stagger">
            {cursosFiltrados.length === 0 ? (
              <div
                className="puma-card"
                style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: '#94a3b8' }}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '0.75rem' }}
                />
                <p style={{ margin: 0 }}>
                  No hay cursos que coincidan. Prueba cambiar nivel o categoría.
                </p>
              </div>
            ) : (
              cursosFiltrados.map((curso: Curso, idx) => {
                const tienePuma = !!curso.precioPuma && curso.precioPuma > 0
                const inscripcion = inscripciones[curso.id]
                const completadas = inscripcion?.lecciones_completadas?.length || 0
                const totalLecciones = getLeccionesFlat(curso).length
                const progreso = totalLecciones > 0 ? Math.round((completadas / totalLecciones) * 100) : 0
                const completado = progreso === 100
                const iniciado = completadas > 0
                const conf = nivelConf(curso.nivel)
                return (
                  <motion.article
                    key={curso.id}
                    className="puma-card puma-card--shimmer curso-row"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    style={{ '--i': idx } as React.CSSProperties}
                  >
                    {/* Icono por dificultad (dorado/azul) */}
                    <div className="curso-row__lead">
                      <div
                        className="curso-row__badge"
                        style={{ background: conf.bg, color: conf.color, border: `1px solid ${conf.color}44` }}
                        title={curso.nivel}
                      >
                        <FontAwesomeIcon icon={conf.icon} />
                      </div>
                    </div>

                    {/* Miniatura */}
                    <div className="curso-row__thumb">
                      <img
                        src={curso.imagen}
                        alt={curso.titulo}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {completado && (
                        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.45)', borderRadius: 999, padding: '0.2rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
                          <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#D4AF37', fontSize: '0.72rem' }} />
                          <span style={{ color: '#F4D03F', fontSize: '0.66rem', fontWeight: 700 }}>Completado</span>
                        </div>
                      )}
                    </div>

                    {/* Cuerpo */}
                    <div className="curso-row__body">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: conf.color,
                            background: conf.bg,
                            border: `1px solid ${conf.color}55`,
                            borderRadius: 999,
                            padding: '0.15rem 0.55rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.4px',
                          }}
                        >
                          {curso.nivel}
                        </span>
                        {tienePuma && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 700, color: '#0a0a0a', background: 'linear-gradient(135deg, #F4D03F, #D4AF37)', borderRadius: 999, padding: '0.15rem 0.55rem', fontFamily: 'Orbitron' }}>
                            <FontAwesomeIcon icon={faCoins} style={{ fontSize: '0.66rem' }} />
                            {curso.precioPuma?.toLocaleString('en-US')} $PUMA
                          </span>
                        )}
                      </div>

                      <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.08rem', margin: 0, lineHeight: 1.3 }}>
                        {curso.titulo}
                      </h2>
                      <p
                        style={{
                          margin: 0,
                          color: '#94a3b8',
                          fontSize: '0.86rem',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {curso.descripcion}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.76rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FontAwesomeIcon icon={faClock} />
                          {curso.duracion}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FontAwesomeIcon icon={faListCheck} />
                          {totalLecciones} lecciones
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#F4D03F' }}>
                          <FontAwesomeIcon icon={faAward} />
                          NFT al completar
                        </span>
                      </div>
                    </div>

                    {/* Lado derecho: avance + CTA */}
                    <div className="curso-row__side">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 5 }}>
                          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                            {completado ? 'Completado' : iniciado ? 'En progreso' : 'Sin empezar'}
                          </span>
                          <span style={{ color: conf.color, fontWeight: 700 }}>{progreso}%</span>
                        </div>
                        <div className="curso-progress-track">
                          <div className="curso-progress-fill" style={{ width: `${progreso}%` }} />
                        </div>
                        {iniciado && !completado && (
                          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4 }}>
                            {completadas}/{totalLecciones} lecciones
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/registro-curso/${curso.id}`}
                        className="puma-btn puma-btn--gold"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.6rem 1rem', fontSize: '0.9rem' }}
                      >
                        {iniciado ? 'Continuar' : 'Ver curso'}
                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                      </Link>
                    </div>
                  </motion.article>
                )
              })
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default Cursos

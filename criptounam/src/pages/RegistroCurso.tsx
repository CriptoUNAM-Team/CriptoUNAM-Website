import { useState, useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate, useParams } from 'react-router-dom'
import { resolveLearnerId, emailToLearnerId, setStoredLearnerId } from '../utils/learnerIdentity'
import { sendTelegramMessage } from '../api/telegram'
import { cursosData, type Curso, type Leccion, type Capitulo, getLeccionesFlat } from '../constants/cursosData'
import { shuffleCuestionario, nuevaSemilla } from '../utils/quizShuffle'
import ExamenFinal from '../components/Cursos/ExamenFinal'
import {
  inscripcionCurso,
  estaInscrito,
  obtenerProgresoCurso,
  marcarLeccionCompletada
} from '../services/progresoCurso.service'
import CourseEnrollPreview from '../components/Cursos/CourseEnrollPreview'
import CourseCertificateCTA from '../components/Cursos/CourseCertificateCTA'
import { cursoBadgeRef } from '../constants/cursosData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faCheck,
  faCircleQuestion,
  faGraduationCap,
  faCheckCircle,
  faClock,
  faBars,
  faPlay,
  faBook,
  faAward,
  faRedo,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const RegistroCurso = () => {
  // status: 'connecting' | 'reconnecting' | 'connected' | 'disconnected'.
  // Mientras es reconnecting/connecting (típico tras un refresh) NO mostramos
  // el CTA de "Conectar wallet" ni el form de inscribirse — esperamos a wagmi.
  const { address, status } = useAccount()
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [inscrito, setInscrito] = useState(false)
  // Identidad del alumno: wallet conectada o, sin wallet, un id basado en el email
  // (inscripción "email-first"). Se guarda en localStorage para sobrevivir refrescos.
  const [learnerId, setLearnerId] = useState<string | null>(() => resolveLearnerId(address))
  // Evita mostrar el form de "Inscribirse" mientras Supabase verifica si ya lo está.
  // Arranca en true para que el primer render no muestre el form por defecto.
  const [verificandoInscripcion, setVerificandoInscripcion] = useState(true)
  const [firmando, setFirmando] = useState(false)
  const [errorInscripcion, setErrorInscripcion] = useState<string | null>(null)
  const [leccionActual, setLeccionActual] = useState(0)
  const [leccionesCompletadas, setLeccionesCompletadas] = useState<number[]>([])
  const [respuestasCuestionario, setRespuestasCuestionario] = useState<Record<number, number>>({})
  const [preguntaActual, setPreguntaActual] = useState(0) // índice en el cuestionario de la lección actual (carrusel)
  const [sidebarAbierto, setSidebarAbierto] = useState(false) // móvil: menú desplegable
  // Semillas para barajar opciones de cuestionarios por lección (estables dentro de la sesión)
  const [shuffleSeeds, setShuffleSeeds] = useState<Record<number, number>>({})
  // Estado del examen final
  const [examenAbierto, setExamenAbierto] = useState(false)
  const [examenAprobado, setExamenAprobado] = useState(false)

  useEffect(() => {
    const c = id ? cursosData.find((x) => x.id === id) : undefined
    setCurso(c !== undefined ? c : null)
    setLoading(false)
  }, [id])

  // Cuando la wallet conecta/desconecta, recalculamos la identidad activa
  // (wallet tiene prioridad; sin wallet cae al id de email guardado).
  useEffect(() => {
    setLearnerId(resolveLearnerId(address))
  }, [address])

  // Cargar inscripción y progreso desde Supabase según la identidad del alumno.
  // Mientras wagmi rehidrata (status 'connecting' o 'reconnecting' tras un refresh)
  // mantenemos verificandoInscripcion=true para no parpadear nada.
  useEffect(() => {
    if (!id) return
    // wagmi todavía decidiendo el estado: esperamos.
    if (status === 'connecting' || status === 'reconnecting') {
      setVerificandoInscripcion(true)
      return
    }
    if (!learnerId) {
      // Sin identidad (ni wallet ni email guardado): mostramos el form de inscripción.
      setVerificandoInscripcion(false)
      return
    }
    let cancelled = false
    setVerificandoInscripcion(true)
    const load = async () => {
      try {
        const [ok, indices] = await Promise.all([
          estaInscrito(learnerId, id),
          obtenerProgresoCurso(learnerId, id)
        ])
        if (cancelled) return
        setInscrito(ok)
        if (indices.length > 0) setLeccionesCompletadas(indices)
      } finally {
        if (!cancelled) setVerificandoInscripcion(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [learnerId, id, status])

  // Al cambiar de lección, volver a la primera pregunta del cuestionario.
  // Además, generamos (una sola vez) la semilla para barajear esa lección.
  useEffect(() => {
    setPreguntaActual(0)
    setShuffleSeeds((prev) =>
      prev[leccionActual] === undefined
        ? { ...prev, [leccionActual]: nuevaSemilla() }
        : prev,
    )
  }, [leccionActual])

  // Cuestionario barajeado de la lección actual (calculado siempre para respetar reglas de hooks)
  const cuestionarioShuffled = useMemo(() => {
    if (!curso) return undefined
    const flat = getLeccionesFlat(curso)
    const l = flat[leccionActual]
    if (!l?.cuestionario || l.cuestionario.length === 0) return undefined
    const seed = shuffleSeeds[leccionActual] ?? 1
    return shuffleCuestionario(l.cuestionario, seed)
  }, [curso, leccionActual, shuffleSeeds])

  if (loading) return <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37'}}>Cargando...</div>

  if (!curso) {
    return (
      <div className="registro-curso-container" style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <h2 style={{color:'#ff4444'}}>Curso no encontrado</h2>
        <button className="primary-button" style={{marginTop:24}} onClick={()=>navigate('/cursos')}>Volver a cursos</button>
      </div>
    )
  }

  // Ya no exigimos wallet para llegar al curso: la inscripción puede ser email-first.
  // El loader de verificación (más abajo) cubre el estado mientras wagmi rehidrata.

  const handleInscribirse = async (datos: { nombre: string; email: string }) => {
    if (!curso) return
    setErrorInscripcion(null)
    setFirmando(true)
    try {
      // Identidad: wallet si está conectada; si no, un id derivado del email.
      const identidad = address ? address.toLowerCase() : emailToLearnerId(datos.email)
      // Sin wallet: persistimos el id para que el progreso sobreviva al refresco.
      if (!address) setStoredLearnerId(identidad)
      const notif = `🚀 Nuevo alumno inscrito en CriptoUNAM\nCurso: ${curso.titulo}\nWallet: ${address ?? '(sin wallet)'}\nNombre: ${datos.nombre}\nEmail: ${datos.email}`
      await sendTelegramMessage(notif, '1608242541')
      await inscripcionCurso({
        walletAddress: identidad,
        cursoId: id!,
        nombre: datos.nombre,
        email: datos.email,
      })
      setLearnerId(identidad)
      setInscrito(true)
    } catch {
      setErrorInscripcion('No se pudo completar. Intenta de nuevo.')
    } finally {
      setFirmando(false)
    }
  }

  const handleCompletarLeccion = () => {
    const leccionesFlat = curso ? getLeccionesFlat(curso) : []
    if (!curso || leccionesFlat.length === 0) return
    const leccion = leccionesFlat[leccionActual]
    const tieneCuestionario = leccion?.cuestionario && leccion.cuestionario.length > 0
    if (tieneCuestionario) {
      // Verificación usa la versión barajeada cacheada en cuestionarioShuffled
      const correctas = cuestionarioShuffled!.every(
        (p, i) => respuestasCuestionario[leccionActual * 10 + i] === p.correcta,
      )
      if (!correctas) return
    }
    if (!leccionesCompletadas.includes(leccionActual)) {
      setLeccionesCompletadas([...leccionesCompletadas, leccionActual])
      if (learnerId && id) {
        marcarLeccionCompletada({
          walletAddress: learnerId,
          cursoId: id,
          leccionIndex: leccionActual,
          totalLecciones: leccionesFlat.length
        }).catch((e) => console.error('Error guardando progreso en Supabase:', e))
      }
    }
  }

  /** Convierte guía tipo markdown a elementos: ##, ###, ####, **, ```, listas, > */
  const renderGuia = (texto: string) => {
    const lines = texto.trim().split('\n')
    const out: React.ReactNode[] = []
    let i = 0
    const key = () => `g-${i}-${out.length}`

    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()

      // Bloques de código ```
      if (trimmed.startsWith('```')) {
        const lang = trimmed.slice(3).trim() || 'text'
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        if (i < lines.length) i++ // cerrar ```
        out.push(
          <pre key={key()} style={{ background: '#0d1117', padding: 16, borderRadius: 8, overflow: 'auto', margin: '16px 0', border: '1px solid #30363d', fontSize: '0.9rem' }}>
            <code style={{ color: '#e6edf3', fontFamily: 'ui-monospace, monospace' }}>{codeLines.join('\n')}</code>
          </pre>
        )
        continue
      }

      // Encabezados
      if (line.startsWith('#### ')) {
        out.push(<h4 key={key()} style={{ color: '#93C5FD', fontSize: '1rem', marginTop: 16, marginBottom: 6 }}>{line.slice(5)}</h4>)
        i++
        continue
      }
      if (line.startsWith('### ')) {
        out.push(<h3 key={key()} style={{ color: '#E0E0E0', fontSize: '1.15rem', marginTop: 20, marginBottom: 8 }}>{line.slice(4)}</h3>)
        i++
        continue
      }
      if (line.startsWith('## ')) {
        out.push(<h2 key={key()} style={{ color: '#D4AF37', fontSize: '1.4rem', marginTop: 24, marginBottom: 12 }}>{line.slice(3)}</h2>)
        i++
        continue
      }

      // Blockquote (referencias / cita)
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [line.slice(2)]
        i++
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2))
          i++
        }
        const parseInline = (s: string) => {
          const parts = s.split(/(\*\*[^*]+\*\*)/g)
          return parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
        }
        out.push(
          <blockquote key={key()} style={{ margin: '12px 0', padding: '12px 16px', borderLeft: '4px solid #2563EB', background: 'rgba(37,99,235,0.08)', borderRadius: 4, color: '#bfdbfe' }}>
            {quoteLines.map((q, idx) => <p key={idx} style={{ margin: idx ? '8px 0 0 0' : 0 }}>{parseInline(q)}</p>)}
          </blockquote>
        )
        continue
      }

      // Lista desordenada (- o *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items: React.ReactNode[] = []
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          const content = lines[i].trim().slice(2)
          const parts = content.split(/(\*\*[^*]+\*\*)/g)
          const parsed = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
          items.push(<li key={i}>{parsed}</li>)
          i++
        }
        out.push(<ul key={key()} style={{ margin: '8px 0 16px 1.2rem', color: '#E0E0E0', lineHeight: 1.7 }}>{items}</ul>)
        continue
      }

      // Lista ordenada (1. 2. etc.)
      if (/^\d+\.\s/.test(trimmed)) {
        const items: React.ReactNode[] = []
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const content = lines[i].trim().replace(/^\d+\.\s/, '')
          const parts = content.split(/(\*\*[^*]+\*\*)/g)
          const parsed = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
          items.push(<li key={i}>{parsed}</li>)
          i++
        }
        out.push(<ol key={key()} style={{ margin: '8px 0 16px 1.2rem', color: '#E0E0E0', lineHeight: 1.7 }}>{items}</ol>)
        continue
      }

      // Párrafo normal
      if (trimmed) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g)
        const parsed = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
        out.push(<p key={key()} style={{ color: '#E0E0E0', lineHeight: 1.7, marginBottom: 12 }}>{parsed}</p>)
      } else {
        out.push(<br key={key()} />)
      }
      i++
    }
    return out
  }

  // Mientras verificamos inscripción contra Supabase, mostramos un loader
  // para no parpadear el form de "Inscribirse" a alguien que ya está inscrito.
  if (verificandoInscripcion) {
    return (
      <div
        className="registro-curso-container"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: '#D4AF37'
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: '3px solid rgba(212,175,55,0.25)',
            borderTopColor: '#D4AF37',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite'
          }}
        />
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Verificando tu inscripción…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!inscrito) {
    return (
      <div className="registro-curso-container" style={{ padding: '1.5rem 0 3rem' }}>
        <CourseEnrollPreview
          curso={curso}
          walletAddress={address}
          firmando={firmando}
          errorInscripcion={errorInscripcion}
          onConfirmar={handleInscribirse}
        />
      </div>
    )
  }

  const leccionesFlat = curso ? getLeccionesFlat(curso) : []
  const leccion = leccionesFlat[leccionActual] as Leccion | undefined
  const progreso = leccionesFlat.length > 0 ? Math.round((leccionesCompletadas.length / leccionesFlat.length) * 100) : 0
  const muestraGuia = leccion?.guia != null
  const cuestionario = cuestionarioShuffled
  const respuestasLeccion = cuestionario ? cuestionario.map((_, i) => respuestasCuestionario[leccionActual * 10 + i]) : []
  const cuestionarioCompleto = !cuestionario || cuestionario.every((p, i) => respuestasLeccion[i] !== undefined)
  const cuestionarioCorrecto = cuestionario && cuestionarioCompleto && cuestionario.every((p, i) => respuestasLeccion[i] === p.correcta)
  const puedeCompletar = muestraGuia ? (cuestionario ? cuestionarioCorrecto : true) : true
  // Examen final disponible cuando todas las lecciones están completas
  const todasLeccionesCompletas =
    leccionesFlat.length > 0 && leccionesCompletadas.length >= leccionesFlat.length
  const hayExamenFinal = !!curso.examenFinal && curso.examenFinal.length > 0

  const badgeRef = cursoBadgeRef(curso.id, curso.cohorteRef)
  const yaCompletada = leccionesCompletadas.includes(leccionActual)
  const irSiguienteLeccion = () => {
    if (leccionActual < leccionesFlat.length - 1) {
      setLeccionActual(leccionActual + 1)
      setSidebarAbierto(false)
    }
  }
  const irLeccionAnterior = () => {
    if (leccionActual > 0) {
      setLeccionActual(leccionActual - 1)
      setSidebarAbierto(false)
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 880px) {
          .curso-mobile-nav { display: flex !important; }
          .curso-lecciones-sidebar { display: none !important; }
          .curso-main-content { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="section" style={{ minHeight: '100vh', paddingTop: '1rem', paddingBottom: '4rem' }}>
        {/* ============================================================
            HEADER CON PROGRESO
            ============================================================ */}
        <div
          className="puma-fade-in-up"
          style={{
            maxWidth: 1300,
            margin: '0 auto 1.25rem',
            padding: '0 1rem',
          }}
        >
          <div
            className="puma-card puma-card--featured"
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1rem 1.25rem',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 22px rgba(124,58,237,0.4)',
                flexShrink: 0,
              }}
            >
              <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#fff', fontSize: '1.2rem' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  margin: 0,
                }}
              >
                Estás aprendiendo
              </p>
              <h1
                style={{
                  fontFamily: 'Orbitron',
                  color: '#fff',
                  fontSize: 'clamp(1.05rem, 3vw, 1.35rem)',
                  margin: '0.15rem 0 0.4rem',
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {curso.titulo}
              </h1>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: `${progreso}%`,
                    height: '100%',
                    background:
                      progreso === 100
                        ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                        : 'linear-gradient(90deg, #D4AF37, #F4D03F)',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                }}
              >
                <span>
                  <strong style={{ color: '#F4D03F' }}>{progreso}%</strong> completado
                </span>
                <span>
                  {leccionesCompletadas.length} / {leccionesFlat.length} lecciones
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span className="puma-chip puma-chip--gold">
                <FontAwesomeIcon icon={faClock} />
                {curso.duracion}
              </span>
            </div>
          </div>
        </div>

        {/* selector móvil de lección */}
        <div
          className="curso-mobile-nav"
          style={{
            display: 'none',
            maxWidth: 1300,
            margin: '0 auto 1rem',
            padding: '0 1rem',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <FontAwesomeIcon icon={faBars} style={{ color: '#D4AF37' }} />
          <select
            value={leccionActual}
            onChange={(e) => {
              setLeccionActual(Number(e.target.value))
              setSidebarAbierto(false)
            }}
            className="puma-select"
            style={{ flex: 1, marginBottom: 0 }}
          >
            {leccionesFlat.map((sec, idx) => (
              <option key={idx} value={idx}>
                {leccionesCompletadas.includes(idx) ? '✓ ' : ''}
                {sec.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* ============================================================
            MAIN CONTENT
            ============================================================ */}
        <div
          className="curso-main-content"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 300px',
            gap: '1.5rem',
            maxWidth: 1300,
            margin: '0 auto',
            padding: '0 1rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Contenido principal */}
          <div className="puma-card puma-fade-in" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
            {leccion && (
              <>
                {/* breadcrumb lección */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: '0.85rem',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                  }}
                >
                  <span className="puma-chip puma-chip--gray">
                    Lección {leccionActual + 1} de {leccionesFlat.length}
                  </span>
                  {yaCompletada && (
                    <span className="puma-chip puma-chip--green">
                      <FontAwesomeIcon icon={faCheck} /> Completada
                    </span>
                  )}
                  {muestraGuia ? (
                    <span className="puma-chip puma-chip--blue">
                      <FontAwesomeIcon icon={faBook} /> Lectura
                    </span>
                  ) : leccion.video ? (
                    <span className="puma-chip puma-chip--blue">
                      <FontAwesomeIcon icon={faPlay} /> Video
                    </span>
                  ) : null}
                </div>

                {muestraGuia ? (
                  <div className="curso-guia-libro" style={{ marginBottom: 24 }}>
                    <h2
                      style={{
                        color: '#F4D03F',
                        fontFamily: 'Orbitron',
                        fontSize: 'clamp(1.25rem, 3.5vw, 1.7rem)',
                        marginBottom: '0.5rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {leccion.titulo}
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: '0.95rem' }}>
                      {leccion.descripcion}
                    </p>
                    <div style={{ color: '#E0E0E0', fontSize: '1rem' }}>{renderGuia(leccion.guia!)}</div>
                  </div>
                ) : leccion.video ? (
                  <>
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16 / 9',
                        borderRadius: 16,
                        overflow: 'hidden',
                        boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {/\.(mp4|webm|ogg)(\?.*)?$/i.test(leccion.video) ? (
                        <video
                          src={leccion.video}
                          title={leccion.titulo}
                          controls
                          playsInline
                          preload="metadata"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: '#000',
                          }}
                        />
                      ) : (
                        <iframe
                          src={leccion.video}
                          title={leccion.titulo}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                          }}
                        />
                      )}
                    </div>
                    <h2
                      style={{
                        color: '#F4D03F',
                        fontFamily: 'Orbitron',
                        fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                        margin: '0 0 0.5rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {leccion.titulo}
                    </h2>
                    <p style={{ color: '#cbd5e1', marginBottom: 16, lineHeight: 1.65 }}>
                      {leccion.descripcion}
                    </p>
                  </>
                ) : null}

                {/* ============================================================
                    CUESTIONARIO
                    ============================================================ */}
                {cuestionario && cuestionario.length > 0 && (
                  <div
                    className="puma-card puma-card--rainbow"
                    style={{
                      marginTop: '1.5rem',
                      padding: 'clamp(1rem, 3vw, 1.5rem)',
                      background:
                        'linear-gradient(160deg, rgba(124,58,237,0.08) 0%, rgba(20,20,30,0.92) 60%)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        flexWrap: 'wrap',
                        marginBottom: '1rem',
                      }}
                    >
                      <h3
                        style={{
                          color: '#fff',
                          fontFamily: 'Orbitron',
                          margin: 0,
                          fontSize: '1.05rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <FontAwesomeIcon icon={faCircleQuestion} style={{ color: '#a78bfa' }} />
                        Cuestionario
                      </h3>
                      <span className="puma-chip puma-chip--blue">
                        {Math.min(preguntaActual + 1, cuestionario.length)} / {cuestionario.length}
                      </span>
                    </div>

                    {/* Progreso de preguntas */}
                    <div style={{ display: 'flex', gap: 5, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                      {cuestionario.map((_, idx) => {
                        const answered = respuestasCuestionario[leccionActual * 10 + idx] !== undefined
                        const isActive = idx === preguntaActual
                        return (
                          <button
                            key={idx}
                            type="button"
                            aria-label={`Ir a pregunta ${idx + 1}`}
                            onClick={() => setPreguntaActual(idx)}
                            style={{
                              flex: 1,
                              minWidth: 24,
                              maxWidth: 60,
                              height: 6,
                              borderRadius: 3,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                              background: isActive
                                ? 'linear-gradient(90deg, #F4D03F, #D4AF37)'
                                : answered
                                ? 'rgba(74, 222, 128, 0.55)'
                                : 'rgba(212,175,55,0.18)',
                              boxShadow: isActive ? '0 0 10px rgba(244,208,63,0.55)' : 'none',
                            }}
                          />
                        )
                      })}
                    </div>

                    {/* Pregunta activa */}
                    {cuestionario.map((preg, i) => (
                      <div
                        key={i}
                        style={{
                          display: i === preguntaActual ? 'block' : 'none',
                        }}
                        className="puma-fade-in"
                      >
                        <p
                          style={{
                            color: '#fff',
                            fontWeight: 600,
                            marginBottom: 16,
                            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                            lineHeight: 1.5,
                          }}
                        >
                          {preg.pregunta}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {preg.opciones.map((op, j) => {
                            const selected = respuestasCuestionario[leccionActual * 10 + i] === j
                            const correcta = cuestionarioCompleto && preg.correcta === j
                            const incorrecta =
                              cuestionarioCompleto && selected && preg.correcta !== j
                            let borderColor = 'rgba(212,175,55,0.25)'
                            let bg = 'rgba(0,0,0,0.35)'
                            let color = '#cbd5e1'
                            if (incorrecta) {
                              borderColor = 'rgba(248,113,113,0.6)'
                              bg = 'rgba(127,29,29,0.25)'
                              color = '#fecaca'
                            } else if (correcta) {
                              borderColor = 'rgba(74,222,128,0.6)'
                              bg = 'rgba(20,83,45,0.25)'
                              color = '#bbf7d0'
                            } else if (selected) {
                              borderColor = '#F4D03F'
                              bg = 'rgba(212,175,55,0.15)'
                              color = '#fff'
                            }
                            return (
                              <button
                                key={j}
                                type="button"
                                onClick={() =>
                                  setRespuestasCuestionario((prev) => ({
                                    ...prev,
                                    [leccionActual * 10 + i]: j,
                                  }))
                                }
                                style={{
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '0.85rem 1rem',
                                  borderRadius: 12,
                                  border: `2px solid ${borderColor}`,
                                  background: bg,
                                  color,
                                  fontSize: '0.95rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  fontFamily: 'inherit',
                                }}
                              >
                                <span
                                  style={{
                                    flexShrink: 0,
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    background: selected
                                      ? 'rgba(244,208,63,0.25)'
                                      : 'rgba(212,175,55,0.1)',
                                    color: selected ? '#F4D03F' : '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    fontFamily: 'Orbitron',
                                  }}
                                >
                                  {String.fromCharCode(65 + j)}
                                </span>
                                <span style={{ flex: 1 }}>{op}</span>
                                {correcta && (
                                  <FontAwesomeIcon icon={faCheck} style={{ color: '#4ade80' }} />
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {cuestionarioCompleto &&
                          respuestasCuestionario[leccionActual * 10 + i] !== preg.correcta && (
                            <p
                              style={{
                                color: '#fca5a5',
                                fontSize: '0.85rem',
                                marginTop: 12,
                                padding: '0.5rem 0.75rem',
                                borderRadius: 8,
                                background: 'rgba(127,29,29,0.2)',
                                border: '1px solid rgba(248,113,113,0.3)',
                              }}
                            >
                              Respuesta correcta: <strong>{preg.opciones[preg.correcta]}</strong>
                            </p>
                          )}

                        {/* Navegación carrusel */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '1.25rem',
                            gap: 12,
                            flexWrap: 'wrap',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setPreguntaActual((p) => Math.max(0, p - 1))}
                            disabled={preguntaActual === 0}
                            className="puma-btn puma-btn--ghost"
                            style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} />
                            Anterior
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (preguntaActual < cuestionario.length - 1)
                                setPreguntaActual((p) => p + 1)
                            }}
                            disabled={
                              respuestasCuestionario[leccionActual * 10 + i] === undefined
                            }
                            className="puma-btn puma-btn--gold"
                            style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
                          >
                            {preguntaActual < cuestionario.length - 1 ? 'Siguiente' : 'Ver resultado'}
                            <FontAwesomeIcon icon={faChevronRight} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {cuestionarioCompleto && !cuestionarioCorrecto && (
                      <div className="puma-alert puma-alert--warn" style={{ marginTop: '1rem' }}>
                        <span>
                          Revisa las respuestas marcadas en rojo. Toca cualquier opción para
                          cambiarla.
                        </span>
                      </div>
                    )}
                    {cuestionarioCorrecto && (
                      <div className="puma-alert puma-alert--success" style={{ marginTop: '1rem' }}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 3 }} />
                        <span>
                          <strong>Todas correctas.</strong> Puedes marcar la lección como completada.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Botón de completar */}
                <div
                  style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCompletarLeccion}
                    disabled={yaCompletada || (cuestionario && !puedeCompletar)}
                    className={yaCompletada ? 'puma-btn puma-btn--ghost' : 'puma-btn puma-btn--gold'}
                    style={{ flex: '1 1 auto', minWidth: 200, justifyContent: 'center' }}
                  >
                    <FontAwesomeIcon icon={yaCompletada ? faCheckCircle : faCheck} />
                    {yaCompletada
                      ? 'Lección completada'
                      : cuestionario && !cuestionarioCompleto
                      ? 'Responde el cuestionario'
                      : cuestionario && !cuestionarioCorrecto
                      ? 'Revisa tus respuestas'
                      : 'Marcar como completada'}
                  </button>
                </div>

                {/* Bottom nav: lección anterior / siguiente */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginTop: '1.5rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(212,175,55,0.15)',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    onClick={irLeccionAnterior}
                    disabled={leccionActual === 0}
                    className="puma-btn puma-btn--ghost"
                    style={{
                      padding: '0.6rem 1rem',
                      fontSize: '0.88rem',
                      opacity: leccionActual === 0 ? 0.5 : 1,
                    }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={irSiguienteLeccion}
                    disabled={leccionActual === leccionesFlat.length - 1}
                    className="puma-btn puma-btn--gold"
                    style={{
                      padding: '0.6rem 1.25rem',
                      fontSize: '0.88rem',
                      opacity: leccionActual === leccionesFlat.length - 1 ? 0.5 : 1,
                    }}
                  >
                    Siguiente lección
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </>
            )}

            {/* ============================================================
                EXAMEN FINAL (cuando todas las lecciones están completas)
                ============================================================ */}
            {todasLeccionesCompletas && hayExamenFinal && (
              <div
                className="puma-card puma-fade-in-up"
                style={{
                  marginTop: '1.5rem',
                  padding: '1.5rem',
                  background:
                    'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(124,58,237,0.08))',
                  border: '1.5px solid rgba(212,175,55,0.4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: examenAprobado
                        ? 'linear-gradient(135deg, #4ade80, #16a34a)'
                        : 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: examenAprobado ? '#fff' : '#0a0a0a',
                      fontSize: '1.3rem',
                      flexShrink: 0,
                    }}
                  >
                    <FontAwesomeIcon icon={examenAprobado ? faCheckCircle : faAward} />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3
                      style={{
                        color: '#fff',
                        fontFamily: 'Orbitron',
                        fontSize: '1.05rem',
                        margin: '0 0 0.3rem',
                      }}
                    >
                      {examenAprobado ? '¡Examen aprobado!' : 'Examen final del curso'}
                    </h3>
                    <p
                      style={{
                        color: '#cbd5e1',
                        fontSize: '0.9rem',
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {examenAprobado
                        ? 'Ya demostraste comprensión global del curso. Puedes reclamar tu certificado NFT.'
                        : 'Pon a prueba lo que aprendiste con 10 preguntas que cruzan todo el curso. Necesitas 8 de 10 para aprobar; las opciones cambian de orden cada intento.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExamenAbierto(true)}
                    className={
                      examenAprobado ? 'puma-btn puma-btn--ghost' : 'puma-btn puma-btn--gold'
                    }
                    style={{ minWidth: 160, justifyContent: 'center' }}
                  >
                    <FontAwesomeIcon icon={examenAprobado ? faRedo : faGraduationCap} />
                    {examenAprobado ? 'Repetir examen' : 'Tomar examen'}
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================
                CTA DE CERTIFICADO (solo al completar)
                ============================================================ */}
            <CourseCertificateCTA
              cursoId={curso.id}
              cursoTitulo={curso.titulo}
              cohorteRef={curso.cohorteRef}
              badgeRef={badgeRef}
              progreso={progreso}
              totalLecciones={leccionesFlat.length}
              examenFinalAprobado={!hayExamenFinal || examenAprobado}
            />
          </div>

          {/* ============================================================
              SIDEBAR
              ============================================================ */}
          <aside
            className="curso-lecciones-sidebar puma-fade-in-up"
            style={{
              position: 'sticky',
              top: 90,
            }}
          >
            <div className="puma-card" style={{ padding: '1.1rem' }}>
              <h3
                style={{
                  color: '#D4AF37',
                  fontFamily: 'Orbitron',
                  fontSize: '0.95rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faBook} />
                {curso.capitulos ? 'Contenido' : 'Lecciones'}
              </h3>

              {curso.capitulos && curso.capitulos.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {curso.capitulos.map((cap: Capitulo) => (
                    <li key={cap.id} style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          color: '#94a3b8',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          marginBottom: 6,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}
                      >
                        {cap.titulo}
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {cap.secciones.map((sec, secIdx) => {
                          const flatIdx =
                            curso.capitulos!
                              .slice(0, curso.capitulos!.indexOf(cap))
                              .reduce((acc, c) => acc + c.secciones.length, 0) + secIdx
                          const active = flatIdx === leccionActual
                          const done = leccionesCompletadas.includes(flatIdx)
                          return (
                            <li key={sec.id} style={{ marginBottom: 4 }}>
                              <button
                                style={{
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '0.5rem 0.7rem',
                                  borderRadius: 10,
                                  border: `1px solid ${
                                    active ? '#F4D03F' : 'rgba(255,255,255,0.06)'
                                  }`,
                                  background: active
                                    ? 'rgba(212,175,55,0.16)'
                                    : 'rgba(255,255,255,0.02)',
                                  color: done ? '#86efac' : active ? '#fff' : '#cbd5e1',
                                  fontWeight: active ? 700 : 500,
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  fontFamily: 'inherit',
                                }}
                                onClick={() => setLeccionActual(flatIdx)}
                              >
                                <span
                                  style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: '50%',
                                    background: done
                                      ? '#4ade80'
                                      : active
                                      ? '#F4D03F'
                                      : 'rgba(212,175,55,0.15)',
                                    color: done || active ? '#0a0a0a' : '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    flexShrink: 0,
                                  }}
                                >
                                  {done ? <FontAwesomeIcon icon={faCheck} /> : secIdx + 1}
                                </span>
                                <span
                                  style={{
                                    flex: 1,
                                    minWidth: 0,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {sec.titulo}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(curso.lecciones || []).map((l: Leccion, idx: number) => {
                    const active = idx === leccionActual
                    const done = leccionesCompletadas.includes(idx)
                    return (
                      <li key={l.titulo || idx} style={{ marginBottom: 6 }}>
                        <button
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.6rem 0.8rem',
                            borderRadius: 10,
                            border: `1px solid ${
                              active ? '#F4D03F' : 'rgba(255,255,255,0.06)'
                            }`,
                            background: active
                              ? 'rgba(212,175,55,0.16)'
                              : 'rgba(255,255,255,0.02)',
                            color: done ? '#86efac' : active ? '#fff' : '#cbd5e1',
                            fontWeight: active ? 700 : 500,
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontFamily: 'inherit',
                          }}
                          onClick={() => setLeccionActual(idx)}
                        >
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: done
                                ? '#4ade80'
                                : active
                                ? '#F4D03F'
                                : 'rgba(212,175,55,0.15)',
                              color: done || active ? '#0a0a0a' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {done ? <FontAwesomeIcon icon={faCheck} /> : idx + 1}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              minWidth: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {l.titulo}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Sidebar footer: NFT badge mini */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem',
                  borderRadius: 12,
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px dashed rgba(212,175,55,0.3)',
                  textAlign: 'center',
                }}
              >
                <FontAwesomeIcon
                  icon={faAward}
                  style={{ color: '#F4D03F', fontSize: '1.4rem', marginBottom: '0.4rem' }}
                />
                <p style={{ color: '#cbd5e1', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
                  Al completar el curso desbloqueas tu <strong style={{ color: '#F4D03F' }}>credencial NFT</strong> soulbound.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* ============================================================
            INFO EXTRA
            ============================================================ */}
        <div
          className="puma-card puma-fade-in-up"
          style={{
            maxWidth: 1300,
            margin: '2rem auto 0',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Orbitron',
              color: '#D4AF37',
              fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
              margin: '0 0 0.85rem',
            }}
          >
            Sobre el curso
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1.25rem', lineHeight: 1.65 }}>
            {curso.descripcion}
          </p>
          <h3
            style={{
              color: '#fff',
              fontFamily: 'Orbitron',
              fontSize: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            Requisitos
          </h3>
          <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
            {curso.requisitos ?? 'No especificados.'}
          </p>
        </div>
      </div>
      {hayExamenFinal && (
        <ExamenFinal
          cursoTitulo={curso.titulo}
          preguntas={curso.examenFinal!}
          aprobacionMinima={8}
          open={examenAbierto}
          onClose={() => setExamenAbierto(false)}
          onAprobado={() => setExamenAprobado(true)}
        />
      )}
    </>
  )
}

export default RegistroCurso 
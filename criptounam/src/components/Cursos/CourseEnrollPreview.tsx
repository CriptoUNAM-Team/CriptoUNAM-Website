import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faClock,
  faSignal,
  faUsers,
  faStar,
  faBookOpen,
  faCheck,
  faCoins,
  faTimes,
  faArrowRight,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import type { Curso } from '../../constants/cursosData'
import { getLeccionesFlat } from '../../constants/cursosData'
import { obtenerPerfilUsuario } from '../../services/progresoCurso.service'
import CoursePumaPayment from './CoursePumaPayment'

type Props = {
  curso: Curso
  walletAddress?: string
  firmando: boolean
  errorInscripcion?: string | null
  /** Llamado cuando el usuario confirma (gratis: tras firma; pago: tras burn) */
  onConfirmar: (datos: { nombre: string; email: string }) => Promise<void> | void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CourseEnrollPreview: React.FC<Props> = ({
  curso,
  walletAddress,
  firmando,
  errorInscripcion,
  onConfirmar,
}) => {
  const navigate = useNavigate()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [cargandoPerfil, setCargandoPerfil] = useState(false)
  const [pagoListo, setPagoListo] = useState(false)

  const totalLecciones = getLeccionesFlat(curso).length
  const totalCapitulos = curso.capitulos?.length ?? 0
  const precioPuma = curso.precioPuma ?? 0
  const esPago = precioPuma > 0

  // Autofill desde el perfil del usuario (última inscripción con datos)
  useEffect(() => {
    if (!walletAddress) return
    let cancelled = false
    setCargandoPerfil(true)
    obtenerPerfilUsuario(walletAddress)
      .then((perfil) => {
        if (cancelled || !perfil) return
        if (!nombre && perfil.nombre) setNombre(perfil.nombre)
        if (!email && perfil.email) setEmail(perfil.email)
      })
      .finally(() => {
        if (!cancelled) setCargandoPerfil(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress])

  const nombreValido = nombre.trim().length >= 3
  const emailValido = EMAIL_RE.test(email.trim())
  const formularioValido = nombreValido && emailValido

  const handleAbrirModal = () => {
    setModalAbierto(true)
    setTouched(false)
  }

  const handleCerrarModal = () => {
    if (firmando) return
    setModalAbierto(false)
  }

  const handleConfirmarGratis = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!formularioValido) return
    await onConfirmar({ nombre: nombre.trim(), email: email.trim() })
  }

  // Para curso de pago: el form de datos se valida primero,
  // luego se muestra el botón de pago; tras burn se llama onConfirmar.
  const datosListos = formularioValido && pagoListo === false
  const handlePagoConfirmado = async () => {
    await onConfirmar({ nombre: nombre.trim(), email: email.trim() })
  }

  // Bullets de "qué incluye" derivados de la data
  const incluye: string[] = [
    `${totalLecciones} ${totalLecciones === 1 ? 'lección' : 'lecciones'} interactivas${
      totalCapitulos > 0 ? ` en ${totalCapitulos} capítulos` : ''
    }`,
    'Cuestionarios al final de cada lección',
    'Certificado NFT soulbound on-chain al completar',
    'Acceso de por vida — el curso vive en tu wallet',
  ]
  if (curso.examenFinal && curso.examenFinal.length > 0) {
    incluye.splice(2, 0, `Examen final de ${curso.examenFinal.length} preguntas`)
  }

  return (
    <>
      <div
        className="course-enroll-preview puma-fade-in-up"
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '0 1rem',
        }}
      >
        {/* HERO: imagen + overlay + título */}
        <div
          style={{
            position: 'relative',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            border: '1px solid rgba(212,175,55,0.25)',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              aspectRatio: '16 / 9',
              background: `linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%), url(${curso.imagen}) center/cover no-repeat`,
              minHeight: 240,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 12,
              }}
            >
              {(curso.categorias || []).slice(0, 4).map((cat) => (
                <span
                  key={cat}
                  className="puma-chip puma-chip--gold"
                  style={{ fontSize: '0.72rem' }}
                >
                  {cat}
                </span>
              ))}
              {esPago && (
                <span
                  className="puma-chip"
                  style={{
                    fontSize: '0.72rem',
                    background: 'linear-gradient(90deg, #F4D03F, #D4AF37)',
                    color: '#0a0a0a',
                    fontWeight: 700,
                  }}
                >
                  <FontAwesomeIcon icon={faCoins} /> {precioPuma.toLocaleString('en-US')} $PUMA
                </span>
              )}
            </div>
            <h1
              style={{
                color: '#fff',
                fontFamily: 'Chakra Petch',
                fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
                margin: 0,
                lineHeight: 1.15,
                textShadow: '0 4px 18px rgba(0,0,0,0.7)',
              }}
            >
              {curso.titulo}
            </h1>
          </div>
        </div>

        {/* STATS BAR */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 10,
            marginBottom: '1.25rem',
          }}
        >
          <StatCell icon={faSignal} label="Nivel" value={curso.nivel} />
          <StatCell icon={faClock} label="Duración" value={curso.duracion} />
          <StatCell
            icon={faBookOpen}
            label="Lecciones"
            value={String(totalLecciones)}
          />
          <StatCell
            icon={faStar}
            label="Rating"
            value={curso.rating ? curso.rating.toFixed(1) : '—'}
          />
          <StatCell
            icon={faUsers}
            label="Estudiantes"
            value={curso.estudiantes ? String(curso.estudiantes) : '—'}
          />
        </div>

        {/* CTA principal */}
        <div
          className="puma-card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.25rem',
            background:
              'linear-gradient(160deg, rgba(212,175,55,0.08), rgba(20,20,30,0.92))',
            border: '1.5px solid rgba(212,175,55,0.35)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #F4D03F, #D4AF37 70%, #8b6e1d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 26px rgba(212,175,55,0.4)',
            }}
          >
            <FontAwesomeIcon
              icon={faGraduationCap}
              style={{ color: '#0a0a0a', fontSize: '1.6rem' }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                color: '#cbd5e1',
                fontSize: '0.95rem',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {esPago
                ? `Paga ${precioPuma.toLocaleString('en-US')} $PUMA con tu wallet y empieza el curso.`
                : 'Inscríbete en menos de un minuto con tu correo. Es gratis y sin wallet.'}
            </p>
          </div>
          <button
            type="button"
            className="primary-button"
            style={{
              padding: '0.85rem 1.5rem',
              fontSize: '1rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
            onClick={handleAbrirModal}
          >
            Inscribirse <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="puma-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2
            style={{
              color: '#D4AF37',
              fontFamily: 'Chakra Petch',
              fontSize: '1.15rem',
              marginTop: 0,
              marginBottom: '0.85rem',
            }}
          >
            Sobre el curso
          </h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{curso.descripcion}</p>

          {curso.requisitos && (
            <>
              <h3
                style={{
                  color: '#fff',
                  fontFamily: 'Chakra Petch',
                  fontSize: '1rem',
                  marginTop: '1.25rem',
                  marginBottom: '0.5rem',
                }}
              >
                Requisitos
              </h3>
              <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{curso.requisitos}</p>
            </>
          )}
        </div>

        {/* QUE INCLUYE */}
        <div className="puma-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h2
            style={{
              color: '#D4AF37',
              fontFamily: 'Chakra Petch',
              fontSize: '1.15rem',
              marginTop: 0,
              marginBottom: '0.85rem',
            }}
          >
            Qué incluye
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {incluye.map((item) => (
              <li
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  color: '#E0E0E0',
                  lineHeight: 1.65,
                  marginBottom: 8,
                  fontSize: '0.95rem',
                }}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{ color: '#4ade80', marginTop: 4, flexShrink: 0 }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* PIE: link a cursos */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/cursos')}
          >
            ← Volver a todos los cursos
          </button>
        </div>
      </div>

      {/* MODAL DE INSCRIPCIÓN */}
      {modalAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Inscríbete al curso"
          onClick={handleCerrarModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(160deg, #1a1a25 0%, #0d0d15 100%)',
              borderRadius: 20,
              border: '1.5px solid rgba(212,175,55,0.35)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(244,208,63,0.1)',
              maxWidth: 480,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 'clamp(1.5rem, 4vw, 2rem)',
              position: 'relative',
              animation: 'modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={handleCerrarModal}
              disabled={firmando}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: '#cbd5e1',
                width: 36,
                height: 36,
                borderRadius: '50%',
                cursor: firmando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                opacity: firmando ? 0.4 : 1,
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #F4D03F, #D4AF37 70%, #8b6e1d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <FontAwesomeIcon
                icon={faGraduationCap}
                style={{ color: '#0a0a0a', fontSize: '1.5rem' }}
              />
            </div>

            <h2
              style={{
                color: '#fff',
                fontFamily: 'Chakra Petch',
                fontSize: '1.25rem',
                marginTop: 0,
                marginBottom: '0.4rem',
              }}
            >
              Inscríbete a {curso.titulo}
            </h2>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                marginTop: 0,
                marginBottom: '1.5rem',
                lineHeight: 1.55,
              }}
            >
              Solo necesitamos tu nombre y correo para emitir tu certificado al completar el
              curso.
            </p>

            <form onSubmit={esPago ? (e) => e.preventDefault() : handleConfirmarGratis}>
              <label style={{ display: 'block', marginBottom: 14 }}>
                <span
                  style={{
                    color: '#E0E0E0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Nombre completo
                </span>
                <input
                  type="text"
                  autoFocus
                  required
                  minLength={3}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Ej. María González"
                  disabled={firmando}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: `1.5px solid ${
                      touched && !nombreValido
                        ? 'rgba(248,113,113,0.6)'
                        : 'rgba(212,175,55,0.25)'
                    }`,
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </label>

              <label style={{ display: 'block', marginBottom: 18 }}>
                <span
                  style={{
                    color: '#E0E0E0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: 6,
                  }}
                >
                  Correo electrónico
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="tu@correo.com"
                  disabled={firmando}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    background: 'rgba(0,0,0,0.4)',
                    border: `1.5px solid ${
                      touched && !emailValido
                        ? 'rgba(248,113,113,0.6)'
                        : 'rgba(212,175,55,0.25)'
                    }`,
                    borderRadius: 10,
                    color: '#fff',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
              </label>

              {cargandoPerfil && (
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: -8 }}>
                  Buscando tus datos previos…
                </p>
              )}

              {errorInscripcion && (
                <div
                  style={{
                    padding: '0.7rem 0.85rem',
                    borderRadius: 10,
                    background: 'rgba(127,29,29,0.25)',
                    border: '1px solid rgba(248,113,113,0.4)',
                    color: '#fecaca',
                    fontSize: '0.88rem',
                    marginBottom: 14,
                  }}
                >
                  {errorInscripcion}
                </div>
              )}

              {/* CTA: gratis vs pago */}
              {esPago ? (
                <>
                  {!datosListos ? (
                    <button
                      type="button"
                      className="primary-button"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        setTouched(true)
                        if (formularioValido) setPagoListo(true)
                      }}
                      disabled={firmando}
                    >
                      Continuar al pago <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  ) : (
                    <CoursePumaPayment
                      cursoId={curso.id}
                      cursoTitulo={curso.titulo}
                      precioPuma={precioPuma}
                      isBusy={firmando}
                      onPaid={handlePagoConfirmado}
                    />
                  )}
                </>
              ) : (
                <button
                  type="submit"
                  className="primary-button"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                  disabled={firmando}
                >
                  {firmando ? (
                    'Inscribiendo…'
                  ) : (
                    <>
                      Inscribirme gratis <FontAwesomeIcon icon={faArrowRight} />
                    </>
                  )}
                </button>
              )}

              <p
                style={{
                  color: '#777',
                  fontSize: '0.75rem',
                  marginTop: 14,
                  marginBottom: 0,
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                <FontAwesomeIcon icon={faShieldHalved} style={{ marginRight: 6 }} />
                Sin firma ni wallet. Solo usamos tu nombre y correo para emitir tu certificado y
                recordar tus próximas inscripciones.
              </p>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  )
}

const StatCell: React.FC<{
  icon: typeof faSignal
  label: string
  value: string
}> = ({ icon, label, value }) => (
  <div
    style={{
      padding: '0.85rem 0.9rem',
      borderRadius: 12,
      background: 'rgba(20,20,30,0.65)',
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 4,
    }}
  >
    <FontAwesomeIcon
      icon={icon}
      style={{ color: '#F4D03F', fontSize: '1rem', marginBottom: 2 }}
    />
    <span
      style={{
        color: '#94a3b8',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
    <span
      style={{
        color: '#fff',
        fontSize: '0.95rem',
        fontWeight: 700,
        fontFamily: 'Chakra Petch',
      }}
    >
      {value}
    </span>
  </div>
)

export default CourseEnrollPreview

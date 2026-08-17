import React, { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimes,
  faTrophy,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faRedo,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons'
import type { PreguntaCuestionario } from '../../constants/cursosData'
import { shuffleCuestionario, nuevaSemilla } from '../../utils/quizShuffle'

interface ExamenFinalProps {
  cursoTitulo: string
  preguntas: PreguntaCuestionario[]
  /** Mínimo de aciertos para aprobar. Default: 8/10. */
  aprobacionMinima?: number
  open: boolean
  onClose: () => void
  /** Se invoca cuando el alumno aprueba (al menos 1 vez). */
  onAprobado?: (aciertos: number, total: number) => void
}

const ExamenFinal: React.FC<ExamenFinalProps> = ({
  cursoTitulo,
  preguntas,
  aprobacionMinima = 8,
  open,
  onClose,
  onAprobado,
}) => {
  const [semilla, setSemilla] = useState<number>(() => nuevaSemilla())
  const [respuestas, setRespuestas] = useState<Record<number, number>>({})
  const [preguntaActual, setPreguntaActual] = useState(0)
  const [enviado, setEnviado] = useState(false)

  const preguntasShuffled = useMemo(
    () => shuffleCuestionario(preguntas, semilla),
    [preguntas, semilla],
  )

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const reiniciar = () => {
    setSemilla(nuevaSemilla())
    setRespuestas({})
    setPreguntaActual(0)
    setEnviado(false)
  }

  if (!open) return null

  const total = preguntasShuffled.length
  const respondidas = Object.keys(respuestas).length
  const todasRespondidas = respondidas === total
  const aciertos = preguntasShuffled.reduce(
    (acc, p, i) => acc + (respuestas[i] === p.correcta ? 1 : 0),
    0,
  )
  const aprobado = aciertos >= aprobacionMinima
  const current = preguntasShuffled[preguntaActual]

  const handleEnviar = () => {
    setEnviado(true)
    if (aciertos >= aprobacionMinima) {
      onAprobado?.(aciertos, total)
    }
  }

  const handleCerrarYReiniciar = () => {
    onClose()
    setTimeout(() => {
      if (!aprobado) reiniciar()
    }, 250)
  }

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="examen-final-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="puma-fade-in-up"
        style={{
          background:
            'linear-gradient(160deg, rgba(26,26,26,0.98), rgba(14,14,18,0.98))',
          border: '1.5px solid rgba(212,175,55,0.4)',
          borderRadius: 24,
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 'clamp(1.25rem, 4vw, 2rem)',
          position: 'relative',
          boxShadow:
            '0 24px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.15) inset',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar examen"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: 10,
            border: '1px solid rgba(212,175,55,0.3)',
            background: 'rgba(0,0,0,0.4)',
            color: '#F4D03F',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0a0a',
              fontSize: '1.3rem',
              flexShrink: 0,
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
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
              Examen final
            </p>
            <h2
              id="examen-final-title"
              style={{
                fontFamily: 'Chakra Petch',
                color: '#fff',
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                margin: '0.15rem 0 0',
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cursoTitulo}
            </h2>
          </div>
        </div>

        {!enviado ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {preguntasShuffled.map((_, i) => {
                const respondida = respuestas[i] !== undefined
                const activa = i === preguntaActual
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ir a pregunta ${i + 1}`}
                    onClick={() => setPreguntaActual(i)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: `1px solid ${
                        activa
                          ? '#F4D03F'
                          : respondida
                          ? 'rgba(74,222,128,0.4)'
                          : 'rgba(255,255,255,0.12)'
                      }`,
                      background: activa
                        ? 'rgba(212,175,55,0.2)'
                        : respondida
                        ? 'rgba(34,197,94,0.1)'
                        : 'transparent',
                      color: activa ? '#F4D03F' : respondida ? '#86efac' : '#94a3b8',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    {i + 1}
                  </button>
                )
              })}
              <span
                style={{
                  marginLeft: 'auto',
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              >
                {respondidas} / {total}
              </span>
            </div>

            <p
              style={{
                color: '#fff',
                fontSize: '1.05rem',
                fontWeight: 600,
                margin: '0 0 1rem',
                lineHeight: 1.5,
              }}
            >
              {preguntaActual + 1}. {current.pregunta}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {current.opciones.map((op, j) => {
                const selected = respuestas[preguntaActual] === j
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() =>
                      setRespuestas((prev) => ({
                        ...prev,
                        [preguntaActual]: j,
                      }))
                    }
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 0.95rem',
                      borderRadius: 12,
                      border: `1.5px solid ${
                        selected ? '#F4D03F' : 'rgba(255,255,255,0.1)'
                      }`,
                      background: selected
                        ? 'rgba(212,175,55,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      color: '#E0E0E0',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        marginRight: 10,
                        background: selected ? '#F4D03F' : 'rgba(255,255,255,0.08)',
                        color: selected ? '#0a0a0a' : '#94a3b8',
                        textAlign: 'center',
                        lineHeight: '22px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      {String.fromCharCode(65 + j)}
                    </span>
                    {op}
                  </button>
                )
              })}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 10,
                marginTop: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setPreguntaActual((p) => Math.max(0, p - 1))
                }
                disabled={preguntaActual === 0}
                className="puma-btn puma-btn--ghost"
                style={{
                  opacity: preguntaActual === 0 ? 0.5 : 1,
                  minWidth: 110,
                }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                Anterior
              </button>

              {preguntaActual < total - 1 ? (
                <button
                  type="button"
                  onClick={() => setPreguntaActual((p) => p + 1)}
                  className="puma-btn puma-btn--gold"
                  style={{ minWidth: 130 }}
                >
                  Siguiente
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnviar}
                  disabled={!todasRespondidas}
                  className="puma-btn puma-btn--gold"
                  style={{
                    minWidth: 150,
                    opacity: todasRespondidas ? 1 : 0.55,
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Calificar examen
                </button>
              )}
            </div>

            {!todasRespondidas && preguntaActual === total - 1 && (
              <p
                style={{
                  color: '#f59e0b',
                  fontSize: '0.85rem',
                  marginTop: '0.75rem',
                  textAlign: 'center',
                }}
              >
                Te faltan {total - respondidas} pregunta
                {total - respondidas === 1 ? '' : 's'} por contestar.
              </p>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                margin: '0 auto 1rem',
                background: aprobado
                  ? 'linear-gradient(135deg, #4ade80, #16a34a)'
                  : 'linear-gradient(135deg, #f87171, #b91c1c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '2.4rem',
                boxShadow: aprobado
                  ? '0 12px 36px rgba(74,222,128,0.4)'
                  : '0 12px 36px rgba(248,113,113,0.35)',
              }}
            >
              <FontAwesomeIcon icon={aprobado ? faTrophy : faRedo} />
            </div>
            <h3
              style={{
                color: aprobado ? '#86efac' : '#fca5a5',
                fontFamily: 'Chakra Petch',
                fontSize: '1.4rem',
                margin: '0 0 0.5rem',
              }}
            >
              {aprobado ? '¡Aprobado!' : 'Casi… inténtalo de nuevo'}
            </h3>
            <p
              style={{
                color: '#fff',
                fontSize: '1.15rem',
                fontWeight: 700,
                margin: '0 0 0.85rem',
                fontFamily: 'monospace',
              }}
            >
              {aciertos} / {total} aciertos
            </p>
            <p
              style={{
                color: '#cbd5e1',
                fontSize: '0.95rem',
                margin: '0 0 1.5rem',
                lineHeight: 1.6,
              }}
            >
              {aprobado
                ? `Demostraste comprensión del curso. Mínimo era ${aprobacionMinima}/${total}.`
                : `Necesitas al menos ${aprobacionMinima}/${total}. Las preguntas se vuelven a barajear al reintentar.`}
            </p>

            {!aprobado && (
              <div
                style={{
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.25)',
                  borderRadius: 14,
                  padding: '1rem',
                  textAlign: 'left',
                  marginBottom: '1.25rem',
                  maxHeight: 240,
                  overflow: 'auto',
                }}
              >
                <p
                  style={{
                    color: '#fca5a5',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    margin: '0 0 0.6rem',
                  }}
                >
                  Repasa estas preguntas:
                </p>
                {preguntasShuffled.map((p, i) => {
                  const ok = respuestas[i] === p.correcta
                  if (ok) return null
                  return (
                    <div
                      key={i}
                      style={{
                        marginBottom: '0.7rem',
                        paddingBottom: '0.7rem',
                        borderBottom: '1px dashed rgba(248,113,113,0.2)',
                      }}
                    >
                      <p
                        style={{
                          color: '#fde68a',
                          fontSize: '0.85rem',
                          margin: '0 0 0.25rem',
                          fontWeight: 600,
                        }}
                      >
                        {i + 1}. {p.pregunta}
                      </p>
                      <p
                        style={{
                          color: '#86efac',
                          fontSize: '0.85rem',
                          margin: 0,
                        }}
                      >
                        Respuesta: {p.opciones[p.correcta]}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={reiniciar}
                className="puma-btn puma-btn--ghost"
                style={{ minWidth: 140 }}
              >
                <FontAwesomeIcon icon={faRedo} />
                Reintentar
              </button>
              <button
                type="button"
                onClick={handleCerrarYReiniciar}
                className="puma-btn puma-btn--gold"
                style={{ minWidth: 140 }}
              >
                <FontAwesomeIcon icon={faCheck} />
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExamenFinal

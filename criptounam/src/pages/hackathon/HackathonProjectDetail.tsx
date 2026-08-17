import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import HackathonLayout from './HackathonLayout'
import { Card, GOLD, Chip, Spinner, Banner, Button } from '../../components/hackathon/ui'
import { hackathonApi, Project } from '../../services/hackathon.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
} from '@fortawesome/free-brands-svg-icons'
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faVideo,
  faFileLines,
  faRocket,
  faLayerGroup,
  faUsers,
  faCircleCheck,
  faClock,
} from '@fortawesome/free-solid-svg-icons'

const HackathonProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    hackathonApi
      .gallery()
      .then((res) => {
        const found = res.projects.find((p) => p.id === id)
        if (found) {
          setProject(found)
        } else {
          setError('Proyecto no encontrado')
        }
      })
      .catch(() => {
        setError('No se pudo cargar la información del proyecto')
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <HackathonLayout wide>
      <div style={{ marginBottom: 24 }}>
        <Link
          to="/hackathon/proyectos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'color 0.2s',
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al listado de BUIDLs
        </Link>
      </div>

      {loading ? (
        <Spinner label="Cargando detalles del proyecto…" />
      ) : error || !project ? (
        <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: '3rem', color: '#ef4444', marginBottom: 16 }} />
          <h2 style={{ color: '#fff', margin: '0 0 12px' }}>{error || 'Proyecto no encontrado'}</h2>
          <p style={{ color: '#94a3b8', margin: '0 0 24px' }}>Es posible que el proyecto haya sido retirado o el enlace sea incorrecto.</p>
          <Link to="/hackathon/proyectos" style={{ background: GOLD, color: '#000', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
            Ver todos los proyectos
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Cover Header Banner */}
          <Card
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: project.cover_url ? 0 : '3rem 2.5rem',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
              background: 'linear-gradient(135deg, rgba(20, 20, 35, 0.95), rgba(15, 23, 42, 0.98))',
            }}
          >
            {project.cover_url && (
              <div style={{ width: '100%', height: 340, position: 'relative' }}>
                <img
                  src={project.cover_url}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.96) 0%, rgba(15, 23, 42, 0.4) 50%, rgba(15, 23, 42, 0.1) 100%)',
                  }}
                />
              </div>
            )}

            <div
              style={{
                padding: project.cover_url ? '0 2.5rem 2.5rem 2.5rem' : 0,
                marginTop: project.cover_url ? '-80px' : 0,
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                {project.logo_url ? (
                  <img
                    src={project.logo_url}
                    alt="Logo"
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 18,
                      objectFit: 'contain',
                      background: 'rgba(20, 20, 30, 0.95)',
                      border: '2px solid rgba(212, 175, 55, 0.6)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                      padding: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 18,
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '2px solid rgba(212, 175, 55, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: GOLD,
                      fontSize: '2.5rem',
                    }}
                  >
                    <FontAwesomeIcon icon={faRocket} />
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <h1 style={{ color: '#fff', margin: 0, fontSize: '2.2rem', fontFamily: 'Chakra Petch', fontWeight: 800 }}>
                      {project.title}
                    </h1>
                    {project.status === 'submitted' ? (
                      <Chip tone="gold">
                        <FontAwesomeIcon icon={faCircleCheck} style={{ marginRight: 6 }} /> BUIDL Enviado
                      </Chip>
                    ) : (
                      <Chip tone="blue">
                        <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} /> En Desarrollo
                      </Chip>
                    )}
                  </div>
                  {project.tagline && (
                    <p style={{ color: GOLD, fontSize: '1.1rem', margin: 0, fontWeight: 600, maxWidth: 700 }}>
                      {project.tagline}
                    </p>
                  )}
                </div>
              </div>

              {project.track && (
                <div style={{ background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '10px 18px', borderRadius: 14 }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Track de Competencia
                  </span>
                  <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.05rem' }}>{project.track.name}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Main Grid Content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Left Column: Description & Tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card>
                <h3 style={{ color: GOLD, fontSize: '1.3rem', margin: '0 0 16px', fontFamily: 'Chakra Petch', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FontAwesomeIcon icon={faFileLines} /> Descripción del BUIDL
                </h3>
                <div style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {project.description || 'Este proyecto aún no ha agregado una descripción detallada.'}
                </div>
              </Card>

              {project.tags && project.tags.length > 0 && (
                <Card>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 14px' }}>Tecnologías & Etiquetas</h4>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {project.tags.map((t) => (
                      <Chip key={t} tone="blue">
                        #{t}
                      </Chip>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: Links & Team Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card style={{ border: '1.5px solid rgba(212, 175, 55, 0.3)' }}>
                <h3 style={{ color: GOLD, fontSize: '1.25rem', margin: '0 0 18px', fontFamily: 'Chakra Petch' }}>
                  Enláces y Recursos
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {project.repo_url ? (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '14px 18px',
                        borderRadius: 12,
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FontAwesomeIcon icon={faGithub} style={{ fontSize: '1.3rem' }} /> Repositorio GitHub
                      </span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.9rem', color: GOLD }} />
                    </a>
                  ) : (
                    <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '8px 0' }}>No hay enlace de repositorio público disponible</div>
                  )}

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        padding: '14px 18px',
                        borderRadius: 12,
                        color: GOLD,
                        textDecoration: 'none',
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FontAwesomeIcon icon={faRocket} /> Demo en Vivo
                      </span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.9rem' }} />
                    </a>
                  )}

                  {project.video_url && (
                    <a
                      href={project.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '14px 18px',
                        borderRadius: 12,
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FontAwesomeIcon icon={faVideo} /> Pitch Video
                      </span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.9rem', color: GOLD }} />
                    </a>
                  )}

                  {project.slides_url && (
                    <a
                      href={project.slides_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '14px 18px',
                        borderRadius: 12,
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FontAwesomeIcon icon={faFileLines} /> Presentación / Slides
                      </span>
                      <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ fontSize: '0.9rem', color: GOLD }} />
                    </a>
                  )}
                </div>
              </Card>

              {project.team ? (
                <Card>
                  <h3 style={{ color: GOLD, fontSize: '1.2rem', margin: '0 0 14px', fontFamily: 'Chakra Petch', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faUsers} /> Equipo Creador
                  </h3>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: 16, borderRadius: 12 }}>
                    <h4 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.15rem' }}>{project.team.name}</h4>
                    {(project.team as any).looking_for_members && (
                      <p style={{ color: GOLD, fontSize: '0.85rem', margin: '0 0 12px' }}>✨ Buscando nuevos integrantes para colaborar</p>
                    )}
                    <Link
                      to="/hackathon/equipos"
                      style={{
                        display: 'inline-block',
                        color: '#cbd5e1',
                        fontSize: '0.88rem',
                        textDecoration: 'underline',
                      }}
                    >
                      Ver todos los equipos y postular →
                    </Link>
                  </div>
                </Card>
              ) : (
                <Card>
                  <h3 style={{ color: GOLD, fontSize: '1.2rem', margin: '0 0 14px', fontFamily: 'Chakra Petch' }}>
                    Registrado por
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0 }}>Hacker Independiente / Equipo en conformación</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonProjectDetail

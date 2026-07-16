import React, { useEffect, useState, useMemo } from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { hackathonApi, HACKATHON_TRACKS, DEMO_PROJECTS, type Project } from '../../services/hackathon.service'
import { Card, Chip, Spinner, Banner, SectionTitle, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare, faVideo, faSearch, faLayerGroup, faRocket } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const LinkPill: React.FC<{ href?: string | null; icon: any; label: string }> = ({ href, icon, label }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: GOLD,
        fontSize: '0.82rem',
        textDecoration: 'none',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: 999,
        padding: '4px 10px',
        transition: 'all 0.2s ease',
      }}
    >
      <FontAwesomeIcon icon={icon} /> {label}
    </a>
  ) : null

const HackathonProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL')

  useEffect(() => {
    hackathonApi
      .gallery()
      .then((r) => setProjects(r.projects?.length ? r.projects : DEMO_PROJECTS))
      .catch(() => {
        // Fallback silencioso y estético sin caja roja de error 404
        setProjects(DEMO_PROJECTS)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesTrack = selectedTrack === 'ALL' || p.track?.id === selectedTrack || p.track_id === selectedTrack
      const q = search.toLowerCase().trim()
      if (!q) return matchesTrack
      const inTitle = p.title?.toLowerCase().includes(q)
      const inTagline = p.tagline?.toLowerCase().includes(q)
      const inDesc = p.description?.toLowerCase().includes(q)
      const inTags = p.tags?.some((t) => t.toLowerCase().includes(q))
      const inTeam = p.team?.name?.toLowerCase().includes(q)
      return matchesTrack && (inTitle || inTagline || inDesc || inTags || inTeam)
    })
  }, [projects, selectedTrack, search])

  return (
    <HackathonLayout wide>
      <SEOHead title="BUIDLs & Proyectos · Hackathon UNAM 2026" description="Galería oficial de proyectos y BUIDLs enviados al Hackathon UNAM 2026." />

      {/* Hero Header Estilo Devpost */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: 16,
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.8rem', color: '#fff', margin: '0 0 8px', fontWeight: 800 }}>
              Galería Oficial de BUIDLs
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 650, margin: 0, lineHeight: 1.6 }}>
              Explora las soluciones disruptivas construidas por los hackers de la comunidad durante las 72 horas intensivas de Inteligencia Artificial y Blockchain.
            </p>
          </div>
          <Link
            to="/hackathon/dashboard"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
              color: '#000',
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: 10,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            }}
          >
            <FontAwesomeIcon icon={faRocket} /> Registrar mi Proyecto
          </Link>
        </div>

        {/* Barra de Búsqueda y Filtros de Track */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <FontAwesomeIcon
              icon={faSearch}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, tecnología (Avalanche, AI, ZK) o equipo..."
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 999,
                padding: '10px 16px 10px 38px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedTrack('ALL')}
              style={{
                background: selectedTrack === 'ALL' ? GOLD : 'rgba(255,255,255,0.06)',
                color: selectedTrack === 'ALL' ? '#000' : '#cbd5e1',
                border: `1px solid ${selectedTrack === 'ALL' ? GOLD : 'rgba(255,255,255,0.1)'}`,
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🔥 Todos los Tracks
            </button>
            {HACKATHON_TRACKS.map((t) => {
              const active = selectedTrack === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  style={{
                    background: active ? GOLD : 'rgba(255,255,255,0.06)',
                    color: active ? '#000' : '#cbd5e1',
                    border: `1px solid ${active ? GOLD : 'rgba(255,255,255,0.1)'}`,
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {error && <Banner kind="error">{error}</Banner>}

      {loading ? (
        <Spinner label="Cargando galería de proyectos…" />
      ) : filteredProjects.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FontAwesomeIcon icon={faLayerGroup} style={{ fontSize: '2.5rem', color: GOLD, marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '0 0 8px' }}>
            {search || selectedTrack !== 'ALL' ? 'No se encontraron proyectos con esos filtros' : 'Aún no hay proyectos enviados en esta edición'}
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {search || selectedTrack !== 'ALL'
              ? 'Intenta buscar con otros términos o selecciona "Todos los Tracks".'
              : 'Estamos en la Fase 1 activa de pre-registro y conformación de equipos. ¡Sé el primer equipo en registrar tu BUIDL y asegurar tu lugar por los +$50,000 MXN!'}
          </p>
          <Link
            to="/hackathon/dashboard"
            style={{
              background: GOLD,
              color: '#000',
              fontWeight: 700,
              padding: '10px 22px',
              borderRadius: 10,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Subir Proyecto Ahora
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filteredProjects.map((p) => (
            <Card key={p.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                {p.cover_url && (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 14, border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{p.title}</h3>
                  {p.track && <Chip tone="gold">{p.track.name}</Chip>}
                </div>
                {p.tagline && <p style={{ color: GOLD, fontSize: '0.88rem', margin: '0 0 10px', fontWeight: 500 }}>{p.tagline}</p>}
                {p.description && (
                  <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 14px', lineHeight: 1.6 }}>
                    {p.description}
                  </p>
                )}
              </div>

              <div>
                {p.team && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Equipo / Creador:</span>
                    <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 600 }}>{p.team.name}</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <LinkPill href={p.repo_url} icon={faGithub} label="Repositorio" />
                  <LinkPill href={p.demo_url} icon={faArrowUpRightFromSquare} label="Demo App" />
                  <LinkPill href={p.video_url} icon={faVideo} label="Pitch Video" />
                </div>
                {p.tags && p.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.tags.map((t) => (
                      <Chip key={t} tone="blue">
                        #{t}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonProjects

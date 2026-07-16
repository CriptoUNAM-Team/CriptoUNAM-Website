import React, { useEffect, useState } from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { hackathonApi, type Project } from '../../services/hackathon.service'
import { Card, Chip, Spinner, Banner, SectionTitle, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowUpRightFromSquare, faVideo } from '@fortawesome/free-solid-svg-icons'

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
      }}
    >
      <FontAwesomeIcon icon={icon} /> {label}
    </a>
  ) : null

const HackathonProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    hackathonApi
      .gallery()
      .then((r) => setProjects(r.projects))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <HackathonLayout wide>
      <SEOHead title="Proyectos · Hackathon UNAM" description="Proyectos enviados al Hackathon UNAM 2026." />
      <SectionTitle sub="Los proyectos enviados por los equipos participantes.">Proyectos</SectionTitle>

      {error && <Banner kind="error">{error}</Banner>}

      {loading ? (
        <Spinner label="Cargando proyectos…" />
      ) : projects.length === 0 ? (
        <Card>
          <p style={{ color: '#94a3b8', margin: 0, textAlign: 'center' }}>
            Todavía no hay proyectos enviados. ¡Vuelve pronto!
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {projects.map((p) => (
            <Card key={p.id}>
              {p.cover_url && (
                <img
                  src={p.cover_url}
                  alt={p.title}
                  style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }}
                />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.15rem' }}>{p.title}</h3>
                {p.track && <Chip>{p.track.name}</Chip>}
              </div>
              {p.tagline && <p style={{ color: GOLD, fontSize: '0.9rem', margin: '0 0 8px' }}>{p.tagline}</p>}
              {p.description && (
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 10px', lineHeight: 1.5 }}>
                  {p.description}
                </p>
              )}
              {p.team && <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 10px' }}>Por {p.team.name}</p>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <LinkPill href={p.repo_url} icon={faGithub} label="Código" />
                <LinkPill href={p.demo_url} icon={faArrowUpRightFromSquare} label="Demo" />
                <LinkPill href={p.video_url} icon={faVideo} label="Video" />
              </div>
              {p.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {p.tags.map((t) => (
                    <Chip key={t} tone="blue">
                      {t}
                    </Chip>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonProjects

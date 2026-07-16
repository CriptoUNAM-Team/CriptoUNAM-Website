import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../../context/WalletContext'
import { hackathonApi, HACKATHON_INFO, type Participant, type Team, type Project } from '../../services/hackathon.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLaptopCode,
  faUsers,
  faDiagramProject,
  faArrowRight,
  faTrophy,
  faCircleCheck,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const GOLD = '#D4AF37'

/**
 * Panel de hackathon para el Perfil (estilo DoraHacks): permite aplicar al
 * hackathon y muestra el estado del usuario — inscripción, equipo y proyectos
 * subidos. Se auto-oculta el detalle cuando no hay sesión (muestra CTA).
 */
const PerfilHackathonPanel: React.FC = () => {
  const { ready, isConnected } = useWallet()
  const [loading, setLoading] = useState(true)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!ready) return
    if (!isConnected) {
      setLoading(false)
      return
    }
    let alive = true
    ;(async () => {
      try {
        const { participant } = await hackathonApi.getMe()
        if (!alive) return
        setParticipant(participant)
        if (participant) {
          const [t, p] = await Promise.all([hackathonApi.myTeams(), hackathonApi.myProject()])
          if (!alive) return
          setTeams(t.teams)
          setProject(p.project)
        }
      } catch {
        /* silencioso: el perfil no debe romperse por el hackathon */
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [ready, isConnected])

  const wrap: React.CSSProperties = {
    background: 'linear-gradient(160deg, rgba(212,175,55,0.08), rgba(59,130,246,0.05))',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: 18,
    padding: '1.5rem',
    marginBottom: '1.5rem',
  }

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.1rem' }}>
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesomeIcon icon={faLaptopCode} style={{ color: '#0a0a0a', fontSize: '1.2rem' }} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, color: '#fff', fontFamily: 'Orbitron', fontSize: '1.15rem' }}>{HACKATHON_INFO.name}</h3>
        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>21–24 septiembre 2026 · {HACKATHON_INFO.event}</span>
      </div>
    </div>
  )

  const pill = (icon: any, text: string, color = GOLD) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.8rem',
        color,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}33`,
        borderRadius: 999,
        padding: '4px 10px',
      }}
    >
      <FontAwesomeIcon icon={icon} /> {text}
    </span>
  )

  // Sin sesión o no inscrito → CTA para aplicar.
  if (!ready || loading) {
    return (
      <div style={wrap}>
        {header}
        <p style={{ color: '#94a3b8', margin: 0 }}>Cargando…</p>
      </div>
    )
  }

  if (!isConnected || !participant) {
    return (
      <div style={wrap}>
        {header}
        <p style={{ color: '#cbd5e1', margin: '0 0 1rem', lineHeight: 1.55 }}>
          Aplica al hackathon: inscríbete, arma tu equipo y sube tu proyecto para competir por los premios.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            to="/hackathon"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
              color: '#0a0a0a',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.6rem 1.2rem',
              borderRadius: 10,
              textDecoration: 'none',
            }}
          >
            <FontAwesomeIcon icon={faTrophy} />
            Aplicar al hackathon
          </Link>
          <Link
            to="/hackathon/proyectos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: GOLD,
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.6rem 1.2rem',
              borderRadius: 10,
              textDecoration: 'none',
              border: `1px solid ${GOLD}`,
            }}
          >
            Ver proyectos
          </Link>
        </div>
      </div>
    )
  }

  // Inscrito → estado + proyectos subidos.
  return (
    <div style={wrap}>
      {header}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {pill(faCircleCheck, 'Inscrito', '#34d399')}
        {teams.length > 0
          ? pill(faUsers, teams[0].name)
          : pill(faUsers, 'Sin equipo', '#94a3b8')}
        {project && pill(faDiagramProject, project.status === 'submitted' ? 'Proyecto enviado' : 'Proyecto en borrador')}
      </div>

      {/* Proyecto subido (tipo DoraHacks) */}
      {project ? (
        <div
          style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem' }}>{project.title}</h4>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: project.status === 'submitted' ? '#34d399' : GOLD,
              }}
            >
              {project.status === 'submitted' ? 'ENVIADO' : 'BORRADOR'}
            </span>
          </div>
          {project.tagline && <p style={{ color: GOLD, fontSize: '0.85rem', margin: '4px 0 6px' }}>{project.tagline}</p>}
          {project.description && (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 8px', lineHeight: 1.5 }}>
              {project.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: '0.8rem' }}>
                <FontAwesomeIcon icon={faGithub} /> Código
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: '0.8rem' }}>
                <FontAwesomeIcon icon={faUpRightFromSquare} /> Demo
              </a>
            )}
          </div>
        </div>
      ) : (
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1rem' }}>
          Aún no has subido un proyecto. {teams.length === 0 ? 'Primero únete o crea un equipo.' : '¡Sube el tuyo!'}
        </p>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link
          to="/hackathon/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
            color: '#0a0a0a',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.6rem 1.2rem',
            borderRadius: 10,
            textDecoration: 'none',
          }}
        >
          Ir a mi panel <FontAwesomeIcon icon={faArrowRight} />
        </Link>
        {teams.length === 0 && (
          <Link
            to="/hackathon/equipos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: GOLD,
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.6rem 1.2rem',
              borderRadius: 10,
              textDecoration: 'none',
              border: `1px solid ${GOLD}`,
            }}
          >
            <FontAwesomeIcon icon={faUsers} /> Buscar equipo
          </Link>
        )}
      </div>
    </div>
  )
}

export default PerfilHackathonPanel

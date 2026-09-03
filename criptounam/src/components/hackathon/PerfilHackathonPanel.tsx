import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../../context/WalletContext'
import { hackathonApi, HACKATHON_INFO, type Participant, type Team, type Project } from '../../services/hackathon.service'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLaptopCode,
  faUsers,
  faArrowRight,
  faTrophy,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import HackerCredential from './HackerCredential'

const GOLD = '#E9AF3C'

/**
 * Panel de hackathon para el Perfil: credencial + estado de BUIDL.
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
    marginBottom: '1.5rem',
  }

  if (!ready || loading) {
    return (
      <div style={wrap}>
        <p style={{ color: 'var(--goya-muted)', margin: 0 }}>Cargando credencial…</p>
      </div>
    )
  }

  if (!isConnected || !participant) {
    return (
      <div
        className="goya-cut"
        style={{
          ['--cut' as string]: '14px',
          background: '#fff',
          color: '#0b1220',
          border: '1px solid rgba(233,175,60,0.55)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <p className="m-0 font-mono text-[10px] font-bold uppercase tracking-label" style={{ color: '#E9AF3C' }}>
          Goya Hack
        </p>
        <h3 style={{ margin: '8px 0 10px', color: '#010004', fontFamily: 'Chakra Petch', fontSize: '1.15rem' }}>
          {HACKATHON_INFO.name}
        </h3>
        <p style={{ color: '#334155', margin: '0 0 1rem', lineHeight: 1.55 }}>
          Aplica al hackathon: inscríbete, arma tu equipo y sube tu proyecto para competir por los premios.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link
            to="/hackathon"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #E9AF3C, #F4C55F)',
              color: '#010004',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '0.6rem 1.2rem',
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

  return (
    <div style={wrap}>
      <HackerCredential
        name={participant.full_name}
        avatarUrl={participant.avatar_url}
        bio={participant.bio}
        skills={participant.skills}
        lookingForTeam={participant.looking_for_team}
        teamName={teams[0]?.name}
        projectStatus={project?.status === 'submitted' ? 'submitted' : project ? 'draft' : null}
        panelHref="/hackathon/dashboard"
      />

      {project ? (
        <div
          style={{
            marginTop: '1rem',
            background: 'var(--goya-card)',
            border: '1px solid rgba(233,175,60,0.22)',
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <h4 style={{ margin: 0, color: 'var(--goya-paper)', fontSize: '1rem' }}>{project.title}</h4>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: project.status === 'submitted' ? '#047857' : GOLD,
              }}
            >
              {project.status === 'submitted' ? 'ENVIADO' : 'BORRADOR'}
            </span>
          </div>
          {project.tagline && <p style={{ color: GOLD, fontSize: '0.85rem', margin: '4px 0 6px' }}>{project.tagline}</p>}
          {project.description && (
            <p style={{ color: 'var(--goya-muted)', fontSize: '0.85rem', margin: '0 0 8px', lineHeight: 1.5 }}>
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
        <p style={{ color: 'var(--goya-muted)', fontSize: '0.88rem', margin: '1rem 0 0' }}>
          Aún no has subido un proyecto. {teams.length === 0 ? 'Primero únete o crea un equipo.' : '¡Sube el tuyo!'}
        </p>
      )}

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
            marginTop: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <FontAwesomeIcon icon={faUsers} /> Buscar equipo
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      )}
    </div>
  )
}

export default PerfilHackathonPanel

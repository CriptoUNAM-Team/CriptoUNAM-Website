import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { hackathonApi, type Participant, type Team, type Project } from '../../services/hackathon.service'
import { Card, Button, Chip, Spinner, Banner, SectionTitle, GOLD } from '../../components/hackathon/ui'
import RegistroForm from '../../components/hackathon/RegistroForm'
import ProjectForm from '../../components/hackathon/ProjectForm'
import TeamNotificationsPanel from '../../components/hackathon/TeamNotificationsPanel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPen, faCircleNodes } from '@fortawesome/free-solid-svg-icons'

const HackathonDashboard: React.FC = () => {
  const { ready, isConnected, connectWallet } = useWallet()
  const [loading, setLoading] = useState(true)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { participant } = await hackathonApi.getMe()
      setParticipant(participant)
      if (participant) {
        const [{ teams }, proj] = await Promise.all([hackathonApi.myTeams(), hackathonApi.myProject()])
        setTeams(teams)
        setProject(proj.project)
        setTeamId(proj.team_id ?? teams[0]?.id ?? null)
      }
    } catch {
      // Ignorar errores de red o 404 durante desarrollo local para evitar banners rojos
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ready && isConnected) load()
    else if (ready && !isConnected) setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isConnected])

  if (!ready || (isConnected && loading)) {
    return (
      <HackathonLayout wide>
        <Spinner label="Cargando tu panel…" />
      </HackathonLayout>
    )
  }

  if (!isConnected) {
    return (
      <HackathonLayout wide>
        <SEOHead title="Mi panel · Hackathon UNAM" description="Panel del hacker" />
        <Card glow style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Orbitron' }}>Inicia sesión para participar</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            Ingresa con tu correo — creamos tu cuenta y wallet automáticamente.
          </p>
          <Button onClick={connectWallet}>Acceder</Button>
        </Card>
      </HackathonLayout>
    )
  }

  return (
    <HackathonLayout wide>
      <SEOHead title="Mi panel · Hackathon UNAM" description="Panel del hacker" />
      {error && <Banner kind="error">{error}</Banner>}

      {/* Sin inscripción o editando */}
      {(!participant || editing) && (
        <RegistroForm
          initial={editing ? participant : null}
          onSaved={(p) => {
            setParticipant(p)
            setEditing(false)
            if (!teams.length) load()
          }}
        />
      )}

      {participant && !editing && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <TeamNotificationsPanel onStatusChange={load} />

          {/* Perfil */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h2 style={{ color: '#fff', margin: '0 0 6px', fontFamily: 'Orbitron' }}>{participant.full_name}</h2>
                {participant.bio && <p style={{ color: '#94a3b8', margin: '0 0 10px', maxWidth: 520 }}>{participant.bio}</p>}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {participant.skills.map((s) => (
                    <Chip key={s} tone="blue">
                      {s}
                    </Chip>
                  ))}
                  {participant.looking_for_team && <Chip tone="green">Busca equipo</Chip>}
                </div>
              </div>
              <Button variant="ghost" onClick={() => setEditing(true)}>
                <FontAwesomeIcon icon={faPen} style={{ marginRight: 6 }} />
                Editar
              </Button>
            </div>
          </Card>

          {/* Equipo */}
          <Card>
            <SectionTitle>Tu equipo</SectionTitle>
            {teams.length === 0 ? (
              <div>
                <p style={{ color: '#94a3b8', marginTop: 0 }}>Aún no estás en un equipo.</p>
                <Link to="/hackathon/equipos">
                  <Button>
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: 6 }} />
                    Buscar o crear equipo
                  </Button>
                </Link>
              </div>
            ) : (
              teams.map((team) => (
                <div key={team.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: GOLD, margin: 0 }}>{team.name}</h3>
                    {team.track && <Chip>{team.track.name}</Chip>}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '6px 0' }}>
                    <FontAwesomeIcon icon={faCircleNodes} style={{ marginRight: 6 }} />
                    {team.members?.length || 1} miembro(s) · Código de invitación:{' '}
                    <strong style={{ color: '#fff', letterSpacing: 1 }}>{team.invite_code}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {team.members?.map((m, i) => (
                      <Chip key={i} tone="blue">
                        {m.participant?.full_name}
                        {m.role ? ` · ${m.role}` : ''}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))
            )}
          </Card>

          {/* Proyecto (solo si tiene equipo) */}
          {teamId ? (
            <ProjectForm initial={project} onSaved={setProject} />
          ) : (
            <Card>
              <SectionTitle>Proyecto</SectionTitle>
              <p style={{ color: '#94a3b8', margin: 0 }}>
                Únete o crea un equipo para poder registrar y enviar tu proyecto.
              </p>
            </Card>
          )}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonDashboard

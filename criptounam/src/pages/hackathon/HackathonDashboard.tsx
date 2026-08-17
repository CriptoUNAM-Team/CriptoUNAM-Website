import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { hackathonApi, type Participant, type Team, type Project } from '../../services/hackathon.service'
import { Card, Button, Chip, Spinner, Banner, SectionTitle, Select, Avatar, GOLD } from '../../components/hackathon/ui'
import RegistroForm from '../../components/hackathon/RegistroForm'
import ProjectForm from '../../components/hackathon/ProjectForm'
import TeamNotificationsPanel from '../../components/hackathon/TeamNotificationsPanel'
import { useSesionLista } from '../../hooks/useSesionLista'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPen, faCrown, faCopy, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

/** Tarjeta de un equipo del participante: miembros reales, controles de líder. */
const MyTeamCard: React.FC<{
  team: Team
  myParticipantId: string
  onChanged: () => void
  onFeedback: (kind: 'ok' | 'error', text: string) => void
}> = ({ team, myParticipantId, onChanged, onFeedback }) => {
  const [transferTo, setTransferTo] = useState('')
  const [busy, setBusy] = useState(false)
  const isLeader = team.leader_participant_id === myParticipantId
  const members = team.members || []
  const others = members.filter((m) => m.participant && m.participant.id !== myParticipantId)

  const copyCode = () => {
    navigator.clipboard?.writeText(team.invite_code || '')
    onFeedback('ok', 'Código de invitación copiado')
  }

  const transfer = async () => {
    if (!transferTo) return
    const target = others.find((m) => m.participant?.id === transferTo)
    if (!window.confirm(`¿Ceder el liderazgo de "${team.name}" a ${target?.participant?.full_name}?`)) return
    setBusy(true)
    try {
      await hackathonApi.transferLead(team.id, transferTo)
      onFeedback('ok', `👑 ${target?.participant?.full_name} es ahora líder de "${team.name}"`)
      setTransferTo('')
      onChanged()
    } catch (err: any) {
      onFeedback('error', err.message)
    } finally {
      setBusy(false)
    }
  }

  const leave = async () => {
    const warning = isLeader
      ? `Eres el único miembro: salir eliminará el equipo "${team.name}" y su proyecto. ¿Continuar?`
      : `¿Salir del equipo "${team.name}"?`
    if (!window.confirm(warning)) return
    setBusy(true)
    try {
      const res = await hackathonApi.leaveTeam(team.id)
      onFeedback('ok', res.deleted ? `El equipo "${team.name}" fue disuelto.` : `Saliste de "${team.name}".`)
      onChanged()
    } catch (err: any) {
      onFeedback('error', err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBottom: 16, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h3 style={{ color: GOLD, margin: 0 }}>{team.name}</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {team.track && <Chip>{team.track.name}</Chip>}
          {isLeader && (
            <Chip tone="gold">
              <FontAwesomeIcon icon={faCrown} style={{ marginRight: 4 }} />
              Líder
            </Chip>
          )}
        </div>
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '8px 0' }}>
        {members.length} de {team.max_members || 5} miembros · Código de invitación:{' '}
        <strong style={{ color: '#fff', letterSpacing: 1 }}>{team.invite_code}</strong>
        <button
          onClick={copyCode}
          title="Copiar código"
          style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', marginLeft: 6 }}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </p>

      {/* Miembros con avatar y rol */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        {members.map((m, i) => {
          const p = m.participant
          if (!p) return null
          const memberIsLeader = p.id === team.leader_participant_id
          return (
            <div
              key={p.id || i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${memberIsLeader ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 999,
                padding: '4px 12px 4px 4px',
              }}
            >
              <Avatar src={p.avatar_url} name={p.full_name} size={30} />
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ color: '#e2e8f0', fontSize: '0.84rem', fontWeight: 600 }}>
                  {p.full_name}
                  {memberIsLeader && <FontAwesomeIcon icon={faCrown} style={{ color: GOLD, marginLeft: 5, fontSize: '0.72rem' }} />}
                </div>
                {m.role && <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{m.role}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        {isLeader && others.length > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} style={{ width: 'auto', padding: '0.45rem 0.7rem' }}>
              <option value="">Transferir liderazgo a…</option>
              {others.map((m) => (
                <option key={m.participant!.id} value={m.participant!.id}>
                  {m.participant!.full_name}
                </option>
              ))}
            </Select>
            <Button variant="ghost" disabled={!transferTo || busy} onClick={transfer}>
              <FontAwesomeIcon icon={faCrown} style={{ marginRight: 6 }} />
              Transferir
            </Button>
          </div>
        )}
        {(!isLeader || others.length === 0) && (
          <Button variant="danger" disabled={busy} onClick={leave}>
            <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: 6 }} />
            {isLeader ? 'Disolver equipo' : 'Salir del equipo'}
          </Button>
        )}
        {isLeader && others.length > 0 && (
          <span style={{ color: '#64748b', fontSize: '0.78rem' }}>
            Para salir del equipo primero transfiere el liderazgo.
          </span>
        )}
      </div>
    </div>
  )
}

const HackathonDashboard: React.FC = () => {
  const { connectWallet } = useWallet()
  const { ready, isConnected, sesionNoDisponible } = useSesionLista()
  const [loading, setLoading] = useState(true)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [project, setProject] = useState<Project | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const notify = (kind: 'ok' | 'error', text: string) => {
    setFeedback({ kind, text })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setFeedback(null), 6000)
  }

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

  // Privy no arrancó (origen no autorizado, red caída, bloqueador). Sin esto la
  // página se quedaba girando indefinidamente sin explicar nada.
  if (sesionNoDisponible) {
    return (
      <HackathonLayout wide>
        <SEOHead title="Mi panel · Hackathon UNAM" description="Panel del hacker" />
        <Card glow style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Chakra Petch' }}>No pudimos abrir tu sesión</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            El servicio de inicio de sesión no respondió. Revisa tu conexión y vuelve a intentar; si
            usas un bloqueador de anuncios, desactívalo para este sitio.
          </p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </Card>
      </HackathonLayout>
    )
  }

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
          <h2 style={{ color: '#fff', fontFamily: 'Chakra Petch' }}>Inicia sesión para participar</h2>
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
      {feedback && <Banner kind={feedback.kind === 'ok' ? 'success' : 'error'}>{feedback.text}</Banner>}

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
          {/* Checklist de progreso: perfil → equipo → proyecto enviado */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: '1 · Perfil completo', done: true },
              { label: '2 · Equipo formado', done: teams.length > 0 },
              { label: '3 · Proyecto enviado', done: project?.status === 'submitted' },
            ].map((step) => (
              <div
                key={step.label}
                style={{
                  flex: '1 1 180px',
                  padding: '10px 14px',
                  borderRadius: 10,
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  background: step.done ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${step.done ? 'rgba(52,211,153,0.45)' : 'rgba(255,255,255,0.1)'}`,
                  color: step.done ? '#34d399' : '#94a3b8',
                }}
              >
                {step.done ? '✅ ' : '○ '}
                {step.label}
              </div>
            ))}
          </div>

          <TeamNotificationsPanel onStatusChange={load} />

          {/* Perfil */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <Avatar src={participant.avatar_url} name={participant.full_name} size={64} />
                <div>
                  <h2 style={{ color: '#fff', margin: '0 0 6px', fontFamily: 'Chakra Petch' }}>{participant.full_name}</h2>
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
                <MyTeamCard
                  key={team.id}
                  team={team}
                  myParticipantId={participant.id}
                  onChanged={load}
                  onFeedback={notify}
                />
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

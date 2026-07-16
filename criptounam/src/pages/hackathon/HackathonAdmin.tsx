import React, { useEffect, useState } from 'react'
import { getAccessToken } from '@privy-io/react-auth'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { useAdmin } from '../../hooks/useAdmin'
import { hackathonApi, type Participant, type Team, type Project } from '../../services/hackathon.service'
import { Card, Button, Chip, Spinner, Banner, Input, Textarea, SectionTitle, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUserGroup, faDiagramProject, faFileCsv, faStar } from '@fortawesome/free-solid-svg-icons'

const CRITERIA = ['Innovación', 'Ejecución', 'Impacto', 'Presentación']
type Tab = 'overview' | 'participants' | 'teams' | 'projects'

async function downloadCsv(type: 'participants' | 'projects') {
  const token = await getAccessToken()
  const res = await fetch(`/api/hackathon/admin?resource=export&type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('No se pudo exportar')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${type}-hackathon.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const StatCard: React.FC<{ icon: any; label: string; value: number | string }> = ({ icon, label, value }) => (
  <Card style={{ textAlign: 'center' }}>
    <FontAwesomeIcon icon={icon} style={{ color: GOLD, fontSize: '1.4rem', marginBottom: 8 }} />
    <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: '#fff', fontWeight: 800 }}>{value}</div>
    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{label}</div>
  </Card>
)

const ScorePanel: React.FC<{ project: Project & { scores?: any[] } }> = ({ project }) => {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const total = CRITERIA.reduce((a, c) => a + (Number(scores[c]) || 0), 0)

  const save = async () => {
    setBusy(true)
    setMsg(null)
    try {
      await hackathonApi.score({ project_id: project.id, criteria: scores, total, feedback })
      setMsg('Calificación guardada ✓')
    } catch (err: any) {
      setMsg(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginTop: 12, borderTop: '1px solid rgba(212,175,55,0.15)', paddingTop: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        {CRITERIA.map((c) => (
          <div key={c}>
            <label style={{ color: '#cbd5e1', fontSize: '0.78rem', display: 'block', marginBottom: 4 }}>{c}</label>
            <Input
              type="number"
              min={0}
              max={10}
              value={scores[c] ?? ''}
              onChange={(e) => setScores((s) => ({ ...s, [c]: Number(e.target.value) }))}
              placeholder="0-10"
            />
          </div>
        ))}
      </div>
      <Textarea
        style={{ marginTop: 10 }}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Feedback para el equipo (opcional)"
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        <Button onClick={save} disabled={busy}>
          <FontAwesomeIcon icon={faStar} style={{ marginRight: 6 }} />
          Guardar calificación
        </Button>
        <span style={{ color: GOLD, fontWeight: 700 }}>Total: {total}/40</span>
        {msg && <span style={{ color: '#6ee7b7', fontSize: '0.85rem' }}>{msg}</span>}
      </div>
      {project.scores && project.scores.length > 0 && (
        <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 8 }}>
          {project.scores.length} calificación(es) registrada(s) · promedio{' '}
          {(project.scores.reduce((a: number, s: any) => a + Number(s.total || 0), 0) / project.scores.length).toFixed(1)}
        </p>
      )}
    </div>
  )
}

const HackathonAdmin: React.FC = () => {
  const { ready, isConnected, connectWallet } = useWallet()
  const { isAdmin } = useAdmin()
  const [tab, setTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [participants, setParticipants] = useState<Participant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [projects, setProjects] = useState<(Project & { scores?: any[] })[]>([])

  const loadTab = async (t: Tab) => {
    setLoading(true)
    setError(null)
    try {
      if (t === 'overview') setCounts((await hackathonApi.adminOverview()).counts)
      if (t === 'participants') setParticipants((await hackathonApi.adminParticipants()).participants)
      if (t === 'teams') setTeams((await hackathonApi.adminTeams()).teams)
      if (t === 'projects') setProjects((await hackathonApi.adminProjects()).projects)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ready && isConnected && isAdmin) loadTab(tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, isConnected, isAdmin, tab])

  if (!ready) {
    return (
      <HackathonLayout wide>
        <Spinner />
      </HackathonLayout>
    )
  }

  if (!isConnected || !isAdmin) {
    return (
      <HackathonLayout wide>
        <SEOHead title="Admin · Hackathon UNAM" description="Panel de organizadores" />
        <Card glow style={{ textAlign: 'center', padding: '2.5rem' }}>
          <h2 style={{ color: '#fff', fontFamily: 'Orbitron' }}>Acceso restringido</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>
            {isConnected
              ? 'Tu cuenta no está autorizada como organizadora.'
              : 'Inicia sesión con una cuenta de organizador.'}
          </p>
          {!isConnected && <Button onClick={connectWallet}>Acceder</Button>}
        </Card>
      </HackathonLayout>
    )
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Resumen' },
    { id: 'participants', label: 'Inscritos' },
    { id: 'teams', label: 'Equipos' },
    { id: 'projects', label: 'Proyectos' },
  ]

  return (
    <HackathonLayout wide>
      <SEOHead title="Admin · Hackathon UNAM" description="Panel de organizadores" />
      <SectionTitle sub="Gestiona inscritos, equipos, proyectos y calificaciones.">Panel de organización</SectionTitle>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {TABS.map((t) => (
          <Button key={t.id} variant={tab === t.id ? 'primary' : 'ghost'} onClick={() => setTab(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>

      {error && <Banner kind="error">{error}</Banner>}
      {loading && <Spinner />}

      {!loading && tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <StatCard icon={faUsers} label="Inscritos" value={counts.participants ?? 0} />
          <StatCard icon={faUserGroup} label="Equipos" value={counts.teams ?? 0} />
          <StatCard icon={faDiagramProject} label="Proyectos" value={counts.projects ?? 0} />
          <StatCard icon={faStar} label="Enviados" value={counts.submitted ?? 0} />
        </div>
      )}

      {!loading && tab === 'participants' && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <Button variant="ghost" onClick={() => downloadCsv('participants').catch((e) => setError(e.message))}>
              <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: 6 }} />
              Exportar CSV
            </Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', color: '#e2e8f0' }}>
              <thead>
                <tr style={{ color: GOLD, textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Nombre</th>
                  <th style={{ padding: 8 }}>Email</th>
                  <th style={{ padding: 8 }}>Nivel</th>
                  <th style={{ padding: 8 }}>Habilidades</th>
                  <th style={{ padding: 8 }}>Equipo</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.id} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: 8 }}>{p.full_name}</td>
                    <td style={{ padding: 8, color: '#94a3b8' }}>{p.email}</td>
                    <td style={{ padding: 8 }}>{p.experience}</td>
                    <td style={{ padding: 8 }}>{(p.skills || []).join(', ')}</td>
                    <td style={{ padding: 8 }}>{p.looking_for_team ? <Chip tone="green">Busca</Chip> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && tab === 'teams' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {teams.map((team) => (
            <Card key={team.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: GOLD, margin: 0 }}>{team.name}</h3>
                {team.track && <Chip>{team.track.name}</Chip>}
              </div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '6px 0' }}>Código: {team.invite_code}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {team.members?.map((m, i) => (
                  <Chip key={i} tone="blue">
                    {m.participant?.full_name}
                  </Chip>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && tab === 'projects' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => downloadCsv('projects').catch((e) => setError(e.message))}>
              <FontAwesomeIcon icon={faFileCsv} style={{ marginRight: 6 }} />
              Exportar CSV
            </Button>
          </div>
          {projects.length === 0 && (
            <Card>
              <p style={{ color: '#94a3b8', textAlign: 'center', margin: 0 }}>Aún no hay proyectos.</p>
            </Card>
          )}
          {projects.map((p) => (
            <Card key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#fff', margin: 0 }}>{p.title}</h3>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {p.team?.name} · {p.track?.name || 'sin track'}
                  </span>
                </div>
                <Chip tone={p.status === 'submitted' ? 'green' : 'gold'}>
                  {p.status === 'submitted' ? 'Enviado' : 'Borrador'}
                </Chip>
              </div>
              {p.repo_url && (
                <a href={p.repo_url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: '0.85rem' }}>
                  {p.repo_url}
                </a>
              )}
              <ScorePanel project={p} />
            </Card>
          ))}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonAdmin

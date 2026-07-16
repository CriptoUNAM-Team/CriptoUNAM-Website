import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { hackathonApi, HACKATHON_TRACKS, type Team } from '../../services/hackathon.service'
import { Card, Button, Chip, Spinner, Banner, Field, Input, Textarea, Select, SectionTitle, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons'

const HackathonTeams: React.FC = () => {
  const navigate = useNavigate()
  const { ready, isConnected, connectWallet } = useWallet()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [inviteCode, setInviteCode] = useState('')

  // Form crear equipo
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [trackId, setTrackId] = useState('')
  const [neededSkills, setNeededSkills] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { teams } = await hackathonApi.listTeams()
      setTeams(teams)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ready) load()
  }, [ready])

  const requireAuth = (fn: () => void) => (isConnected ? fn() : connectWallet())

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) return setError('El nombre del equipo es obligatorio')
    setBusy(true)
    try {
      const { team } = await hackathonApi.createTeam({
        name: name.trim(),
        description: desc.trim(),
        track_id: trackId || undefined,
        needed_skills: neededSkills.split(',').map((s) => s.trim()).filter(Boolean),
      })
      setMsg(`Equipo "${team.name}" creado. Código: ${team.invite_code}`)
      navigate('/hackathon/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const join = async (opts: { team_id?: string; invite_code?: string }) => {
    setError(null)
    setMsg(null)
    try {
      await hackathonApi.joinTeam(opts)
      setMsg('¡Te uniste al equipo!')
      navigate('/hackathon/dashboard')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <HackathonLayout wide>
      <SEOHead title="Equipos · Hackathon UNAM" description="Explora, crea o únete a equipos del Hackathon UNAM 2026." />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: '1.5rem' }}>
        <SectionTitle sub="Encuentra compañeros o forma tu propio equipo.">Equipos</SectionTitle>
        <Button onClick={() => requireAuth(() => setShowCreate((s) => !s))}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 6 }} />
          Crear equipo
        </Button>
      </div>

      {error && <Banner kind="error">{error}</Banner>}
      {msg && <Banner kind="success">{msg}</Banner>}

      {/* Unirse por código */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Field label="¿Tienes un código de invitación?">
              <Input
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Ej. AB3D9K"
                maxLength={8}
              />
            </Field>
          </div>
          <Button
            variant="ghost"
            style={{ marginBottom: '1rem' }}
            onClick={() => requireAuth(() => join({ invite_code: inviteCode.trim() }))}
            disabled={!inviteCode.trim()}
          >
            <FontAwesomeIcon icon={faRightToBracket} style={{ marginRight: 6 }} />
            Unirme
          </Button>
        </div>
      </Card>

      {/* Form crear */}
      {showCreate && (
        <Card glow style={{ marginBottom: '1.5rem' }}>
          <SectionTitle>Nuevo equipo</SectionTitle>
          <form onSubmit={create}>
            <Field label="Nombre del equipo *">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Los Pumas Cripto" />
            </Field>
            <Field label="Descripción / idea">
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="¿Qué quieren construir?" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
              <Field label="Track">
                <Select value={trackId} onChange={(e) => setTrackId(e.target.value)}>
                  <option value="">Sin definir</option>
                  {HACKATHON_TRACKS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Perfiles que buscan (coma)">
                <Input value={neededSkills} onChange={(e) => setNeededSkills(e.target.value)} placeholder="Backend, Diseño" />
              </Field>
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? 'Creando…' : 'Crear equipo'}
            </Button>
          </form>
        </Card>
      )}

      {/* Lista de equipos */}
      {loading ? (
        <Spinner label="Cargando equipos…" />
      ) : teams.length === 0 ? (
        <Card>
          <p style={{ color: '#94a3b8', margin: 0, textAlign: 'center' }}>
            Aún no hay equipos buscando miembros. ¡Sé el primero en crear uno!
          </p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {teams.map((team) => {
            const memberCount = team.members?.length || 0
            const full = memberCount >= team.max_members
            return (
              <Card key={team.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ color: GOLD, margin: 0, fontSize: '1.1rem' }}>{team.name}</h3>
                  {team.track && <Chip>{team.track.name}</Chip>}
                </div>
                {team.description && (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 10px', lineHeight: 1.5 }}>
                    {team.description}
                  </p>
                )}
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 10px' }}>
                  <FontAwesomeIcon icon={faUsers} style={{ marginRight: 6 }} />
                  {memberCount}/{team.max_members} miembros
                </p>
                {team.needed_skills?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {team.needed_skills.map((s) => (
                      <Chip key={s} tone="blue">
                        {s}
                      </Chip>
                    ))}
                  </div>
                )}
                <Button
                  onClick={() => requireAuth(() => join({ team_id: team.id }))}
                  disabled={full}
                  style={{ width: '100%' }}
                >
                  {full ? 'Equipo lleno' : 'Unirme'}
                </Button>
              </Card>
            )
          })}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonTeams

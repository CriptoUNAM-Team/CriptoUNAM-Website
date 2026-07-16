import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { hackathonApi, HACKATHON_TRACKS, DEMO_TEAMS, type Team } from '../../services/hackathon.service'
import { Card, Button, Chip, Spinner, Banner, Field, Input, Textarea, Select, SectionTitle, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus, faRightToBracket, faSearch, faUserGroup } from '@fortawesome/free-solid-svg-icons'

const HackathonTeams: React.FC = () => {
  const navigate = useNavigate()
  const { ready, isConnected, connectWallet } = useWallet()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [search, setSearch] = useState('')
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL')

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
      setTeams(teams?.length ? teams : DEMO_TEAMS)
    } catch {
      // Fallback silencioso sin mostrar banner rojo de Error 404
      setTeams(DEMO_TEAMS)
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

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchesTrack = selectedTrack === 'ALL' || t.track?.id === selectedTrack || t.track_id === selectedTrack
      const q = search.toLowerCase().trim()
      if (!q) return matchesTrack
      const inName = t.name?.toLowerCase().includes(q)
      const inDesc = t.description?.toLowerCase().includes(q)
      const inSkills = t.needed_skills?.some((s) => s.toLowerCase().includes(q))
      return matchesTrack && (inName || inDesc || inSkills)
    })
  }, [teams, selectedTrack, search])

  return (
    <HackathonLayout wide>
      <SEOHead title="Hackers & Equipos · Hackathon UNAM 2026" description="Explora, crea o únete a equipos del Hackathon UNAM 2026." />

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
              Directorio de Equipos & Hackers
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 650, margin: 0, lineHeight: 1.6 }}>
              Encuentra el equipo perfecto para tus habilidades (Solidity, React, AI, Diseño) o crea tu propio equipo e invita a compañeros universitarios.
            </p>
          </div>
          <Button onClick={() => requireAuth(() => setShowCreate((s) => !s))} style={{ padding: '10px 22px' }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
            {showCreate ? 'Cerrar formulario' : 'Crear mi Equipo'}
          </Button>
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
              placeholder="Buscar por nombre, habilidad buscada (React, Rust, UI) o track..."
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
      {msg && <Banner kind="success">{msg}</Banner>}

      {/* Unirse por código y crear */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: '2rem' }}>
        <Card style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FontAwesomeIcon icon={faRightToBracket} style={{ color: GOLD }} /> ¿Tienes un código de invitación?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: '0 0 14px' }}>
            Si un líder de equipo te compartió un código alfanumérico (ej. PUMAAI26), ingrésalo aquí para unirte al instante.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="CÓDIGO DE EQUIPO"
              maxLength={10}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(212,175,55,0.4)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#fff',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                letterSpacing: 1,
                outline: 'none',
              }}
            />
            <Button
              variant="primary"
              onClick={() => requireAuth(() => join({ invite_code: inviteCode.trim() }))}
              disabled={!inviteCode.trim()}
              style={{ padding: '10px 18px' }}
            >
              Unirme
            </Button>
          </div>
        </Card>

        {showCreate && (
          <Card glow style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
            <SectionTitle>Crear Nuevo Equipo</SectionTitle>
            <form onSubmit={create}>
              <Field label="Nombre del equipo *">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Los Pumas Cripto" />
              </Field>
              <Field label="Descripción o idea del proyecto">
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="¿Qué solución planean construir?" />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
                <Field label="Track de competencia">
                  <Select value={trackId} onChange={(e) => setTrackId(e.target.value)}>
                    <option value="">Sin definir aún</option>
                    {HACKATHON_TRACKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Habilidades que buscan (separadas por coma)">
                  <Input value={neededSkills} onChange={(e) => setNeededSkills(e.target.value)} placeholder="React, Solidity, UI/UX" />
                </Field>
              </div>
              <Button type="submit" disabled={busy} style={{ marginTop: 12, width: '100%' }}>
                {busy ? 'Creando equipo…' : '✔ Registrar mi Equipo en Plataforma'}
              </Button>
            </form>
          </Card>
        )}
      </div>

      {/* Lista de equipos */}
      {loading ? (
        <Spinner label="Cargando directorio de equipos…" />
      ) : filteredTeams.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FontAwesomeIcon icon={faUserGroup} style={{ fontSize: '2.5rem', color: GOLD, marginBottom: '1rem', opacity: 0.8 }} />
          <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '0 0 8px' }}>
            {search || selectedTrack !== 'ALL' ? 'No encontramos equipos con esos filtros' : 'Aún no hay equipos publicados'}
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0 auto 1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {search || selectedTrack !== 'ALL'
              ? 'Intenta buscar con otras palabras clave o selecciona "Todos los Tracks".'
              : 'Estamos en la Fase 1 activa de formación de equipos. Crea tu propio equipo y publica las habilidades que necesitas.'}
          </p>
          <Button onClick={() => requireAuth(() => setShowCreate(true))}>+ Crear el Primer Equipo</Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filteredTeams.map((team) => {
            const memberCount = team.members?.length || 0
            const maxMembers = team.max_members || 5
            const full = memberCount >= maxMembers
            return (
              <Card key={team.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <h3 style={{ color: GOLD, margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{team.name}</h3>
                    {team.track && <Chip tone="gold">{team.track.name}</Chip>}
                  </div>
                  {team.description && (
                    <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 14px', lineHeight: 1.6 }}>
                      {team.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: '0.85rem', marginBottom: 12, fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faUsers} style={{ color: GOLD }} />
                    {memberCount} de {maxMembers} miembros en el equipo
                  </div>
                  {team.needed_skills?.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>
                        Buscando perfiles:
                      </span>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {team.needed_skills.map((s) => (
                          <Chip key={s} tone="blue">
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                  <Button
                    onClick={() => requireAuth(() => join({ team_id: team.id }))}
                    disabled={full}
                    style={{ width: '100%' }}
                  >
                    {full ? 'Equipo lleno' : '🚀 Solicitar Unirme'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonTeams

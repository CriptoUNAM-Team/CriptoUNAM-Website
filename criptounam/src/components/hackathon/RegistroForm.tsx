import React, { useState } from 'react'
import { Card, Field, Input, Textarea, Select, Button, Banner, SectionTitle } from './ui'
import ImageField from './ImageField'
import { hackathonApi, type Participant } from '../../services/hackathon.service'

type Props = {
  initial?: Participant | null
  onSaved: (p: Participant) => void
}

/** Formulario de inscripción / edición de perfil de hacker. */
const RegistroForm: React.FC<Props> = ({ initial, onSaved }) => {
  const editing = Boolean(initial)
  const [fullName, setFullName] = useState(initial?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url || '')
  const [bio, setBio] = useState(initial?.bio || '')
  const [skills, setSkills] = useState((initial?.skills || []).join(', '))
  const [experience, setExperience] = useState(initial?.experience || 'beginner')
  const [github, setGithub] = useState(initial?.socials?.github || '')
  const [x, setX] = useState(initial?.socials?.x || '')
  const [telegram, setTelegram] = useState(initial?.socials?.telegram || '')
  const [lookingForTeam, setLookingForTeam] = useState(initial?.looking_for_team ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!fullName.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    setSaving(true)
    try {
      const payload = {
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
        bio: bio.trim(),
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        experience,
        socials: { github, x, telegram },
        looking_for_team: lookingForTeam,
      }
      const res = editing ? await hackathonApi.updateProfile(payload) : await hackathonApi.register(payload)
      onSaved(res.participant)
    } catch (err: any) {
      setError(err.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <SectionTitle sub={editing ? 'Actualiza tu información de hacker.' : 'Completa tu perfil para participar.'}>
        {editing ? 'Editar perfil' : 'Inscripción al hackathon'}
      </SectionTitle>
      {error && <Banner kind="error">{error}</Banner>}
      <form onSubmit={submit}>
        <Field label="Nombre completo *">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ada Lovelace" />
        </Field>
        <ImageField label="Foto de perfil" value={avatarUrl} onChange={setAvatarUrl} onError={setError} round />
        <Field label="Bio corta">
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuéntanos sobre ti…" />
        </Field>
        <Field label="Habilidades (separadas por coma)">
          <Input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Solidity, React, Python, Diseño UX"
          />
        </Field>
        <Field label="Nivel de experiencia">
          <Select value={experience} onChange={(e) => setExperience(e.target.value)}>
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </Select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <Field label="GitHub">
            <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="usuario" />
          </Field>
          <Field label="X / Twitter">
            <Input value={x} onChange={(e) => setX(e.target.value)} placeholder="@usuario" />
          </Field>
          <Field label="Telegram">
            <Input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@usuario" />
          </Field>
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#cbd5e1', margin: '4px 0 1.25rem' }}>
          <input type="checkbox" checked={lookingForTeam} onChange={(e) => setLookingForTeam(e.target.checked)} />
          Estoy buscando equipo
        </label>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Inscribirme'}
        </Button>
      </form>
    </Card>
  )
}

export default RegistroForm

import React, { useState } from 'react'
import { Card, Field, Input, Textarea, Select, Button, Banner, Chip, SectionTitle } from './ui'
import { hackathonApi, HACKATHON_TRACKS, type Project } from '../../services/hackathon.service'

type Props = {
  initial?: Project | null
  onSaved: (p: Project) => void
}

/** Editor del proyecto del equipo (guardar borrador / enviar). */
const ProjectForm: React.FC<Props> = ({ initial, onSaved }) => {
  const [title, setTitle] = useState(initial?.title || '')
  const [tagline, setTagline] = useState(initial?.tagline || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [trackId, setTrackId] = useState(initial?.track_id || '')
  const [repo, setRepo] = useState(initial?.repo_url || '')
  const [demo, setDemo] = useState(initial?.demo_url || '')
  const [video, setVideo] = useState(initial?.video_url || '')
  const [slides, setSlides] = useState(initial?.slides_url || '')
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const submitted = initial?.status === 'submitted'

  const payload = () => ({
    title: title.trim(),
    tagline: tagline.trim(),
    description: description.trim(),
    track_id: trackId || null,
    repo_url: repo.trim(),
    demo_url: demo.trim(),
    video_url: video.trim(),
    slides_url: slides.trim(),
    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
  })

  const save = async (submit: boolean) => {
    setError(null)
    setOk(null)
    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }
    setBusy(true)
    try {
      const res = submit ? await hackathonApi.submitProject(payload()) : await hackathonApi.saveProject(payload())
      onSaved(res.project)
      setOk(submit ? '¡Proyecto enviado! 🎉' : 'Borrador guardado.')
    } catch (err: any) {
      setError(err.message || 'No se pudo guardar')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <SectionTitle sub="Guarda tu avance como borrador y envíalo cuando esté listo.">Proyecto</SectionTitle>
        <Chip tone={submitted ? 'green' : 'gold'}>{submitted ? 'Enviado' : 'Borrador'}</Chip>
      </div>
      {error && <Banner kind="error">{error}</Banner>}
      {ok && <Banner kind="success">{ok}</Banner>}

      <Field label="Título *">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre del proyecto" />
      </Field>
      <Field label="Frase gancho (tagline)">
        <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Una línea que lo describa" />
      </Field>
      <Field label="Descripción">
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="¿Qué construyeron y qué problema resuelve?" />
      </Field>
      <Field label="Track">
        <Select value={trackId} onChange={(e) => setTrackId(e.target.value)}>
          <option value="">Selecciona un track</option>
          {HACKATHON_TRACKS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <Field label="Repositorio (GitHub)">
          <Input value={repo} onChange={(e) => setRepo(e.target.value)} placeholder="https://github.com/…" />
        </Field>
        <Field label="Demo en vivo">
          <Input value={demo} onChange={(e) => setDemo(e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="Video (pitch)">
          <Input value={video} onChange={(e) => setVideo(e.target.value)} placeholder="https://youtu.be/…" />
        </Field>
        <Field label="Presentación (slides)">
          <Input value={slides} onChange={(e) => setSlides(e.target.value)} placeholder="https://…" />
        </Field>
      </div>
      <Field label="Etiquetas (separadas por coma)">
        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, DeFi, ZK" />
      </Field>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button variant="ghost" onClick={() => save(false)} disabled={busy}>
          Guardar borrador
        </Button>
        <Button onClick={() => save(true)} disabled={busy}>
          {submitted ? 'Actualizar envío' : 'Enviar proyecto'}
        </Button>
      </div>
    </Card>
  )
}

export default ProjectForm

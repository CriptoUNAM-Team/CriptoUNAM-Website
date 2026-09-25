import React, { useEffect, useState } from 'react'
import { Card, Field, Input, Textarea, Button, Banner, Chip, SectionTitle } from './ui'
import ImageField from './ImageField'
import TrackPicker from './TrackPicker'
import { hackathonApi, idsDeTracks, type Project, type Track } from '../../services/hackathon.service'
import { sincronizarSponsors, sponsorFaltante, STELLAR_APEX_GOYA_URL } from '../../data/hackathonInfo'
import SponsorPicker from './SponsorPicker'
import { AvisoApexStellar } from './TrackPicker'

type Props = {
  initial?: Project | null
  onSaved: (p: Project) => void
}

/** Editor del proyecto del equipo (guardar borrador / enviar). */
const ProjectForm: React.FC<Props> = ({ initial, onSaved }) => {
  const [title, setTitle] = useState(initial?.title || '')
  const [tagline, setTagline] = useState(initial?.tagline || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [trackIds, setTrackIds] = useState<string[]>(() => idsDeTracks(initial))
  const [sponsorIds, setSponsorIds] = useState<string[]>(initial?.sponsor_ids ?? [])
  const [repo, setRepo] = useState(initial?.repo_url || '')
  const [demo, setDemo] = useState(initial?.demo_url || '')
  const [video, setVideo] = useState(initial?.video_url || '')
  const [slides, setSlides] = useState(initial?.slides_url || '')
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url || '')
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url || '')
  const [tags, setTags] = useState((initial?.tags || []).join(', '))
  const [tracks, setTracks] = useState<Track[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [apexConfirmado, setApexConfirmado] = useState(false)
  const vaPorStellar = sponsorIds.includes('stellar')

  const submitted = initial?.status === 'submitted'

  useEffect(() => {
    hackathonApi
      .listTracks()
      .then(setTracks)
      .catch(() => setTracks([]))
  }, [])

  useEffect(() => {
    setTrackIds(idsDeTracks(initial))
    setSponsorIds(initial?.sponsor_ids ?? [])
  }, [initial])

  useEffect(() => {
    if (!tracks.length) return
    setSponsorIds((prev) => sincronizarSponsors(tracks, trackIds, prev))
  }, [tracks, trackIds])

  const payload = () => ({
    title: title.trim(),
    tagline: tagline.trim(),
    description: description.trim(),
    track_ids: trackIds,
    sponsor_ids: sponsorIds,
    repo_url: repo.trim(),
    demo_url: demo.trim(),
    video_url: video.trim(),
    slides_url: slides.trim(),
    logo_url: logoUrl.trim() || null,
    cover_url: coverUrl.trim() || null,
    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
  })

  const save = async (submit: boolean) => {
    setError(null)
    setOk(null)
    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }
    if (submit && trackIds.length === 0) {
      setError('Selecciona al menos un track antes de enviar')
      return
    }
    if (submit) {
      const falta = sponsorFaltante(tracks, trackIds, sponsorIds)
      if (falta) {
        setError(falta)
        return
      }
      if (vaPorStellar && !apexConfirmado) {
        setError('Para enviar un proyecto Stellar primero súbelo en Stellar Apex y confirma el paso.')
        return
      }
    }
    if (submit && (!description.trim() || description.trim().length < 40)) {
      setError('La descripción debe explicar el proyecto (mín. 40 caracteres)')
      return
    }
    if (submit && !repo.trim()) {
      setError('Para enviar el proyecto necesitas al menos el enlace del repositorio (https)')
      return
    }
    const https = (url: string) => !url.trim() || /^https:\/\/.+/i.test(url.trim())
    if ([repo, demo, video, slides, logoUrl, coverUrl].some((u) => !https(u))) {
      setError('Los enlaces deben empezar con https://')
      return
    }
    setBusy(true)
    try {
      const res = submit ? await hackathonApi.submitProject(payload()) : await hackathonApi.saveProject(payload())
      onSaved(res.project)
      setOk(submit ? '¡Proyecto enviado! 🎉 Ya aparece en la galería pública.' : 'Borrador guardado.')
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
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="¿Qué construyeron y qué problema resuelve? Si usaron código abierto o plantillas, declárenlo aquí."
        />
      </Field>
      <Field label="Tracks de competencia *">
        <TrackPicker
          tracks={tracks}
          value={trackIds}
          onChange={(ids) => {
            setTrackIds(ids)
            setSponsorIds((prev) => sincronizarSponsors(tracks, ids, prev))
          }}
          disabled={busy}
        />
      </Field>
      <Field label="Sponsors *">
        <SponsorPicker
          tracks={tracks}
          trackIds={trackIds}
          value={sponsorIds}
          onChange={setSponsorIds}
          disabled={busy}
        />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        <ImageField label="Logo / Icono del proyecto" value={logoUrl} onChange={setLogoUrl} onError={setError} />
        <ImageField label="Portada / Banner (cover)" value={coverUrl} onChange={setCoverUrl} onError={setError} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <Field label="Repositorio (GitHub) *">
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

      {vaPorStellar && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          <AvisoApexStellar />
          <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: '#e2e8f0', fontSize: '0.86rem', lineHeight: 1.45 }}>
            <input
              type="checkbox"
              checked={apexConfirmado}
              onChange={(e) => setApexConfirmado(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <span>
              Ya subí este proyecto en{' '}
              <a href={STELLAR_APEX_GOYA_URL} target="_blank" rel="noreferrer" style={{ color: '#E9AF3C', fontWeight: 700 }}>
                Stellar Apex · GOYA HACK
              </a>
              . Sin este paso Stellar no puede elegir ganadores.
            </span>
          </label>
        </div>
      )}

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

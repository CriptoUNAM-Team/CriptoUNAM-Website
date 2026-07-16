import React, { useEffect, useState } from 'react'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useWallet } from '../../context/WalletContext'
import { useAdmin } from '../../hooks/useAdmin'
import { hackathonApi, DEMO_QUESTIONS, type Question } from '../../services/hackathon.service'
import { Card, Button, Chip, Spinner, Banner, Field, Input, Textarea, Select, SectionTitle, GOLD } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faPaperPlane, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

const CATEGORIES = [
  { v: 'general', l: 'General' },
  { v: 'tecnico', l: 'Técnico' },
  { v: 'reglas', l: 'Reglas' },
  { v: 'logistica', l: 'Logística' },
]

const HackathonQuestions: React.FC = () => {
  const { isConnected, connectWallet } = useWallet()
  const { isAdmin } = useAdmin()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Nueva duda
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('general')
  const [busy, setBusy] = useState(false)

  // Respuestas (admin/hacker)
  const [answerText, setAnswerText] = useState<Record<string, string>>({})

  const load = async () => {
    setLoading(true)
    try {
      const { questions } = await hackathonApi.listQuestions()
      setQuestions(questions?.length ? questions : DEMO_QUESTIONS)
    } catch {
      // Fallback silencioso con dudas demo si está offline o no hay preguntas aún
      setQuestions(DEMO_QUESTIONS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const ask = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isConnected) return connectWallet()
    if (!title.trim() || !body.trim()) return setError('Completa título y descripción')
    setBusy(true)
    try {
      await hackathonApi.askQuestion({ title: title.trim(), body: body.trim(), category })
      setTitle('')
      setBody('')
      setCategory('general')
      await load()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const answer = async (questionId: string) => {
    const text = (answerText[questionId] || '').trim()
    if (!text) return
    try {
      await hackathonApi.answerQuestion({ question_id: questionId, body: text })
      setAnswerText((s) => ({ ...s, [questionId]: '' }))
      await load()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <HackathonLayout wide>
      <SEOHead title="Dudas & FAQ · Hackathon UNAM" description="Preguntas y respuestas del Hackathon UNAM 2026." />
      <SectionTitle sub="Pregunta lo que necesites; la organización o mentores responden en vivo.">Foro de Dudas & FAQ</SectionTitle>

      {error && <Banner kind="error">{error}</Banner>}

      {/* Nueva duda */}
      <Card style={{ marginBottom: '1.5rem', border: '1px solid rgba(212,175,55,0.3)' }}>
        <form onSubmit={ask}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <Field label="Título de tu pregunta">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. ¿Cómo desplegar en Fuji Testnet?" />
            </Field>
            <Field label="Categoría">
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.v} value={c.v}>
                    {c.l}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Explicación detallada">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Agrega contexto de tu duda técnica o logística…" />
          </Field>
          <Button type="submit" disabled={busy} style={{ marginTop: 8 }}>
            <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: 8 }} />
            {isConnected ? 'Publicar duda en el Foro' : 'Inicia sesión para preguntar'}
          </Button>
        </form>
      </Card>

      {loading ? (
        <Spinner label="Cargando foro de dudas…" />
      ) : questions.length === 0 ? (
        <Card>
          <p style={{ color: '#94a3b8', margin: 0, textAlign: 'center' }}>No hay dudas todavía. ¡Haz la primera!</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {questions.map((q) => (
            <Card key={q.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div>
                  <h3 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.05rem' }}>
                    <FontAwesomeIcon icon={faCircleQuestion} style={{ color: GOLD, marginRight: 8 }} />
                    {q.title}
                  </h3>
                  <p style={{ color: '#94a3b8', margin: '0 0 6px', fontSize: '0.9rem' }}>{q.body}</p>
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>
                    {q.author_name || 'Hacker'} · {CATEGORIES.find((c) => c.v === q.category)?.l || q.category}
                  </span>
                </div>
                {q.is_answered && <Chip tone="green">Respondida</Chip>}
              </div>

              {/* Respuestas */}
              {q.answers && q.answers.length > 0 && (
                <div style={{ marginTop: 12, borderLeft: `2px solid ${GOLD}`, paddingLeft: 12, display: 'grid', gap: 8 }}>
                  {q.answers.map((a) => (
                    <div key={a.id}>
                      <p style={{ color: '#e2e8f0', margin: '0 0 2px', fontSize: '0.9rem' }}>{a.body}</p>
                      <span style={{ fontSize: '0.75rem', color: a.is_official ? GOLD : '#64748b' }}>
                        {a.is_official && <FontAwesomeIcon icon={faShieldHalved} style={{ marginRight: 4 }} />}
                        {a.author_name}
                        {a.is_official ? ' · Oficial' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Responder (cualquier hacker autenticado; oficial si es admin) */}
              {isConnected && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'flex-end' }}>
                  <Input
                    value={answerText[q.id] || ''}
                    onChange={(e) => setAnswerText((s) => ({ ...s, [q.id]: e.target.value }))}
                    placeholder={isAdmin ? 'Responder como organización…' : 'Aporta una respuesta…'}
                  />
                  <Button variant="ghost" onClick={() => answer(q.id)}>
                    Responder
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </HackathonLayout>
  )
}

export default HackathonQuestions

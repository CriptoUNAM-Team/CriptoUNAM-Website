import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faCalendarAlt,
  faCertificate,
  faTrophy,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { handleNewsletterSubscription } from '../api/telegram'
import '../styles/global.css'
import { newsletterData } from '../data/newsletterData'
import type { NewsletterEntryItem } from '../data/newsletterData'
import SEOHead from '../components/SEOHead'

const MESES_ES: Record<string, number> = {
  'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
  'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
}

const parseDateToTimestamp = (dateStr: string): number => {
  try {
    // Formato ISO: 2024-09-15
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr).getTime()
    }
    // Formato español: "15 de Septiembre, 2025" o "5 de Enero, 2026"
    const match = dateStr.match(/(\d{1,2})\s+de\s+(\w+),?\s+(\d{4})/i)
    if (match) {
      const day = parseInt(match[1])
      const month = MESES_ES[match[2].toLowerCase()]
      const year = parseInt(match[3])
      if (month !== undefined) {
        return new Date(year, month, day).getTime()
      }
    }
    // Formato dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/')
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime()
    }
    return 0
  } catch {
    return 0
  }
}

const formatDateToSpanish = (dateStr: string): string => {
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/')
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    return dateStr
  } catch {
    return dateStr
  }
}

const TAGS_DISPONIBLES = [
  'Blockchain',
  'DeFi',
  'NFTs',
  'Web3',
  'Ethereum',
  'Bitcoin',
  'Trading',
  'Educación',
  'Eventos',
  'Tecnología',
  'UNAM',
]

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [filtroTag, setFiltroTag] = useState<string>('')

  const entradasFiltradas = useMemo(() => {
    if (!filtroTag) return newsletterData
    return newsletterData.filter((entrada) =>
      entrada.tags?.some((tag) => tag.toLowerCase().includes(filtroTag.toLowerCase()))
    )
  }, [filtroTag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!email || !email.includes('@')) {
        throw new Error('Por favor ingresa un email válido')
      }
      const { success, message: telegramError } = await handleNewsletterSubscription(email, 'newsletter')
      if (!success) throw new Error(telegramError || 'Error al enviar la suscripción')
      setIsSubscribed(true)
      setShowConfirmation(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la suscripción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEOHead 
        title="Newsletter CriptoUNAM - Noticias y Eventos Blockchain"
        description="Mantente actualizado con las últimas noticias, eventos y artículos sobre blockchain, criptomonedas y Web3 en la UNAM."
        image="https://criptounam.xyz/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/newsletter"
        type="website"
      />
      <div className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '2rem' }}>
        <header className="newsletter-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="hero-title" style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', marginBottom: 8, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Newsletter CriptoUNAM
          </h1>
          <p className="hero-subtitle" style={{ color: '#E0E0E0', fontSize: '1.15rem', maxWidth: 560, margin: '0 auto' }}>
            Noticias, eventos y artículos sobre blockchain y criptomonedas.
          </p>
      </header>

        {/* Filtros por tags */}
        <div style={{ maxWidth: 1000, margin: '0 auto 2rem auto', padding: '0 20px' }}>
          <div
            style={{
              background: 'rgba(26,26,26,0.85)',
              borderRadius: 20,
              padding: '1.25rem 1.5rem',
              border: '1px solid rgba(212,175,55,0.35)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center' }}>
              Filtrar por categoría
          </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            <button
                type="button"
              onClick={() => setFiltroTag('')}
              style={{
                padding: '0.5rem 1rem',
                  borderRadius: 14,
                border: filtroTag === '' ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                background: filtroTag === '' ? '#D4AF37' : 'rgba(26,26,26,0.5)',
                color: filtroTag === '' ? '#0A0A0A' : '#E0E0E0',
                cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: filtroTag === '' ? 600 : 400,
              }}
            >
              Todos
            </button>
              {TAGS_DISPONIBLES.map((tag) => (
              <button
                key={tag}
                  type="button"
                onClick={() => setFiltroTag(tag)}
                style={{
                  padding: '0.5rem 1rem',
                    borderRadius: 14,
                  border: filtroTag === tag ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                  background: filtroTag === tag ? '#D4AF37' : 'rgba(26,26,26,0.5)',
                  color: filtroTag === tag ? '#0A0A0A' : '#E0E0E0',
                  cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: filtroTag === tag ? 600 : 400,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

        <div
          className="content-container"
          style={{
            width: '100%',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
            gap: '4rem'
          }}
        >
          {/* Grid de Artículos */}
          <section className="entries-grid">
                  <h2 style={{
                    fontFamily: 'Chakra Petch',
                    color: '#D4AF37',
                    fontSize: '1.5rem',
              marginBottom: '2rem',
              borderLeft: '4px solid #D4AF37',
              paddingLeft: '1rem'
            }}>
              Últimas Publicaciones
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
              width: '100%'
            }}>
              {entradasFiltradas.map((entry: NewsletterEntryItem) => {
                const preview = entry.contenido.split('\n\n')[0]
                const previewText = preview.length > 150 ? preview.substring(0, 150) + '...' : preview

                return (
                  <article
                    key={entry.id}
                    className="card newsletter-entry"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(26, 26, 26, 0.85)',
                      borderRadius: 20,
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                      backdropFilter: 'blur(10px)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(212, 175, 55, 0.15)'
                      e.currentTarget.style.border = '1px solid rgba(212, 175, 55, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.25)'
                      e.currentTarget.style.border = '1px solid rgba(212, 175, 55, 0.2)'
                    }}
                  >
                    {entry.imagen && (
                      <div
                        style={{
                          width: '100%',
                          height: 220,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={entry.imagen}
                          alt={entry.titulo}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '40%',
                          background: 'linear-gradient(to top, rgba(26,26,26,0.9), transparent)'
                        }} />
                      </div>
                    )}

                    <div style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1
                    }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {entry.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              background: 'rgba(212,175,55,0.15)',
                          color: '#D4AF37',
                              padding: '0.2rem 0.6rem',
                              borderRadius: 8,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                          {tag}
                        </span>
                      ))}
                    </div>

                      <h2
                        style={{
                          fontFamily: 'Chakra Petch',
                          color: '#fff',
                          fontSize: '1.25rem',
                          margin: '0 0 1rem 0',
                          fontWeight: 700,
                          lineHeight: 1.4,
                          minHeight: '3.5rem' // Ensure alignment
                        }}
                      >
                        {entry.titulo}
                      </h2>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', opacity: 0.8 }}>
                        <span style={{ color: '#E0E0E0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#D4AF37' }} />
                          {formatDateToSpanish(entry.fecha)}
                        </span>
                  </div>
                  
                      <p
                        style={{
                          color: '#B0B0B0',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          margin: '0 0 1.5rem 0',
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {previewText}
                      </p>

                      <Link
                        to={`/newsletter/${entry.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#D4AF37',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                      textDecoration: 'none',
                          marginTop: 'auto',
                          width: 'fit-content',
                          paddingBottom: '2px',
                          borderBottom: '2px solid transparent',
                          transition: 'border-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = '#D4AF37'}
                        onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
                      >
                        Leer artículo <i className="fas fa-arrow-right" />
                    </Link>
                </div>
              </article>
                )
              })}
          </div>
        </section>

          {/* Sección de Suscripción Rediseñada */}
          <section
            style={{
              width: '100%',
              maxWidth: 900,
              margin: '0 auto',
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(10,10,10,0.95) 100%)',
              borderRadius: 24,
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Elementos decorativos de fondo */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {!showConfirmation ? (
            <>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '2.5rem', color: '#D4AF37' }} />
                  </div>
                  <h2 style={{
                    fontFamily: 'Chakra Petch',
                    color: '#fff',
                    fontSize: '2rem',
                    marginBottom: '1rem'
                  }}>
                    Únete a <span style={{ color: '#D4AF37' }}>CriptoUNAM</span>
                  </h2>
                  <p style={{
                    color: '#B0B0B0',
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}>
                    Recibe las últimas noticias sobre blockchain, invitaciones a eventos exclusivos y recursos educativos directamente en tu bandeja de entrada.
                  </p>

                  <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    gap: '1rem',
                    maxWidth: '500px',
                    margin: '0 auto',
                    flexWrap: 'wrap'
                  }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@unam.mx"
                      required
                      style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '1rem 1.5rem',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: '1rem 2rem',
                        borderRadius: 12,
                        border: 'none',
                        background: 'linear-gradient(90deg, #D4AF37, #F4D03F)',
                        color: '#000',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(212,175,55,0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {loading ? 'Suscrito...' : 'Suscribirme'}
                  </button>
                </form>
                  {error && <p style={{ color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>}
            </>
          ) : (
                <div style={{ padding: '2rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#D4AF37' }}>✅</div>
                  <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.8rem', marginBottom: '1rem' }}>
                    ¡Te has suscrito correctamente!
                  </h3>
                  <p style={{ color: '#E0E0E0', fontSize: '1.1rem' }}>
                    Bienvenido a la comunidad. Revisa tu correo para confirmar.
                  </p>
              <button 
                onClick={() => setShowConfirmation(false)}
                    style={{
                      marginTop: '2rem',
                      background: 'transparent',
                      border: '1px solid #D4AF37',
                      color: '#D4AF37',
                      padding: '0.8rem 1.5rem',
                      borderRadius: 10,
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Suscribir otro correo
              </button>
            </div>
          )}
      </div>
          </section>
      </div>

        <div className="benefits-section" style={{ margin: '3rem auto 0 auto', maxWidth: 1200 }}>
          <h2 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.35rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            Beneficios de suscribirte
              </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1rem', background: 'rgba(26,26,26,0.8)', borderRadius: 16, border: '1px solid rgba(212,175,55,0.3)' }}>
              <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: 10 }} />
              <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.05rem', margin: 0 }}>Cursos exclusivos</h3>
              <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>Acceso a cursos en blockchain y criptomonedas</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1rem', background: 'rgba(26,26,26,0.8)', borderRadius: 16, border: '1px solid rgba(212,175,55,0.3)' }}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: 10 }} />
              <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.05rem', margin: 0 }}>Eventos prioritarios</h3>
              <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>Información anticipada de eventos y conferencias</p>
              </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1rem', background: 'rgba(26,26,26,0.8)', borderRadius: 16, border: '1px solid rgba(212,175,55,0.3)' }}>
              <FontAwesomeIcon icon={faCertificate} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: 10 }} />
              <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.05rem', margin: 0 }}>Certificaciones</h3>
              <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>Oportunidades de certificaciones reconocidas</p>
              </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1rem', background: 'rgba(26,26,26,0.8)', borderRadius: 16, border: '1px solid rgba(212,175,55,0.3)' }}>
              <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: 10 }} />
              <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.05rem', margin: 0 }}>Logros y recompensas</h3>
              <p style={{ color: '#E0E0E0', margin: 0, fontSize: '0.9rem' }}>Programas de recompensas y logros</p>
              </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Newsletter 

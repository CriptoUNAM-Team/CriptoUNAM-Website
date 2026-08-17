import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendarAlt, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import '../styles/global.css'
import { useState, useEffect } from 'react'
import { newsletterData, type NewsletterEntryItem } from '../data/newsletterData'
import SEOHead from '../components/SEOHead'
import { useWallet } from '../context/WalletContext'
import { supabase } from '../config/supabase'
import { apiFetch } from '../services/apiClient'
import BlogContent from '../components/BlogContent'

const NewsletterEntry = () => {
  const { id } = useParams()
  const { walletAddress, isConnected } = useWallet()
  const found = id ? newsletterData.find((e: NewsletterEntryItem) => String(e.id) === id) : undefined
  const entry: NewsletterEntryItem | null = found !== undefined ? found : null

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (!id || !supabase) return
    const loadLikes = async () => {
      try {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('newsletter_id', id)
        setLikeCount(count ?? 0)
      } catch {
        setLikeCount(0)
      }
    }
    loadLikes()
  }, [id])

  useEffect(() => {
    if (!walletAddress || !id || !supabase) return
    const checkLiked = async () => {
      try {
        const { data } = await supabase
          .from('likes')
          .select('*')
          .eq('user_id', walletAddress)
          .eq('newsletter_id', id)
          .single()
        setIsLiked(!!data)
      } catch {
        setIsLiked(false)
      }
    }
    checkLiked()
  }, [walletAddress, id])

  const handleLike = async () => {
    if (!walletAddress || !isConnected || !id) {
      alert('Conecta tu wallet para dar like')
      return
    }
    setIsLiking(true)
    try {
      // El like se escribe por la API: la tabla ya no acepta escrituras con la
      // anon key, con la que cualquiera podía dar y quitar likes a nombre de
      // otra wallet. El conteo sigue siendo de lectura pública.
      const { liked, count } = await apiFetch<{ liked: boolean; count: number }>('/likes', {
        method: isLiked ? 'DELETE' : 'POST',
        body: { newsletter_id: id, wallet: walletAddress },
      })
      setIsLiked(liked)
      setLikeCount(count)
    } catch (err) {
      console.error('Error al procesar like:', err)
      alert(err instanceof Error ? err.message : 'Error al procesar el like. Intenta de nuevo.')
    } finally {
      setIsLiking(false)
    }
  }

  if (!entry) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', maxWidth: 400 }}>
          <h2 style={{ color: '#D4AF37', fontFamily: 'Chakra Petch' }}>Entrada no encontrada</h2>
          <p style={{ color: '#E0E0E0' }}>La entrada que buscas no existe o ha sido eliminada.</p>
          <Link to="/newsletter" className="primary-button" style={{ marginTop: '1rem', borderRadius: 16, display: 'inline-block' }}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al Newsletter
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split('-')
        return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  return (
    <>
      <SEOHead
        title={`${entry.titulo} - CriptoUNAM Newsletter`}
        description={entry.contenido.substring(0, 160).replace(/\n/g, ' ') + '...'}
        image={entry.imagen}
        url={`https://criptounam.xyz/newsletter/${entry.id}`}
        type="article"
      />
      <div className="section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2rem' }}>
        <article
          className="card full-entry"
          style={{
            maxWidth: 720,
            width: '100%',
            padding: '2rem 1.75rem',
            margin: '0 auto',
            background: 'rgba(26,26,26,0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          {entry.imagen && (
            <div style={{ width: '100%', height: 240, marginBottom: 20, borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
              <img src={entry.imagen} alt={entry.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ color: '#60A5FA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(entry.fecha)}
              </span>
              {entry.autor && (
                <span style={{ color: '#D4AF37', fontWeight: 600 }}>Por {entry.autor}</span>
              )}
            </div>
            <h1 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.75rem', margin: '0 0 0.5rem 0', lineHeight: 1.25 }}>
              {entry.titulo}
            </h1>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleLike}
                disabled={isLiking || !isConnected}
                style={{
                  background: isLiked ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(239, 68, 68, 0.12)',
                  border: isLiked ? '2px solid #ef4444' : '2px solid rgba(239, 68, 68, 0.35)',
                  color: isLiked ? '#fff' : '#ef4444',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 12,
                  cursor: isLiking || !isConnected ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  opacity: isLiking || !isConnected ? 0.6 : 1,
                }}
              >
                <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} style={{ fontSize: '1.2rem' }} />
                {isLiked ? 'Te gusta' : 'Me gusta'}
                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.5rem', borderRadius: 8, fontSize: '0.9rem' }}>
                  {likeCount}
                </span>
              </button>
              {!isConnected && (
                <span style={{ color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic' }}>Conecta tu wallet para dar like</span>
              )}
            </div>

            {entry.tags && entry.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(37,99,235,0.2))',
                      color: '#D4AF37',
                      borderRadius: 10,
                      padding: '0.25rem 0.75rem',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                marginBottom: '1.25rem',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 16,
                padding: '1.75rem',
                border: '1px solid rgba(212, 175, 55, 0.15)',
              }}
            >
              <BlogContent content={entry.contenido} />
            </div>

            <Link
              to="/newsletter"
              className="primary-button"
              style={{ marginTop: '0.5rem', borderRadius: 14, width: 'fit-content', textDecoration: 'none', padding: '0.7rem 1.25rem' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver al Newsletter
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}

export default NewsletterEntry

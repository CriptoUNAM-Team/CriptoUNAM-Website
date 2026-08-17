import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCalendarAlt, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import OptimizedImage from './OptimizedImage'
import '../styles/global.css'

interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  capacity?: number
  registered?: number
  isUpcoming: boolean
  /** Si está presente, se muestra el embed de Luma en lugar de la imagen */
  lumaEventId?: string
}

interface EventsCarouselProps {
  events: EventData[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showIndicators?: boolean
  showNavigation?: boolean
}

const EventsCarousel: React.FC<EventsCarouselProps> = ({
  events,
  autoPlay = true,
  autoPlayInterval = 5000,
  showIndicators = true,
  showNavigation = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && events.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, events.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (autoPlay && events.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
      }, autoPlayInterval)
    }
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex(index)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const goToPrevious = () => {
    if (isTransitioning) return
    goToSlide(currentIndex === 0 ? events.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    if (isTransitioning) return
    goToSlide((currentIndex + 1) % events.length)
  }

  if (!events || events.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'rgba(26,26,26,0.8)',
        borderRadius: '20px',
        border: '1px solid rgba(212,175,55,0.3)',
        margin: '2rem 0'
      }}>
        <h3 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Próximos Eventos</h3>
        <p style={{ color: '#E0E0E0' }}>No hay eventos próximos por el momento</p>
      </div>
    )
  }

  const currentEvent = events[currentIndex]

  return (
    <div
      ref={carouselRef}
      style={{
        position: 'relative',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 12px'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header del carrusel */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{
          fontFamily: 'Chakra Petch',
          color: '#D4AF37',
          fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)',
          margin: '0 0 0.4rem'
        }}>
          Próximos Eventos
        </h2>
        <p style={{
          color: '#94a3b8',
          fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
          maxWidth: '560px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          No te pierdas nuestras próximas actividades
        </p>
      </div>

      {/* Carrusel principal */}
      <div className="events-carousel-frame" style={{
        position: 'relative',
        background: 'rgba(26,26,26,0.9)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        {/* Contenido del evento: embed Luma o imagen */}
        <div className="events-carousel-content" style={{
          position: 'relative',
          height: 'clamp(260px, 42vw, 400px)',
          overflow: 'hidden'
        }}>
          {currentEvent.lumaEventId ? (
            <iframe
              src={`https://luma.com/embed/event/${currentEvent.lumaEventId}/simple`}
              title={currentEvent.title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                background: '#fff'
              }}
              allow="fullscreen; payment"
            />
          ) : (
            <OptimizedImage
              src={currentEvent.image}
              alt={currentEvent.title}
              fallback="/images/LogosCriptounam2.svg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(26,26,26,0.8)'
              }}
              onError={() => {}}
              onLoad={() => {
                if (carouselRef.current) {
                  const img = carouselRef.current.querySelector('img')
                  if (img) {
                    img.style.transform = 'scale(1.05)'
                  }
                }
              }}
            />
          )}
          
          {/* Badge de fecha sobre el contenido */}
          <div style={{
            position: 'absolute',
            bottom: '0.7rem',
            left: '0.7rem',
            right: '0.7rem',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(0,0,0,0.7)',
              padding: '0.4rem 0.8rem',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              backdropFilter: 'blur(8px)'
            }}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#D4AF37', fontSize: '0.78rem' }} />
              <span>{currentEvent.date} {currentEvent.time && `| ${currentEvent.time}`}</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        {showNavigation && events.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              style={{
                position: 'absolute',
                left: 'clamp(8px, 2vw, 18px)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#D4AF37',
                width: 'clamp(34px, 7vw, 44px)',
                height: 'clamp(34px, 7vw, 44px)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D4AF37'
                e.currentTarget.style.color = '#0A0A0A'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26,26,26,0.8)'
                e.currentTarget.style.color = '#D4AF37'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: 'clamp(8px, 2vw, 18px)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#D4AF37',
                width: 'clamp(34px, 7vw, 44px)',
                height: 'clamp(34px, 7vw, 44px)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D4AF37'
                e.currentTarget.style.color = '#0A0A0A'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26,26,26,0.8)'
                e.currentTarget.style.color = '#D4AF37'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
      </div>

      {/* Indicadores */}
      {showIndicators && events.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '0.9rem'
        }}>
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.6)'
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.3)'
                }
              }}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default EventsCarousel

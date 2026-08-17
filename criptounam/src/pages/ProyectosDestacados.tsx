import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faExternalLinkAlt, faCode } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import SEOHead from '../components/SEOHead'
import { proyectosHacksData } from '../data/proyectosHacksData'
import '../styles/global.css'

const ProyectosDestacados = () => {
  return (
    <>
      <SEOHead
        title="Proyectos y Hackathones - CriptoUNAM"
        description="Proyectos de hackathones desarrollados por la comunidad CriptoUNAM. Mantle, Stellar, Solana, Base, Celo, Polkadot y más."
        image="https://criptounam.xyz/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/proyectos"
        type="website"
      />
      <div className="section" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#D4AF37',
                textDecoration: 'none',
                marginBottom: '1rem',
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Volver al Inicio
            </Link>
            <h1
              style={{
                fontFamily: 'Chakra Petch',
                color: '#D4AF37',
                fontSize: '2.5rem',
                marginBottom: '1rem',
              }}
            >
              Proyectos y Hackathones
            </h1>
            <p style={{ color: '#E0E0E0', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              Proyectos reales desarrollados por CriptoUNAM en hackathones. Demo, código y red en cada tarjeta.
            </p>
          </div>

          {/* Grid de proyectos */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            {proyectosHacksData.map((proyecto) => (
              <div
                key={proyecto.id}
                style={{
                  background: 'rgba(26,26,26,0.95)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212,175,55,0.3)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = '#D4AF37'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                {/* Imagen del proyecto */}
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                  }}
                >
                  <img
                    src={proyecto.imagen}
                    alt={proyecto.nombre}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '1.25rem', margin: 0 }}>
                      {proyecto.nombre}
                    </h3>
                    <span
                      style={{
                        background: 'rgba(37,99,235,0.25)',
                        color: '#60A5FA',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {proyecto.red}
                    </span>
                  </div>
                  <p style={{ color: '#E0E0E0', lineHeight: 1.5, margin: '0 0 1rem 0', fontSize: '0.95rem', flex: 1 }}>
                    {proyecto.descripcion}
                  </p>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {proyecto.demo && (
                      <a
                        href={proyecto.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'linear-gradient(45deg, #D4AF37, #b8962e)',
                          color: '#0A0A0A',
                          padding: '0.5rem 1rem',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                        Demo
                      </a>
                    )}
                    {proyecto.repo && (
                      <a
                        href={proyecto.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: 'rgba(26,26,26,0.9)',
                          color: '#E0E0E0',
                          padding: '0.5rem 1rem',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          border: '1px solid rgba(212,175,55,0.3)',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#D4AF37'
                          e.currentTarget.style.color = '#0A0A0A'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(26,26,26,0.9)'
                          e.currentTarget.style.color = '#E0E0E0'
                        }}
                      >
                        <FontAwesomeIcon icon={faGithub} />
                        Repo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div
            style={{
              textAlign: 'center',
              background: 'rgba(26,26,26,0.8)',
              borderRadius: '20px',
              padding: '3rem',
              border: '1px solid rgba(212,175,55,0.3)',
              marginTop: '3rem',
            }}
          >
            <h2 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', fontSize: '2rem', marginBottom: '1rem' }}>
              ¿Tienes un proyecto?
            </h2>
            <p style={{ color: '#E0E0E0', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Únete a nuestra comunidad y desarrolla el próximo proyecto blockchain en un hackathon
            </p>
            <Link
              to="/eventos#comunidad"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(45deg, #D4AF37, #2563EB)',
                color: '#0A0A0A',
                padding: '1rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Únete a la Comunidad
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProyectosDestacados

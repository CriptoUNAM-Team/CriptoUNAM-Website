import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faUsers, 
  faGraduationCap, 
  faTrophy,
  faArrowRight,
  faPlay,
  faCode,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';

interface InteractiveCTAProps {
  title: string;
  description: string;
}

const InteractiveCTA: React.FC<InteractiveCTAProps> = ({ title, description }) => {
  const handleJoinClick = () => {
    // Scroll suave a la sección de registro
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      maxWidth: '1000px',
      margin: '0 auto 3rem auto',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(26, 26, 26, 0.9)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Título principal */}
        <h2 style={{
          fontFamily: 'Chakra Petch',
          color: '#D4AF37',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          {title}
        </h2>

        {/* Descripción */}
        <p style={{
          color: '#E0E0E0',
          fontSize: '1.1rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto',
          lineHeight: '1.5'
        }}>
          {description}
        </p>

        {/* Estadística simple */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(26, 26, 26, 0.8)',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'white'
            }}>
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#3B82F6',
                fontFamily: 'Chakra Petch',
                marginBottom: '0.25rem'
              }}>
                50+
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#D4AF37',
                fontWeight: '600'
              }}>
                Cursos Completados
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={handleJoinClick}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faRocket} />
            Únete Ahora
          </button>

          <button
            onClick={() => window.open('/cursos', '_self')}
            style={{
              background: 'rgba(37, 99, 235, 0.8)',
              color: 'white',
              border: '1px solid #2563EB',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(37, 99, 235, 1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(37, 99, 235, 0.8)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} />
            Ver Cursos
          </button>
        </div>

        {/* Texto motivacional */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <p style={{
            color: '#E0E0E0',
            fontSize: '1rem',
            margin: '0',
            fontStyle: 'italic'
          }}>
            "El futuro de la tecnología blockchain está en las manos de la próxima generación. 
            Únete a CriptoUNAM y sé parte de la revolución digital."
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCTA;

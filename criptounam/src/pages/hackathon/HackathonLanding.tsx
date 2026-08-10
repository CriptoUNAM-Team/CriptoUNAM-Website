import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../../components/SEOHead'
import HackathonLayout from './HackathonLayout'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import HeroSection from '../../components/hackathon/sections/HeroSection'
import SobreSection from '../../components/hackathon/sections/SobreSection'
import TracksSection from '../../components/hackathon/sections/TracksSection'
import PremiosSection from '../../components/hackathon/sections/PremiosSection'
import AgendaSection from '../../components/hackathon/sections/AgendaSection'
import SedesSection from '../../components/hackathon/sections/SedesSection'
import CriteriosSection from '../../components/hackathon/sections/CriteriosSection'
import SponsorsSection from '../../components/hackathon/sections/SponsorsSection'
import ActualizacionesSection from '../../components/hackathon/sections/ActualizacionesSection'
import CtaFinalSection from '../../components/hackathon/sections/CtaFinalSection'
import '../../styles/hackathon.css'

/** Atajos a las páginas hermanas, al pie de la landing. */
const RECURSOS = [
  {
    to: '/hackathon/guia',
    icon: faBook,
    titulo: 'Guía del Hacker',
    desc: 'Setup, stack recomendado, reglas y cómo preparar el pitch.',
  },
  {
    to: '/hackathon/talleres',
    icon: faChalkboardTeacher,
    titulo: 'Talleres virtuales',
    desc: 'Sesiones previas al kickoff para llegar con el entorno listo.',
  },
]

const HackathonLanding: React.FC = () => {
  // Un solo observer para toda la página: revela los `.hack-reveal` de las
  // secciones a medida que entran en pantalla.
  const contenedor = useRevealOnScroll<HTMLDivElement>()

  return (
    <HackathonLayout>
      <SEOHead
        title="Hackathon UNAM 2026 · AI & Blockchain"
        description="72 horas para construir con Inteligencia Artificial y Web3 en la Facultad de Ingeniería de la UNAM. Registro gratuito, premios, talleres y mentorías."
      />

      <div ref={contenedor}>
        <HeroSection />

        <div style={{ marginTop: '4rem' }}>
          <SobreSection />
          <TracksSection />
          <PremiosSection />
          <AgendaSection />
          <SedesSection />
          <CriteriosSection />
          <ActualizacionesSection />
          <SponsorsSection />

          {/* Recursos */}
          <section style={{ marginBottom: '4rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {RECURSOS.map((r, i) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className="hack-card hack-reveal"
                  style={
                    {
                      '--i': i,
                      textDecoration: 'none',
                      display: 'block',
                    } as React.CSSProperties
                  }
                >
                  <FontAwesomeIcon
                    icon={r.icon}
                    style={{ color: '#D4AF37', fontSize: '1.25rem', marginBottom: '0.7rem' }}
                  />
                  <h3
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      color: '#fff',
                      fontSize: '1rem',
                      margin: '0 0 0.4rem',
                    }}
                  >
                    {r.titulo}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                    {r.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <CtaFinalSection />
        </div>
      </div>
    </HackathonLayout>
  )
}

export default HackathonLanding

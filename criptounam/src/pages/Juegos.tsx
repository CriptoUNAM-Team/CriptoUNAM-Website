import React from 'react'
import SEOHead from '../components/SEOHead'
import PageHero from '../components/PageHero'
import PumaRunnerGame from '../components/Puma/PumaRunnerGame'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGamepad,
  faTrophy,
  faBolt,
  faCoins,
  faKeyboard,
  faShieldHalved,
  faShareAlt
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const Juegos: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Arcade CriptoUNAM - Cyber Puma Runner"
        description="Juega Cyber Puma Runner, alcanza el puntaje más alto y reclama tokens $PUMA directamente en la blockchain."
        image="/images/Equipo/puma_avatar_1.png"
        url="https://criptounam.xyz/juegos"
        type="website"
      />

      <div style={{ padding: '0.5rem clamp(0.5rem, 3vw, 1rem) 3.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <PumaPausedBanner />
        </div>

        <PageHero
          icon={faGamepad}
          iconColor="#2563EB"
          iconGradient="linear-gradient(135deg, #2563EB, #F4D03F)"
          eyebrow="Web3 Arcade"
          title="Cyber Puma Runner"
          description="Demuestra tu agilidad en nuestro minijuego arcade. Recolecta monedas PUMA, esquiva los cortafuegos y desbloquea transacciones de recompensa en Avalanche Fuji."
          accentRgba="rgba(37, 99, 235, 0.12)"
          stats={[
            {
              icon: faCoins,
              label: 'Recompensas',
              value: 'Up to 210 PUMA',
              color: '#F4D03F',
            },
            {
              icon: faTrophy,
              label: 'Rango Máximo',
              value: 'Maestro Cripto',
              color: '#60a5fa',
            },
            {
              icon: faBolt,
              label: 'Red Web3',
              value: 'Avalanche Fuji',
              color: '#4ade80',
            },
          ]}
        />

        {/* Contenedor Principal del Juego */}
        <section style={{ maxWidth: 1000, margin: '0 auto 2rem' }}>
          <PumaRunnerGame />
        </section>

        {/* Guía de Juego y Powerups */}
        <section
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <div
            className="puma-card"
            style={{
              padding: '1.5rem',
              borderRadius: 16,
              background: 'rgba(20, 20, 30, 0.6)',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
              <FontAwesomeIcon icon={faKeyboard} style={{ fontSize: '1.2rem', color: '#F4D03F' }} />
              <h3 style={{ fontFamily: 'Chakra Petch', color: '#fff', margin: 0, fontSize: '1.1rem' }}>
                Controles y Mecánicas
              </h3>
            </div>
            <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, paddingLeft: '1.2rem', margin: 0 }}>
              <li>
                <strong style={{ color: '#F4D03F' }}>Salto:</strong> Presiona la tecla <code style={{ color: '#fff', background: '#333', padding: '2px 6px', borderRadius: 4 }}>ESPACIO</code>, <code style={{ color: '#fff', background: '#333', padding: '2px 6px', borderRadius: 4 }}>W</code> o haz clic/touch en la pantalla.
              </li>
              <li>
                <strong style={{ color: '#60a5fa' }}>Doble Salto:</strong> Vuelve a presionar en el aire para esquivar trampas anchas o láseres altos.
              </li>
              <li>
                <strong style={{ color: '#f97316' }}>Deslizarse:</strong> Presiona <code style={{ color: '#fff', background: '#333', padding: '2px 6px', borderRadius: 4 }}>S</code> o <code style={{ color: '#fff', background: '#333', padding: '2px 6px', borderRadius: 4 }}>FLECHA ABAJO</code> para pasar debajo de cortafuegos de alto nivel.
              </li>
              <li>
                <strong style={{ color: '#a855f7' }}>Caída Rápida:</strong> Presiona hacia abajo mientras estás en el aire para tocar el suelo inmediatamente.
              </li>
            </ul>
          </div>

          <div
            className="puma-card"
            style={{
              padding: '1.5rem',
              borderRadius: 16,
              background: 'rgba(20, 20, 30, 0.6)',
              border: '1px solid rgba(37, 99, 235, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '1.2rem', color: '#60a5fa' }} />
              <h3 style={{ fontFamily: 'Chakra Petch', color: '#fff', margin: 0, fontSize: '1.1rem' }}>
                Tokens y Power-ups
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(244, 208, 63, 0.2)', border: '1px solid #F4D03F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#F4D03F', fontFamily: 'Chakra Petch', flexShrink: 0 }}>
                  P
                </div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#F4D03F' }}>Moneda PUMA:</strong> Aumenta +50 puntos tu marcador y acumula tu botín virtual de la partida.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                  🛡️
                </div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#60a5fa' }}>Escudo Web3:</strong> Te otorga invulnerabilidad durante 5 segundos y destruye cualquier obstáculo que toques.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(74, 222, 128, 0.2)', border: '1px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', flexShrink: 0 }}>
                  <FontAwesomeIcon icon={faBolt} />
                </div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#4ade80' }}>Cobro On-Chain:</strong> Al superar 500, 1,500 y 3,000 puntos puedes reclamar tokens PUMA al contrato.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Juegos

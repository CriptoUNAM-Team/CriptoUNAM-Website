import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import SEOHead from '../../components/SEOHead'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { HACKATHON_INFO, FECHAS_CARTEL } from '../../data/hackathonInfo'
import Backdrop from '../../components/goya/Backdrop'
import Nav from '../../components/hackathon/goya/Nav'
import Hero from '../../components/hackathon/goya/Hero'
import Donde from '../../components/hackathon/goya/Donde'
import SedeCIA from '../../components/hackathon/goya/SedeCIA'
import PremiosTracks from '../../components/hackathon/goya/PremiosTracks'
import TalleresPublicos from '../../components/hackathon/goya/TalleresPublicos'
import StandPublico from '../../components/hackathon/goya/StandPublico'
import ProgramaAgenda from '../../components/hackathon/goya/ProgramaAgenda'
import Tangem from '../../components/hackathon/goya/Tangem'
import SedesSponsors from '../../components/hackathon/goya/SedesSponsors'
import Actualizaciones from '../../components/hackathon/goya/Actualizaciones'
import Faq from '../../components/hackathon/goya/Faq'
import CierreCTA from '../../components/hackathon/goya/CierreCTA'
import FooterGoya from '../../components/hackathon/goya/FooterGoya'
import { PixelSeparador } from '../../components/goya/PixelFlow'
import { goyaPointerGlow } from '../../lib/goyaAnime'

/**
 * Landing de Goya Hack — motion layer con anime.js (hero, reveal, glow).
 */
const HackathonLanding: React.FC = () => {
  const contenedor = useRevealOnScroll<HTMLDivElement>()
  const scope = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)
  const { hash } = useLocation()

  useEffect(() => {
    if (!scope.current || !glow.current) return
    return goyaPointerGlow(glow.current, scope.current)
  }, [])

  // Refuerzo local del scroll a anclas (además de ScrollToTop global).
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.replace(/^#/, ''))
    if (!id) return
    let cancelado = false
    const ir = () => {
      if (cancelado) return
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    const timers = [50, 250, 600].map((ms) => window.setTimeout(ir, ms))
    return () => {
      cancelado = true
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [hash])

  return (
    <div ref={scope} className="goya-scope relative min-h-screen overflow-x-hidden bg-goya-void font-sans">
      <SEOHead
        title="Goya Hack · Hackathon UNAM 2026"
        description={
          `Goya Hack: ${HACKATHON_INFO.horas} horas para construir con inteligencia artificial y Web3 ` +
          `en la Facultad de Ingeniería de la UNAM, del ${FECHAS_CARTEL.completo} de 2026. ` +
          `Registro gratuito, mentorías, premios y certificado oficial en blockchain.`
        }
      />

      <Backdrop tono="noche" />

      {/* Halo que sigue el puntero — solo desktop, se desactiva en reduced-motion. */}
      <div
        ref={glow}
        className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[360px] w-[360px] md:block"
        style={{
          background: 'radial-gradient(circle, rgba(233,175,60,0.14) 0%, transparent 68%)',
          mixBlendMode: 'screen',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      <div ref={contenedor} className="relative z-10">
        <Nav />

        <main>
          <Hero />
          <PixelSeparador formas={['cruz', 'orbita', 'diamante']} tono="text-goya-paper/35" />
          <Donde />
          <PixelSeparador formas={['escalera', 'anillo', 'columnas', 'cruz']} tono="text-goya-amber/35" />
          <SedeCIA />
          <PixelSeparador formas={['diamante', 'orbita', 'anillo']} tono="text-goya-paper/35" />
          <PremiosTracks />
          <PixelSeparador formas={['columnas', 'cruz', 'escalera', 'diamante']} tono="text-goya-amber/40" />
          <Tangem />
          <PixelSeparador formas={['anillo', 'orbita', 'cruz']} tono="text-goya-paper/35" />
          <TalleresPublicos />
          <PixelSeparador formas={['escalera', 'diamante', 'columnas', 'anillo']} tono="text-goya-paper/30" />
          <StandPublico />
          <PixelSeparador formas={['cruz', 'anillo', 'orbita']} tono="text-goya-amber/30" />
          <ProgramaAgenda />
          <PixelSeparador formas={['diamante', 'columnas', 'escalera', 'cruz']} tono="text-goya-paper/35" />
          <SedesSponsors />
          <PixelSeparador formas={['orbita', 'anillo', 'diamante']} tono="text-goya-paper/30" />
          <Actualizaciones />
          <PixelSeparador formas={['cruz', 'escalera', 'columnas', 'orbita']} tono="text-goya-amber/35" />
          <Faq />
          <PixelSeparador formas={['anillo', 'diamante', 'cruz']} tono="text-goya-paper/35" />
          <CierreCTA />
        </main>

        <FooterGoya />
      </div>
    </div>
  )
}

export default HackathonLanding

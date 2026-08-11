import React from 'react'
import SEOHead from '../../components/SEOHead'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import ScrollVideo from '../../components/hackathon/ScrollVideo'
import Nav from '../../components/hackathon/goya/Nav'
import Hero from '../../components/hackathon/goya/Hero'
import ValueProps from '../../components/hackathon/goya/ValueProps'
import Tracks from '../../components/hackathon/goya/Tracks'
import Premios from '../../components/hackathon/goya/Premios'
import TimelineCriterios from '../../components/hackathon/goya/TimelineCriterios'
import SedesSponsors from '../../components/hackathon/goya/SedesSponsors'
import Actualizaciones from '../../components/hackathon/goya/Actualizaciones'
import Faq from '../../components/hackathon/goya/Faq'
import FooterGoya from '../../components/hackathon/goya/FooterGoya'

/**
 * Landing del Hackathon UNAM 2026.
 *
 * El vídeo de fondo va fijo detrás de todo y avanza con el scroll; las
 * secciones flotan encima en paneles translúcidos.
 *
 * Trae cabecera y pie propios en vez de `HackathonLayout`: el diseño necesita
 * ancho completo bajo una barra fija, y las pestañas del layout compartido
 * romperían la composición. El resto de páginas del hackathon sí lo siguen
 * usando.
 */
const HackathonLanding: React.FC = () => {
  const contenedor = useRevealOnScroll<HTMLDivElement>()

  return (
    <div className="relative bg-ink">
      <SEOHead
        title="Hackathon UNAM 2026 · AI & Blockchain"
        description="72 horas para construir con inteligencia artificial y Web3 en la Facultad de Ingeniería de la UNAM. Registro gratuito, mentorías, premios y POAP."
      />

      <ScrollVideo src="/video/hackathon-hero.mp4" poster="/video/hackathon-hero-poster.jpg" />

      <div ref={contenedor} className="relative z-10">
        <Nav />

        <main>
          <Hero />

          {/* Da recorrido al vídeo entre el hero y la siguiente sección. */}
          <div className="h-[80vh]" aria-hidden="true" />

          <ValueProps />
          <Tracks />
          <Premios />
          <TimelineCriterios />
          <SedesSponsors />
          <Actualizaciones />
          <Faq />
        </main>

        <FooterGoya />
      </div>
    </div>
  )
}

export default HackathonLanding

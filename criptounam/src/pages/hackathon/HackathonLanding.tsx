import React from 'react'
import SEOHead from '../../components/SEOHead'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { HACKATHON_INFO, FECHAS_CARTEL } from '../../data/hackathonInfo'
import Backdrop from '../../components/goya/Backdrop'
import Nav from '../../components/hackathon/goya/Nav'
import { useGoyaTheme } from '../../hooks/useGoyaTheme'
import Hero from '../../components/hackathon/goya/Hero'
import Donde from '../../components/hackathon/goya/Donde'
import SedeCIA from '../../components/hackathon/goya/SedeCIA'
import PremiosTracks from '../../components/hackathon/goya/PremiosTracks'
import ProgramaAgenda from '../../components/hackathon/goya/ProgramaAgenda'
import SedesSponsors from '../../components/hackathon/goya/SedesSponsors'
import Actualizaciones from '../../components/hackathon/goya/Actualizaciones'
import Faq from '../../components/hackathon/goya/Faq'
import CierreCTA from '../../components/hackathon/goya/CierreCTA'
import FooterGoya from '../../components/hackathon/goya/FooterGoya'

/**
 * Landing de Goya Hack.
 *
 * El diseño es la traducción a pantalla del cartel oficial: negro #010004 con
 * retícula azul, ámbar #E9AF3C, versalitas achaflanadas y la G de píxeles. El
 * fondo va fijo detrás de todo (`Backdrop`) y las secciones scrollean por
 * encima.
 */
const HackathonLanding: React.FC = () => {
  const contenedor = useRevealOnScroll<HTMLDivElement>()
  const { isLight } = useGoyaTheme()

  return (
    <div className="goya-scope relative min-h-screen bg-goya-void font-sans">
      <SEOHead
        title="Goya Hack · Hackathon UNAM 2026"
        description={
          `Goya Hack: ${HACKATHON_INFO.horas} horas para construir con inteligencia artificial y Web3 ` +
          `en la Facultad de Ingeniería de la UNAM, del ${FECHAS_CARTEL.completo} de 2026. ` +
          `Registro gratuito, mentorías, premios y POAP.`
        }
      />

      <Backdrop tono={isLight ? 'dia' : 'noche'} />

      <div ref={contenedor} className="relative z-10">
        <Nav />

        <main>
          <Hero />
          <Donde />
          <SedeCIA />
          <PremiosTracks />
          <ProgramaAgenda />
          <SedesSponsors />
          <Actualizaciones />
          <Faq />
          <CierreCTA />
        </main>

        <FooterGoya />
      </div>
    </div>
  )
}

export default HackathonLanding

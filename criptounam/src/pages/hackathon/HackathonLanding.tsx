import React from 'react'
import SEOHead from '../../components/SEOHead'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { HACKATHON_INFO, FECHAS_CARTEL } from '../../data/hackathonInfo'
import Backdrop from '../../components/goya/Backdrop'
import Nav from '../../components/hackathon/goya/Nav'
import Hero from '../../components/hackathon/goya/Hero'
import ValueProps from '../../components/hackathon/goya/ValueProps'
import Tracks from '../../components/hackathon/goya/Tracks'
import Premios from '../../components/hackathon/goya/Premios'
import TimelineCriterios from '../../components/hackathon/goya/TimelineCriterios'
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
 *
 * Trae cabecera y pie propios en vez de `HackathonLayout`: el diseño necesita
 * ancho completo bajo una barra fija, y las pestañas del layout compartido
 * romperían la composición. El resto de páginas del hackathon sí lo siguen
 * usando.
 */
const HackathonLanding: React.FC = () => {
  const contenedor = useRevealOnScroll<HTMLDivElement>()

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

      <Backdrop tono="noche" />

      <div ref={contenedor} className="relative z-10">
        <Nav />

        <main>
          <Hero />
          <ValueProps />
          <Tracks />
          <Premios />
          <TimelineCriterios />
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

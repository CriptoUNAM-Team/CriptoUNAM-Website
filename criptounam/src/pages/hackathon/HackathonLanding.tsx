import React from 'react'
import SEOHead from '../../components/SEOHead'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { HACKATHON_INFO, FECHAS_CARTEL } from '../../data/hackathonInfo'
import Backdrop from '../../components/goya/Backdrop'
import Nav from '../../components/hackathon/goya/Nav'
import Hero from '../../components/hackathon/goya/Hero'
import TracksExperiencia from '../../components/hackathon/goya/TracksExperiencia'
import Premios from '../../components/hackathon/goya/Premios'
import ProgramaAgenda from '../../components/hackathon/goya/ProgramaAgenda'
import SedesSponsors from '../../components/hackathon/goya/SedesSponsors'
import BandaCU from '../../components/goya/BandaCU'
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
          <TracksExperiencia />
          <Premios />
          <ProgramaAgenda />
          <SedesSponsors />
          <BandaCU
            id="cia"
            rotulo="Sede"
            titulo="Centro de Ingeniería Avanzada"
            etiqueta="CIA · Edificio X · Facultad de Ingeniería, UNAM"
            pie="Aquí se construye"
            subpie={`${HACKATHON_INFO.horas} horas · ${FECHAS_CARTEL.completo}`}
            videoSrc="/video/CIA.mp4"
            posterSrc="/images/CIA1.png"
          />
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

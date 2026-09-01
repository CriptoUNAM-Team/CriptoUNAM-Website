import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import ComunidadPageContent from '../components/ComunidadPageContent'
import Seccion from '../components/goya/Seccion'
import Reveal from '../components/Reveal'
import LumaCheckout from '../components/goya/LumaCheckout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faExternalLinkAlt,
  faLocationDot,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons'
import { faTelegram, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  HACKATHON_INFO,
  NUM_TRACKS,
  TRACKS_EN_LINEA,
  FECHAS_CARTEL,
} from '../data/hackathonInfo'
import { hackathonsData, eventosLumaPasados } from '../data/eventosData'
import '../styles/global.css'

const REDES = [
  { url: 'https://t.me/criptounam', label: 'Telegram', icon: faTelegram },
  { url: 'https://twitter.com/criptounam', label: 'X / Twitter', icon: faXTwitter },
]

const Eventos = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#comunidad') {
      const el = document.getElementById('comunidad')
      requestAnimationFrame(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }, [location.hash])

  // El hackathon propio va destacado arriba; el resto de convocatorias, en su
  // propia retícula.
  const otrosHackathones = hackathonsData.filter((h) => h.id !== 'hack-unam-2026')
  const pasados = eventosLumaPasados

  const cifras = [
    { valor: String(NUM_TRACKS), etiqueta: 'Tracks' },
    { valor: String(HACKATHON_INFO.horas), etiqueta: 'Horas' },
    { valor: String(pasados.length), etiqueta: 'Eventos hechos' },
  ]

  return (
    <div className="goya-scope">
      <SEOHead
        title="Eventos — CriptoUNAM"
        description="Eventos, hackathones y comunidad CriptoUNAM. Construye con blockchain e inteligencia artificial."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/eventos"
        type="website"
      />

      {/* ---- Cabecera ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 pb-4 pt-8 sm:px-8 md:px-12 md:pt-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal
              inmediato
              as="p"
              delay={100}
              className="font-mono text-[11px] uppercase tracking-label text-goya-amber"
            >
              Meetups · Hackathones · Talleres
            </Reveal>

            <Reveal
              inmediato
              as="h1"
              delay={180}
              className="goya-rule mt-3 w-fit font-display text-4xl uppercase leading-none tracking-wide text-goya-paper sm:text-5xl md:text-6xl"
            >
              CriptoUNAM en acción
            </Reveal>

            <Reveal
              inmediato
              as="p"
              delay={260}
              className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400"
            >
              Nos juntamos en Ciudad Universitaria a construir. Aquí está lo que
              viene y lo que ya hicimos.
            </Reveal>
          </div>

          <Reveal inmediato as="div" delay={320} className="flex flex-wrap gap-3">
            {cifras.map((c) => (
              <span
                key={c.etiqueta}
                className="goya-cut flex min-w-[6.5rem] flex-col gap-1 border border-goya-amber/30 px-4 py-3"
                style={{ ['--cut' as string]: '9px' }}
              >
                <span className="font-display text-2xl leading-none text-goya-paper">
                  {c.valor}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-label text-slate-500">
                  {c.etiqueta}
                </span>
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---- Goya Hack, destacado ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 md:px-12">
        <div className="goya-panel goya-panel-lit" style={{ ['--cut' as string]: '28px' }}>
          <div className="flex flex-col gap-10 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="min-w-0">
              <Reveal
                as="p"
                delay={100}
                className="font-mono text-[11px] uppercase tracking-label text-goya-amber"
              >
                {HACKATHON_INFO.registroAbierto ? 'Inscripciones abiertas' : 'Próximamente'}
                {' · '}
                {HACKATHON_INFO.event}
              </Reveal>

              <Reveal
                as="h2"
                delay={180}
                className="mt-4 font-display text-4xl uppercase leading-[1] tracking-wide text-goya-paper sm:text-5xl"
              >
                {HACKATHON_INFO.brand}
              </Reveal>

              <Reveal
                as="p"
                delay={240}
                className="goya-rule mt-3 w-fit font-mono text-sm uppercase tracking-label text-goya-amber"
              >
                {FECHAS_CARTEL.completo} · Facultad de Ingeniería
              </Reveal>

              <Reveal
                as="p"
                delay={300}
                className="mt-5 max-w-lg text-sm leading-relaxed text-slate-400"
              >
                {HACKATHON_INFO.horas} horas construyendo con inteligencia artificial y Web3 en{' '}
                {NUM_TRACKS} tracks: {TRACKS_EN_LINEA}. Gratis y abierto a estudiantes de cualquier
                universidad.
              </Reveal>

              <Reveal as="div" delay={380} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {/* Inscripción de asistencia en Luma; el equipo y el proyecto
                    se arman después en la plataforma. */}
                <LumaCheckout
                  eventId={HACKATHON_INFO.lumaEventId}
                  className="goya-cut inline-flex items-center justify-center gap-2 bg-goya-amber px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
                  style={{ ['--cut' as string]: '9px' }}
                >
                  Inscribirse al evento
                  <FontAwesomeIcon icon={faArrowRight} className="text-[0.6rem]" />
                </LumaCheckout>
                <Link
                  to="/hackathon"
                  className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                  style={{ ['--cut' as string]: '9px' }}
                >
                  Conoce Goya Hack
                </Link>
                <Link
                  to="/hackathon/dashboard"
                  className="goya-cut inline-flex items-center justify-center border border-goya-amber/40 px-6 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                  style={{ ['--cut' as string]: '9px' }}
                >
                  Mi panel
                </Link>
              </Reveal>
            </div>

            <Reveal as="div" delay={220} className="w-full shrink-0 lg:w-[420px]">
              <img
                src="/images/semanadie/sponsorship/facultad-ingenieria-aereo.jpg"
                alt="Facultad de Ingeniería, UNAM"
                loading="lazy"
                className="goya-cut h-56 w-full object-cover opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 lg:h-64"
                style={{ ['--cut' as string]: '16px' }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Otras convocatorias ---- */}
      {otrosHackathones.length > 0 && (
        <Seccion
          rotulo="Convocatorias"
          titulo="Otros hackathones"
          intro="Competencias abiertas en las que participa la comunidad. Si entras, cuéntanos y te apoyamos."
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {otrosHackathones.map((h, i) => (
              <Reveal
                key={h.id}
                as="article"
                delay={160 + i * 100}
                className="goya-panel goya-panel-hover h-full"
              >
                <div className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-label text-goya-amber">
                      {h.date}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-label ${
                        h.status === 'upcoming' ? 'text-emerald-300' : 'text-slate-600'
                      }`}
                    >
                      {h.status === 'upcoming' ? 'Abierto' : h.status === 'live' ? 'En curso' : 'Cerrado'}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg uppercase leading-tight tracking-wide text-goya-paper">
                    {h.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                    {h.description}
                  </p>

                  <div className="mt-5 flex flex-col gap-2 border-t border-goya-amber/15 pt-4 font-mono text-[10px] uppercase tracking-label text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: '0.6rem' }} />
                      {h.location}
                    </span>
                    {h.prizes && <span className="text-goya-amber/80">{h.prizes}</span>}
                  </div>

                  <a
                    href={h.url}
                    target={h.url.startsWith('http') ? '_blank' : undefined}
                    rel={h.url.startsWith('http') ? 'noreferrer' : undefined}
                    className="group mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                  >
                    Ver convocatoria
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-[0.6rem] transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Seccion>
      )}

      {/* ---- Eventos ya realizados ---- */}
      {pasados.length > 0 && (
        <Seccion
          rotulo="Histórico"
          titulo="Lo que ya hicimos"
          intro="Charlas, talleres y bootcamps de la comunidad. La mayoría en la Facultad de Ingeniería."
        >
          <ol className="m-0 list-none border-t border-goya-amber/15 p-0">
            {pasados.map((e, i) => (
              <Reveal
                key={e.id}
                as="div"
                delay={110 + (i % 8) * 60}
                className="flex flex-col gap-2 border-b border-goya-amber/15 py-5 md:flex-row md:items-baseline md:gap-8"
              >
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-goya-amber md:w-40">
                  {e.date}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base uppercase tracking-wide text-goya-paper">
                    {e.title}
                  </h3>
                  {e.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{e.description}</p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-label text-slate-500 md:max-w-[16rem] md:text-right">
                  {e.location}
                </span>
              </Reveal>
            ))}
          </ol>
        </Seccion>
      )}

      {/* ---- Lo que viene ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 md:px-12">
        <Reveal as="div" className="goya-panel" style={{ ['--cut' as string]: '22px' }}>
          <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{ color: '#E9AF3C', fontSize: '1.4rem', marginTop: 4 }}
              />
              <div>
                <h2 className="font-display text-xl uppercase tracking-wide text-goya-paper">
                  Más eventos próximamente
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
                  Estamos preparando meetups, talleres y sesiones. Síguenos y activa las
                  notificaciones para enterarte primero.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              {REDES.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="goya-cut inline-flex items-center gap-2 border border-goya-amber/40 px-5 py-3 font-mono text-[11px] uppercase tracking-label text-goya-paper no-underline transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
                  style={{ ['--cut' as string]: '9px' }}
                >
                  <FontAwesomeIcon icon={r.icon} />
                  {r.label}
                  <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.6rem' }} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- Comunidad ---- */}
      <Seccion
        id="comunidad"
        rotulo="Comunidad"
        titulo="Comunidad CriptoUNAM"
        intro="Red de estudiantes, desarrolladores y entusiastas del blockchain en la UNAM."
      >
        <ComunidadPageContent />
      </Seccion>
    </div>
  )
}

export default Eventos

import React, { useRef, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CreditCard, Download, Volume2, VolumeX, Wallet } from 'lucide-react'
import { TANGEM, TANGEM_PASOS, SPONSORS } from '../../../data/hackathonInfo'
import Reveal from '../../Reveal'
import Seccion from '../../goya/Seccion'
import { PixelFranja } from '../../goya/PixelFlow'

const ICONO_PASO: Record<string, React.ReactNode> = {
  descarga: <Download size={15} />,
  wallet: <Wallet size={15} />,
  tangempay: <CreditCard size={15} />,
}

/** El logo sale de SPONSORS para no tener la ruta escrita dos veces. */
const LOGO = SPONSORS.find((s) => s.id === 'tangem')?.logo

/**
 * Bloque de descarga. Se repite arriba y abajo de la sección a propósito: es
 * la única acción que la sección pide, y quien entra por el ancla `#tangem`
 * desde el menú tiene que encontrarla sin buscar.
 */
const BotonDescarga: React.FC<{ id?: string }> = ({ id }) => (
  <a
    id={id}
    href={TANGEM.enlaceApp}
    target="_blank"
    rel="noreferrer"
    /* Ancho completo en móvil: con `px-7` y el texto en versalitas espaciadas
     * el botón medía 339 px, y a 400 px de pantalla se quedaba a 21 px del
     * borde. Es la única acción de la sección — no puede verse apretada. */
    className="goya-cut goya-cta-glow group inline-flex w-full items-center justify-center gap-2.5 bg-goya-amber px-5 py-4 text-center font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper sm:w-auto sm:px-7"
    style={{ ['--cut' as string]: '10px' }}
  >
    <Download size={15} />
    Descargar la app de Tangem
    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
  </a>
)

/**
 * Sección exclusiva del patrocinador principal.
 *
 * Todo el bloque existe para una sola cosa: que la app se instale desde
 * `TANGEM.enlaceApp` y no desde la tienda. De ahí que no haya insignias de App
 * Store ni de Google Play —invitan justo a la descarga que no cuenta— y que el
 * enlace y el QR sean las únicas dos maneras de salir de aquí hacia la app.
 */
const Tangem: React.FC = () => {
  const video = useRef<HTMLVideoElement>(null)
  // El vídeo del stand lleva locución en español, así que arranca mudo —es lo
  // único que permiten los navegadores en autoplay— y se deja activar el audio.
  const [conAudio, setConAudio] = useState(false)

  const alternarAudio = () => {
    const v = video.current
    if (!v) return
    v.muted = conAudio
    setConAudio(!conAudio)
    if (!conAudio) v.play().catch(() => {})
  }

  return (
    <Seccion
      id="tangem"
      rotulo="Patrocinador principal"
      titulo="Tangem"
      intro="Tangem patrocina GOYA HACK y el track de Contenido. De aquí sale un requisito obligatorio para todas las personas participantes."
    >
      <Reveal as="div" delay={80} className="mb-8">
        <PixelFranja
          formas={['cruz', 'diamante', 'escalera']}
          tamano="sm"
          tono="text-goya-amber/50"
        />
      </Reveal>
      {/* Requisito obligatorio */}
      <Reveal as="div" delay={100} variante="scale" className="goya-panel goya-panel-lit overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
          <div className="p-6 sm:p-8">
            <span
              className="goya-cut inline-flex items-center gap-1.5 bg-goya-amber px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-label text-goya-void"
              style={{ ['--cut' as string]: '5px' }}
            >
              <AlertTriangle size={11} />
              Obligatorio
            </span>

            <h3 className="mt-3 font-display text-2xl uppercase leading-tight tracking-wide text-goya-paper sm:text-3xl">
              Tres pasos antes del kickoff
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              Aplica a <strong className="font-semibold text-goya-paper">todas las personas participantes</strong>,
              compitan en el CIA o en línea. Es requisito para entregar proyecto y para optar a los premios.
            </p>

            <ol className="mt-7 m-0 list-none space-y-5 p-0">
              {TANGEM_PASOS.map((paso, i) => (
                <li key={paso.id} className="flex gap-4">
                  <span
                    className={`goya-cut flex h-9 w-9 shrink-0 items-center justify-center p-0 font-mono text-[11px] font-bold ${
                      paso.critico
                        ? 'bg-goya-amber text-goya-void'
                        : 'border border-goya-amber/40 text-goya-amber'
                    }`}
                    style={{ ['--cut' as string]: '6px' }}
                    aria-hidden="true"
                  >
                    {ICONO_PASO[paso.id] ?? String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-display text-base uppercase tracking-wide text-goya-paper">
                      <span className="font-mono text-[11px] text-goya-amber">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {paso.titulo}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{paso.descripcion}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <BotonDescarga />
              <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-label text-slate-500">
                Abre join.tangem.com · el mismo destino que el QR
              </p>
            </div>
          </div>

          {/* QR */}
          <div className="flex flex-col items-center justify-center gap-4 border-t border-goya-amber/20 bg-white/[0.03] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-center font-mono text-[10px] uppercase tracking-label text-goya-amber">
              Escanea desde el móvil
            </p>
            <span className="rounded bg-white p-3">
              <img
                src={TANGEM.qr}
                alt={`Código QR para descargar la app de Tangem desde el enlace de GOYA HACK: ${TANGEM.enlaceApp}`}
                width={188}
                height={188}
                className="block h-[188px] w-[188px] max-w-full"
              />
            </span>
            <p className="max-w-[240px] text-center text-xs leading-relaxed text-slate-400">
              Es la forma más rápida: apunta con la cámara y la app se instala ya asociada a GOYA HACK.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Por qué solo desde este enlace */}
      <Reveal as="div" delay={160} className="goya-panel mt-4 p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-2 font-display text-base uppercase tracking-wide text-goya-amber">
          <AlertTriangle size={15} />
          Solo cuenta si la descargas desde aquí
        </p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
          El enlace y el QR de esta página llevan el identificador de GOYA HACK. Si instalas la app buscándola en la
          App Store o en Google Play, la descarga no queda asociada al hackathon y{' '}
          <strong className="font-semibold text-goya-paper">el requisito no se da por cumplido</strong>, aunque tengas
          la app y la wallet. Si ya la tenías instalada de antes, desinstálala y vuelve a instalarla desde el enlace.
        </p>
      </Reveal>

      {/* Vídeo + producto */}
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Reveal as="div" delay={200} className="goya-cut relative overflow-hidden bg-goya-void" style={{ ['--cut' as string]: '16px' }}>
          <video
            ref={video}
            className="block aspect-video w-full object-cover"
            src={TANGEM.video}
            poster={TANGEM.videoPoster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label="Vídeo de producto de Tangem"
          />
          <button
            type="button"
            onClick={alternarAudio}
            aria-pressed={conAudio}
            className="goya-cut absolute bottom-4 right-4 inline-flex items-center gap-2 border border-goya-amber/40 bg-goya-void/85 px-3 py-2 font-mono text-[10px] uppercase tracking-label text-goya-paper backdrop-blur-sm transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber"
            style={{ ['--cut' as string]: '6px' }}
          >
            {conAudio ? <Volume2 size={12} /> : <VolumeX size={12} />}
            {conAudio ? 'Audio activado' : 'Activar audio'}
          </button>
        </Reveal>

        <Reveal as="div" delay={240} className="grid gap-4">
          <div
            className="goya-panel relative flex items-center justify-center overflow-hidden p-6"
            style={{ ['--cut' as string]: '14px' }}
          >
            <img
              src={TANGEM.tarjetas}
              alt="Tarjetas Tangem"
              loading="lazy"
              className="max-h-40 w-full object-contain"
            />
          </div>
          <div className="goya-cut relative min-h-[180px] overflow-hidden bg-goya-void" style={{ ['--cut' as string]: '14px' }}>
            <img
              src={TANGEM.pago}
              alt="Pago sin contacto con una tarjeta Tangem"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(1,0,4,0.9) 0%, rgba(1,0,4,0.15) 55%, transparent 80%)',
              }}
              aria-hidden="true"
            />
            <p className="absolute inset-x-0 bottom-0 p-4 font-mono text-[10px] uppercase leading-relaxed tracking-label text-goya-paper">
              TangemPay · tu tarjeta en línea, lista desde la app
            </p>
          </div>
        </Reveal>
      </div>

      {/* Cierre */}
      <Reveal
        as="div"
        delay={280}
        variante="scale"
        className="goya-panel goya-panel-lit mt-4 flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-display text-xl uppercase tracking-wide text-goya-paper sm:text-2xl">
            <Check size={18} className="shrink-0 text-goya-amber" />
            ¿Ya lo tienes? Perfecto
          </p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
            App instalada desde el enlace, wallet creada y TangemPay con la verificación completada. Con eso cumples el
            requisito y puedes concentrarte en construir.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:items-center">
          <BotonDescarga />
          {LOGO && (
            <a
              href={TANGEM.sitio}
              target="_blank"
              rel="noreferrer"
              className="goya-cut inline-flex items-center justify-center border border-goya-amber/35 px-6 py-3 no-underline transition-colors duration-300 hover:border-goya-amber"
              style={{ ['--cut' as string]: '8px' }}
              title="Tangem"
            >
              <img
                src={LOGO}
                alt="Tangem"
                loading="lazy"
                /* El lockup de Tangem es apilado (icono sobre texto), no apaisado:
               * con un tope de 20 px salía a 30 px de ancho y no se leía. */
              className="max-h-10 max-w-[120px] object-contain opacity-80 transition-opacity duration-300 hover:opacity-100 [filter:brightness(0)_invert(1)]"
              />
            </a>
          )}
        </div>
      </Reveal>
    </Seccion>
  )
}

export default Tangem

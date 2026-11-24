import React, { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from 'framer-motion'

type Pieza = { texto: string; destacado?: boolean }

/**
 * El manifiesto de la comunidad, en grande. Cada palabra pasa de apagada a
 * encendida conforme la sección cruza la pantalla, así que la frase se "lee"
 * con el scroll. La palabra destacada va dentro de una placa ámbar achaflanada.
 */
const FRASE: Pieza[] = [
  { texto: 'Desde' },
  { texto: 'Ciudad' },
  { texto: 'Universitaria' },
  { texto: 'formamos' },
  { texto: 'a' },
  { texto: 'quienes' },
  { texto: 'construyen', destacado: true },
  { texto: 'la' },
  { texto: 'Web3:' },
  { texto: 'gratis,' },
  { texto: 'abierto' },
  { texto: 'y' },
  { texto: 'en' },
  { texto: 'comunidad.' },
]

const Palabra: React.FC<{
  pieza: Pieza
  progreso: MotionValue<number>
  rango: [number, number]
}> = ({ pieza, progreso, rango }) => {
  const opacidad = useTransform(progreso, rango, [0.14, 1])
  const y = useTransform(progreso, rango, [10, 0])

  if (pieza.destacado) {
    return (
      <motion.span
        style={{ opacity: opacidad, y, ['--cut' as string]: '14px' }}
        className="goya-cut mx-[0.08em] inline-block bg-goya-amber px-[0.28em] pb-[0.04em] text-goya-void"
      >
        {pieza.texto}
      </motion.span>
    )
  }

  return (
    <motion.span style={{ opacity: opacidad, y }} className="inline-block text-goya-paper">
      {pieza.texto}
    </motion.span>
  )
}

const ManifiestoScroll: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reducir = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  })

  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-5 py-28 sm:px-8 md:px-12 md:py-40">
      <div ref={ref} className="mx-auto max-w-5xl text-center">
        <p className="mb-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-label text-goya-amber">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-goya-amber" />
          Manifiesto
        </p>

        <h2 className="m-0 font-display text-[clamp(2rem,5.6vw,5rem)] font-semibold normal-case leading-[1.08] tracking-tight text-goya-paper">
          {reducir ? (
            FRASE.map((p, i) => (
              <React.Fragment key={i}>
                {p.destacado ? (
                  <span className="goya-cut mx-[0.08em] inline-block bg-goya-amber px-[0.28em] text-goya-void" style={{ ['--cut' as string]: '14px' }}>
                    {p.texto}
                  </span>
                ) : (
                  <span className="text-goya-paper">{p.texto}</span>
                )}{' '}
              </React.Fragment>
            ))
          ) : (
            FRASE.map((p, i) => {
              const inicio = i / FRASE.length
              const fin = Math.min(1, inicio + 1.6 / FRASE.length)
              return (
                <React.Fragment key={i}>
                  <Palabra pieza={p} progreso={scrollYProgress} rango={[inicio, fin]} />{' '}
                </React.Fragment>
              )
            })
          )}
        </h2>
      </div>
    </section>
  )
}

export default ManifiestoScroll

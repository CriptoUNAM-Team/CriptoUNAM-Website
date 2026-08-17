import React from 'react'

export type Tono = 'noche' | 'marino'

/**
 * El fondo del sistema visual: papel milimetrado azul sobre un degradado
 * profundo, con halos que abren la composición.
 *
 * Dos tonos, uno por cada cartel oficial:
 *
 * - `noche`  — negro #010004 del cartel de Goya Hack. Lo usa /hackathon.
 * - `marino` — degradado azul del cartel de Community Partner: marino claro
 *              arriba y abajo, casi negro en la franja central. Es el del
 *              resto del sitio.
 *
 * Va `fixed` detrás de todo el contenido y es puramente decorativo.
 */
const Backdrop: React.FC<{ tono?: Tono }> = ({ tono = 'marino' }) => {
  const noche = tono === 'noche'

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: noche
          ? '#010004'
          : // Muestreado del cartel: #204479 en los bordes, #0D1620 en el centro.
            'linear-gradient(180deg, #204479 0%, #16233A 22%, #0D1620 46%, #101B2B 58%, #1B355C 82%, #284674 100%)',
      }}
      aria-hidden="true"
    >
      {/* Papel milimetrado. Se atenúa hacia el centro para que el texto de las
          secciones no compita con las líneas. */}
      <div
        className="goya-grid absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(115% 85% at 50% 0%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.85) 100%)',
          WebkitMaskImage:
            'radial-gradient(115% 85% at 50% 0%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* En `noche` los halos son lo único que separa la G del negro plano; en
          `marino` el degradado ya hace ese trabajo y solo se refuerza. */}
      {noche && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 0% 100%, rgba(17,36,65,0.85) 0%, rgba(17,36,65,0.35) 35%, rgba(1,0,4,0) 70%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 55% at 85% 8%, rgba(17,36,65,0.5) 0%, rgba(1,0,4,0) 65%)',
            }}
          />
        </>
      )}

      {/* Viñeta: cierra los bordes y evita que la retícula llegue plana al
          canto de la pantalla. */}
      <div
        className="absolute inset-0"
        style={{
          background: noche
            ? 'radial-gradient(100% 100% at 50% 50%, rgba(1,0,4,0) 55%, rgba(1,0,4,0.75) 100%)'
            : 'radial-gradient(100% 100% at 50% 50%, rgba(6,12,22,0) 55%, rgba(6,12,22,0.6) 100%)',
        }}
      />
    </div>
  )
}

export default Backdrop

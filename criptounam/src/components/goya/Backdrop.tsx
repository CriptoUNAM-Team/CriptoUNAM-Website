import React, { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { goyaReducedMotion } from '../../lib/goyaAnime'

export type Tono = 'noche' | 'marino' | 'dia'

/**
 * Fondo del sistema visual Goya: retícula + halos + orbes animados (anime.js).
 */
const Backdrop: React.FC<{ tono?: Tono }> = ({ tono = 'marino' }) => {
  const noche = tono === 'noche'
  const dia = tono === 'dia'
  const orbs = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!noche || !orbs.current || goyaReducedMotion()) return
    const nodes = orbs.current.querySelectorAll<HTMLElement>('[data-orb]')
    const anims = Array.from(nodes).map((el, i) =>
      animate(el, {
        translateX: [
          { to: `${12 + i * 8}px`, duration: 5000 + i * 900, ease: 'inOutSine' },
          { to: `${-10 - i * 6}px`, duration: 5500 + i * 700, ease: 'inOutSine' },
        ],
        translateY: [
          { to: `${-18 - i * 5}px`, duration: 4800 + i * 800, ease: 'inOutSine' },
          { to: `${14 + i * 4}px`, duration: 5200 + i * 600, ease: 'inOutSine' },
        ],
        opacity: [{ to: 0.55, duration: 3000 }, { to: 0.25, duration: 3200 }],
        scale: [{ to: 1.08, duration: 4200 }, { to: 0.92, duration: 4000 }],
        loop: true,
        delay: i * 400,
      })
    )
    return () => anims.forEach((a) => a.pause())
  }, [noche])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: dia
          ? '#F4F6F8'
          : noche
            ? '#010004'
            : 'linear-gradient(180deg, #204479 0%, #16233A 22%, #0D1620 46%, #101B2B 58%, #1B355C 82%, #284674 100%)',
      }}
      aria-hidden="true"
    >
      <div
        className="goya-grid absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(115% 85% at 50% 0%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.85) 100%)',
          WebkitMaskImage:
            'radial-gradient(115% 85% at 50% 0%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.85) 100%)',
        }}
      />

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
          <div ref={orbs} className="absolute inset-0 overflow-hidden">
            <div
              data-orb
              className="absolute left-[12%] top-[28%] h-64 w-64 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(233,175,60,0.18) 0%, transparent 68%)',
                filter: 'blur(2px)',
              }}
            />
            <div
              data-orb
              className="absolute right-[8%] top-[12%] h-80 w-80 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(56,112,189,0.22) 0%, transparent 70%)',
                filter: 'blur(4px)',
              }}
            />
            <div
              data-orb
              className="absolute bottom-[18%] left-[40%] h-72 w-72 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(233,175,60,0.12) 0%, transparent 65%)',
                filter: 'blur(6px)',
              }}
            />
          </div>
        </>
      )}

      <div
        className="absolute inset-0"
        style={{
          background: dia
            ? 'radial-gradient(100% 100% at 50% 50%, rgba(244,246,248,0) 55%, rgba(200,210,220,0.45) 100%)'
            : noche
              ? 'radial-gradient(100% 100% at 50% 50%, rgba(1,0,4,0) 55%, rgba(1,0,4,0.75) 100%)'
              : 'radial-gradient(100% 100% at 50% 50%, rgba(6,12,22,0) 55%, rgba(6,12,22,0.6) 100%)',
        }}
      />
    </div>
  )
}

export default Backdrop

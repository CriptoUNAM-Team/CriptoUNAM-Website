import React from 'react'
import PixelSprite from './PixelSprite'
import { BITMAP_G } from './bitmaps'

/**
 * La "G" de píxeles del cartel de Goya Hack.
 *
 * Es la marca del hackathon, pero también funciona como sello de CriptoUNAM en
 * el resto del sitio: "Goya" es la porra de la UNAM, no algo exclusivo del
 * evento.
 */
const PixelG: React.FC<{ className?: string; animado?: boolean }> = ({
  className = '',
  animado = false,
}) => (
  <PixelSprite
    bitmap={BITMAP_G}
    className={className}
    titulo="G de Goya"
    animado={animado}
  />
)

export default PixelG

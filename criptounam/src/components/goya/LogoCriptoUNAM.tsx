import React from 'react'

/**
 * El logo de CriptoUNAM: escudo del puma, anillo ámbar, circuitos a los lados
 * y el rótulo "CRIPTOUNAM / COMUNIDAD WEB 3.0" debajo.
 *
 * Como el logo ya trae el nombre, no hay que ponerle texto al lado: se usa
 * suelto.
 *
 * El archivo sale de `public/images/LogosCriptounam3.svg`, que es la variante
 * para fondo oscuro (transparencia real y rótulo en blanco). Ese SVG pesa
 * 2,2 MB porque son rásters incrustados y no vectores, así que se rasteriza a
 * PNG de 1000 px — suficiente para 2x en el uso más grande y ~160 KB.
 *
 * Proporción ~2,09:1: se dimensiona por altura y el ancho va libre.
 *
 * La G de píxeles queda reservada para Goya Hack, que es su marca; fuera de
 * /hackathon el sello del sitio es este.
 */
const LogoCriptoUNAM: React.FC<{ className?: string; alt?: string }> = ({
  className = '',
  alt = 'CriptoUNAM · Comunidad Web 3.0',
}) => (
  <img
    src="/images/logo-criptounam-marca.png"
    alt={alt}
    width={1000}
    height={478}
    loading="eager"
    decoding="async"
    className={className}
  />
)

export default LogoCriptoUNAM

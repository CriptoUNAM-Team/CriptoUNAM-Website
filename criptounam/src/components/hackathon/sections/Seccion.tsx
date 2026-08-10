import React from 'react'

/**
 * Envoltorio común de las secciones de la landing: ancla para la navegación,
 * etiqueta superior, título y subtítulo. Mantiene el ritmo vertical parejo sin
 * repetir los mismos estilos en cada sección.
 */
const Seccion: React.FC<{
  id: string
  eyebrow?: string
  titulo: string
  sub?: string
  children: React.ReactNode
  style?: React.CSSProperties
}> = ({ id, eyebrow, titulo, sub, children, style }) => (
  <section
    id={id}
    style={{ scrollMarginTop: 90, marginBottom: '4rem', ...style }}
  >
    <header className="hack-reveal" style={{ marginBottom: '1.75rem' }}>
      {eyebrow && <span className="hack-eyebrow">{eyebrow}</span>}
      <h2
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
          color: '#fff',
          margin: eyebrow ? '0.85rem 0 0' : 0,
          letterSpacing: '-0.3px',
        }}
      >
        {titulo}
      </h2>
      {sub && (
        <p
          style={{
            color: '#94a3b8',
            margin: '0.6rem 0 0',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '65ch',
          }}
        >
          {sub}
        </p>
      )}
    </header>
    {children}
  </section>
)

export default Seccion

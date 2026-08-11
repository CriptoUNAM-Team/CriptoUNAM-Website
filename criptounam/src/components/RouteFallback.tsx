import React from 'react'

/**
 * Se muestra mientras se descarga el chunk de una página (React.lazy).
 *
 * Ocupa alto de pantalla completa para que el footer no salte hacia arriba
 * durante la carga, y usa el dorado del sitio para que no parezca una pantalla
 * ajena.
 */
const RouteFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
    }}
  >
    <div
      aria-hidden="true"
      style={{
        width: 34,
        height: 34,
        border: '3px solid rgba(212,175,55,0.2)',
        borderTopColor: '#D4AF37',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }}
    />
    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Cargando…</span>
  </div>
)

export default RouteFallback

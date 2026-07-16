import React from 'react'

/**
 * Primitivos de UI del hackathon — estilo dorado/oscuro consistente con el
 * resto del sitio (#D4AF37 sobre fondos oscuros). Inline styles para no añadir
 * dependencias ni archivos CSS nuevos.
 */

export const GOLD = '#D4AF37'
export const GOLD_LIGHT = '#F4D03F'
export const BG_CARD = 'rgba(255,255,255,0.03)'
export const BORDER = 'rgba(212,175,55,0.22)'

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { glow?: boolean }> = ({
  children,
  glow,
  style,
  ...rest
}) => (
  <div
    {...rest}
    style={{
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 16,
      padding: '1.25rem',
      boxShadow: glow ? '0 0 30px rgba(212,175,55,0.12)' : 'none',
      ...style,
    }}
  >
    {children}
  </div>
)

export const SectionTitle: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <h2
      style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '1.5rem',
        color: '#fff',
        margin: 0,
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </h2>
    {sub && <p style={{ color: '#94a3b8', margin: '6px 0 0', fontSize: '0.95rem' }}>{sub}</p>}
  </div>
)

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
}
export const Button: React.FC<BtnProps> = ({ variant = 'primary', style, children, ...rest }) => {
  const base: React.CSSProperties = {
    padding: '0.7rem 1.3rem',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: '0.92rem',
    fontFamily: 'inherit',
    cursor: rest.disabled ? 'not-allowed' : 'pointer',
    opacity: rest.disabled ? 0.55 : 1,
    border: 'none',
    transition: 'all 0.2s ease',
  }
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: '#0a0a0a' },
    ghost: { background: 'transparent', color: GOLD, border: `1px solid ${GOLD}` },
    danger: { background: 'transparent', color: '#f87171', border: '1px solid #f87171' },
  }
  return (
    <button {...rest} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  )
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.35)',
  border: `1px solid ${BORDER}`,
  color: '#fff',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>
    {children}
  </label>
)

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ style, ...rest }) => (
  <input {...rest} style={{ ...fieldStyle, ...style }} />
)

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ style, ...rest }) => (
  <textarea {...rest} style={{ ...fieldStyle, minHeight: 90, resize: 'vertical', ...style }} />
)

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ style, children, ...rest }) => (
  <select {...rest} style={{ ...fieldStyle, ...style }}>
    {children}
  </select>
)

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: '1rem' }}>
    <Label>{label}</Label>
    {children}
  </div>
)

export const Chip: React.FC<{ children: React.ReactNode; tone?: 'gold' | 'blue' | 'green' }> = ({
  children,
  tone = 'gold',
}) => {
  const tones = {
    gold: { bg: 'rgba(212,175,55,0.15)', fg: GOLD },
    blue: { bg: 'rgba(59,130,246,0.15)', fg: '#60A5FA' },
    green: { bg: 'rgba(52,211,153,0.15)', fg: '#34d399' },
  }[tone]
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        background: tones.bg,
        color: tones.fg,
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  )
}

export const Banner: React.FC<{ kind?: 'error' | 'success' | 'info'; children: React.ReactNode }> = ({
  kind = 'info',
  children,
}) => {
  const colors = {
    error: { bg: 'rgba(248,113,113,0.12)', fg: '#fca5a5', border: 'rgba(248,113,113,0.4)' },
    success: { bg: 'rgba(52,211,153,0.12)', fg: '#6ee7b7', border: 'rgba(52,211,153,0.4)' },
    info: { bg: 'rgba(59,130,246,0.12)', fg: '#93c5fd', border: 'rgba(59,130,246,0.4)' },
  }[kind]
  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.fg,
        borderRadius: 10,
        padding: '0.75rem 1rem',
        fontSize: '0.9rem',
        marginBottom: '1rem',
      }}
    >
      {children}
    </div>
  )
}

export const Spinner: React.FC<{ label?: string }> = ({ label }) => (
  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
    <div
      style={{
        width: 32,
        height: 32,
        border: `3px solid ${BORDER}`,
        borderTopColor: GOLD,
        borderRadius: '50%',
        margin: '0 auto 12px',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    {label}
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
)

export const PAGE_WRAP: React.CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '90px 1.25rem 4rem',
}

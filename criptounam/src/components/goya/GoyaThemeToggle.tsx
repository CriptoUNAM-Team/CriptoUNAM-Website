import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useGoyaTheme } from '../../hooks/useGoyaTheme'

type Props = {
  className?: string
}

/** Sol / luna. Cambia landing y plataforma Goya. */
const GoyaThemeToggle: React.FC<Props> = ({ className = '' }) => {
  const { isLight, toggle } = useGoyaTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
      className={`goya-cut inline-flex h-9 w-9 items-center justify-center border border-goya-amber/40 text-goya-paper transition-colors hover:border-goya-amber hover:text-goya-amber ${className}`}
      style={{ ['--cut' as string]: '6px', color: 'var(--goya-paper)' }}
    >
      {isLight ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
    </button>
  )
}

export default GoyaThemeToggle

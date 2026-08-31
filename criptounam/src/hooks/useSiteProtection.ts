import { useEffect } from 'react'

/**
 * Disuasión básica contra copia casual del front (clic derecho, atajos de
 * guardar/vista fuente). No reemplaza controles de acceso en el servidor:
 * el bundle sigue siendo público para quien abra DevTools.
 */
export function useSiteProtection(enabled = true) {
  useEffect(() => {
    if (!enabled || !import.meta.env.PROD) return

    const allowTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
      if (target.isContentEditable) return true
      return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
    }

    const onContextMenu = (e: MouseEvent) => {
      if (!allowTarget(e.target)) e.preventDefault()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (allowTarget(e.target)) return
      const key = e.key.toLowerCase()
      const mod = e.ctrlKey || e.metaKey
      if (mod && (key === 's' || key === 'u' || key === 'p')) {
        e.preventDefault()
      }
      if (mod && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
        e.preventDefault()
      }
      if (key === 'f12') e.preventDefault()
    }

    const onDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) e.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('dragstart', onDragStart)

    return () => {
      document.removeEventListener('contextmenu', onContextMenu)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('dragstart', onDragStart)
    }
  }, [enabled])
}

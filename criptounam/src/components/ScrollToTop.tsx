import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scroll al inicio en cada cambio de ruta, salvo si hay hash: entonces
 * espera a que exista el ancla (lazy/Suspense) y hace scroll a la sección.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const id = decodeURIComponent(hash.replace(/^#/, ''))
    if (!id) {
      window.scrollTo(0, 0)
      return
    }

    let cancelado = false
    const ir = () => {
      if (cancelado) return false
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return true
    }

    // Varios intentos: el landing del hack se monta lazy y el DOM tarda.
    const timers = [0, 80, 200, 450, 900].map((ms) => window.setTimeout(ir, ms))

    return () => {
      cancelado = true
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [pathname, hash])

  return null
}

export default ScrollToTop

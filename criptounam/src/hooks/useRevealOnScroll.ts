import { useEffect, useRef } from 'react'

/**
 * Añade `is-visible` a los elementos con clase `reveal` o `hack-reveal` que hay
 * dentro del contenedor devuelto, cuando entran en el viewport.
 *
 * Se aceptan las dos clases porque conviven dos lenguajes visuales: `reveal`
 * es el del rediseño con Tailwind y `hack-reveal` el de las páginas que aún no
 * se han migrado.
 *
 * Se hace con IntersectionObserver en vez de una librería de scroll: no añade
 * peso al bundle y no corre nada en cada frame. Una vez revelado, el elemento
 * deja de observarse — la animación es de entrada, no de ida y vuelta.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal, .hack-reveal'))
    if (targets.length === 0) return

    // Sin IntersectionObserver (o con reduced-motion) mostramos todo de una vez:
    // el contenido nunca debe quedar invisible esperando una animación.
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}

import { animate, createTimeline, stagger, utils, type JSAnimation, type Timeline } from 'animejs'

/** Preferencia del sistema: no animar si el usuario pide menos movimiento. */
export const goyaReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const goyaSet = (targets: Parameters<typeof utils.set>[0], props: Record<string, unknown>) => {
  if (goyaReducedMotion()) {
    // Estado final inmediato: nunca dejar contenido invisible.
    const finals: Record<string, unknown> = { ...props }
    if ('opacity' in finals && Array.isArray(finals.opacity)) finals.opacity = (finals.opacity as number[])[1] ?? 1
    if ('translateY' in finals && Array.isArray(finals.translateY)) finals.translateY = 0
    if ('translateX' in finals && Array.isArray(finals.translateX)) finals.translateX = 0
    if ('scale' in finals && Array.isArray(finals.scale)) finals.scale = 1
    utils.set(targets, finals as never)
    return
  }
  utils.set(targets, props as never)
}

type RevealOpts = {
  delay?: number
  duration?: number
  y?: number
  scale?: number
}

/** Entrada estándar Goya: sube + fade con outExpo. */
export const goyaReveal = (
  target: HTMLElement | null,
  { delay = 0, duration = 900, y = 36, scale }: RevealOpts = {}
): JSAnimation | null => {
  if (!target) return null
  if (goyaReducedMotion()) {
    utils.set(target, { opacity: 1, translateY: 0, scale: 1 })
    return null
  }
  utils.set(target, { opacity: 0, translateY: y, ...(scale != null ? { scale } : {}) })
  return animate(target, {
    opacity: 1,
    translateY: 0,
    ...(scale != null ? { scale: 1 } : {}),
    duration,
    delay,
    ease: 'outExpo',
  })
}

/** Stagger de hijos (listas, chips, pasos). */
export const goyaStaggerChildren = (
  parent: HTMLElement | null,
  childSelector = ':scope > *',
  { delay = 0, step = 70, y = 24 }: { delay?: number; step?: number; y?: number } = {}
): JSAnimation | null => {
  if (!parent) return null
  const kids = parent.querySelectorAll<HTMLElement>(childSelector)
  if (!kids.length) return null
  if (goyaReducedMotion()) {
    utils.set(kids, { opacity: 1, translateY: 0 })
    return null
  }
  utils.set(kids, { opacity: 0, translateY: y })
  return animate(kids, {
    opacity: 1,
    translateY: 0,
    duration: 780,
    delay: stagger(step, { start: delay }),
    ease: 'outExpo',
  })
}

/** Timeline del hero: lettering + fechas + CTAs. */
export const goyaHeroTimeline = (root: HTMLElement): Timeline | null => {
  if (goyaReducedMotion()) {
    utils.set(root.querySelectorAll('[data-goya-hero]'), { opacity: 1, translateY: 0, scale: 1 })
    return null
  }

  const letters = root.querySelectorAll<HTMLElement>('[data-goya-letter]')
  const blocks = root.querySelectorAll<HTMLElement>('[data-goya-hero]')

  utils.set(letters, { opacity: 0, translateY: '0.35em', rotateX: -40 })
  utils.set(blocks, { opacity: 0, translateY: 28 })

  const tl = createTimeline({ defaults: { ease: 'outExpo' } })

  if (letters.length) {
    tl.add(letters, {
      opacity: 1,
      translateY: 0,
      rotateX: 0,
      duration: 920,
      delay: stagger(28, { start: 180 }),
    })
  }

  tl.add(
    blocks,
    {
      opacity: 1,
      translateY: 0,
      duration: 860,
      delay: stagger(90),
    },
    letters.length ? '-=520' : 0
  )

  return tl
}

/** Halo que sigue al puntero dentro de `.goya-scope` (desktop). */
export const goyaPointerGlow = (glow: HTMLElement, scope: HTMLElement) => {
  if (goyaReducedMotion()) return () => {}
  if (window.matchMedia('(pointer: coarse)').matches) return () => {}

  let raf = 0
  let x = 0
  let y = 0
  let tx = 0
  let ty = 0

  const onMove = (e: PointerEvent) => {
    tx = e.clientX
    ty = e.clientY
    if (!raf) {
      raf = requestAnimationFrame(() => {
        x += (tx - x) * 0.18
        y += (ty - y) * 0.18
        glow.style.transform = `translate3d(${x - 180}px, ${y - 180}px, 0)`
        raf = 0
      })
    }
  }

  scope.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    scope.removeEventListener('pointermove', onMove)
    if (raf) cancelAnimationFrame(raf)
  }
}

/** Pulso sutil infinito (cronómetros, chips live). */
export const goyaPulse = (target: HTMLElement | null) => {
  if (!target || goyaReducedMotion()) return null
  return animate(target, {
    scale: [1, 1.04, 1],
    opacity: [1, 0.85, 1],
    duration: 2200,
    ease: 'inOutSine',
    loop: true,
  })
}

/** Menú/popover que se despliega: escala corta desde el borde superior. */
export const goyaMenuIn = (target: HTMLElement | null): JSAnimation | null => {
  if (!target) return null
  if (goyaReducedMotion()) {
    utils.set(target, { opacity: 1, translateY: 0, scaleY: 1 })
    return null
  }
  utils.set(target, { opacity: 0, translateY: -6, scaleY: 0.94, transformOrigin: 'top center' })
  return animate(target, {
    opacity: 1,
    translateY: 0,
    scaleY: 1,
    duration: 260,
    ease: 'outExpo',
  })
}

/**
 * Relevo de contenido dentro de un panel que no se mueve de sitio.
 *
 * A diferencia de `goyaReveal`, el desplazamiento es mínimo: el panel de
 * detalle de la agenda ya está en pantalla y una entrada de 36 px lo haría
 * saltar cada vez que se elige otro bloque.
 */
export const goyaSwapIn = (target: HTMLElement | null, { delay = 0 } = {}): JSAnimation | null => {
  if (!target) return null
  if (goyaReducedMotion()) {
    utils.set(target, { opacity: 1, translateY: 0 })
    return null
  }
  utils.set(target, { opacity: 0, translateY: 10 })
  return animate(target, {
    opacity: 1,
    translateY: 0,
    duration: 420,
    delay,
    ease: 'outExpo',
  })
}

/**
 * Entrada de las filas de la línea de tiempo.
 *
 * Es un stagger más corto y en horizontal que `goyaStaggerChildren`: la lista
 * se rehace en cada cambio de día o de filtro, y con 24 px en vertical y 70 ms
 * de paso la relectura se volvía incómoda.
 */
export const goyaStaggerFilas = (
  parent: HTMLElement | null,
  selector = '[data-goya-fila]'
): JSAnimation | null => {
  if (!parent) return null
  const filas = parent.querySelectorAll<HTMLElement>(selector)
  if (!filas.length) return null
  if (goyaReducedMotion()) {
    utils.set(filas, { opacity: 1, translateX: 0 })
    return null
  }
  utils.set(filas, { opacity: 0, translateX: -14 })
  return animate(filas, {
    opacity: 1,
    translateX: 0,
    duration: 520,
    delay: stagger(38),
    ease: 'outExpo',
  })
}

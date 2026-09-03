import { useCallback, useEffect, useState } from 'react'

export type GoyaTheme = 'light' | 'dark'

const KEY = 'goya-theme'

const leerTema = (): GoyaTheme => {
  if (typeof document === 'undefined') return 'dark'
  const attr = document.documentElement.dataset.goyaTheme
  if (attr === 'light' || attr === 'dark') return attr
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* private mode */
  }
  return 'dark'
}

export const applyGoyaTheme = (theme: GoyaTheme) => {
  document.documentElement.dataset.goyaTheme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* ignore */
  }
}

/** Tema Goya (landing + plataforma). Default oscuro; persiste en localStorage. */
export const useGoyaTheme = () => {
  const [theme, setThemeState] = useState<GoyaTheme>(leerTema)

  useEffect(() => {
    applyGoyaTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: GoyaTheme) => {
    setThemeState(next)
    applyGoyaTheme(next)
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      applyGoyaTheme(next)
      return next
    })
  }, [])

  return { theme, setTheme, toggle, isLight: theme === 'light' }
}

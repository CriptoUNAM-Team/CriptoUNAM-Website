import { useEffect, useState } from 'react'

export type Countdown = {
  dias: number
  horas: number
  minutos: number
  segundos: number
  /** La fecha objetivo ya pasó. */
  terminado: boolean
}

const ZERO: Countdown = { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true }

function calcular(targetMs: number): Countdown {
  const diff = targetMs - Date.now()
  if (diff <= 0) return ZERO
  const totalSeg = Math.floor(diff / 1000)
  return {
    dias: Math.floor(totalSeg / 86400),
    horas: Math.floor((totalSeg % 86400) / 3600),
    minutos: Math.floor((totalSeg % 3600) / 60),
    segundos: totalSeg % 60,
    terminado: false,
  }
}

/**
 * Cuenta regresiva hasta una fecha ISO. Tick de un segundo, que se detiene solo
 * al llegar a cero para no dejar un intervalo vivo el resto de la sesión.
 */
export function useCountdown(targetIso: string): Countdown {
  const targetMs = new Date(targetIso).getTime()
  const [value, setValue] = useState<Countdown>(() =>
    Number.isNaN(targetMs) ? ZERO : calcular(targetMs)
  )

  useEffect(() => {
    if (Number.isNaN(targetMs)) return
    // Recalculamos de inmediato: entre el render inicial y este efecto pudo
    // pasar tiempo (hidratación, pestaña en segundo plano).
    const next = calcular(targetMs)
    setValue(next)
    if (next.terminado) return

    const id = setInterval(() => {
      const v = calcular(targetMs)
      setValue(v)
      if (v.terminado) clearInterval(id)
    }, 1000)

    return () => clearInterval(id)
  }, [targetMs])

  return value
}

import { formatEther } from 'viem'

/** Muestra PUMA legible (sin redondear 5000 → 5000.00 mal). */
export function formatPumaAmount(wei: bigint | undefined | null): string {
  if (wei === undefined || wei === null) return '—'
  const raw = formatEther(wei)
  const n = Number(raw)
  if (!Number.isFinite(n)) return raw
  if (Math.abs(n) < 1e-9) return '0'
  if (Math.abs(n - Math.round(n)) < 1e-6) {
    return Math.round(n).toLocaleString('es-MX')
  }
  return n.toLocaleString('es-MX', { maximumFractionDigits: 4 })
}

/**
 * Versión corta para espacios estrechos, como las tarjetas de estadísticas del
 * perfil: 10 027 500 → "10.03 M".
 *
 * Un balance de ocho cifras en Orbitron no cabe en una tarjeta de 180 px y se
 * cortaba contra el `overflow: hidden`. Junto al valor conviene mostrar el
 * número completo en un `title` para quien quiera el dato exacto.
 */
export function formatPumaCompact(wei: bigint | undefined | null): string {
  if (wei === undefined || wei === null) return '—'
  const n = Number(formatEther(wei))
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)} B`
  if (abs >= 1e6) return `${(n / 1e6).toFixed(2)} M`
  if (abs >= 1e4) return `${(n / 1e3).toFixed(1)} k`
  return formatPumaAmount(wei)
}

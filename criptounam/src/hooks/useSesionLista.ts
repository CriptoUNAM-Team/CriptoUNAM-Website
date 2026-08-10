import { useEffect, useState } from 'react'
import { useWallet } from '../context/WalletContext'

/**
 * `ready` de Privy con un límite de espera.
 *
 * Si Privy no puede inicializar —origen no autorizado en su dashboard, red
 * caída, bloqueador de anuncios— nunca emite `ready`, y las páginas que hacen
 * `if (!ready) return <Spinner/>` se quedan girando para siempre sin decir por
 * qué. Con esto, pasado el margen se puede mostrar un mensaje accionable.
 *
 * @param margenMs cuánto esperar antes de darlo por fallido.
 */
export function useSesionLista(margenMs = 12_000) {
  const { ready, isConnected } = useWallet()
  const [expiro, setExpiro] = useState(false)

  useEffect(() => {
    if (ready) {
      setExpiro(false)
      return
    }
    const id = setTimeout(() => setExpiro(true), margenMs)
    return () => clearTimeout(id)
  }, [ready, margenMs])

  return {
    ready,
    isConnected,
    /** Privy no respondió a tiempo: hay que ofrecer una salida al usuario. */
    sesionNoDisponible: !ready && expiro,
  }
}

import { useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { useWallet } from '../context/WalletContext'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Puente al modal de Privy (login por email/wallet + conexión de wallet).
 *
 * Ya no renderizamos UI propia: cuando `open` se activa, delegamos en
 * `connectWallet()` del WalletContext, que decide entre `login()` y el modal de
 * conexión de wallet según el estado de la sesión. Se conserva la firma
 * `{ open, onClose }` para no tocar el `Navbar` que controla este componente.
 */
const ConnectWalletModal = ({ open, onClose }: Props) => {
  const { ready } = usePrivy()
  const { connectWallet } = useWallet()
  const launched = useRef(false)

  useEffect(() => {
    if (!open) {
      launched.current = false
      return
    }
    if (!ready || launched.current) return

    launched.current = true
    connectWallet()
    // Cerramos nuestro estado local; Privy maneja su propia modal desde aquí.
    onClose()
  }, [open, ready, connectWallet, onClose])

  return null
}

export default ConnectWalletModal

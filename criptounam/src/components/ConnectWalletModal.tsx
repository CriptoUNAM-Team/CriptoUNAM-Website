import { useEffect, useRef } from 'react'
import { usePrivy } from '@privy-io/react-auth'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Puente al modal de login de Privy (email/OTP + wallet embebida).
 *
 * Ya no renderizamos UI propia: cuando `open` se activa, disparamos el modal
 * nativo de Privy con `login()`. Se conserva la firma `{ open, onClose }` para
 * no tocar el `Navbar` que controla este componente.
 */
const ConnectWalletModal = ({ open, onClose }: Props) => {
  const { ready, authenticated, login } = usePrivy()
  const launched = useRef(false)

  useEffect(() => {
    if (!open) {
      launched.current = false
      return
    }
    if (!ready || launched.current) return

    if (authenticated) {
      onClose()
      return
    }

    launched.current = true
    login()
    // Cerramos nuestro estado local; Privy maneja su propia modal desde aquí.
    onClose()
  }, [open, ready, authenticated, login, onClose])

  return null
}

export default ConnectWalletModal

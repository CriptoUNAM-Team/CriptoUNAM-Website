/**
 * Sustituto vacío de `@reown/appkit/core`.
 *
 * `@wagmi/connectors/walletConnect` hace `await import('@reown/appkit/core')`
 * para abrir el modal de WalletConnect. Este sitio no usa ese conector — la
 * conexión va por Privy con wallets inyectadas — así que el paquete no está
 * instalado y Vite fallaba al resolver el import en desarrollo.
 *
 * Como la ruta que lo llama nunca se ejecuta, basta con que el módulo exista.
 * Si algún día se reintroduce WalletConnect, hay que instalar `@reown/appkit`
 * de verdad y borrar este stub junto con su alias en vite.config.ts.
 */
export function createAppKit(): never {
  throw new Error(
    'WalletConnect no está habilitado en este sitio. Para usarlo, instala @reown/appkit y elimina el alias de vite.config.ts.'
  )
}

export default { createAppKit }

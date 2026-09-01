import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTriangleExclamation,
  faWallet,
  faGamepad,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import ENV_CONFIG from '../config/env'
import Seccion from '../components/goya/Seccion'
import Reveal from '../components/Reveal'
import PumaMissionsSection from '../components/Puma/PumaMissionsSection'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import AddPumaToWalletButton from '../components/Puma/AddPumaToWalletButton'
import FaucetButton from '../components/Puma/FaucetButton'
import DropCodeClaim from '../components/Puma/DropCodeClaim'
import BadgeCodeClaimPanel from '../components/Puma/BadgeCodeClaimPanel'
import { usePumaMissionsList, isGameMission } from '../hooks/usePumaMissions'
import { usePumaTokenBalance } from '../hooks/usePumaTokenBalance'
import { useEnsureNetwork } from '../hooks/useEnsureNetwork'
import { chainDisplayName, isTestnetChain } from '../utils/chainNames'
import '../styles/global.css'

/**
 * Recompensas $PUMA.
 *
 * Solo la presentación está migrada al lenguaje de los carteles. Todo lo que
 * habla con la cadena sigue exactamente donde estaba —los hooks
 * `usePumaMissionsList`, `usePumaTokenBalance` y `useEnsureNetwork`, y los
 * componentes de `components/Puma/`— porque son los que sostienen el sistema
 * de recompensas. Esta página no lee ni escribe contratos por su cuenta.
 */
const Recompensas: React.FC = () => {
  const { address } = useAccount()

  const { data: missions = [], isLoading: loadingMissions, refetch: refetchMissions } =
    usePumaMissionsList()

  const {
    formatted: balanceFormatted,
    tokenConfigured,
    onExpectedChain,
    expectedChainId,
    isLoading: balanceLoading,
  } = usePumaTokenBalance()

  const { ensure: switchToExpectedChain } = useEnsureNetwork()
  const [switchingChain, setSwitchingChain] = useState(false)
  const [switchFailed, setSwitchFailed] = useState(false)

  const nonGameMissions = missions.filter((m) => !isGameMission(m.missionId))
  const activeMissions = nonGameMissions.filter(
    (m) => m.active && Number(m.deadline) * 1000 > Date.now()
  ).length

  // El saldo se lee del RPC de la red de los contratos (chainId fijo en
  // usePumaTokenBalance), así que es correcto aunque la wallet esté en otra red.
  const saldoHero =
    !tokenConfigured || !address ? '—' : balanceLoading ? '…' : balanceFormatted

  const expectedChainName = chainDisplayName(expectedChainId)

  const handleSwitchChain = async () => {
    setSwitchingChain(true)
    setSwitchFailed(false)
    const ok = await switchToExpectedChain()
    setSwitchFailed(!ok)
    setSwitchingChain(false)
  }

  const cifras = [
    { valor: saldoHero, etiqueta: 'Tu saldo $PUMA' },
    { valor: String(activeMissions), etiqueta: 'Misiones activas' },
    { valor: String(nonGameMissions.length), etiqueta: 'Misiones totales' },
  ]

  return (
    <div className="goya-scope">
      <SEOHead
        title="Recompensas - CriptoUNAM"
        description="PUMA y recompensas CriptoUNAM: misiones, cursos y eventos."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/recompensas"
        type="website"
      />

      <div className="mx-auto w-full max-w-[1500px] px-5 pt-6 sm:px-8 md:px-12">
        <PumaPausedBanner />
      </div>

      {/* ---- Cabecera ---- */}
      <section className="mx-auto w-full max-w-[1500px] px-5 pb-4 pt-8 sm:px-8 md:px-12 md:pt-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal
              inmediato
              as="p"
              delay={100}
              className="font-mono text-[11px] uppercase tracking-label text-goya-amber"
            >
              Token de la comunidad · On-chain
            </Reveal>

            <Reveal
              inmediato
              as="h1"
              delay={180}
              className="goya-rule mt-3 w-fit font-display text-4xl uppercase leading-none tracking-wide text-goya-paper sm:text-5xl md:text-6xl"
            >
              Recompensas $PUMA
            </Reveal>

            <Reveal
              inmediato
              as="p"
              delay={260}
              className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400"
            >
              Completa misiones, canjea códigos de embajadores y administra tu
              saldo para cursos y drops.
            </Reveal>
          </div>

          {/* Cifras */}
          <Reveal inmediato as="div" delay={320} className="flex flex-wrap gap-3">
            {cifras.map((c) => (
              <span
                key={c.etiqueta}
                className="goya-cut flex min-w-[7.5rem] flex-col gap-1 border border-goya-amber/30 px-4 py-3"
                style={{ ['--cut' as string]: '9px' }}
              >
                <span className="font-display text-2xl leading-none text-goya-paper">
                  {c.valor}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-label text-slate-500">
                  {c.etiqueta}
                </span>
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---- Aviso de red equivocada ---- */}
      {address && tokenConfigured && !onExpectedChain && (
        <div className="mx-auto w-full max-w-[1500px] px-5 py-4 sm:px-8 md:px-12">
          <div className="goya-panel" style={{ ['--goya-panel-border' as string]: 'rgba(233,175,60,0.65)' }}>
            <div className="flex gap-4 p-6">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{ color: '#E9AF3C', marginTop: 3 }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-slate-300">
                  Tu wallet está en otra red. El saldo PUMA de arriba ya es el real (lo leemos
                  directo del contrato en {expectedChainName}), pero para reclamar, jugar o firmar
                  cualquier transacción necesitas cambiar de red.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleSwitchChain}
                    disabled={switchingChain}
                    className="goya-cut border border-goya-amber/45 px-5 py-2.5 font-mono text-[11px] uppercase tracking-label text-goya-paper transition-colors duration-300 hover:border-goya-amber hover:text-goya-amber disabled:opacity-50"
                    style={{ ['--cut' as string]: '8px' }}
                  >
                    {switchingChain ? 'Cambiando…' : `Cambiar a ${expectedChainName}`}
                  </button>
                  <a
                    href={ENV_CONFIG.EXPLORER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] uppercase tracking-label text-goya-amber no-underline transition-colors duration-300 hover:text-goya-paper"
                  >
                    Ver el contrato en el explorer →
                  </a>
                </div>

                {isTestnetChain(expectedChainId) && (
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    ¿Usas <strong className="text-slate-300">Core</strong>? Responde que la red no
                    está soportada hasta que actives el modo de prueba:{' '}
                    <em>Configuración → Avanzado → Testnet Mode</em>. En MetaMask, activa{' '}
                    <em>Mostrar redes de prueba</em> en Configuración → Avanzado.
                  </p>
                )}
                {switchFailed && (
                  <p className="mt-3 text-sm leading-relaxed text-red-300">
                    Tu wallet rechazó el cambio de red. Cámbiala manualmente a {expectedChainName} (
                    {expectedChainId}) y recarga.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Añadir el token a la wallet ---- */}
      {tokenConfigured && (
        <div className="mx-auto w-full max-w-[1500px] px-5 py-4 sm:px-8 md:px-12">
          <div className="goya-panel">
            <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-4">
                <FontAwesomeIcon icon={faWallet} style={{ color: '#E9AF3C', marginTop: 4 }} />
                <div>
                  <h2 className="font-display text-base uppercase tracking-wide text-goya-paper">
                    Ver $PUMA en tu wallet
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                    Tras reclamar, MetaMask no muestra el token hasta que lo importes. Usa el botón
                    para agregarlo con un clic. Las transacciones en Fuji necesitan un poco de AVAX
                    de prueba (gas); si el faucet está vacío, intenta más tarde o con otra wallet.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <AddPumaToWalletButton disabled={!address || !onExpectedChain} compact />
                <FaucetButton compact />
                {!address && (
                  <span className="font-mono text-[10px] uppercase tracking-label text-slate-500">
                    Conecta tu wallet
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Arcade ---- */}
      <div className="mx-auto w-full max-w-[1500px] px-5 py-4 sm:px-8 md:px-12">
        <div className="goya-panel goya-panel-lit" style={{ ['--cut' as string]: '22px' }}>
          <div className="flex flex-col gap-6 p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-5">
              <FontAwesomeIcon
                icon={faGamepad}
                style={{ color: '#E9AF3C', fontSize: '1.6rem', marginTop: 2 }}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl uppercase tracking-wide text-goya-paper">
                    Cyber Puma Runner
                  </h2>
                  <span className="bg-goya-amber px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-label text-goya-void">
                    Nuevo
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                  Nuestro arcade Web3. Supera los récords esquivando obstáculos y desbloquea hasta
                  210 tokens $PUMA directamente al contrato inteligente.
                </p>
              </div>
            </div>

            <Link
              to="/juegos"
              className="goya-cut group inline-flex shrink-0 items-center justify-center gap-2 bg-goya-amber px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
              style={{ ['--cut' as string]: '10px' }}
            >
              Jugar ahora
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[0.7rem] transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ---- Reclamos con código ---- */}
      <Seccion
        id="reclamos"
        rotulo="Reclamos"
        titulo="Canjea tu código"
        intro="Todo se reclama aquí: sesión de embajadores (PUMA) y credenciales de curso, evento o certificación."
      >
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <DropCodeClaim />
          <BadgeCodeClaimPanel />
        </div>
      </Seccion>

      {/* ---- Misiones ---- */}
      <Seccion
        rotulo="Misiones"
        titulo="Misiones disponibles"
        intro="Las misiones activas las publica el equipo y se reclaman una sola vez por wallet."
      >
        <PumaMissionsSection
          missions={missions}
          isLoading={loadingMissions}
          onTxConfirmed={() => refetchMissions()}
          tone="embajador"
        />
      </Seccion>
    </div>
  )
}

export default Recompensas

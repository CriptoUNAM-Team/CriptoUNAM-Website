import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useAccount, useConfig, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGamepad,
  faTrophy,
  faCoins,
  faBolt,
  faPlay,
  faRedo,
  faVolumeUp,
  faVolumeMute,
  faCheckCircle,
  faShieldHalved,
  faWandMagicSparkles,
  faExclamationTriangle,
  faAward,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons'
import { usePumaMissionClaims } from '../../hooks/usePumaMissions'
import { pumaCompleteMissionAbi, type PumaMissionRow } from '../../constants/pumaTokenAbi'
import { useEnsureNetwork } from '../../hooks/useEnsureNetwork'
import { useWallet } from '../../context/WalletContext'
import { useAdmin } from '../../hooks/useAdmin'
import ENV_CONFIG from '../../config/env'
import '../../styles/puma-animations.css'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://testnet.snowtrace.io'

// Definición de las 3 Misiones / Niveles Web3 del Juego
export const PUMA_RUNNER_MISSIONS: PumaMissionRow[] = [
  {
    missionId: 'PUMA-RUNNER-NOVATO',
    title: 'Puma Runner 🥉 Novato Cripto (500 pts)',
    reward: 10n * 10n ** 18n, // 10 PUMA
    active: true,
    deadline: 0n,
    exists: true,
  },
  {
    missionId: 'PUMA-RUNNER-HACKER',
    title: 'Puma Runner 🥈 Hacker UNAM (1,500 pts)',
    reward: 50n * 10n ** 18n, // 50 PUMA
    active: true,
    deadline: 0n,
    exists: true,
  },
  {
    missionId: 'PUMA-RUNNER-MAESTRO',
    title: 'Puma Runner 🥇 Cyber Maestro (3,000 pts)',
    reward: 150n * 10n ** 18n, // 150 PUMA
    active: true,
    deadline: 0n,
    exists: true,
  },
]

const SCORE_THRESHOLDS = {
  'PUMA-RUNNER-NOVATO': 500,
  'PUMA-RUNNER-HACKER': 1500,
  'PUMA-RUNNER-MAESTRO': 3000,
}

// Sonidos retro sintetizados con Web Audio API
class SoundFx {
  private ctx: AudioContext | null = null
  public muted: boolean = false

  constructor() {
    // Lazy init en el primer clic/interacción
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  playCoin() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1) // A5
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.15)
  }

  playJump() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.18)
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.2)
  }

  playPowerup() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(300, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.1)
    osc.frequency.linearRampToValueAtTime(900, this.ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.25)
  }

  playGameOver() {
    if (this.muted) return
    this.init()
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, this.ctx.currentTime)
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.3)
    osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 0.6)
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.65)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.65)
  }
}

const sfx = new SoundFx()

const PumaRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { isConnected, connectWallet } = useWallet()
  const { address } = useAccount()
  const wagmiConfig = useConfig()
  const { ensure: ensureTargetChain, targetChainId } = useEnsureNetwork()
  const targetChain = wagmiConfig.chains.find((c) => c.id === targetChainId)
  const { isAdmin } = useAdmin()

  // Estados del juego
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('puma_runner_high_score') || '0', 10)
    }
    return 0
  })
  const [coinsCollected, setCoinsCollected] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // Consultar reclamos en blockchain
  const { data: claimedMap, refetch: refetchClaims } = usePumaMissionClaims(PUMA_RUNNER_MISSIONS, address)

  // Hook de escritura para reclamar
  const { writeContract, data: txHash, isPending: isSendingTx, error: writeError, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (txSuccess) {
      refetchClaims()
      reset()
    }
  }, [txSuccess, refetchClaims, reset])

  const busy = isSendingTx || isConfirming

  const toggleMute = () => {
    sfx.muted = !sfx.muted
    setIsMuted(sfx.muted)
  }

  // Lógica del motor del juego (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isRunning = gameState === 'PLAYING'

    // Variables de física y entidades
    const width = canvas.width
    const height = canvas.height
    const groundY = height - 60

    let player = {
      x: 80,
      y: groundY - 50,
      width: 50,
      height: 50,
      vy: 0,
      gravity: 0.75,
      jumpStrength: -13.5,
      isJumping: false,
      doubleJumpUsed: false,
      isSliding: false,
      invincibleTimer: 0,
    }

    let obstacles: Array<{
      x: number
      y: number
      width: number
      height: number
      type: 'BUG' | 'FIREWALL' | 'LASER'
      speed: number
      passed: boolean
    }> = []

    let collectibles: Array<{
      x: number
      y: number
      radius: number
      type: 'COIN' | 'SHIELD'
      collected: boolean
    }> = []

    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      alpha: number
      size: number
    }> = []

    let gameSpeed = 4.0
    let frameCount = 0
    let currentScore = 0
    let currentCoins = 0

    // Cargar imagen de Puma Avatar para el personaje
    const pumaImg = new Image()
    pumaImg.src = '/images/Equipo/puma_avatar_1.png'

    const handleJump = () => {
      if (gameState !== 'PLAYING') return
      if (!player.isJumping) {
        player.vy = player.jumpStrength
        player.isJumping = true
        sfx.playJump()
        createParticles(player.x, player.y + player.height, '#F4D03F', 8)
      } else if (!player.doubleJumpUsed) {
        player.vy = player.jumpStrength * 0.9
        player.doubleJumpUsed = true
        sfx.playJump()
        createParticles(player.x, player.y + player.height, '#60a5fa', 12)
      }
    }

    const handleSlideDown = () => {
      if (gameState !== 'PLAYING') return
      if (!player.isJumping && !player.isSliding) {
        player.isSliding = true
        player.height = 28
        player.y = groundY - 28
        setTimeout(() => {
          player.isSliding = false
          player.height = 50
          if (!player.isJumping) player.y = groundY - 50
        }, 650)
      } else if (player.isJumping) {
        player.vy += 10 // Caída rápida
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault()
        if (gameState === 'START' || gameState === 'GAMEOVER') {
          startGame()
        } else {
          handleJump()
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault()
        handleSlideDown()
      }
    }

    const onCanvasClick = () => {
      if (gameState === 'START' || gameState === 'GAMEOVER') {
        startGame()
      } else {
        handleJump()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    canvas.addEventListener('click', onCanvasClick)

    const createParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 2,
          color,
          alpha: 1,
          size: Math.random() * 5 + 2,
        })
      }
    }

    const spawnObstacle = () => {
      const types: Array<'BUG' | 'FIREWALL' | 'LASER'> = ['BUG', 'FIREWALL', 'BUG']
      if (currentScore > 600) types.push('LASER')
      const type = types[Math.floor(Math.random() * types.length)]

      let obsWidth = 40
      let obsHeight = 45
      let obsY = groundY - obsHeight

      if (type === 'FIREWALL') {
        obsWidth = 35
        obsHeight = 65
        obsY = groundY - obsHeight
      } else if (type === 'LASER') {
        obsWidth = 45
        obsHeight = 25
        obsY = groundY - 75 // Obstáculo aéreo, hay que deslizarse por debajo o doble salto alto
      }

      obstacles.push({
        x: width + 50,
        y: obsY,
        width: obsWidth,
        height: obsHeight,
        type,
        speed: gameSpeed,
        passed: false,
      })
    }

    const spawnCollectible = () => {
      const isShield = Math.random() < 0.15 && currentScore > 200
      collectibles.push({
        x: width + 50,
        y: groundY - (Math.random() > 0.5 ? 90 : 40),
        radius: isShield ? 16 : 14,
        type: isShield ? 'SHIELD' : 'COIN',
        collected: false,
      })
    }

    // Bucle principal de renderizado
    const update = () => {
      if (!isRunning) return
      frameCount++

      // Aumentar dificultad gradualmente pero controlada (máxima velocidad de 7.0)
      gameSpeed = Math.min(7.0, 4.0 + Math.floor(currentScore / 500) * 0.35)
      currentScore += 1
      if (frameCount % 6 === 0) {
        setScore(currentScore)
      }

      // Física del jugador
      player.vy += player.gravity
      player.y += player.vy

      if (player.y > groundY - player.height) {
        player.y = groundY - player.height
        player.vy = 0
        player.isJumping = false
        player.doubleJumpUsed = false
      }

      if (player.invincibleTimer > 0) {
        player.invincibleTimer--
      }

      // Generar obstáculos y monedas con más espacio y tiempo para reaccionar
      if (frameCount % Math.max(70, Math.floor(140 - gameSpeed * 5)) === 0) {
        if (Math.random() < 0.7) spawnObstacle()
      }
      if (frameCount % 35 === 0) {
        if (Math.random() < 0.85) spawnCollectible()
      }

      // Mover y dibujar fondo
      ctx.fillStyle = '#0a0a12'
      ctx.fillRect(0, 0, width, height)

      // Dibujar cuadrícula neón cyberpunk (suelo)
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)'
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 40) {
        const offset = (i - (frameCount * gameSpeed * 0.5) % 40)
        ctx.beginPath()
        ctx.moveTo(offset, groundY)
        ctx.lineTo(offset - 60, height)
        ctx.stroke()
      }
      ctx.strokeStyle = '#2563EB'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(width, groundY)
      ctx.stroke()

      // Dibujar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= 0.02
        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Mover y verificar colisiones con obstáculos
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i]
        obs.x -= obs.speed

        // Dibujar obstáculo
        if (obs.type === 'BUG') {
          ctx.fillStyle = '#ef4444'
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
          ctx.strokeStyle = '#f87171'
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
        } else if (obs.type === 'FIREWALL') {
          ctx.fillStyle = '#f97316'
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
          ctx.strokeStyle = '#fbbf24'
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
        } else if (obs.type === 'LASER') {
          ctx.fillStyle = '#a855f7'
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
          ctx.strokeStyle = '#e879f9'
          ctx.lineWidth = 2
          ctx.strokeRect(obs.x, obs.y, obs.width, obs.height)
        }

        // Colisión con jugador
        if (
          player.x < obs.x + obs.width - 8 &&
          player.x + player.width - 8 > obs.x &&
          player.y < obs.y + obs.height - 8 &&
          player.y + player.height - 8 > obs.y
        ) {
          if (player.invincibleTimer > 0) {
            // Destruir obstáculo con escudo
            createParticles(obs.x + obs.width / 2, obs.y + obs.height / 2, '#60a5fa', 15)
            obstacles.splice(i, 1)
            sfx.playPowerup()
            continue
          } else {
            // Game Over
            sfx.playGameOver()
            isRunning = false
            setGameState('GAMEOVER')
            if (currentScore > highScore) {
              setHighScore(currentScore)
              localStorage.setItem('puma_runner_high_score', String(currentScore))
            }
            break
          }
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1)
        }
      }

      // Mover y verificar coleccionables
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const col = collectibles[i]
        col.x -= gameSpeed

        if (!col.collected) {
          ctx.beginPath()
          ctx.arc(col.x, col.y, col.radius, 0, Math.PI * 2)
          if (col.type === 'COIN') {
            ctx.fillStyle = '#F4D03F'
            ctx.shadowColor = '#D4AF37'
            ctx.shadowBlur = 10
            ctx.fill()
            ctx.shadowBlur = 0
            ctx.fillStyle = '#000'
            ctx.font = 'bold 12px Orbitron'
            ctx.fillText('P', col.x - 4, col.y + 4)
          } else {
            ctx.fillStyle = '#3b82f6'
            ctx.shadowColor = '#60a5fa'
            ctx.shadowBlur = 10
            ctx.fill()
            ctx.shadowBlur = 0
            ctx.fillStyle = '#fff'
            ctx.font = 'bold 10px Orbitron'
            ctx.fillText('🛡️', col.x - 6, col.y + 4)
          }

          // Colisión con coleccionable
          const dx = player.x + player.width / 2 - col.x
          const dy = player.y + player.height / 2 - col.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < player.width / 2 + col.radius) {
            col.collected = true
            collectibles.splice(i, 1)
            if (col.type === 'COIN') {
              currentCoins++
              currentScore += 75
              setCoinsCollected(currentCoins)
              setScore(currentScore)
              sfx.playCoin()
              createParticles(col.x, col.y, '#F4D03F', 10)
            } else {
              player.invincibleTimer = 300 // ~5 segundos a 60fps
              sfx.playPowerup()
              createParticles(col.x, col.y, '#3b82f6', 15)
            }
          }
        }

        if (col.x + col.radius < 0) {
          collectibles.splice(i, 1)
        }
      }

      // Dibujar Jugador (Puma)
      ctx.save()
      if (player.invincibleTimer > 0) {
        ctx.shadowColor = '#60a5fa'
        ctx.shadowBlur = 18
        if (Math.floor(frameCount / 4) % 2 === 0) ctx.globalAlpha = 0.8
      } else {
        ctx.shadowColor = '#F4D03F'
        ctx.shadowBlur = 8
      }

      if (pumaImg.complete && pumaImg.naturalWidth > 0) {
        ctx.drawImage(pumaImg, player.x, player.y, player.width, player.height)
      } else {
        // Fallback gráfico en caso de que la imagen tarde
        ctx.fillStyle = '#D4AF37'
        ctx.fillRect(player.x, player.y, player.width, player.height)
      }
      ctx.restore()

      // Dibujar HUD en el Canvas
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 16px Orbitron'
      ctx.fillText(`SCORE: ${currentScore}`, 20, 30)
      ctx.fillStyle = '#F4D03F'
      ctx.fillText(`PUMA: ${currentCoins}`, 20, 55)
      if (player.invincibleTimer > 0) {
        ctx.fillStyle = '#60a5fa'
        ctx.fillText(`🛡️ ESCUDO: ${Math.ceil(player.invincibleTimer / 60)}s`, width - 150, 30)
      }

      if (isRunning) {
        animationFrameId = requestAnimationFrame(update)
      }
    }

    if (gameState === 'PLAYING') {
      animationFrameId = requestAnimationFrame(update)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('click', onCanvasClick)
    }
  }, [gameState, highScore])

  const startGame = useCallback(() => {
    setScore(0)
    setCoinsCollected(0)
    setGameState('PLAYING')
  }, [])

  // Reclamar misión en blockchain
  const claimMissionReward = async (missionId: string) => {
    if (!targetChain || !address) return
    if (!(await ensureTargetChain())) return
    writeContract({
      address: tokenAddr,
      abi: pumaCompleteMissionAbi,
      functionName: 'completeMission',
      args: [missionId],
      chain: targetChain,
      account: address,
    })
  }

  return (
    <div className="puma-card puma-card--featured puma-fade-in-up" style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}>
      {/* Cabecera del Juego */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="puma-pulse-ring"
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F4D03F, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
            }}
          >
            <FontAwesomeIcon icon={faGamepad} style={{ color: '#fff', fontSize: '1.3rem' }} />
          </div>
          <div>
            <h2 className="puma-title-glow" style={{ fontFamily: 'Orbitron', margin: 0, fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
              Cyber Puma Runner
            </h2>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>
              Esquiva obstáculos web3, recolecta PUMA y desbloquea recompensas reales en blockchain.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '0.4rem 0.8rem', borderRadius: 8, border: '1px solid rgba(212,175,55,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>RÉCORD</div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, color: '#F4D03F', fontSize: '1.1rem' }}>
              <FontAwesomeIcon icon={faTrophy} style={{ marginRight: 6 }} />
              {highScore}
            </div>
          </div>
          <button
            onClick={toggleMute}
            className="puma-btn puma-btn--ghost"
            style={{ padding: '0.5rem', borderRadius: '50%', width: 40, height: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} style={{ fontSize: '1.1rem' }} />
          </button>
        </div>
      </div>

      {/* Área del Canvas e Interfaz de Inicio / Fin */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', borderRadius: 16, overflow: 'hidden', border: '2px solid #2563EB', boxShadow: '0 0 30px rgba(37, 99, 235, 0.25)', background: '#0a0a12' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={380}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }}
        />

        {/* Pantalla de Inicio */}
        {gameState === 'START' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 10, 18, 0.85)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
            <img src="/images/Equipo/puma_avatar_1.png" alt="Cyber Puma" style={{ width: 80, height: 80, marginBottom: '1rem', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.8))' }} />
            <h3 style={{ fontFamily: 'Orbitron', color: '#F4D03F', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>
              PUMA RUNNER
            </h3>
            <p style={{ color: '#cbd5e1', maxWidth: 450, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Presiona <strong style={{ color: '#F4D03F' }}>ESPACIO</strong>, <strong style={{ color: '#F4D03F' }}>FLECHA ARRIBA</strong> o haz clic en el recuadro para saltar (Doble Salto disponible). Flecha abajo para deslizarte bajo los cortafuegos.
            </p>
            <button onClick={startGame} className="puma-btn puma-btn--gold" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: 30 }}>
              <FontAwesomeIcon icon={faPlay} />
              INICIAR MISIÓN
            </button>
          </div>
        )}

        {/* Pantalla de Game Over */}
        {gameState === 'GAMEOVER' && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 10, 18, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: '#ef4444', fontFamily: 'Orbitron', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              MISIÓN FINALIZADA
            </div>
            <div style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              Puntuación Final: <strong style={{ color: '#F4D03F' }}>{score}</strong>
            </div>
            <div style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              {score >= 3000
                ? '🔥 ¡Increíble! Has alcanzado el rango de Maestro Cripto.'
                : score >= 1500
                ? '⚡ ¡Excelente corrida Hacker! Reclama tu recompensa Nivel 2.'
                : score >= 500
                ? '✨ ¡Buen comienzo Novato! Ya puedes reclamar tu primer premio.'
                : 'Sigue intentando para alcanzar los 500 puntos y desbloquear tokens $PUMA reales.'}
            </div>
            <button onClick={startGame} className="puma-btn puma-btn--blue" style={{ padding: '0.7rem 1.8rem', fontSize: '1rem', borderRadius: 30 }}>
              <FontAwesomeIcon icon={faRedo} />
              JUGAR DE NUEVO
            </button>
          </div>
        )}
      </div>

      {/* Sección de Recompensa en Blockchain (Los 3 Niveles) */}
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
          <FontAwesomeIcon icon={faAward} style={{ fontSize: '1.3rem', color: '#F4D03F' }} />
          <h3 style={{ fontFamily: 'Orbitron', color: '#fff', margin: 0, fontSize: '1.2rem' }}>
            Recompensas Web3 Desbloqueadas
          </h3>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Tus mejores puntuaciones te permiten reclamar tokens $PUMA reales directamente al contrato inteligente en Avalanche Fuji. ¡Una vez superado el puntaje, el botón de cobro se habilitará!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {PUMA_RUNNER_MISSIONS.map((mission, idx) => {
            const threshold = SCORE_THRESHOLDS[mission.missionId as keyof typeof SCORE_THRESHOLDS]
            const isUnlocked = highScore >= threshold
            const isClaimed = claimedMap?.[mission.missionId] === true
            const canClaim = isConnected && isUnlocked && !isClaimed

            return (
              <div
                key={mission.missionId}
                className={`puma-card ${isUnlocked ? 'puma-glow' : ''}`}
                style={{
                  padding: '1.2rem',
                  borderRadius: 14,
                  background: isUnlocked ? 'rgba(37, 99, 235, 0.12)' : 'rgba(20, 20, 30, 0.5)',
                  border: isUnlocked ? '1px solid #2563EB' : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="puma-chip puma-chip--gold" style={{ fontSize: '0.75rem' }}>
                      <FontAwesomeIcon icon={faCoins} />
                      +{formatEther(mission.reward)} PUMA
                    </span>
                    <span className={`puma-chip ${isClaimed ? 'puma-chip--green' : isUnlocked ? 'puma-chip--blue' : 'puma-chip--amber'}`} style={{ fontSize: '0.7rem' }}>
                      {isClaimed ? 'Reclamado' : isUnlocked ? 'Desbloqueado' : `Meta: ${threshold} pts`}
                    </span>
                  </div>

                  <h4 style={{ color: '#fff', fontFamily: 'Orbitron', fontSize: '0.95rem', margin: '0.5rem 0' }}>
                    {mission.title}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 1rem' }}>
                    {isClaimed
                      ? 'Recompensa acreditada a tu wallet.'
                      : isUnlocked
                      ? '¡Has superado el puntaje requerido! Haz clic para reclamar en blockchain.'
                      : `Alcanza ${threshold} puntos en una partida para desbloquear.`}
                  </p>
                </div>

                <div>
                  {!isConnected ? (
                    <button
                      type="button"
                      onClick={() => connectWallet()}
                      className="puma-btn puma-btn--ghost"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                    >
                      <FontAwesomeIcon icon={faWandMagicSparkles} />
                      Conectar Wallet
                    </button>
                  ) : isClaimed ? (
                    <button
                      type="button"
                      disabled
                      className="puma-btn puma-btn--ghost"
                      style={{ width: '100%', justifyContent: 'center', opacity: 0.6, fontSize: '0.85rem' }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Cobrado en Blockchain
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => claimMissionReward(mission.missionId)}
                      disabled={!canClaim || busy}
                      className={canClaim ? 'puma-btn puma-btn--gold' : 'puma-btn puma-btn--ghost'}
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                    >
                      <FontAwesomeIcon icon={faBolt} />
                      {busy ? 'Minteando…' : 'Reclamar PUMA'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {writeError && (
          <div className="puma-alert puma-alert--error" style={{ marginTop: '1rem' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: 8 }} />
            <span>{writeError.message.slice(0, 200)}</span>
          </div>
        )}

        {txSuccess && (
          <div className="puma-alert puma-alert--success puma-pop-in" style={{ marginTop: '1rem' }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '1.2rem' }} />
            <div>
              <strong style={{ color: '#bbf7d0' }}>¡Transacción Confirmada!</strong>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem' }}>
                Tus tokens $PUMA han sido minteados en tu wallet.{' '}
                {txHash && (
                  <a href={`${explorerBase}/tx/${txHash}`} target="_blank" rel="noreferrer" style={{ color: '#86efac', fontWeight: 600 }}>
                    Ver en Explorer <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem' }} />
                  </a>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Nota para Administradores de CriptoUNAM */}
        {isAdmin && (
          <div className="puma-alert puma-alert--warn" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 2 }} />
            <div>
              <strong>Panel Admin - Nota de Configuración:</strong> Para que los usuarios puedan reclamar estas 3 misiones del juego sin error, asegúrate de registrarlas una vez en el contrato <code>PUMAToken</code> ejecutando <code>createMission</code> con los IDs: <code>PUMA-RUNNER-NOVATO</code> (10 PUMA), <code>PUMA-RUNNER-HACKER</code> (50 PUMA) y <code>PUMA-RUNNER-MAESTRO</code> (150 PUMA).
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PumaRunnerGame

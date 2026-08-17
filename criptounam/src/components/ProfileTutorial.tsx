import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWandMagicSparkles,
  faCalendarCheck,
  faMedal,
  faCoins,
  faRocket,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faArrowRight,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'

const STORAGE_KEY = 'criptounam_profile_tutorial_dismissed'

interface Step {
  icon: IconDefinition
  iconColor: string
  iconBg: string
  title: string
  body: React.ReactNode
}

const STEPS: Step[] = [
  {
    icon: faWandMagicSparkles,
    iconColor: '#0a0a0a',
    iconBg: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
    title: 'Bienvenido a tu perfil CriptoUNAM',
    body: (
      <>
        Aquí ves todo lo que vas construyendo en la comunidad: tu balance{' '}
        <strong style={{ color: '#F4D03F' }}>$PUMA</strong>, tus credenciales NFT, cursos
        completos, eventos asistidos y misiones activas. Es tu identidad on-chain.
      </>
    ),
  },
  {
    icon: faCalendarCheck,
    iconColor: '#fff',
    iconBg: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    title: 'Eventos y sesiones',
    body: (
      <>
        Inscríbete a <strong>eventos presenciales</strong> y{' '}
        <strong>sesiones de embajadores</strong> desde{' '}
        <Link to="/eventos" style={{ color: '#F4D03F' }}>Eventos</Link>. Al asistir recibes un{' '}
        <strong>código único</strong> que luego canjeas para acuñar tu POAP y tus $PUMA.
      </>
    ),
  },
  {
    icon: faMedal,
    iconColor: '#0a0a0a',
    iconBg: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
    title: 'POAPs y credenciales NFT',
    body: (
      <>
        Cada asistencia, curso terminado o certificación se acuña como un{' '}
        <strong>NFT soulbound</strong> en Avalanche Fuji: no se vende ni se transfiere — es tu
        reputación. Aparecen en <strong>Mi colección NFT</strong>, clasificadas por tipo
        (eventos, embajadores, certificados).
      </>
    ),
  },
  {
    icon: faCoins,
    iconColor: '#0a0a0a',
    iconBg: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
    title: 'Recompensas $PUMA',
    body: (
      <>
        $PUMA es el token de reputación de la comunidad. Lo ganas asistiendo a eventos,
        completando cursos y reclamando <strong>misiones</strong>. Tu <strong>XP</strong>{' '}
        acumulado sube tu nivel — entra a{' '}
        <Link to="/recompensas/misiones" style={{ color: '#F4D03F' }}>Misiones</Link> para
        reclamar las que tengas abiertas.
      </>
    ),
  },
  {
    icon: faRocket,
    iconColor: '#fff',
    iconBg: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    title: 'Empieza ahora',
    body: (
      <>
        ¿Tienes un código de evento o sesión? Ve a{' '}
        <Link to="/claim" style={{ color: '#F4D03F' }}>Reclamar</Link>. ¿Sin código? Explora{' '}
        <Link to="/eventos" style={{ color: '#F4D03F' }}>Eventos</Link>,{' '}
        <Link to="/cursos" style={{ color: '#F4D03F' }}>Cursos</Link> o las{' '}
        <Link to="/recompensas/misiones" style={{ color: '#F4D03F' }}>Misiones</Link>{' '}
        activas.
      </>
    ),
  },
]

interface ProfileTutorialProps {
  forceOpen?: boolean
  onClose?: () => void
}

const ProfileTutorial: React.FC<ProfileTutorialProps> = ({ forceOpen = false, onClose }) => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [dontShow, setDontShow] = useState(false)

  useEffect(() => {
    if (forceOpen) {
      setOpen(true)
      setStep(0)
      return
    }
    let dismissed = false
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      dismissed = false
    }
    if (!dismissed) {
      setOpen(true)
    }
  }, [forceOpen])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, STEPS.length - 1))
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClose = () => {
    if (dontShow) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        /* ignore */
      }
    }
    setOpen(false)
    setStep(0)
    onClose?.()
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      handleClose()
    }
  }

  const handleBack = () => setStep((s) => Math.max(0, s - 1))

  if (!open) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-tutorial-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'pumaFadeIn 0.25s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="puma-fade-in-up"
        style={{
          background:
            'linear-gradient(160deg, rgba(26,26,26,0.98), rgba(14,14,18,0.98))',
          border: '1.5px solid rgba(212,175,55,0.4)',
          borderRadius: 24,
          maxWidth: 540,
          width: '100%',
          padding: 'clamp(1.5rem, 4vw, 2.25rem)',
          position: 'relative',
          boxShadow:
            '0 24px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.15) inset',
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar tutorial"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 34,
            height: 34,
            borderRadius: 10,
            border: '1px solid rgba(212,175,55,0.3)',
            background: 'rgba(0,0,0,0.4)',
            color: '#F4D03F',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: '1.5rem',
            alignItems: 'center',
            paddingRight: 48,
          }}
        >
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al paso ${i + 1}`}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 22 : 10,
                height: 10,
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background:
                  i === step
                    ? 'linear-gradient(90deg, #F4D03F, #D4AF37)'
                    : i < step
                    ? 'rgba(212,175,55,0.5)'
                    : 'rgba(255,255,255,0.18)',
                transition: 'width 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 'auto',
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontFamily: 'monospace',
            }}
          >
            {step + 1} / {STEPS.length}
          </span>
        </div>

        <div
          key={step}
          className="puma-pop-in"
          style={{
            width: 76,
            height: 76,
            margin: '0 auto 1.25rem',
            borderRadius: 22,
            background: current.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: current.iconColor,
            fontSize: '2.1rem',
            boxShadow: '0 14px 36px rgba(212,175,55,0.3)',
          }}
        >
          <FontAwesomeIcon icon={current.icon} />
        </div>

        <h2
          id="profile-tutorial-title"
          style={{
            fontFamily: 'Chakra Petch',
            color: '#fff',
            fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)',
            textAlign: 'center',
            margin: '0 0 0.85rem',
            lineHeight: 1.25,
          }}
        >
          {current.title}
        </h2>

        <p
          style={{
            color: '#cbd5e1',
            fontSize: 'clamp(0.92rem, 2.5vw, 1rem)',
            textAlign: 'center',
            lineHeight: 1.65,
            margin: '0 0 1.5rem',
          }}
        >
          {current.body}
        </p>

        {isLast && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: '0.85rem',
              color: '#cbd5e1',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              style={{
                width: 16,
                height: 16,
                margin: 0,
                accentColor: '#D4AF37',
                cursor: 'pointer',
              }}
            />
            No volver a mostrar
          </label>
        )}

        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            className="puma-btn puma-btn--ghost"
            onClick={step === 0 ? handleClose : handleBack}
            style={{ minWidth: 110 }}
          >
            {step === 0 ? (
              'Saltar'
            ) : (
              <>
                <FontAwesomeIcon icon={faChevronLeft} />
                Atrás
              </>
            )}
          </button>
          <button
            type="button"
            className="puma-btn puma-btn--gold"
            onClick={handleNext}
            style={{ minWidth: 130 }}
          >
            {isLast ? (
              <>
                Listo
                <FontAwesomeIcon icon={faArrowRight} />
              </>
            ) : (
              <>
                Siguiente
                <FontAwesomeIcon icon={faChevronRight} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileTutorial

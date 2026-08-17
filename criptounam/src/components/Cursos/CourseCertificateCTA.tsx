import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faAward,
  faLock,
  faExternalLinkAlt,
  faCheckCircle,
  faShieldHalved,
  faArrowRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../../config/env'
import {
  obtenerCertificadoCurso,
  invalidarCacheProgreso,
  type CertificadoCurso,
} from '../../services/progresoCurso.service'
import { apiFetch } from '../../services/apiClient'
import { badgesContractConfigured } from '../../hooks/useCriptoUnamBadges'

const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://etherscan.io'

type AutoMintStatus =
  | { state: 'idle' }
  | { state: 'pending' }
  | { state: 'success'; tokenId?: string; txHash?: string }
  | { state: 'error'; message: string }

type Props = {
  cursoId: string
  cursoTitulo: string
  cohorteRef?: string
  badgeRef: string
  progreso: number
  totalLecciones: number
  /**
   * Si el curso tiene examen final, debe estar aprobado para considerarse
   * completado a efectos del certificado. Cursos sin examen final deben
   * pasar `true` (o no pasar la prop).
   */
  examenFinalAprobado?: boolean
}

const CourseCertificateCTA: React.FC<Props> = ({
  cursoId,
  cursoTitulo,
  cohorteRef,
  badgeRef,
  progreso,
  totalLecciones,
  examenFinalAprobado = true,
}) => {
  const { address } = useAccount()
  const [cert, setCert] = useState<CertificadoCurso | null>(null)
  const [checking, setChecking] = useState(false)
  const [autoMint, setAutoMint] = useState<AutoMintStatus>({ state: 'idle' })
  const attempted = useRef(false)
  const completado = progreso >= 100 && examenFinalAprobado

  // Buscar certificado existente
  useEffect(() => {
    if (!address || !completado) return
    let cancelled = false
    setChecking(true)
    obtenerCertificadoCurso(address, badgeRef)
      .then((c) => {
        if (!cancelled) setCert(c)
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [address, badgeRef, completado])

  // Auto-emisión: si curso completo, no hay cert previa y aún no intentamos
  useEffect(() => {
    if (!address || !completado || checking) return
    if (cert) return // ya existe
    if (attempted.current) return // ya intentamos en esta sesión
    if (autoMint.state !== 'idle') return
    if (!badgesContractConfigured) return

    attempted.current = true
    setAutoMint({ state: 'pending' })

    // El endpoint acuña el NFT y reparte PUMA: exige el token de Privy y
    // comprueba que la wallet sea de quien pide. `cohorteRef` y
    // `totalLecciones` los resuelve el servidor desde el catálogo.
    apiFetch<{ tokenId?: string; txHash?: string }>('/courses/auto-certificate', {
      method: 'POST',
      body: {
        wallet: address,
        cursoId,
        cursoTitulo,
      },
    })
      .then((data) => {
        setAutoMint({
          state: 'success',
          tokenId: data.tokenId,
          txHash: data.txHash,
        })
        // refrescar registro local (saltando la caché corta del servicio)
        invalidarCacheProgreso(address)
        obtenerCertificadoCurso(address, badgeRef).then((c) => setCert(c))
      })
      .catch((err) => {
        setAutoMint({
          state: 'error',
          message: err instanceof Error ? err.message : 'No pudimos emitir el certificado.',
        })
      })
  }, [address, completado, checking, cert, cursoId, cursoTitulo, autoMint.state, badgeRef])

  if (!completado) {
    return (
      <div
        className="puma-card puma-fade-in-up"
        style={{
          marginTop: '1.5rem',
          borderColor: 'rgba(212,175,55,0.2)',
          background:
            'linear-gradient(160deg, rgba(20,20,30,0.92) 0%, rgba(15,23,42,0.92) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'rgba(212,175,55,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(212,175,55,0.6)',
            }}
          >
            <FontAwesomeIcon icon={faLock} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                color: '#cbd5e1',
                fontFamily: 'Chakra Petch',
                fontSize: '0.98rem',
                margin: 0,
              }}
            >
              Tu certificado NFT te espera
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
              Completa todas las lecciones para desbloquear la credencial soulbound.
            </p>
          </div>
        </div>
        <div
          style={{
            height: 8,
            borderRadius: 999,
            background: 'rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progreso}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #D4AF37, #F4D03F)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <p style={{ color: '#777', fontSize: '0.78rem', marginTop: 8, marginBottom: 0 }}>
          {progreso}% completado · {totalLecciones} lecciones en total
        </p>
      </div>
    )
  }

  /* ====================== Curso completado ====================== */
  const yaReclamado = !!cert

  return (
    <div
      className="puma-card puma-card--featured puma-card--rainbow puma-pop-in"
      style={{
        marginTop: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '1.25rem',
          alignItems: 'center',
        }}
      >
        <div
          className="puma-float"
          style={{
            width: 96,
            height: 96,
            borderRadius: 22,
            background:
              'radial-gradient(circle at 30% 20%, rgba(244,208,63,0.55), transparent 60%), linear-gradient(135deg, #F4D03F, #D4AF37 70%, #8b6e1d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 18px 40px rgba(212,175,55,0.4)',
            border: '2px solid rgba(255,255,255,0.18)',
          }}
        >
          <FontAwesomeIcon
            icon={faGraduationCap}
            style={{ color: '#0a0a0a', fontSize: '2.4rem' }}
          />
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: '0.5rem',
            }}
          >
            <span className="puma-chip puma-chip--green">
              <FontAwesomeIcon icon={faCheckCircle} />
              Curso completado
            </span>
            <span className="puma-chip puma-chip--amber">
              <FontAwesomeIcon icon={faLock} />
              Soulbound NFT
            </span>
          </div>
          <h3
            className="puma-title-glow"
            style={{
              fontFamily: 'Chakra Petch',
              fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
              margin: '0 0 0.3rem',
              lineHeight: 1.2,
            }}
          >
            ¡Felicidades, terminaste el curso!
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.55, margin: 0 }}>
            Reclama tu credencial on-chain de <strong style={{ color: '#fff' }}>{cursoTitulo}</strong>{' '}
            como certificado oficial CriptoUNAM.
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '0.8rem 1rem',
          borderRadius: 12,
          background: 'rgba(0,0,0,0.35)',
          border: '1px dashed rgba(212,175,55,0.35)',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          color: '#94a3b8',
          wordBreak: 'break-all',
        }}
      >
        <span style={{ color: '#F4D03F', marginRight: 6 }}>ref</span>
        {badgeRef}
      </div>

      {!badgesContractConfigured && (
        <div className="puma-alert puma-alert--warn" style={{ marginTop: '1rem' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
          <span>
            El contrato de credenciales aún no está enlazado. Cuando deployemos el contrato,
            podrás reclamar tu NFT aquí.
          </span>
        </div>
      )}

      {checking && (
        <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '1rem' }}>
          Buscando tu certificado en el registro…
        </p>
      )}

      {/* ESTADO 1: ya minteado (cert en DB o success del endpoint) */}
      {(yaReclamado || autoMint.state === 'success') && (
        <div className="puma-alert puma-alert--success puma-pop-in" style={{ marginTop: '1rem' }}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ marginTop: 3, fontSize: '1.1rem' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ color: '#bbf7d0' }}>¡Certificado emitido en tu wallet!</strong>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
              {(cert?.token_id || autoMint.state === 'success') && (
                <>
                  Token #{cert?.token_id ?? (autoMint.state === 'success' ? autoMint.tokenId : '')}
                  <br />
                </>
              )}
              {(cert?.tx_hash || (autoMint.state === 'success' && autoMint.txHash)) && (
                <a
                  href={`${explorerBase}/tx/${
                    cert?.tx_hash ?? (autoMint.state === 'success' ? autoMint.txHash : '')
                  }`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: '#86efac',
                    fontWeight: 600,
                  }}
                >
                  Ver transacción
                  <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem' }} />
                </a>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ESTADO 2: en curso (auto-emisión disparada) */}
      {!yaReclamado && autoMint.state === 'pending' && (
        <div
          className="puma-alert puma-alert--info"
          style={{ marginTop: '1rem', alignItems: 'center' }}
        >
          <FontAwesomeIcon icon={faSpinner} spin style={{ marginTop: 3, fontSize: '1.1rem' }} />
          <span>
            <strong>Emitiendo tu certificado on-chain…</strong>{' '}
            <span style={{ opacity: 0.85 }}>
              Esto toma unos segundos. No cierres la pestaña.
            </span>
          </span>
        </div>
      )}

      {/* ESTADO 3: error → fallback al claim manual */}
      {!yaReclamado && autoMint.state === 'error' && (
        <>
          <div className="puma-alert puma-alert--warn" style={{ marginTop: '1rem' }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
            <span style={{ wordBreak: 'break-word' }}>
              No pudimos emitir tu certificado automáticamente ({autoMint.message}). Puedes intentar
              el reclamo manual.
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '1rem',
            }}
          >
            <Link
              to={`/claim/curso/${badgeRef}`}
              className="puma-btn puma-btn--gold"
              style={{ flex: '1 1 auto', justifyContent: 'center' }}
            >
              <FontAwesomeIcon icon={faAward} />
              Reclamar manualmente
              <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.78rem' }} />
            </Link>
            <Link to="/claim" className="puma-btn puma-btn--ghost" style={{ flex: '0 0 auto' }}>
              Mi colección
            </Link>
          </div>
        </>
      )}

      {/* ESTADO 4: idle (sin badges configurados o todavía buscando) */}
      {!yaReclamado && autoMint.state === 'idle' && !checking && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginTop: '1.25rem',
          }}
        >
          <Link
            to={`/claim/curso/${badgeRef}`}
            className="puma-btn puma-btn--gold"
            style={{ flex: '1 1 auto', justifyContent: 'center' }}
          >
            <FontAwesomeIcon icon={faAward} />
            Reclamar mi certificado NFT
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.78rem' }} />
          </Link>
          <Link to="/claim" className="puma-btn puma-btn--ghost" style={{ flex: '0 0 auto' }}>
            Mi colección
          </Link>
        </div>
      )}

      <p style={{ color: '#777', fontSize: '0.78rem', marginTop: '1rem', marginBottom: 0, lineHeight: 1.5 }}>
        Curso <code style={{ color: '#aaa' }}>{cursoId}</code>. La credencial es soulbound y no se
        puede transferir.
      </p>
    </div>
  )
}

export default CourseCertificateCTA

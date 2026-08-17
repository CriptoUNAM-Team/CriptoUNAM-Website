import React, { useCallback, useEffect, useState } from 'react'
import { hackathonApi, type JoinRequest } from '../../services/hackathon.service'
import { useWallet } from '../../context/WalletContext'
import { Card, GOLD, Chip, Avatar } from './ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

interface TeamNotificationsPanelProps {
  onStatusChange?: () => void
}

/**
 * Panel del líder: solicitudes de ingreso pendientes a sus equipos.
 * Los datos vienen del servidor (hackathon_join_requests); aceptar una
 * solicitud agrega al aspirante al equipo en la base de datos.
 */
const TeamNotificationsPanel: React.FC<TeamNotificationsPanelProps> = ({ onStatusChange }) => {
  const { isConnected } = useWallet()
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const load = useCallback(async () => {
    if (!isConnected) return
    try {
      const { requests } = await hackathonApi.listJoinRequests()
      setRequests(requests)
    } catch {
      /* sin sesión o sin equipos liderados: no hay nada que mostrar */
    }
  }, [isConnected])

  useEffect(() => {
    load()
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [load])

  const respond = async (request: JoinRequest, accept: boolean) => {
    const name = request.applicant?.full_name || 'el aspirante'
    const teamName = request.team?.name || 'tu equipo'
    setBusyId(request.id)
    setToast(null)
    try {
      await hackathonApi.respondJoinRequest(request.id, accept)
      setToast({
        kind: 'ok',
        text: accept
          ? `🎉 ${name} ahora es parte de "${teamName}".`
          : `Has rechazado la solicitud de ${name}.`,
      })
      await load()
      onStatusChange?.()
    } catch (err: any) {
      setToast({ kind: 'error', text: err.message || 'No se pudo responder la solicitud' })
    } finally {
      setBusyId(null)
      setTimeout(() => setToast(null), 6000)
    }
  }

  if (!isConnected || (requests.length === 0 && !toast)) return null

  return (
    <div style={{ marginBottom: 24 }}>
      {toast && (
        <div
          style={{
            background: toast.kind === 'ok' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${toast.kind === 'ok' ? '#10b981' : '#ef4444'}`,
            padding: '14px 20px',
            borderRadius: 12,
            color: toast.kind === 'ok' ? '#34d399' : '#f87171',
            fontWeight: 600,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <FontAwesomeIcon icon={toast.kind === 'ok' ? faCheck : faXmark} style={{ fontSize: '1.2rem' }} />
          <span>{toast.text}</span>
        </div>
      )}

      {requests.length > 0 && (
        <Card
          style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 10, 0.95), rgba(20, 20, 32, 0.98))',
            border: '2px solid rgba(212, 175, 55, 0.7)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: GOLD,
                fontSize: '1.3rem',
              }}
            >
              <FontAwesomeIcon icon={faBell} />
            </div>
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.15rem', fontFamily: 'Chakra Petch' }}>
                Solicitudes de Ingreso Pendientes ({requests.length})
              </h3>
              <span style={{ color: GOLD, fontSize: '0.82rem', fontWeight: 600 }}>
                Al aceptar, el hacker se une a tu equipo de inmediato.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {requests.map((r) => (
              <div
                key={r.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '16px',
                  borderRadius: 12,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div style={{ flex: '1 1 280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <Avatar src={r.applicant?.avatar_url} name={r.applicant?.full_name || 'Hacker'} size={34} />
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                      {r.applicant?.full_name || 'Hacker'}
                    </span>
                    <Chip tone="gold">Equipo: {r.team?.name}</Chip>
                    {r.role && <Chip tone="blue">Rol: {r.role}</Chip>}
                    {r.applicant?.experience && <Chip>{r.applicant.experience}</Chip>}
                  </div>
                  {(r.applicant?.skills?.length ?? 0) > 0 && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                      {r.applicant!.skills!.map((s) => (
                        <Chip key={s} tone="blue">{s}</Chip>
                      ))}
                    </div>
                  )}
                  {r.message && <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '4px 0 0' }}>{r.message}</p>}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => respond(r, true)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: busyId === r.id ? 'wait' : 'pointer',
                      opacity: busyId === r.id ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.88rem',
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Aceptar
                  </button>
                  <button
                    type="button"
                    disabled={busyId === r.id}
                    onClick={() => respond(r, false)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: busyId === r.id ? 'wait' : 'pointer',
                      opacity: busyId === r.id ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.88rem',
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

export default TeamNotificationsPanel

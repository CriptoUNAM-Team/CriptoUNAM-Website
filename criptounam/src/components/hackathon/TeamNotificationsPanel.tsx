import React, { useEffect, useState } from 'react'
import { hackathonApi, HackathonNotification } from '../../services/hackathon.service'
import { Card, GOLD, Chip } from './ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCheck, faXmark, faUserPlus } from '@fortawesome/free-solid-svg-icons'

interface TeamNotificationsPanelProps {
  onStatusChange?: () => void
}

const TeamNotificationsPanel: React.FC<TeamNotificationsPanelProps> = ({ onStatusChange }) => {
  const [notifications, setNotifications] = useState<HackathonNotification[]>([])
  const [toast, setToast] = useState<string | null>(null)

  const loadNotifications = async () => {
    try {
      const syncList = hackathonApi.getNotifications()
      setNotifications(syncList)
      const asyncList = await hackathonApi.getNotificationsAsync()
      setNotifications(asyncList)
    } catch {
      setNotifications([])
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = async (id: string, status: 'accepted' | 'rejected', applicantName: string, teamName: string) => {
    await hackathonApi.respondToNotification(id, status)
    loadNotifications()
    if (status === 'accepted') {
      setToast(`🎉 ¡Has aceptado a "${applicantName}" como nuevo integrante de "${teamName}"! Ahora tienen acceso a tu equipo.`)
    } else {
      setToast(`ℹ️ Has rechazado la solicitud de "${applicantName}".`)
    }
    setTimeout(() => setToast(null), 5000)
    if (onStatusChange) onStatusChange()
  }

  const pending = notifications.filter((n) => n.status === 'pending')
  const history = notifications.filter((n) => n.status !== 'pending').slice(0, 3)

  if (notifications.length === 0 && !toast) return null

  return (
    <div style={{ marginBottom: 24 }}>
      {toast && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            padding: '14px 20px',
            borderRadius: 12,
            color: '#34d399',
            fontWeight: 600,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
          }}
        >
          <FontAwesomeIcon icon={faCheck} style={{ fontSize: '1.2rem' }} />
          <span>{toast}</span>
        </div>
      )}

      {pending.length > 0 && (
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
              <h3 style={{ color: '#fff', margin: 0, fontSize: '1.15rem', fontFamily: 'Orbitron' }}>
                Solicitudes de Ingreso Pendientes ({pending.length})
              </h3>
              <span style={{ color: GOLD, fontSize: '0.82rem', fontWeight: 600 }}>
                Otros hackers han postulado a tu equipo. Revisa sus perfiles y roles solicitados:
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {pending.map((n) => (
              <div
                key={n.id}
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <FontAwesomeIcon icon={faUserPlus} style={{ color: GOLD }} />
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{n.applicant_name}</span>
                    <Chip tone="gold">Para equipo: {n.team_name}</Chip>
                    <Chip tone="blue">Rol: {n.role}</Chip>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '4px 0 0' }}>{n.message}</p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleAction(n.id, 'accepted', n.applicant_name, n.team_name)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '0.88rem',
                      transition: 'transform 0.15s',
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Aceptar Integrante
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(n.id, 'rejected', n.applicant_name, n.team_name)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: 'pointer',
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

      {history.length > 0 && pending.length === 0 && (
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: 12 }}>
          <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 8 }}>
            Actividad de Solicitudes Reciente:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map((h) => (
              <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                {h.status === 'accepted' ? (
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✅ Aceptado:</span>
                ) : (
                  <span style={{ color: '#ef4444', fontWeight: 700 }}>❌ Rechazado:</span>
                )}
                <span style={{ color: '#e2e8f0' }}>{h.applicant_name}</span>
                <span style={{ color: '#64748b' }}>en equipo {h.team_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamNotificationsPanel

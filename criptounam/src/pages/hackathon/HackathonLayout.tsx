import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GOLD, PAGE_WRAP } from '../../components/hackathon/ui'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCompass,
  faBook,
  faChalkboardTeacher,
  faChevronDown,
  faChevronUp,
  faCheck,
  faGaugeHigh,
  faUsers,
  faRocket,
  faCircleQuestion,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons'
import { useWallet } from '../../context/WalletContext'
import { useAdmin } from '../../hooks/useAdmin'

type Tab = {
  path: string
  label: string
  icon: typeof faCompass
  exact?: boolean
  /** 'always' = pública · 'auth' = requiere sesión · 'admin' = solo organizadores. */
  scope: 'always' | 'auth' | 'admin'
}

// El contenido informativo es público; la plataforma (dashboard, equipos,
// proyectos, dudas) pide sesión y el panel de organización pide allowlist.
const TABS: Tab[] = [
  { path: '/hackathon', label: 'Overview', icon: faCompass, exact: true, scope: 'always' },
  { path: '/hackathon/guia', label: 'Guía del Hacker', icon: faBook, scope: 'always' },
  { path: '/hackathon/talleres', label: 'Talleres', icon: faChalkboardTeacher, scope: 'always' },
  { path: '/hackathon/dashboard', label: 'Mi panel', icon: faGaugeHigh, scope: 'auth' },
  { path: '/hackathon/equipos', label: 'Equipos', icon: faUsers, scope: 'auth' },
  { path: '/hackathon/proyectos', label: 'Proyectos', icon: faRocket, scope: 'auth' },
  { path: '/hackathon/dudas', label: 'Dudas', icon: faCircleQuestion, scope: 'auth' },
  { path: '/hackathon/admin', label: 'Organización', icon: faUserShield, scope: 'admin' },
]

const HackathonLayout: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  const { isAdmin } = useAdmin()

  // La galería de proyectos es pública, así que se muestra aunque no haya
  // sesión; el resto de la plataforma sólo aparece cuando hay con qué entrar.
  const visibleTabs = TABS.filter((t) => {
    if (t.scope === 'always') return true
    if (t.scope === 'admin') return isAdmin
    if (t.path === '/hackathon/proyectos') return true
    return isConnected
  })
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cerrar el dropdown cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (tab: Tab) =>
    tab.exact ? pathname === tab.path : pathname.startsWith(tab.path)

  const currentTab = visibleTabs.find((t) => isActive(t)) || visibleTabs[0]

  return (
    <div
      style={{
        ...PAGE_WRAP,
        maxWidth: wide ? 1360 : 1200,
        margin: '0 auto',
        paddingTop: '0px',
        paddingLeft: isMobile ? '0.75rem' : '1.25rem',
        paddingRight: isMobile ? '0.75rem' : '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Menú Inteligente: Desplegable en Móvil y Tabs horizontales en Desktop */}
      {isMobile ? (
        <div ref={dropdownRef} style={{ position: 'relative', margin: '6px 0 10px', zIndex: 100 }}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(20, 20, 32, 0.96)',
              border: `1.5px solid ${dropdownOpen ? GOLD : 'rgba(212,175,55,0.35)'}`,
              borderRadius: 14,
              padding: '10px 14px',
              cursor: 'pointer',
              boxShadow: dropdownOpen ? '0 8px 25px rgba(212,175,55,0.25)' : '0 2px 10px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'rgba(212,175,55,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: GOLD,
                }}
              >
                <FontAwesomeIcon icon={currentTab.icon} style={{ fontSize: '0.95rem' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Sección actual
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{currentTab.label}</span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(212,175,55,0.15)',
                color: GOLD,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <span>Menú</span>
              <FontAwesomeIcon icon={dropdownOpen ? faChevronUp : faChevronDown} style={{ fontSize: '0.7rem' }} />
            </div>
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: '#12121e',
                border: '1.5px solid rgba(212,175,55,0.4)',
                borderRadius: 14,
                boxShadow: '0 16px 40px rgba(0,0,0,0.85)',
                overflow: 'hidden',
                padding: '6px',
                animation: 'fadeIn 0.15s ease-in-out',
              }}
            >
              {visibleTabs.map((tab) => {
                const active = isActive(tab)
                return (
                  <div
                    key={tab.path}
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate(tab.path)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: active ? 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.1))' : 'transparent',
                      color: active ? GOLD : '#e2e8f0',
                      fontWeight: active ? 700 : 500,
                      transition: 'all 0.15s ease',
                      borderLeft: active ? `3px solid ${GOLD}` : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FontAwesomeIcon icon={tab.icon} style={{ fontSize: '0.9rem', width: 18, textAlign: 'center', color: active ? GOLD : '#94a3b8' }} />
                      <span style={{ fontSize: '0.88rem' }}>{tab.label}</span>
                    </div>
                    {active && <FontAwesomeIcon icon={faCheck} style={{ color: GOLD, fontSize: '0.8rem' }} />}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <nav
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            marginTop: '0px',
            marginBottom: '0.75rem',
            borderBottom: '1px solid rgba(212,175,55,0.18)',
            paddingBottom: '8px',
            alignItems: 'center',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            nav::-webkit-scrollbar { display: none; }
          `}</style>
          {visibleTabs.map((tab) => {
            const active = isActive(tab)
            return (
              <Link
                key={tab.path}
                to={tab.path}
                style={{
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: '0.83rem',
                  fontWeight: active ? 700 : 600,
                  color: active ? '#000' : '#cbd5e1',
                  background: active
                    ? `linear-gradient(135deg, ${GOLD}, #aa8c2c)`
                    : 'rgba(255,255,255,0.05)',
                  border: active ? '1px solid #F4D03F' : `1px solid rgba(255,255,255,0.08)`,
                  boxShadow: active ? '0 2px 10px rgba(212,175,55,0.3)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
              >
                <FontAwesomeIcon icon={tab.icon} style={{ fontSize: '0.85rem', opacity: active ? 1 : 0.8 }} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
      {children}
    </div>
  )
}

export default HackathonLayout

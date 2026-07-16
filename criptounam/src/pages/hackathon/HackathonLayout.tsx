import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GOLD, PAGE_WRAP } from '../../components/hackathon/ui'
import { useAdmin } from '../../hooks/useAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCompass,
  faRocket,
  faUsers,
  faLaptopCode,
  faCircleQuestion,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'

const BASE_TABS = [
  { path: '/hackathon', label: 'Overview', icon: faCompass, exact: true },
  { path: '/hackathon/proyectos', label: 'Proyectos / BUIDLs', icon: faRocket },
  { path: '/hackathon/equipos', label: 'Hackers & Equipos', icon: faUsers },
  { path: '/hackathon/dashboard', label: 'Mi Panel', icon: faLaptopCode },
  { path: '/hackathon/dudas', label: 'Dudas & FAQ', icon: faCircleQuestion },
]

const HackathonLayout: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => {
  const { pathname } = useLocation()
  const { isAdmin } = useAdmin()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const TABS = isAdmin
    ? [...BASE_TABS, { path: '/hackathon/admin', label: 'Panel Admin', icon: faShieldHalved }]
    : BASE_TABS

  const isActive = (tab: (typeof TABS)[number]) =>
    tab.exact ? pathname === tab.path : pathname.startsWith(tab.path)

  return (
    <div
      style={{
        ...PAGE_WRAP,
        maxWidth: wide ? 1360 : 1200,
        margin: '0 auto',
        paddingTop: isMobile ? '4px' : '8px',
        paddingLeft: isMobile ? '0.75rem' : '1.25rem',
        paddingRight: isMobile ? '0.75rem' : '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Menú compacto, completamente responsivo e intuitivo */}
      <nav
        style={{
          display: 'flex',
          gap: isMobile ? '6px 8px' : '8px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          overflowX: isMobile ? 'visible' : 'auto',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          marginTop: isMobile ? '8px' : '12px',
          marginBottom: isMobile ? '1rem' : '1.25rem',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
          paddingBottom: isMobile ? '10px' : '12px',
          alignItems: 'center',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`
          nav::-webkit-scrollbar { display: none; }
        `}</style>
        {TABS.map((tab) => {
          const active = isActive(tab)
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: 'none',
                padding: isMobile ? '5px 11px' : '6px 14px',
                borderRadius: 999,
                fontSize: isMobile ? '0.75rem' : '0.83rem',
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
              <FontAwesomeIcon icon={tab.icon} style={{ fontSize: isMobile ? '0.78rem' : '0.85rem', opacity: active ? 1 : 0.8 }} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
      {children}
    </div>
  )
}

export default HackathonLayout

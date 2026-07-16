import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GOLD, PAGE_WRAP } from '../../components/hackathon/ui'
import { useAdmin } from '../../hooks/useAdmin'

const BASE_TABS = [
  { path: '/hackathon', label: 'Overview', exact: true },
  { path: '/hackathon/proyectos', label: 'BUIDLs / Proyectos' },
  { path: '/hackathon/equipos', label: 'Hackers & Equipos' },
  { path: '/hackathon/dashboard', label: 'Mi Panel / Submit' },
  { path: '/hackathon/dudas', label: 'Dudas & FAQ' },
]

const HackathonLayout: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => {
  const { pathname } = useLocation()
  const { isAdmin } = useAdmin()
  const TABS = isAdmin ? [...BASE_TABS, { path: '/hackathon/admin', label: 'Panel Admin' }] : BASE_TABS

  const isActive = (tab: (typeof TABS)[number]) =>
    tab.exact ? pathname === tab.path : pathname.startsWith(tab.path)

  return (
    <div style={{ ...PAGE_WRAP, maxWidth: wide ? 1360 : 1200, margin: '0 auto' }}>
      <nav
        className="puma-stagger"
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginBottom: '2.25rem',
          borderBottom: '1px solid rgba(212,175,55,0.22)',
          paddingBottom: 14,
          alignItems: 'center',
        }}
      >
        {TABS.map((tab) => {
          const active = isActive(tab)
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                textDecoration: 'none',
                padding: '0.6rem 1.2rem',
                borderRadius: 12,
                fontSize: '0.92rem',
                fontWeight: 700,
                color: active ? '#0a0a0a' : '#cbd5e1',
                background: active
                  ? `linear-gradient(135deg, ${GOLD}, #D4AF37)`
                  : 'rgba(255,255,255,0.04)',
                border: active ? '1px solid #F4D03F' : `1px solid rgba(255,255,255,0.08)`,
                boxShadow: active ? '0 4px 15px rgba(244,208,63,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>
      {children}
    </div>
  )
}

export default HackathonLayout

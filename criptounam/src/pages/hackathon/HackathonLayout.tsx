import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GOLD, PAGE_WRAP } from '../../components/hackathon/ui'
import { useAdmin } from '../../hooks/useAdmin'

const BASE_TABS = [
  { path: '/hackathon', label: 'Inicio', exact: true },
  { path: '/hackathon/dashboard', label: 'Mi panel' },
  { path: '/hackathon/equipos', label: 'Equipos' },
  { path: '/hackathon/proyectos', label: 'Proyectos' },
  { path: '/hackathon/dudas', label: 'Dudas' },
]

const HackathonLayout: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => {
  const { pathname } = useLocation()
  const { isAdmin } = useAdmin()
  const TABS = isAdmin ? [...BASE_TABS, { path: '/hackathon/admin', label: 'Admin' }] : BASE_TABS

  const isActive = (tab: (typeof TABS)[number]) =>
    tab.exact ? pathname === tab.path : pathname.startsWith(tab.path)

  return (
    <div style={{ ...PAGE_WRAP, maxWidth: wide ? 1280 : 1080 }}>
      <nav
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(212,175,55,0.15)',
          paddingBottom: 12,
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
                padding: '0.5rem 1rem',
                borderRadius: 999,
                fontSize: '0.9rem',
                fontWeight: 700,
                color: active ? '#0a0a0a' : GOLD,
                background: active ? `linear-gradient(135deg, ${GOLD}, #F4D03F)` : 'transparent',
                border: active ? 'none' : `1px solid rgba(212,175,55,0.3)`,
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

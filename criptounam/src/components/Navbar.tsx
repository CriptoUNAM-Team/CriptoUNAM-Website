import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useDisconnect, useEnsName, useEnsAvatar, useBalance } from 'wagmi'
import ConnectWalletModal from './ConnectWalletModal'
import '../styles/global.css'
import { useAdmin } from '../hooks/useAdmin'
import { API_ENDPOINTS } from '../config/api'
import { cursosApi, eventosApi, newsletterApi } from '../config/supabaseApi'
import {
  faBell,
  faHome,
  faGraduationCap,
  faTimes,
  faWallet,
  faCalendarAlt,
  faGift,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SocialProfile {
  picture?: string;
  name?: string;
  email?: string;
}

// Tipo para notificaciones
interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

const NETWORKS: Record<number, { name: string; logo: string }> = {
  1: { name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
  5: { name: 'Goerli', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
  11155111: { name: 'Sepolia', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
  137: { name: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026' },
  80001: { name: 'Polygon Mumbai', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026' },
  56: { name: 'Binance Smart Chain', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026' },
  97: { name: 'BSC Testnet', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026' },
  42161: { name: 'Arbitrum One', logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026' },
  10: { name: 'Optimism', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026' },
  43114: { name: 'Avalanche C-Chain', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=026' },
}

const getChainId = () => {
  if (window && (window as any).ethereum && (window as any).ethereum.networkVersion) {
    return parseInt((window as any).ethereum.networkVersion)
  }
  return undefined
}

const Navbar = () => {
  const location = useLocation()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { data: ensAvatar } = useEnsAvatar(ensName ? { name: ensName } : { name: undefined })
  const { data: balanceData } = useBalance({ address: address as `0x${string}` | undefined })
  const [connectModalOpen, setConnectModalOpen] = useState(false)
  const { isAdmin } = useAdmin()
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Estados para notificaciones
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [panelNotif, setPanelNotif] = useState(false)
  const noLeidas = notificaciones.filter(n => !n.leida).length
  const marcarLeida = (id: string) => setNotificaciones(nots => nots.map(n => n.id === id ? { ...n, leida: true } : n))

  // Estados para wallet panel
  const [walletPanelOpen, setWalletPanelOpen] = useState(false)




  useEffect(() => {
    const updateNetwork = () => {
      const chainId = getChainId()
      if (chainId && NETWORKS[chainId]) {
        setNetworkName(NETWORKS[chainId].name)
        setNetworkLogo(NETWORKS[chainId].logo)
      } else if (chainId) {
        setNetworkName(`Chain ID: ${chainId}`)
        setNetworkLogo('')
      } else {
        setNetworkName('Desconocida')
        setNetworkLogo('')
      }
    }
    updateNetwork()
    if (window && (window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', updateNetwork)
      return () => {
        (window as any).ethereum.removeListener('chainChanged', updateNetwork)
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Temporalmente deshabilitado para evitar errores de CORS
    // fetch(API_ENDPOINTS.NOTIFICACIONES)
    //   .then(res => res.json())
    //   .then(data => {
    //     setNotificaciones(data.map((n: any) => ({ ...n, leida: false })));
    //   })
    //   .catch(err => console.error('Error al cargar notificaciones:', err));

    // Cargar notificaciones reales
    cargarNotificacionesReales();
  }, []);

  const cargarNotificacionesReales = async () => {
    try {
      const notificaciones = [];

      // Notificación de bienvenida (solo si es la primera vez)
      const hasVisited = localStorage.getItem('criptounam_visited');
      if (!hasVisited) {
        notificaciones.push({
          id: 'welcome',
          titulo: 'Bienvenido a CriptoUNAM',
          mensaje: '¡Gracias por unirte a nuestra comunidad!',
          leida: false,
          fecha: new Date().toISOString()
        });
        localStorage.setItem('criptounam_visited', 'true');
      }

      // Verificar nuevos cursos
      try {
        const cursos = await cursosApi.getAll();
        const cursosRecientes = cursos.filter(curso => {
          const fechaCreacion = new Date(curso.created_at);
          const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return fechaCreacion > hace24Horas;
        });

        cursosRecientes.forEach(curso => {
          notificaciones.push({
            id: `curso-${curso.id}`,
            titulo: 'Nuevo curso disponible',
            mensaje: `${curso.titulo} - ${curso.descripcion.substring(0, 50)}...`,
            leida: false,
            fecha: curso.created_at
          });
        });
      } catch (error) {
        console.log('No se pudieron cargar cursos:', error);
      }

      // Verificar nuevos eventos
      try {
        const eventos = await eventosApi.getAll();
        const eventosRecientes = eventos.filter(evento => {
          const fechaCreacion = new Date(evento.created_at);
          const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return fechaCreacion > hace24Horas;
        });

        eventosRecientes.forEach(evento => {
          notificaciones.push({
            id: `evento-${evento.id}`,
            titulo: 'Nuevo evento',
            mensaje: `${evento.titulo} - ${evento.fecha}`,
            leida: false,
            fecha: evento.created_at
          });
        });
      } catch (error) {
        console.log('No se pudieron cargar eventos:', error);
      }

      // Verificar nuevas entradas de newsletter
      try {
        const newsletters = await newsletterApi.getAll();
        const newslettersRecientes = newsletters.filter(newsletter => {
          const fechaCreacion = new Date(newsletter.created_at);
          const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return fechaCreacion > hace24Horas;
        });

        newslettersRecientes.forEach(newsletter => {
          notificaciones.push({
            id: `newsletter-${newsletter.id}`,
            titulo: 'Nueva entrada en el blog',
            mensaje: `${newsletter.titulo}`,
            leida: false,
            fecha: newsletter.created_at
          });
        });
      } catch (error) {
        console.log('No se pudieron cargar newsletters:', error);
      }

      // Ordenar por fecha (más recientes primero)
      notificaciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

      setNotificaciones(notificaciones);
    } catch (error) {
      console.error('Error al cargar notificaciones reales:', error);
      // Fallback a notificación de bienvenida
      setNotificaciones([{
        id: 'welcome',
        titulo: 'Bienvenido a CriptoUNAM',
        mensaje: '¡Gracias por unirte a nuestra comunidad!',
        leida: false,
        fecha: new Date().toISOString()
      }]);
    }
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const handleLogin = () => {
    setConnectModalOpen(true)
  }

  // Datos de navegación (Juegos no se muestra)
  const navigationItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/cursos', icon: faGraduationCap, label: 'Cursos' },
    { path: '/recompensas', icon: faGift, label: 'Recompensas' },
    { path: '/eventos', icon: faCalendarAlt, label: 'Eventos' },
    { path: '/perfil', icon: faUser, label: 'Perfil' },
  ]
  const compactNav = navigationItems.length >= 5

  const isActiveRoute = (path: string) => {
    if (path === '/eventos') {
      return location.pathname === '/eventos' || location.pathname === '/comunidad'
    }
    if (path === '/recompensas') {
      return location.pathname === '/recompensas' || location.pathname.startsWith('/recompensas/') || location.pathname === '/juegos' || location.pathname.startsWith('/juegos/')
    }
    if (path === '/perfil') {
      return location.pathname === '/perfil' || location.pathname.startsWith('/perfil/')
    }
    return location.pathname === path
  }

  return (
    <>
      {/* Barra Superior - Logo, Notificaciones y Wallet */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'rgba(20,20,30,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            color: '#D4AF37',
            fontWeight: 700,
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontFamily: 'Orbitron',
            letterSpacing: '1px',
            textDecoration: 'none'
          }}
        >
          CriptoUNAM
        </Link>

        {/* Botones de la derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notificaciones */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPanelNotif(!panelNotif)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(212, 175, 55, 0.1)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'none'}
            >
              <FontAwesomeIcon
                icon={faBell}
                style={{
                  fontSize: '1.3rem',
                  color: '#D4AF37'
                }}
              />
              {noLeidas > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  background: '#ff4444',
                  borderRadius: '50%',
                  border: '2px solid #18181b'
                }} />
              )}
            </button>

            {/* Panel de notificaciones */}
            {panelNotif && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '8px',
                background: '#18181b',
                border: '1.5px solid #D4AF37',
                borderRadius: '12px',
                minWidth: '300px',
                maxWidth: '350px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                padding: '1.2rem',
                zIndex: 2000
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ color: '#D4AF37', margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                    Notificaciones
                  </h4>
                  <button
                    onClick={() => setPanelNotif(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D4AF37',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '4px'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                {notificaciones.length === 0 ? (
                  <div style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>
                    No hay notificaciones.
                  </div>
                ) : (
                  notificaciones.map(n => (
                    <div
                      key={n.id}
                      style={{
                        marginBottom: '12px',
                        background: n.leida ? '#23233a' : 'rgba(30, 58, 138, 0.15)',
                        borderRadius: '8px',
                        padding: '0.8rem',
                        border: n.leida ? 'none' : '1px solid rgba(212, 175, 55, 0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 700, color: '#D4AF37', fontSize: '1rem' }}>
                          {n.titulo}
                        </div>
                        {!n.leida && (
                          <button
                            onClick={() => marcarLeida(n.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#34d399',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Marcar leída
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>
                        {n.mensaje}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        {n.fecha}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Wallet y Botones de Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isConnected ? (
              <button
                onClick={() => setWalletPanelOpen(!walletPanelOpen)}
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#D4AF37',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative'
                }}
              >
                <FontAwesomeIcon icon={faWallet} />
                {!isMobile && (ensName || (address ? formatAddress(address) : ''))}
                {isAdmin && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    color: '#000',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    border: '1px solid #000'
                  }}>
                    ADMIN
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F4C842)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FontAwesomeIcon icon={faWallet} />
                {!isMobile && 'Conectar'}
              </button>
            )}

          </div>

          {/* Panel de wallet */}
          {walletPanelOpen && isConnected && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '8px',
              background: '#18181b',
              border: '1.5px solid #D4AF37',
              borderRadius: '12px',
              minWidth: '250px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              padding: '1.2rem',
              zIndex: 2000
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ color: '#D4AF37', margin: 0, fontWeight: 700 }}>Wallet</h4>
                <button
                  onClick={() => setWalletPanelOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#D4AF37',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '4px'
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div
                style={{
                  marginBottom: '16px',
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.25)',
                }}
              >
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: 2 }}>Wallet conectada</div>
                <div style={{ color: '#fff', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600 }}>
                  {ensName || (address ? formatAddress(address) : '')}
                </div>
                {balanceData && (
                  <div style={{ color: '#F4D03F', fontSize: '0.82rem', marginTop: 4 }}>
                    {Number(balanceData.formatted).toFixed(4)} {balanceData.symbol}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <Link
                  to="/perfil"
                  onClick={() => setWalletPanelOpen(false)}
                  style={{
                    background: '#2563EB',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  Ver Perfil
                </Link>
                <button
                  onClick={() => {
                    disconnect()
                    setWalletPanelOpen(false)
                  }}
                  style={{
                    background: 'none',
                    color: '#D4AF37',
                    border: '1px solid #D4AF37',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  Desconectar
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Menú Inferior - Navegación principal */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '75px',
          background: 'linear-gradient(to top, rgba(15, 15, 20, 0.98), rgba(25, 25, 35, 0.95))',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 1rem',
          boxShadow: '0 -4px 24px rgba(212, 175, 55, 0.15)'
        }}
      >
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: isMobile ? '6px 8px' : '8px 12px',
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: isActiveRoute(item.path)
                ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.05))'
                : 'transparent',
              border: isActiveRoute(item.path)
                ? '1px solid rgba(212, 175, 55, 0.5)'
                : '1px solid transparent',
              boxShadow: isActiveRoute(item.path)
                ? '0 4px 16px rgba(212, 175, 55, 0.25), inset 0 1px 4px rgba(255, 255, 255, 0.1)'
                : 'none',
              minWidth: isMobile ? '56px' : '64px',
              transform: isActiveRoute(item.path) ? 'translateY(-2px)' : 'none'
            }}
          >
            <FontAwesomeIcon
              icon={item.icon}
              style={{
                fontSize: isMobile ? '1.25rem' : '1.45rem',
                color: isActiveRoute(item.path) ? '#FFD700' : '#60A5FA',
                transition: 'all 0.3s ease',
                filter: isActiveRoute(item.path) ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))' : 'none'
              }}
            />
            <span
              style={{
                fontSize: compactNav ? (isMobile ? '0.65rem' : '0.7rem') : '0.75rem',
                color: isActiveRoute(item.path) ? '#FFD700' : '#60A5FA',
                fontWeight: isActiveRoute(item.path) ? 700 : 500,
                transition: 'all 0.3s ease',
                letterSpacing: '0.3px'
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Espaciado para el contenido */}
      <div style={{ paddingTop: '70px', paddingBottom: '75px' }} />

      <ConnectWalletModal open={connectModalOpen} onClose={() => setConnectModalOpen(false)} />
    </>
  )
}

export default Navbar 
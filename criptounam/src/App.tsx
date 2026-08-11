import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import RouteFallback from './components/RouteFallback'
import { registerServiceWorker, preloadCriticalResources } from './utils/optimization'
import { runDiagnostics } from './utils/diagnostics'

/**
 * Cada página se carga bajo demanda. Antes todas se importaban de golpe y el
 * chunk inicial pesaba 955 KB gzip: entrar a la portada descargaba también el
 * perfil, el panel de admin, los juegos y las nueve páginas del hackathon.
 */
const Home = lazy(() => import('./pages/Home'))
const Cursos = lazy(() => import('./pages/Cursos'))
const Comunidad = lazy(() => import('./pages/Comunidad'))
const Perfil = lazy(() => import('./pages/Perfil'))
const RegistroCurso = lazy(() => import('./pages/RegistroCurso'))
const Newsletter = lazy(() => import('./pages/Newsletter'))
const NewsletterEntry = lazy(() => import('./pages/NewsletterEntry'))
const Eventos = lazy(() => import('./pages/Eventos'))
const ProyectosDestacados = lazy(() => import('./pages/ProyectosDestacados'))
const YearInReview = lazy(() => import('./pages/YearInReview'))
const Recompensas = lazy(() => import('./pages/Recompensas'))
const AdminPuma = lazy(() => import('./pages/AdminPuma'))
const Juegos = lazy(() => import('./pages/Juegos'))
const HackathonLanding = lazy(() => import('./pages/hackathon/HackathonLanding'))
const HackathonGuia = lazy(() => import('./pages/hackathon/HackathonGuia'))
const HackathonTalleres = lazy(() => import('./pages/hackathon/HackathonTalleres'))
const HackathonDashboard = lazy(() => import('./pages/hackathon/HackathonDashboard'))
const HackathonTeams = lazy(() => import('./pages/hackathon/HackathonTeams'))
const HackathonProjects = lazy(() => import('./pages/hackathon/HackathonProjects'))
const HackathonProjectDetail = lazy(() => import('./pages/hackathon/HackathonProjectDetail'))
const HackathonQuestions = lazy(() => import('./pages/hackathon/HackathonQuestions'))
const HackathonAdmin = lazy(() => import('./pages/hackathon/HackathonAdmin'))
import { WalletProvider } from './context/WalletContext'
import './styles/global.css'
import './styles/puma-animations.css'
// Último: sus utilidades deben poder sobrescribir el CSS heredado.
import './styles/tailwind.css'

const AppContent = () => {
  const location = useLocation()
  const isYearInReview = location.pathname === '/year-in-review'
  /**
   * La landing del hackathon trae cabecera y pie propios (barra fija sobre el
   * vídeo de fondo); con los globales encima saldrían dos navegaciones y dos
   * pies. Las demás rutas de /hackathon sí usan los compartidos.
   */
  const esLandingHackathon = location.pathname === '/hackathon'
  const sinCromoGlobal = isYearInReview || esLandingHackathon

  return (
    <div className="app">
      <ScrollToTop />
      {!sinCromoGlobal && <Navbar />}
      <main>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/comunidad" element={<Comunidad />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/newsletter/:id" element={<NewsletterEntry />} />
          <Route path="/proyectos" element={<ProyectosDestacados />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/recompensas" element={<Recompensas />} />
          <Route path="/recompensas/misiones" element={<Navigate to="/recompensas" replace />} />
          <Route path="/misiones" element={<Navigate to="/recompensas" replace />} />
          <Route path="/embajadores" element={<Navigate to="/recompensas" replace />} />
          <Route path="/admin/puma" element={<AdminPuma />} />
          <Route path="/claim" element={<Navigate to="/recompensas" replace />} />
          <Route path="/claim/:kindSlug" element={<Navigate to="/recompensas" replace />} />
          <Route path="/claim/:kindSlug/:ref" element={<Navigate to="/recompensas" replace />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/registro-curso/:id" element={<RegistroCurso />} />
          <Route path="/juegos" element={<Juegos />} />
          {/* Plataforma propia: registro, equipos y entrega de BUIDLs viven aquí.
              El catch-all va al final para no tragarse las rutas de abajo. */}
          <Route path="/hackathon" element={<HackathonLanding />} />
          <Route path="/hackathon/guia" element={<HackathonGuia />} />
          <Route path="/hackathon/talleres" element={<HackathonTalleres />} />
          <Route path="/hackathon/dashboard" element={<HackathonDashboard />} />
          <Route path="/hackathon/equipos" element={<HackathonTeams />} />
          <Route path="/hackathon/proyectos" element={<HackathonProjects />} />
          <Route path="/hackathon/proyectos/:id" element={<HackathonProjectDetail />} />
          <Route path="/hackathon/projects/:id" element={<HackathonProjectDetail />} />
          <Route path="/hackathon/dudas" element={<HackathonQuestions />} />
          <Route path="/hackathon/admin" element={<HackathonAdmin />} />
          <Route path="/hackathon/*" element={<Navigate to="/hackathon" replace />} />
          <Route path="/arcade" element={<Navigate to="/juegos" replace />} />
          <Route path="/year-in-review" element={<YearInReview />} />
        </Routes>
        </Suspense>
      </main>
      {!sinCromoGlobal && <Footer />}
    </div>
  )
}

const App = () => {
  useEffect(() => {
    // Ejecutar diagnósticos en desarrollo
    if (import.meta.env.DEV) {
      // runDiagnostics().then(results => {
      //   console.log('📊 Resultados del diagnóstico:', results)
      // })
    }

    // Temporalmente deshabilitado para resolver problemas de carga
    // registerServiceWorker()

    // Precargar recursos críticos - temporalmente deshabilitado
    // preloadCriticalResources()

    // Prefetch de rutas importantes - temporalmente deshabilitado
    // const prefetchRoutes = ['/cursos', '/comunidad', '/newsletter', '/proyectos']
    // prefetchRoutes.forEach(route => {
    //   const link = document.createElement('link')
    //   link.rel = 'prefetch'
    //   link.href = route
    //   document.head.appendChild(link)
    // })
  }, [])

  return (
    <HelmetProvider>
      <WalletProvider>
        <Router>
          <AppContent />
        </Router>
      </WalletProvider>
    </HelmetProvider>
  )
}

export default App

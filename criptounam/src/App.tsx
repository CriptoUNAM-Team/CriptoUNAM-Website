import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { registerServiceWorker, preloadCriticalResources } from './utils/optimization'
import { runDiagnostics } from './utils/diagnostics'

import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Comunidad from './pages/Comunidad'
import Perfil from './pages/Perfil'
import RegistroCurso from './pages/RegistroCurso'
import Newsletter from './pages/Newsletter'
import NewsletterEntry from './pages/NewsletterEntry'
import Eventos from './pages/Eventos'
import ProyectosDestacados from './pages/ProyectosDestacados'
import YearInReview from './pages/YearInReview'
import Recompensas from './pages/Recompensas'
import AdminPuma from './pages/AdminPuma'
import Juegos from './pages/Juegos'
import { WalletProvider } from './context/WalletContext'
import './styles/global.css'
import './styles/puma-animations.css'

const AppContent = () => {
  const location = useLocation()
  const isYearInReview = location.pathname === '/year-in-review'

  return (
    <div className="app">
      <ScrollToTop />
      {!isYearInReview && <Navbar />}
      <main>
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
          <Route path="/arcade" element={<Navigate to="/juegos" replace />} />
          <Route path="/year-in-review" element={<YearInReview />} />
        </Routes>
      </main>
      {!isYearInReview && <Footer />}
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

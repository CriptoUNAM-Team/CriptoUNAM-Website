import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter, faWhatsapp, faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { handleRegistration } from '../api/telegram'
import { suscripcionesApi } from '../config/supabaseApi'
import SuccessPopup from './SuccessPopup'
import LogoCriptoUNAM from './goya/LogoCriptoUNAM'

const Footer = () => {
  // Estado para el modal de comunidad
  const [showJoinModal, setShowJoinModal] = useState(false)
  // Estado para el formulario de comunidad
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    edad: '',
    carrera: '',
    plantel: '',
    numeroCuenta: '',
    motivacion: '',
    telegram: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  // Newsletter
  const [email, setEmail] = useState('')
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false)
  const [showNewsletterError, setShowNewsletterError] = useState(false)
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false)
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)
  
  // Estados de loading y popup para comunidad
  const [isCommunityLoading, setIsCommunityLoading] = useState(false)
  const [showCommunityPopup, setShowCommunityPopup] = useState(false)

  // Handlers para el formulario de comunidad
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCommunityLoading) return;
    
    if (!formData.nombre || !formData.apellidos || !formData.edad || !formData.carrera || !formData.plantel || !formData.numeroCuenta || !formData.motivacion) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
      return;
    }
    
    setIsCommunityLoading(true);
    
    try {
      // Enviar notificación a Telegram
      await handleRegistration(formData)
      
      setShowJoinModal(false);
      setFormData({
        nombre: '', apellidos: '', edad: '', carrera: '', plantel: '', numeroCuenta: '', motivacion: '', telegram: '', twitter: '', instagram: '', linkedin: '', facebook: ''
      });
      setShowCommunityPopup(true);
    } catch (error) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    } finally {
      setIsCommunityLoading(false);
    }
  }
  // Newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isNewsletterLoading) return
    
    if (!email) {
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
      return
    }
    
    setIsNewsletterLoading(true)
    
    try {
      await suscripcionesApi.create(email, 'home')
      setEmail('')
      setShowNewsletterPopup(true)
    } catch (error) {
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
    } finally {
      setIsNewsletterLoading(false)
    }
  }

  const redes = [
    { href: 'https://discord.gg/wW4RZkyH', icon: faDiscord, label: 'Discord' },
    { href: 'https://t.me/+US3WLlw1uuU0ZjUx', icon: faTelegram, label: 'Telegram' },
    { href: 'https://x.com/Cripto_UNAM', icon: faTwitter, label: 'X' },
    { href: 'https://chat.whatsapp.com/ItF2XhThb8W5Cd7qvqxFyw?mode=gi_t', icon: faWhatsapp, label: 'WhatsApp' },
    { href: 'https://www.facebook.com/criptounam/?locale=es_LA', icon: faFacebookF, label: 'Facebook' },
    { href: 'https://www.instagram.com/cripto_unam/', icon: faInstagram, label: 'Instagram' },
  ]

  const enlaces = [
    { to: '/', label: 'Inicio' },
    { to: '/cursos', label: 'Cursos' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/hackathon', label: 'Hackathon' },
    { to: '/proyectos', label: 'Proyectos' },
    { to: '/newsletter', label: 'Newsletter' },
  ]

  return (
    <footer className="goya-scope relative w-full overflow-hidden border-t border-goya-amber/15 bg-[#050b15]/95 px-5 pb-28 pt-20 sm:px-8 md:px-12 md:pb-10">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Llamada a la acción */}
        <div className="goya-panel goya-panel-lit" style={{ ['--cut' as string]: '28px' }}>
          <div className="flex flex-col gap-10 p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div className="min-w-0">
              <p className="m-0 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-label text-goya-amber">
                <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-goya-amber" />
                Comunidad
              </p>
              <h2 className="m-0 mt-5 font-display text-4xl font-semibold uppercase leading-[0.98] tracking-tight text-goya-paper sm:text-5xl md:text-6xl">
                Construyamos
                <br />
                lo que sigue
              </h2>
              <p className="m-0 mt-5 max-w-md text-sm leading-relaxed text-slate-400 md:text-base">
                Cursos, eventos y hackathones abiertos para estudiantes de cualquier
                carrera. Entra al grupo o recibe el newsletter.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[420px]">
              <a
                href="https://t.me/+US3WLlw1uuU0ZjUx"
                target="_blank"
                rel="noopener noreferrer"
                className="goya-cut inline-flex items-center justify-center gap-3 bg-goya-amber px-7 py-4 font-mono text-xs font-bold uppercase tracking-label text-goya-void no-underline transition-colors duration-300 hover:bg-goya-paper"
                style={{ ['--cut' as string]: '10px' }}
              >
                <FontAwesomeIcon icon={faTelegram} />
                Únete a la comunidad
              </a>

              <form
                onSubmit={handleNewsletterSubmit}
                className="goya-cut flex items-center gap-2 border border-goya-amber/35 bg-[#060c16] p-1.5 pl-4"
                style={{ ['--cut' as string]: '10px' }}
              >
                <label htmlFor="footer-email" className="sr-only">Correo electrónico</label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="min-w-0 flex-1 border-0 bg-transparent font-mono text-sm text-goya-paper outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isNewsletterLoading}
                  className="goya-cut shrink-0 cursor-pointer border-0 bg-goya-paper/10 px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-label text-goya-paper transition-colors duration-300 hover:bg-goya-amber hover:text-goya-void disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ ['--cut' as string]: '7px' }}
                >
                  {isNewsletterLoading ? 'Enviando…' : 'Suscribirme'}
                </button>
              </form>

              {showNewsletterSuccess && (
                <p className="m-0 font-mono text-xs text-goya-amber">¡Gracias por suscribirte!</p>
              )}
              {showNewsletterError && (
                <p className="m-0 font-mono text-xs text-red-400">Hubo un error. Por favor, intenta de nuevo.</p>
              )}
            </div>
          </div>
        </div>

        {/* Marca, enlaces y redes */}
        <div className="mt-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <LogoCriptoUNAM className="h-14 w-auto" />
            <p className="m-0 mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              La comunidad blockchain de la UNAM. Educamos y conectamos a la
              próxima generación de desarrolladores Web3.
            </p>
          </div>

          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-label text-goya-amber">Explora</p>
            <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0">
              {enlaces.map((e) => (
                <li key={e.to}>
                  <Link
                    to={e.to}
                    className="text-sm text-slate-300 no-underline transition-colors duration-300 hover:text-goya-amber"
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-label text-goya-amber">Síguenos</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {redes.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.label}
                  title={r.label}
                  className="goya-cut flex h-11 w-11 items-center justify-center border border-slate-500/30 text-slate-300 no-underline transition-colors duration-300 hover:border-goya-amber hover:bg-goya-amber hover:text-goya-void"
                  style={{ ['--cut' as string]: '7px' }}
                >
                  <FontAwesomeIcon icon={r.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* El nombre, a todo lo ancho, como remate */}
        <p
          aria-hidden="true"
          className="m-0 mt-20 select-none whitespace-nowrap text-center font-display text-[clamp(2.4rem,13.5vw,15rem)] font-semibold uppercase leading-[0.8] tracking-tight text-transparent"
          style={{ WebkitTextStroke: '1.5px rgba(233,175,60,0.5)', backgroundImage: 'linear-gradient(180deg, rgba(233,175,60,0.10), rgba(233,175,60,0))', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
        >
          CriptoUNAM
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-goya-amber/10 pt-6 font-mono text-[10px] uppercase tracking-label text-slate-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} CriptoUNAM</span>
          <span>Hecho en Ciudad Universitaria</span>
        </div>
      </div>

      {/* Modal de comunidad */}
      {showJoinModal && (
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.7)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={()=>setShowJoinModal(false)}>
          <div className="card" style={{maxWidth: 600, width:'100%', margin: '0 auto', padding: '2rem', position:'relative', maxHeight:'90vh', overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowJoinModal(false)} style={{position:'absolute', top:12, right:12, background:'none', border:'none', fontSize:24, color:'#E9AF3C', cursor:'pointer'}}>×</button>
            <h2 className="text-center" style={{marginBottom: '2rem'}}>Únete a la Comunidad</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Nombre*</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
              <div className="form-group"><label>Apellidos*</label><input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required /></div>
              <div className="form-group"><label>Edad*</label><input type="number" name="edad" value={formData.edad} onChange={handleChange} required min="15" max="99" /></div>
              <div className="form-group"><label>Carrera*</label><input type="text" name="carrera" value={formData.carrera} onChange={handleChange} required /></div>
              <div className="form-group"><label>Plantel*</label><input type="text" name="plantel" value={formData.plantel} onChange={handleChange} required /></div>
              <div className="form-group"><label>Número de Cuenta*</label><input type="text" name="numeroCuenta" value={formData.numeroCuenta} onChange={handleChange} required pattern="\d{9}" title="El número de cuenta debe tener 9 dígitos" /></div>
              <div className="form-group"><label>¿Por qué quieres formar parte de CriptoUNAM?*</label><textarea name="motivacion" value={formData.motivacion} onChange={handleChange} required rows={3} /></div>
              <div className="form-group"><label>Usuario de Telegram*</label><input type="text" name="telegram" value={formData.telegram} onChange={handleChange} required placeholder="@usuario" /></div>
              <div className="form-group"><label>Redes Sociales</label>
                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                  <input type="text" name="instagram" placeholder="Instagram" value={formData.instagram} onChange={handleChange} />
                  <input type="text" name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} />
                  <input type="text" name="facebook" placeholder="Facebook" value={formData.facebook} onChange={handleChange} />
                  <input type="text" name="twitter" placeholder="Twitter" value={formData.twitter} onChange={handleChange} />
                </div>
              </div>
              <button 
                type="submit" 
                className="primary-button" 
                disabled={isCommunityLoading}
                style={{
                  width:'100%', 
                  marginTop:12,
                  opacity: isCommunityLoading ? 0.7 : 1,
                  cursor: isCommunityLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isCommunityLoading ? 'Enviando...' : 'Enviar Registro'}
              </button>
            </form>
            {showSuccessMessage && <p style={{color:'#34d399', marginTop:8}}>¡Registro exitoso! Te contactaremos pronto.</p>}
            {showErrorMessage && <p style={{color:'#ff4444', marginTop:8}}>Hubo un error. Por favor, intenta de nuevo.</p>}
          </div>
        </div>
      )}
      
      {/* Popups de éxito */}
      <SuccessPopup
        isOpen={showNewsletterPopup}
        onClose={() => setShowNewsletterPopup(false)}
        title="¡Revisa tu correo!"
        message="Te enviamos un enlace para confirmar tu suscripción al newsletter de CriptoUNAM. Si no lo ves, busca en spam."
        type="newsletter"
      />

      <SuccessPopup
        isOpen={showCommunityPopup}
        onClose={() => setShowCommunityPopup(false)}
        title="¡Registro Exitoso!"
        message="Te has registrado correctamente en la comunidad de CriptoUNAM. Te contactaremos pronto con más información."
        type="community"
      />
    </footer>
  )
}

export default Footer 
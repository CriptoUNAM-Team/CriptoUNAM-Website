/**
 * Talleres públicos de Goya Hack (mié–jue) con arte para la landing.
 * Las piezas pendientes usan `imagen: undefined` y van a la sección especial.
 */

export interface TallerPublico {
  id: string
  dia: 'mie' | 'jue'
  fechaLabel: string
  hora: string
  titulo: string
  subtitulo: string
  sede: string
  /** Ruta bajo /public. Si falta, la UI muestra placeholder. */
  imagen?: string
  /** Mismo horario que otro taller (p. ej. APEX + Office Hours). */
  paralelo?: boolean
  /** Destacar en la fila especial (arte pendiente o sesión clave). */
  especial?: boolean
}

export const TALLERES_PUBLICOS: TallerPublico[] = [
  {
    id: 'stellar',
    dia: 'mie',
    fechaLabel: 'Miércoles 23',
    hora: '11:00',
    titulo: 'Stellar',
    subtitulo: 'Contratos inteligentes, wallets y despliegue en Testnet',
    sede: 'Edificio M · PC PUMA',
    imagen: '/images/hackathon/talleres/stellar-contratos-wallets-testnet.png',
  },
  {
    id: 'pollar',
    dia: 'mie',
    fechaLabel: 'Miércoles 23',
    hora: '13:00',
    titulo: 'POLLAR',
    subtitulo: 'Smart Wallets',
    sede: 'Edificio M · PC PUMA',
    imagen: '/images/hackathon/talleres/pollar-smart-wallets.png',
  },
  {
    id: 'modelo-negocio',
    dia: 'mie',
    fechaLabel: 'Miércoles 23',
    hora: '14:00',
    titulo: 'Modelo de negocio',
    subtitulo: 'De demo a producto: valor, usuarios y pitch',
    sede: 'Edificio M · PC PUMA',
    imagen: '/images/hackathon/talleres/modelo-de-negocio.png',
  },
  {
    id: 'avalanche-l1',
    dia: 'mie',
    fechaLabel: 'Miércoles 23',
    hora: '15:00',
    titulo: 'Despliega tu L1 en Avalanche',
    subtitulo: 'GOYA HACK Taller Team 1',
    sede: 'Div. Ingeniería Mecánica e Industrial',
    especial: true,
  },
  {
    id: 'apex-am',
    dia: 'jue',
    fechaLabel: 'Jueves 24',
    hora: '11:00',
    titulo: 'SUBE TU PROYECTO · APEX',
    subtitulo: 'Checklist de entrega en el panel del hacker',
    sede: 'Edificio M · PC PUMA',
    imagen: '/images/hackathon/talleres/apex-sube-tu-proyecto.png',
    paralelo: true,
  },
  {
    id: 'avax-office',
    dia: 'jue',
    fechaLabel: 'Jueves 24',
    hora: '11:00',
    titulo: 'Office Hours Avalanche',
    subtitulo: 'Dudas técnicas del reto · en paralelo con APEX',
    sede: 'Edificio M · PC PUMA',
    paralelo: true,
    especial: true,
  },
  {
    id: 'grantfox',
    dia: 'jue',
    fechaLabel: 'Jueves 24',
    hora: '12:00',
    titulo: 'GrantFox × CriptoUNAM',
    subtitulo: 'De Cero a Contributor',
    sede: 'Edificio M · PC PUMA',
    especial: true,
  },
  {
    id: 'apex-pm',
    dia: 'jue',
    fechaLabel: 'Jueves 24',
    hora: '15:00',
    titulo: 'SUBE TU PROYECTO · APEX',
    subtitulo: 'Segunda sesión antes del deadline',
    sede: 'Edificio M · PC PUMA',
    imagen: '/images/hackathon/talleres/apex-sube-tu-proyecto.png',
  },
]

export const TALLERES_ESPECIALES = TALLERES_PUBLICOS.filter((t) => t.especial)

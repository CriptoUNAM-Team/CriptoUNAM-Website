/**
 * Miembros del equipo CriptoUNAM.
 * Editar aquí para cambiar roles, descripciones, agregar o quitar miembros.
 * Fotos en: public/images/Equipo/
 * Ver docs/PLAN_MEJORA_ACTUALIZACION.md
 */
export interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  linkedin?: string
  twitter?: string
  github?: string
}

export const teamMembers: TeamMember[] = [
  // Founders (Core Team)
  {
    name: 'Gerardo Vela',
    role: 'Core Team · Founder & CEO',
    description: 'Fundador y líder de CriptoUNAM. Experto en blockchain y criptomonedas.',
    image: '/images/Equipo/GerardoVela.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Fernanda Tello',
    role: 'Core Team · Founder & COO',
    description: 'Co-fundadora y directora de operaciones. Especialista en estrategia y desarrollo.',
    image: '/images/Equipo/FernandaTello.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Adrian Armenta',
    role: 'Core Team · Founder & CTO',
    description: 'Co-fundador y director técnico. Desarrollador blockchain y experto en DeFi.',
    image: '/images/Equipo/AArmenta.png',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Daniel Cruz',
    role: 'Core Team · Founder & CMO',
    description: 'Co-fundador y director de marketing. Experto en crecimiento de comunidades blockchain.',
    image: '/images/Equipo/Kubs.png',
    linkedin: '#',
    twitter: '#'
  },
  // Core Team
  {
    name: 'Andrés Rodríguez',
    role: 'Core Team · Investigación',
    description: 'Especialista en investigación blockchain.',
    image: '/images/Equipo/AndresRodriguez.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Adrián Martínez',
    role: 'Core Team · Protocolos',
    description: 'Experto en protocolos de consenso.',
    image: '/images/Equipo/AdrianMartinez.png',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Ian Hernández',
    role: 'Core Team · Smart Contracts',
    description: 'Especialista en smart contracts.',
    image: '/images/Equipo/IanHernandes.jpg',
    linkedin: '#',
    twitter: '#'
  },
  // Embajadores
  {
    name: 'Jorge Saldaña',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Experto en desarrollo blockchain y Web3.',
    image: '/images/Equipo/puma_avatar_1.png',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Nayeli Chavez',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_2.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Vai0X',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_3.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Miriam',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_4.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Edgadafi',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_1.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Don Eth',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_2.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Jazmin',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_3.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Diego C',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_4.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Manuel Flores',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad.',
    image: '/images/Equipo/puma_avatar_1.png',
    linkedin: '#',
    twitter: '#'
  }
]

/**
 * CriptoUNAM Campus — el workspace virtual de la comunidad.
 *
 * Fuente: el README de github.com/IanHerez/CriptoUNAM-WorkSpace (v0.1, piloto).
 * Las capturas son las de `docs/espacios`, reducidas a JPG en
 * public/images/campus/. Todavía no hay URL pública: cuando la haya, se pone
 * en `CAMPUS.url` y la sección muestra el botón de entrar.
 */

export interface SalaCampus {
  id: string
  nombre: string
  /** Etiqueta corta del panel: qué pasa ahí. */
  etiqueta: string
  texto: string
  imagen: string
}

const IMG = '/images/campus'

export const CAMPUS = {
  nombre: 'CriptoUNAM Campus',
  estado: 'Próximamente · piloto v0.1',
  url: undefined as string | undefined,
  resumen:
    'Un campus 2D en pixel art donde la comunidad se encuentra: caminas con tu avatar, hablas con quien tienes cerca, entras a clases y eventos, cumples misiones y ganas $PUMA.',
  rasgos: [
    'Audio y video por cercanía',
    'Eventos con escenario y preguntas',
    'Misiones con XP e insignias',
    'Recompensas en $PUMA',
    'Entra con tu correo o tu wallet',
  ],
}

export const SALAS_CAMPUS: SalaCampus[] = [
  {
    id: 'plano',
    nombre: 'El campus',
    etiqueta: '72 × 60 baldosas',
    texto:
      'Nueve zonas alrededor de una plaza: auditorio, lounge, laboratorio, misiones, comunidad, jardín, bosque y lago, unidas por paseos de piedra.',
    imagen: `${IMG}/00-campus.jpg`,
  },
  {
    id: 'plaza',
    nombre: 'Plaza central',
    etiqueta: 'Punto de entrada',
    texto:
      'Aquí apareces al entrar, junto al emblema de CriptoUNAM en el mosaico. El audio es abierto: se oye más fuerte quien está más cerca.',
    imagen: `${IMG}/01-plaza.jpg`,
  },
  {
    id: 'auditorio',
    nombre: 'Auditorio',
    etiqueta: 'Charlas y talleres',
    texto:
      'Audio de escenario: quien presenta se oye en toda la sala y el público pide la palabra. Pantalla para la clase, cola de preguntas con votos y asistencia.',
    imagen: `${IMG}/02-auditorio.jpg`,
  },
  {
    id: 'laboratorio',
    nombre: 'Laboratorio Web3',
    etiqueta: 'Trabajo en equipo',
    texto:
      'Cada mesa es un área privada para hasta ocho personas, con pizarras compartidas y pantalla para mostrar código.',
    imagen: `${IMG}/04-laboratorio.jpg`,
  },
  {
    id: 'misiones',
    nombre: 'Zona de misiones',
    etiqueta: 'Retos y ranking',
    texto:
      'Misiones diarias, semanales, de evento y de código. Sumas XP, subes de nivel, ganas insignias y entras al ranking.',
    imagen: `${IMG}/05-misiones.jpg`,
  },
  {
    id: 'comunidad',
    nombre: 'Espacio de comunidad',
    etiqueta: 'Embajadores y clubes',
    texto:
      'Donde se reúnen embajadores, clubes y equipos de hackathon, con una sala de reunión privada para diez.',
    imagen: `${IMG}/06-comunidad.jpg`,
  },
  {
    id: 'lago',
    nombre: 'Lago',
    etiqueta: 'Zona de silencio',
    texto:
      'Al suroeste: la orilla silenciosa no abre audio. Para leer, pensar o simplemente estar con la comunidad sin hablar.',
    imagen: `${IMG}/09-lago.jpg`,
  },
]

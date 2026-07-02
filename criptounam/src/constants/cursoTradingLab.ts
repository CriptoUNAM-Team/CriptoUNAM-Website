import type { Curso } from './cursosData'
import { IMAGES } from './images'

/**
 * Sesiones en vivo · Trading Lab con Bitunix
 * Grabaciones de las sesiones en vivo de trading realizadas junto a Bitunix.
 * Cada sesión es un video grabado (mp4 local en /public/images/cursos).
 */

/* ============================================================
   CURSO · Trading Lab con Bitunix (Sesiones en vivo)
   ============================================================ */
export const cursoTradingLab: Curso = {
  id: 'trading-lab-bitunix',
  titulo: 'Trading Lab con Bitunix (Sesiones en vivo)',
  nivel: 'Intermedio',
  duracion: 'Sesiones en vivo',
  imagen: IMAGES.CURSOS.TRADING_LAB,
  descripcion:
    'Grabaciones de las sesiones en vivo del Trading Lab de CriptoUNAM junto a Bitunix. Análisis de mercado, gestión de riesgo y práctica de trading en tiempo real.',
  precio: 0,
  cohorteRef: 'v1',
  estudiantes: 0,
  rating: 5,
  categorias: ['Sesiones en vivo', 'Trading', 'Finanzas'],
  requisitos:
    'Conocimientos básicos de trading y mercados cripto recomendados. Ideal para acompañar con una cuenta de práctica.',
  lecciones: [
    {
      id: 1,
      titulo: 'Trading Lab con Bitunix · Sesión 1 de julio',
      descripcion:
        'Grabación de la sesión en vivo del Trading Lab con Bitunix: análisis de mercado y práctica de trading.',
      video: 'https://youtu.be/z779R1Q7FnU',
    },
  ],
}

export const cursosSesionesVivo: Curso[] = [cursoTradingLab]

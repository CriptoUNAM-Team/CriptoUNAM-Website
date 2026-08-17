/**
 * Mapas de bits del lenguaje visual de CriptoUNAM.
 *
 * Ninguno está dibujado a ojo: todos se extrajeron de los carteles oficiales
 * detectando las celdas encendidas, así que la web usa exactamente el mismo
 * arte que el material impreso.
 *
 * Convención de cada fila:
 *   '.' celda apagada
 *   '#' celda del color principal (hereda `currentColor`)
 *   'A' celda de acento ámbar
 */

export type Bitmap = readonly string[]

/**
 * La "G" de Goya Hack, del cartel del hackathon (12 × 17).
 *
 * Las dos últimas filas se simetrizaron respecto a las dos primeras: en el PNG
 * las tocaba un elemento vecino y salían con un cuadro de más.
 */
export const BITMAP_G: Bitmap = [
  '001111111100',
  '011111111110',
  '111000000111',
  '110000000011',
  '110000000011',
  '110000000000',
  '110000000000',
  '110000111111',
  '110000111111',
  '110000000011',
  '110000000011',
  '110000000011',
  '110000000011',
  '110000000011',
  '111000000111',
  '011111111110',
  '001111111100',
].map((fila) => fila.replace(/1/g, '#').replace(/0/g, '.'))

/**
 * Figura caminando, del cartel de Community Partner (6 × 14).
 *
 * Es la pose con el acento ámbar: torso y brazo extendido.
 */
export const BITMAP_PERSONA_A: Bitmap = [
  '...##.',
  '...##.',
  '...#..',
  '..###.',
  '..#A#.',
  '..#A#.',
  '..#AAA',
  '..###.',
  '...##.',
  '...##.',
  '..##..',
  '##.#..',
  '#..#..',
  '...##.',
]

/**
 * La otra pose del mismo cartel (8 × 14): brazos abiertos y zancada larga.
 *
 * En el original va entera en blanco — el ámbar se reparte solo por algunas
 * figuras de la retícula, no por todas.
 */
export const BITMAP_PERSONA_B: Bitmap = [
  '...##...',
  '...##...',
  '...#....',
  '..###...',
  '.#####.#',
  '#.###.#.',
  '.####...',
  '..###...',
  '..#.#...',
  '..#.#...',
  '.#...#..',
  '.#...#..',
  '#.....##',
  '##....#.',
]

/** Las dos poses, en orden de ciclo. */
export const POSES_PERSONA: Bitmap[] = [BITMAP_PERSONA_A, BITMAP_PERSONA_B]

/**
 * Utilidades para construir HTML a mano sin abrir un XSS.
 *
 * `BlogContent` y `CodeBlock` arman markup con expresiones regulares y lo
 * inyectan con `dangerouslySetInnerHTML`. Hoy el contenido es estático del
 * repositorio, pero en cuanto venga de la base de datos —o de un formulario—
 * cualquier `<script>` se ejecutaría. Escapar primero también arregla un
 * defecto visible: los ejemplos de código con etiquetas (`<div>`) se
 * renderizaban como elementos en vez de mostrarse como texto.
 */

const ENTIDADES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Convierte texto plano en HTML seguro. Aplicar SIEMPRE antes de formatear. */
export function escapeHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ENTIDADES[c])
}

/**
 * Devuelve el href solo si el esquema es navegable. Bloquea `javascript:` y
 * `data:`, que convierten un enlace de markdown en ejecución de código.
 */
export function safeHref(href: string): string {
  const limpio = href.trim()
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(limpio)) return limpio
  return '#'
}

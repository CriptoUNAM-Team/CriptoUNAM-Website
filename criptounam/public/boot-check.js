/**
 * Pantalla de rescate si React no llega a montar.
 *
 * Vivía como `<script>` en línea dentro de `index.html`, con un `onclick=` en el
 * botón. Las dos cosas obligan a abrir `script-src 'unsafe-inline'` en la CSP,
 * que es justo lo que anula la protección contra XSS: da igual escapar el HTML
 * si el navegador acepta ejecutar cualquier `<script>` inyectado. Como archivo
 * propio, `script-src 'self'` basta.
 */
;(function () {
  var TIEMPO_ESPERA_MS = 10000

  function raiz() {
    return document.getElementById('root')
  }

  /** True cuando el árbol de React ya pintó algo real dentro de #root. */
  function reactMonto(root) {
    return !!(
      root &&
      (root.querySelector('[data-reactroot]') ||
        root.querySelector('.app') ||
        root.querySelector('nav') ||
        root.children.length > 1)
    )
  }

  function mostrarError(root) {
    root.innerHTML = ''

    var caja = document.createElement('div')
    caja.style.cssText =
      'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
      'text-align:center;color:#D4AF37;font-family:Arial,sans-serif;z-index:9999'

    var titulo = document.createElement('h1')
    titulo.textContent = 'CriptoUNAM'
    titulo.style.cssText = 'font-size:2rem;margin-bottom:1rem'

    var texto = document.createElement('p')
    texto.textContent = 'Error de carga'
    texto.style.cssText = 'font-size:1.2rem;margin-bottom:1rem'

    var boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = 'Recargar'
    boton.style.cssText =
      'background:linear-gradient(45deg,#D4AF37,#2563EB);color:#fff;border:none;' +
      'padding:10px 20px;border-radius:5px;cursor:pointer'
    boton.addEventListener('click', function () {
      window.location.reload()
    })

    caja.appendChild(titulo)
    caja.appendChild(texto)
    caja.appendChild(boton)
    root.appendChild(caja)
  }

  var root = raiz()
  if (root) {
    var observador = new MutationObserver(function () {
      if (reactMonto(raiz())) observador.disconnect()
    })
    observador.observe(root, { childList: true, subtree: true })
  }

  window.setTimeout(function () {
    var actual = raiz()
    if (actual && !reactMonto(actual)) mostrarError(actual)
  }, TIEMPO_ESPERA_MS)
})()

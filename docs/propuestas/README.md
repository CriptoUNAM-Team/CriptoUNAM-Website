# Propuestas formales · CriptoUNAM

Plantilla visual para propuestas a partners (Binance Tour, sponsors, universidades).

## Archivos

| Archivo | Uso |
|---------|-----|
| `plantilla-propuesta-criptounam.html` | Plantilla vacía (sustituye `[[...]]`) |
| `2026-10-binance-tour-hermosillo.html` | Propuesta llena: Binance University Tour · Hermosillo (3 páginas carta) |
| `CriptoUNAM-Binance-Tour-Hermosillo-CU-2026-10-BT-HMO.pdf` | PDF listo para enviar (mismo contenido) |

## Cómo exportar PDF

**Opción rápida:** abre el HTML y usa **Descargar PDF** (enlace al `.pdf` generado).

**Regenerar el PDF** (tras editar el HTML):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="docs/propuestas/CriptoUNAM-Binance-Tour-Hermosillo-CU-2026-10-BT-HMO.pdf" \
  "file://$(pwd)/docs/propuestas/2026-10-binance-tour-hermosillo.html"
```

O abre el `.html` → **Imprimir** → Guardar como PDF (fondos activados).

## Identidad

- Fondo `#010004` · acento `#E9AF3C`
- Display: Chakra Petch · mono: JetBrains Mono · cuerpo: Inter
- Logo: `criptounam/public/images/logo-criptounam-marca.png`

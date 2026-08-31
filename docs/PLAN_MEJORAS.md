# Plan de implementación / acción – Mejoras CriptoUNAM

## 1. Landing (Home) ✅
- [x] Eliminar sección de **acciones de criptomonedas** (componente `CryptoActions`).
- [x] Eliminar sección **"Únete a la revolución Blockchain"** (componente `InteractiveCTA`).
- [x] En el footer, el botón **"Únete a la comunidad"** debe navegar al grupo de Telegram: https://t.me/+US3WLlw1uuU0ZjUx.
- [x] Conectar el formulario de **suscripción (newsletter)** del footer a la base de datos de Supabase (tabla `suscripciones_newsletter` vía `suscripcionesApi.create`).

## 2. Footer y página Comunidad ✅
- [x] Donde aparezca Twitter/X, usar usuario **@Cripto_UNAM** y enlace a su perfil.
- [x] En **Comunidad**: corregir enlace de X a @Cripto_UNAM y usar el enlace real de Discord: https://discord.gg/wW4RZkyH.
- [x] En el Footer: actualizar enlaces de Discord y Telegram a los oficiales (Discord: https://discord.gg/wW4RZkyH, Telegram: https://t.me/+US3WLlw1uuU0ZjUx).

## 3. Página Eventos ✅
- [x] En pantallas grandes, mostrar las **tarjetas de eventos presenciales (Luma)** en **dos columnas** (grid 2 columnas con media query).

## 4. Newsletter ✅
- [x] Agregar **3 nuevas notas** que cubran:
  - AI, OpenClau, ClauCode y herramientas de AI en 2026.
  - Guía para Solidity.
  - Guía de Stellar y novedades de febrero 2026.

## 5. Juegos ✅
- [x] La página de Juegos **no se muestra nunca**: eliminada del menú de navegación y la ruta `/juegos` redirige al Home. La ruta y el componente existen pero no son accesibles desde la UI.

## 6. Cursos (plan detallado – pendiente de implementación)
- [ ] Añadir **guías** (texto/recursos por módulo o lección) para poder usar los cursos sin videos.
- [ ] Añadir **cuestionarios** por módulo o al final del curso.
- [ ] Los videos se grabarán después e irán reemplazando/complementando el contenido actual.
- *Archivos clave:* `src/constants/cursosData.ts`, `src/pages/Cursos.tsx`, `src/pages/RegistroCurso.tsx` y posiblemente tablas en Supabase para lecciones/guías/cuestionarios.

---

*Última actualización: según solicitud del usuario. Tareas 1–5 implementadas; tarea 6 queda como plan para desarrollo posterior.*

# API del sitio — cómo se despliega y en qué orden

Todo lo que escribe en la base de datos (registro de Goya Hack, equipos,
proyectos, dudas, progreso de cursos, likes y los listados de administración)
depende de las Vercel Functions de `criptounam/api/`. Sin esas funciones el
sitio se ve entero pero nadie puede guardar nada.

## El problema que hubo

Todas las rutas `/api/*` devolvían **404 en producción** — las del hackathon y
también `/api/courses/*`.

La causa: el **Root Directory** del proyecto de Vercel apuntaba a la raíz del
repositorio. Vercel solo publica como funciones la carpeta `api/` que cuelga del
Root Directory, y en la raíz no hay ninguna: las funciones viven en
`criptounam/api/`. El `vercel.json` de la raíz construía el sitio con
`cd criptounam && npm run build`, así que la web salía bien y el backend no
existía.

Cómo se comprobó sin entrar al panel: `/images/*` traía la cabecera
`Cache-Control: immutable` (regla presente en los dos `vercel.json`) pero
`/assets/*.js` no (regla que solo está en `criptounam/vercel.json`). Es decir,
mandaba el archivo de la raíz.

## El arreglo (paso 1)

En Vercel → proyecto `cripto-unam-website` → **Settings → Build and Deployment
→ Root Directory** → escribir `criptounam` → **Save** → **Redeploy** de la
última producción (Deployments → ⋯ → Redeploy).

A partir de ahí manda `criptounam/vercel.json`, que ya trae `buildCommand`,
`outputDirectory` e `installCommand` explícitos, y `criptounam/api/**` se publica
como funciones.

El `vercel.json` de la raíz queda inerte; se conserva por si hiciera falta
volver atrás, pero conviene borrarlo en cuanto el despliegue nuevo funcione:
tener dos configuraciones es justo lo que causó este lío.

> Si se prefiere la línea de comandos, el mismo cambio se hace con
> `vercel link` y luego **Settings → Root Directory** en el panel: la CLI no
> expone el campo `rootDirectory`, así que el panel es la vía corta.

## Variables de entorno (paso 2)

Van en el proyecto de Vercel (Production **y** Preview), **sin** prefijo
`VITE_` — esas son las que viajan al navegador y nunca deben llevar secretos.

| Variable | Para qué | Quién la usa |
| --- | --- | --- |
| `PRIVY_APP_ID` | Verificar el token de sesión | todos los endpoints |
| `PRIVY_APP_SECRET` | Ídem | todos |
| `SUPABASE_URL` | Base de datos (acepta `VITE_SUPABASE_URL` de respaldo) | todos |
| `SUPABASE_SERVICE_ROLE_KEY` | Escritura saltándose RLS | todos |
| `HACKATHON_ADMIN_EMAILS` | Allowlist de organizadores, separada por comas | `hackathon/admin`, `admin/lists` |
| `ADMIN_EMAILS` | Alias de la anterior, si se prefiere separar | `admin/lists` |
| `ADMIN_WALLETS` | Wallets de administración, separadas por comas | `admin/lists`, `hackathon/admin` |
| `ALLOWED_ORIGINS` | Orígenes extra permitidos por CORS (opcional) | todos |
| `MINTER_PRIVATE_KEY` | Firma el mint del certificado y la recompensa | `courses/auto-certificate`, `courses/payment` |
| `AVAX_RPC_URL` | RPC de Avalanche | ídem |
| `BADGES_CONTRACT` | Dirección de CriptoUNAMBadges | `courses/auto-certificate` |
| `PUMA_TOKEN` | Dirección de PUMAToken | ídem |
| `BADGES_METADATA_BASE` | Base de la metadata del badge | ídem |
| `CERT_PUMA_REWARD` | PUMA a entregar al certificar (opcional) | ídem |

### La regla del prefijo `VITE_`

Todo lo que se llame `VITE_*` **se publica**: Vite lo incrusta en
`assets/index-*.js`, que cualquiera descarga. Estar en un `.env` no lo vuelve
secreto. Dos consecuencias que ya nos tocaron:

* **Borrar `VITE_ADMIN_EMAILS` del proyecto de Vercel.** Los correos de los
  organizadores estaban dentro del bundle publicado. No abría el panel (el
  servidor manda), pero decía a quién había que suplantar para entrar. La
  allowlist vive ahora solo en `ADMIN_EMAILS`, y el navegador pregunta por
  `GET /api/admin/lists?list=perfil`. Ese endpoint acepta las dos identidades:
  correo para los organizadores del hackathon y wallet (`ADMIN_WALLETS`) para el
  panel de recompensas, donde el permiso real es un rol on-chain.
* **`VITE_TELEGRAM_BOT_TOKEN` y `VITE_RESEND_API_KEY` deben quedarse vacías.**
  El código que las lee corre en el navegador (`src/api/telegram.ts`,
  `src/services/resend.service.ts`), así que rellenarlas publica el token del
  bot y la llave de correo. Hoy están vacías: por eso los avisos a Telegram no
  salen. Arreglarlo es moverlos a una función de `api/`, no poner el token.

`src/config/env.ts` lee cada variable por su nombre y no con `env[clave]`
justamente por esto: el acceso dinámico obligaba a Vite a meter el objeto de
entorno **completo** en el bundle, así que se publicaba hasta lo que el código
nunca usaba.

## Cerrar la base de datos (paso 3)

Con la API viva, ejecutar `supabase-seguridad-rls.sql` completo en el SQL Editor
de Supabase. Ese archivo quita las policies `USING (true)` que dejaban leer y
escribir la base entera con la anon key (que va dentro del bundle) y crea la
tabla y la función del rate limiting.

**El orden importa.** Si se ejecuta el SQL antes de que la API responda, el
progreso de cursos y los likes dejan de guardarse, porque el navegador ya no
escribe directo en Supabase.

## Comprobación

```bash
# 1. Las funciones existen: 401 (falta token), NO 404 de texto plano.
curl -s -o /dev/null -w '%{http_code}\n' https://criptounam.xyz/api/hackathon/teams
curl -s -o /dev/null -w '%{http_code}\n' https://criptounam.xyz/api/courses/progress

# 2. Las envs están puestas: si falta alguna sale "Backend mal configurado".
curl -s https://criptounam.xyz/api/hackathon/teams -H 'Authorization: Bearer x' | head -c 120

# 3. Tras el SQL, la anon key ya no ve datos personales (debe dar 0 filas).
curl -s "$SUPABASE_URL/rest/v1/curso_inscripciones?select=*" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
```

## Qué protege cada capa

| Capa | Qué cubre |
| --- | --- |
| Vercel (automático) | Mitigación de DDoS en el edge, para el sitio estático |
| `api/_lib/ratelimit.ts` | Límite por IP y ruta: memoria por instancia + contador global en Postgres (`check_rate_limit`) |
| Privy (`api/_lib/privy.ts`) | Toda escritura exige token; las wallets se verifican contra la cuenta |
| RLS (`supabase-seguridad-rls.sql`) | La anon key solo lee contenido público y solo inserta en los tres formularios abiertos |
| Cabeceras (`vercel.json`) | HSTS, `nosniff`, `Referrer-Policy`, anti-clickjacking y CSP |

Límites por ventana (ver cada endpoint): 60/min en las rutas del hackathon,
90/min en progreso de cursos, 60/min en likes, 20/10min en subida de imágenes y
10/10min en los dos endpoints que firman on-chain.

## Cabeceras de seguridad y CSP (paso 4)

El bloque `"source": "/(.*)"` de `criptounam/vercel.json` manda estas cabeceras
en todas las respuestas:

| Cabecera | Para qué |
| --- | --- |
| `Strict-Transport-Security` | El navegador nunca vuelve a hablar en HTTP con el dominio |
| `X-Content-Type-Options: nosniff` | Un archivo subido no se ejecuta porque el navegador "adivine" que es JS |
| `Referrer-Policy` | Las URLs internas no viajan a sitios de terceros |
| `X-Frame-Options` + `frame-ancestors 'self'` | Nadie mete el sitio en un iframe para robar clics (clickjacking) |
| `Permissions-Policy` | Cámara, micrófono y ubicación apagados; `payment` solo para el marco de Luma |

La **CSP va en dos cabeceras a propósito**:

* `Content-Security-Policy` (forzada) lleva solo lo que no puede romper nada:
  `frame-ancestors`, `base-uri`, `object-src` y `form-action`.
* `Content-Security-Policy-Report-Only` lleva la política completa
  (`script-src 'self'`, `connect-src` con la lista de dominios…). El navegador
  **no bloquea**, solo escribe la violación en la consola.

Que la política estricta esté en modo aviso es lo que permite afinarla sin
tumbar el sitio en pleno hackathon. Para pasarla a forzada:

1. Con el despliegue arriba, recorrer con la consola abierta (F12) los flujos
   reales: entrar con Privy (correo y wallet), inscribirse al hackathon, subir
   foto, ver un curso y un vídeo, y la tarjeta de Luma.
2. Anotar cada `Content Security Policy` de la consola y añadir ese dominio a la
   directiva que aparezca en el mensaje.
3. Cuando una vuelta completa no genere ninguna, copiar el valor de
   `Content-Security-Policy-Report-Only` a `Content-Security-Policy` y borrar la
   de report-only.

El paso 1 no es opcional: Privy tira de `*.rpc.privy.systems` y del captcha de
Cloudflare según el método de acceso, y esos dominios solo salen a la luz
usándolo de verdad.

> Por esto mismo el `<script>` de rescate que estaba dentro de `index.html` vive
> ahora en `public/boot-check.js`: un script en línea obliga a poner
> `script-src 'unsafe-inline'`, y con eso la CSP deja de servir para lo único
> que importa aquí, que un XSS no pueda ejecutar código.

## En local

`vite` no ejecuta las funciones: `npm run dev` sirve la web pero cualquier
llamada a `/api/*` falla. Para probar la plataforma entera hay que levantar el
sitio con `vercel dev` desde `criptounam/`.

# Plataforma de Goya Hack — cómo se despliega

La plataforma (registro, equipos, proyectos, dudas y el panel de organización)
depende de las Vercel Functions de `criptounam/api/hackathon/*`. Sin esas
funciones el sitio se ve entero pero nadie se puede registrar.

## El problema que hubo

Todas las rutas `/api/*` devolvían **404 en producción** — no solo las del
hackathon, también `/api/courses/*`.

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

## El arreglo

En Vercel → proyecto `cripto-unam-website` → **Settings → Build and Deployment
→ Root Directory** → poner `criptounam` y volver a desplegar.

A partir de ahí manda `criptounam/vercel.json`, que ya trae `buildCommand`,
`outputDirectory` e `installCommand` explícitos, y `criptounam/api/**` se publica
como funciones.

El `vercel.json` de la raíz queda inerte; se conserva por si hiciera falta
volver atrás.

## Comprobación después de desplegar

```bash
# Debe responder JSON (una lista de equipos), no un 404 de texto plano.
curl -s https://criptounam.xyz/api/hackathon/teams | head -c 200
```

Si devuelve `{"error":"Backend mal configurado …"}`, las funciones ya están
desplegadas y lo que falta son variables de entorno.

## Variables de entorno que necesitan las funciones

Van en el proyecto de Vercel, **sin** prefijo `VITE_` (esas son las del
navegador). Ver `api/hackathon/_auth.ts`:

| Variable | Para qué |
| --- | --- |
| `PRIVY_APP_ID` | Verificar el token de sesión del participante |
| `PRIVY_APP_SECRET` | Ídem |
| `SUPABASE_URL` | Base de datos (acepta `VITE_SUPABASE_URL` como respaldo) |
| `SUPABASE_SERVICE_ROLE_KEY` | Escritura saltándose RLS |
| `HACKATHON_ADMIN_EMAILS` | Allowlist de organizadores, separada por comas |

Nunca han corrido en producción, así que conviene revisarlas antes de anunciar
el registro.

## En local

`vite` no ejecuta las funciones: `npm run dev` sirve la web pero cualquier
llamada a `/api/*` falla. Para probar la plataforma entera hay que levantar el
sitio con `vercel dev` desde `criptounam/`.

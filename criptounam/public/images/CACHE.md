# Caché de los archivos estáticos

Lo que explicaba el comentario que vivía en `vercel.json` y que hubo que sacar:
el esquema de Vercel no admite propiedades desconocidas y rechaza el despliegue
entero si encuentra una, y JSON no tiene comentarios.

## La regla

| Ruta        | Cache-Control                       | Por qué                                                                                                   |
| ----------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `/assets/`  | `max-age=31536000, immutable`       | Bundles de Vite, con hash de contenido en el nombre: un cambio siempre produce una URL distinta.             |
| `/images/`  | `max-age=3600, must-revalidate`     | Se mantienen a mano y con nombre fijo. Se cachean una hora y luego se revalidan por ETag (304 sin cuerpo).   |
| `/video/`   | `max-age=86400, must-revalidate`    | Igual, pero cambian mucho menos y pesan bastante más.                                                       |

## Por qué `/images/` no puede ser `immutable`

`immutable` le promete al navegador que los bytes de esa URL no van a cambiar
nunca, y por eso no vuelve a preguntar: ni al recargar, ni con recarga forzada.

`/images/` estuvo marcado así durante un año. Cuando siete logos de comunidad
se sustituyeron conservando su nombre de archivo, todos los navegadores que ya
los habían visto se quedaron congelados con la versión anterior, y cuatro de
ellos con una respuesta rota. No había forma de arreglarlo desde el servidor:
la única salida fue renombrar los archivos a `-v2`, porque una URL nueva es una
entrada de caché nueva.

## Al sustituir un archivo

Con la cabecera actual, un reemplazo se propaga en una hora. Aun así, lo seguro
es **darle un nombre nuevo** y actualizar la ruta donde se referencie: el cambio
se ve al instante para todo el mundo y no depende de ninguna caché.

Los dos `vercel.json` —el de la raíz y el de `criptounam/`— se mantienen
sincronizados. El del despliegue actual es el de `criptounam/`, pero el de la
raíz volvería a aplicarse si se cambia el Root Directory del proyecto.

# Logos de las comunidades aliadas

La retícula "Comunidades aliadas" de la landing de GOYA HACK lee esta carpeta.
Los nombres de archivo son los que declara `COMUNIDADES` en
`src/data/hackathonInfo.ts`.

## De dónde salen

Los originales llegan por el formulario de community partner y se guardan en
`public/images/communitypartners/`. **No se referencian desde el código**: Drive
les pega detrás el nombre de quien rellenó el formulario y llegan con espacios,
acentos y mayúsculas (`Anber-2025 - Solana Español.png`), que es frágil en una
URL. Aquí viven ya procesados:

- recortado del margen transparente sobrante (los lienzos vienen con el logo
  pequeño en el centro, y sin recortar cada tarjeta lo escala distinto),
- reescalados a 440 px de lado mayor,
- renombrados a un slug ASCII.

Cuidado al nombrar una entrada nueva: **el nombre de la comunidad es el que se
lee EN el logo, no el del archivo.** `Brand_Kit_Logo - Solène Daviaud.png`, por
ejemplo, es el logo de Dev3Pack.

## Fondo de la tarjeta

Cada logo va sobre una caja del mismo tamaño y lo único que cambia es el
relleno, que se controla con `placa` en `COMUNIDADES`:

| `placa`  | Cuándo                                                        |
| -------- | ------------------------------------------------------------- |
| `true`   | El archivo trae fondo opaco (una foto, un recorte sobre blanco) **o** es un logotipo en tinta oscura sobre transparente. Sin placa desaparece sobre el panel negro. |
| omitido  | El logo ya es claro o de color vivo: va sobre un velo apenas perceptible. |

Los logos se muestran **en su color**. No se invierten ni se pasan a escala de
grises: son marcas de terceros y un negativo les cambia la identidad.

## Al sustituir un logo: renombra el archivo

**No sobrescribas un archivo conservando su nombre.** `/images/` se sirve
cacheado, y durante un tiempo estuvo con `immutable` a un año: siete logos se
reemplazaron bajo el mismo nombre y los navegadores que ya los habían visto se
quedaron con la versión vieja —o directamente con una respuesta rota— sin forma
de refrescarla ni recargando. De ahí el sufijo `-v2` de algunos archivos.

La cabecera ya está corregida (`max-age=3600, must-revalidate` en los dos
`vercel.json`), así que ahora un reemplazo se propaga en una hora. Aun así, la
forma segura de sustituir un logo sigue siendo darle un nombre nuevo y
actualizar la ruta en `COMUNIDADES`: el cambio se ve al instante para todo el
mundo y no depende de ninguna caché.

Formato recomendado para archivos nuevos: PNG con fondo transparente, ~500 px
de ancho.

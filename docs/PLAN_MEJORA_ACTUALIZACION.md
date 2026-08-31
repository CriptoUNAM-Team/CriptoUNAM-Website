# Plan de mejora y actualización – CriptoUNAM

Guía para actualizar **eventos**, **roles de miembros**, **fotos de partners** y **cursos** en el sitio. Todas las fuentes están en código (archivos de datos o constantes), sin CMS.

---

## 1. Eventos organizados por CriptoUNAM

### Dónde se edita
- **Archivo:** `src/data/eventosData.ts`
- **Páginas que los usan:** `src/pages/Eventos.tsx`, `src/pages/Home.tsx` (carrusel de próximos eventos).

### Estructura de un evento
Cada evento es un objeto con:

| Campo        | Tipo    | Descripción |
|-------------|---------|-------------|
| `id`        | string  | Identificador único (ej. `'5'`, `'6'`) |
| `title`     | string  | Nombre del evento |
| `date`      | string  | Fecha legible (ej. `'9 de Febrero, 2026'`) |
| `time`      | string  | Hora (ej. `'10:30 AM - 4:00 PM'`) |
| `location`  | string  | Lugar o "Online" |
| `image`     | string  | Ruta desde `public`: `/images/eventos/nombre-archivo.png` |
| `description` | string | Descripción breve |
| `capacity`  | number? | Cupo (opcional) |
| `registered`| number? | Inscritos (opcional) |
| `isUpcoming`| boolean | `true` = próximo (aparece en Home y como “próximo” en Eventos) |
| `link`      | string? | URL de registro o más info |

### Imágenes de eventos
- **Carpeta:** `public/images/eventos/`
- Añadir la imagen (PNG, JPG o SVG) con el nombre que uses en `image` (ej. `BinancePuebla.png`).
- Ver lista actual en `public/images/eventos/README.md` si existe.

### Cómo actualizar
1. **Añadir evento:** Agregar un objeto al array `eventosData` en `eventosData.ts`. Si es próximo, usar `isUpcoming: true`.
2. **Quitar evento:** Eliminar el objeto o poner `isUpcoming: false` si quieres conservarlo como pasado.
3. **Editar evento:** Cambiar los campos del objeto (título, fecha, enlace, etc.).
4. **Spaces y hackathons:** En el mismo archivo están `spacesData` y `hackathonsData`; sus imágenes van en `public/images/spaces/` y `public/images/hackathones_proximos/` respectivamente.

---

## 2. Roles y miembros del equipo

### Dónde se edita
- **Archivo:** `src/data/teamData.ts` (exporta `teamMembers` y tipo `TeamMember`).
- **Componente que los muestra:** `TeamCard` en la sección "Nuestro equipo" de `Home.tsx`.

### Estructura de un miembro
Cada elemento del array tiene:

| Campo         | Tipo   | Descripción |
|---------------|--------|-------------|
| `name`        | string | Nombre completo o nombre público |
| `role`        | string | Rol (ej. `'Founder & CEO'`, `'Embajador CriptoUNAM'`) |
| `description` | string | Texto breve que aparece en la tarjeta |
| `image`       | string | Ruta: `/images/Equipo/nombre-archivo.jpg` (o .png) |
| `linkedin`    | string?| URL de LinkedIn (o `'#'` si no hay) |
| `twitter`     | string?| URL de Twitter/X (opcional) |
| `github`      | string?| URL de GitHub (opcional) |

### Fotos del equipo
- **Carpeta:** `public/images/Equipo/`
- Subir la foto con nombre consistente (ej. `NombreApellido.jpg`) y usar ese nombre en `image`.

### Cómo actualizar
1. **Cambiar rol:** Editar la propiedad `role` del objeto correspondiente en `teamMembers`.
2. **Cambiar descripción:** Editar `description`.
3. **Añadir miembro:** Agregar un nuevo objeto al array con todos los campos (y la foto en `Equipo/`).
4. **Quitar miembro:** Eliminar el objeto del array.
5. **Cambiar foto:** Sustituir el archivo en `Equipo/` manteniendo el mismo nombre, o cambiar el nombre y actualizar `image` en `teamMembers`.

---

## 3. Fotos de partners (aliados)

### Dónde se usa
- **Archivo:** `src/pages/Home.tsx`
- **Sección:** “Nuestros Aliados” (ticker de logos), aprox. líneas 1285–1303.

### Estado actual (implementado)
- **Archivo de datos:** `src/data/partnersData.ts` exporta `partnersData` (array de `{ img, alt }`). El ticker en `Home.tsx` usa este array.
- **Carpeta:** `public/images/partners/` existe; incluye README con instrucciones.
- **Constantes:** `IMAGES.PARTNERS` en `src/constants/images.ts` define `partner1.png`, `partner2.png`, `partner3.png`. Para más aliados se añaden entradas en `partnersData.ts`.

### Cómo actualizar
1. **Añadir logos:** Subir imágenes en `public/images/partners/` (ej. `partner1.png`, `binance.png`).
2. **Editar lista:** En `src/data/partnersData.ts` agregar o modificar objetos `{ img: '/images/partners/nombre.png', alt: 'Nombre del aliado' }`.
3. **Más de 3 partners:** Añadir nuevas entradas al array; si quieres usar constantes, puedes extender `IMAGES.PARTNERS` en `images.ts`.

---

## 4. Cursos

### Dónde se edita
- **Archivo:** `src/constants/cursosData.ts`
- **Páginas:** `src/pages/Cursos.tsx` (listado), `src/pages/RegistroCurso.tsx` (detalle e inscripción).

### Estructura de un curso
Cada curso es un objeto con:

| Campo         | Tipo     | Descripción |
|---------------|----------|-------------|
| `id`          | string   | ID único (ej. `'1'`, `'2'`) – se usa en la URL `/registro-curso/:id` |
| `titulo`      | string   | Nombre del curso |
| `nivel`       | string   | `'Principiante'` \| `'Intermedio'` \| `'Avanzado'` |
| `duracion`    | string   | Ej. `'2 semanas'`, `'4 semanas'` |
| `imagen`      | string   | Ruta: usar `IMAGES.CURSOS.XXX` de `constants/images.ts` o `/images/cursos/nombre.svg` |
| `descripcion` | string   | Descripción corta |
| `instructor`  | string   | Nombre del instructor |
| `precio`      | number   | 0 = gratuito |
| `estudiantes` | number   | Número (para mostrar estadística) |
| `rating`      | number   | Ej. 4.8 |
| `categorias`  | string[] | Ej. `['Blockchain', 'Ethereum', 'Smart Contracts']` – deben coincidir con filtros en Cursos |
| `requisitos`  | string?  | Texto de requisitos previos |
| `lecciones`   | array?  | Lista de `{ id, titulo, video, descripcion }` para el contenido del curso |

### Imágenes de cursos
- **Constantes:** En `src/constants/images.ts`, objeto `IMAGES.CURSOS` (ej. `BLOCKCHAIN_BASICS`, `SMART_CONTRACTS`, `DEFI`).
- **Carpeta:** `public/images/cursos/` (ahí están 1.svg, 2.svg, 3.svg).

### Cómo actualizar
1. **Añadir curso:** Agregar un objeto al array `cursosData` y, si hace falta, una nueva clave en `IMAGES.CURSOS` y el archivo en `public/images/cursos/`.
2. **Editar curso:** Cambiar titulo, descripción, instructor, nivel, duracion, categorias, lecciones, etc.
3. **Quitar curso:** Eliminar el objeto del array (ten en cuenta que los enlaces `/registro-curso/:id` dejarán de funcionar para ese `id`).
4. **Categorías:** Si añades categorías nuevas, actualizar en `src/pages/Cursos.tsx` la constante `CATEGORIAS_LIST` para que el filtro las muestre.

---

## Resumen rápido

| Contenido        | Archivo principal              | Carpeta de imágenes              |
|------------------|--------------------------------|-----------------------------------|
| Eventos          | `src/data/eventosData.ts`      | `public/images/eventos/`          |
| Spaces           | mismo archivo (`spacesData`)   | `public/images/spaces/`          |
| Hackathons       | mismo archivo (`hackathonsData`)| `public/images/hackathones_proximos/` |
| Miembros / roles | `src/data/teamData.ts` | `public/images/Equipo/`   |
| Partners         | `src/data/partnersData.ts` | `public/images/partners/`   |
| Cursos           | `src/constants/cursosData.ts`  | `public/images/cursos/` + `images.ts` |

Después de cualquier cambio, ejecutar `npm run build` en `criptounam/` para comprobar que no haya errores.

# 👨‍💼 Guía del Panel de Administrador - CriptoUNAM

## 🔐 ¿Cómo acceder como Admin?

Tu wallet ya está configurada como administrador en el código. Solo necesitas:

1. **Conectar tu wallet** en el sitio web
2. **Ir a las páginas** de administración
3. **Verás botones especiales** solo visibles para admins

---

## 📝 **1. NEWSLETTERS (Artículos del Blog)**

### ¿Cómo agregar un nuevo artículo?

#### Desde el Front (Recomendado):
1. **Ve a la página Newsletter**: `https://tu-sitio.com/newsletter`
2. **Conecta tu wallet de admin**
3. **Verás un botón "Agregar Newsletter"** (solo visible para admins)
4. **Click en el botón** y se abrirá un modal
5. **Llena el formulario**:
   - **Título**: El título del artículo
   - **Fecha**: Fecha de publicación
   - **Autor**: Tu nombre o "Equipo CriptoUNAM"
   - **Contenido**: Escribe en **Markdown** (soporta títulos, listas, negritas, etc.)
   - **Imagen**: Sube una imagen o pega URL
   - **Tags**: Selecciona tags relevantes (Blockchain, DeFi, NFTs, etc.)
6. **Click en "Publicar Newsletter"**
7. **¡Listo!** Aparecerá inmediatamente en la página

#### Markdown Soportado:
```markdown
# Título principal
## Subtítulo
### Subtítulo más pequeño

**Texto en negrita**
*Texto en cursiva*

- Lista item 1
- Lista item 2

1. Lista numerada 1
2. Lista numerada 2

[Link a sitio](https://ejemplo.com)

![Imagen](https://url-de-imagen.jpg)
```

#### Desde Supabase (Avanzado):
```sql
INSERT INTO public.newsletters (titulo, contenido, autor, imagen, tags) 
VALUES (
  'Mi Artículo Nuevo',
  '## Introducción\n\nEste es el contenido...',
  'Tu Nombre',
  'https://url-imagen.jpg',
  ARRAY['blockchain', 'defi']
);
```

---

## 🎓 **2. CURSOS**

### ¿Cómo agregar un curso?

#### Desde el Front:
1. **Ve a la página Cursos**: `https://tu-sitio.com/cursos`
2. **Conecta tu wallet de admin**
3. **Verás un botón "Agregar Curso"**
4. **Llena el formulario**:
   - **Título**: Nombre del curso
   - **Descripción**: Descripción completa
   - **Duración**: Ej: "8 semanas"
   - **Nivel**: Principiante / Intermedio / Avanzado
   - **Instructor**: Nombre del profesor
   - **Imagen**: Sube imagen del curso
   - **Enlace**: URL de registro o más info
   - **Precio**: 0 para gratis, o el precio en USD
   - **Fecha inicio/fin**: Fechas del curso
   - **Cupo**: Máximo de estudiantes
5. **Click en "Crear Curso"**

#### Desde Supabase:
```sql
INSERT INTO public.cursos (titulo, descripcion, duracion, nivel, instructor, imagen, enlace, precio, fechaInicio, fechaFin, cupo) 
VALUES (
  'Curso de Solidity',
  'Aprende a programar smart contracts',
  '8 semanas',
  'Intermedio',
  'Dr. Juan Pérez',
  'https://url-imagen.jpg',
  'https://registro.com',
  99.99,
  '2025-02-01',
  '2025-04-01',
  30
);
```

---

## 🎉 **3. EVENTOS**

### ¿Cómo agregar un evento?

#### Desde el Front:
1. **Ve a la página Comunidad**: `https://tu-sitio.com/comunidad`
2. **Conecta tu wallet de admin**
3. **Scroll hasta "Eventos"**
4. **Verás formularios para**:
   - **Próximos eventos**: Eventos futuros
   - **Eventos anteriores**: Eventos pasados con galería de fotos

#### Para Próximos Eventos:
- **Título**: Nombre del evento
- **Fecha**: Fecha del evento
- **Hora**: Hora del evento
- **Lugar**: Ubicación
- **Cupo**: Máximo de asistentes
- **Descripción**: Descripción del evento
- **Link de registro**: URL para registrarse
- **Imagen**: Imagen promocional

#### Para Eventos Anteriores:
- Similar al anterior, PERO:
- **Imagen Principal**: Una foto destacada
- **Fotos**: Subir múltiples fotos del evento
- **Videos**: URLs de videos (YouTube, Vimeo, etc.)
- **Presentaciones**: URLs de slides

#### Desde Supabase:
```sql
-- Evento próximo
INSERT INTO public.eventos (tipo, titulo, fecha, hora, ubicacion, cupo, descripcion, registro_link, imagen_principal) 
VALUES (
  'proximo',
  'Workshop de Blockchain',
  '2025-12-15',
  '16:00',
  'Facultad de Ingeniería',
  50,
  'Aprende los fundamentos...',
  'https://forms.gle/xxx',
  'https://imagen.jpg'
);

-- Evento anterior (con fotos)
INSERT INTO public.eventos (tipo, titulo, fecha, ubicacion, cupo, descripcion, imagen_principal, fotos, videos) 
VALUES (
  'anterior',
  'Hackathon Web3',
  '2024-11-20',
  'Centro de Innovación',
  100,
  'Competencia de desarrollo...',
  'https://foto-principal.jpg',
  ARRAY['https://foto1.jpg', 'https://foto2.jpg'],
  ARRAY['https://youtube.com/watch?v=xxx']
);
```

---

## ❤️ **4. SISTEMA DE LIKES**

### ¿Cómo funciona?

Los likes se manejan **automáticamente** desde el frontend:

1. **Usuario visita** un artículo del newsletter
2. **Click en el botón de like** (❤️)
3. **Se guarda en la tabla `likes`** automáticamente
4. **El contador se actualiza** en tiempo real

#### Ver estadísticas en Supabase:
```sql
-- Newsletters más populares
SELECT titulo, like_count, view_count 
FROM public.newsletters 
ORDER BY like_count DESC;

-- Likes por usuario
SELECT user_id, COUNT(*) as total_likes 
FROM public.likes 
GROUP BY user_id;
```

---

## 📧 **5. SUSCRIPCIONES DE EMAIL**

### ¿Cómo funciona?

Las suscripciones se guardan **automáticamente** cuando un usuario:

1. **Ingresa su email** en la página principal o newsletter
2. **Click en "Suscribirse"**
3. **Se guarda en** `email_subscriptions`
4. **Recibe confirmación** por pantalla

#### Ver suscriptores en Supabase:
```sql
-- Todos los suscriptores activos
SELECT email, subscribed_at 
FROM public.email_subscriptions 
WHERE is_active = true 
ORDER BY subscribed_at DESC;

-- Total de suscriptores
SELECT COUNT(*) as total 
FROM public.email_subscriptions 
WHERE is_active = true;
```

#### Enviar newsletter por email (futuro):
El sistema de Resend enviará automáticamente emails cuando publiques un nuevo artículo.

---

## 💰 **6. SISTEMA PUMA (Recompensas)**

### ¿Cómo funciona?

El sistema PUMA otorga recompensas automáticamente por:
- ✅ Conectar wallet
- ✅ Completar perfil
- ✅ Dar likes a artículos
- ✅ Compartir en redes sociales
- ✅ Asistir a eventos

#### Ver usuarios y recompensas:
```sql
-- Top usuarios por balance
SELECT user_id, balance, level, experience_points 
FROM public.puma_users 
ORDER BY balance DESC 
LIMIT 10;

-- Historial de transacciones
SELECT user_id, amount, type, reason, created_at 
FROM public.puma_transactions 
ORDER BY created_at DESC 
LIMIT 20;
```

---

## 🛠️ **7. GESTIÓN DE CONTENIDO**

### Editar Contenido Existente

#### Editar Newsletter:
1. Ve a la página del newsletter
2. Conecta tu wallet de admin
3. Verás un botón "Editar"
4. Modifica el contenido
5. Guarda cambios

#### Editar Curso:
1. Ve a la página de cursos
2. Click en el curso que quieres editar
3. Modifica los campos
4. Guarda cambios

#### Editar Evento:
Similar a cursos y newsletters.

### Eliminar Contenido

⚠️ **CUIDADO**: Eliminar es permanente

1. Conecta tu wallet de admin
2. Click en el botón "Eliminar" del elemento
3. Confirma la acción
4. Se eliminará de la base de datos

---

## 📊 **8. ESTADÍSTICAS Y MÉTRICAS**

### Dashboard de Admin (próximamente)

El sistema ya está preparado para mostrar:
- 📈 Total de artículos publicados
- 👥 Total de suscriptores
- ❤️ Artículos más populares
- 🎓 Cursos más solicitados
- 🎉 Asistencia a eventos

### Ver estadísticas en Supabase:
```sql
-- Resumen general
SELECT 
  (SELECT COUNT(*) FROM newsletters) as total_newsletters,
  (SELECT COUNT(*) FROM cursos) as total_cursos,
  (SELECT COUNT(*) FROM eventos) as total_eventos,
  (SELECT COUNT(*) FROM email_subscriptions WHERE is_active = true) as total_suscriptores,
  (SELECT SUM(like_count) FROM newsletters) as total_likes;
```

---

## 🎨 **9. TIPS DE CONTENIDO**

### Para Newsletters:

**Buenos títulos**:
- ✅ "Ethereum 2.0: Todo lo que necesitas saber"
- ✅ "5 proyectos DeFi que cambiarán 2025"
- ✅ "Tutorial: Cómo crear tu primer NFT"

**Mal títulos**:
- ❌ "Artículo 1"
- ❌ "Blockchain"
- ❌ "Actualización"

**Contenido de calidad**:
- Mínimo 500 palabras
- Usa subtítulos (##)
- Agrega imágenes relevantes
- Incluye ejemplos prácticos
- Enlaza a recursos externos

### Para Imágenes:

**Recomendaciones**:
- Usa imágenes de alta calidad (mínimo 1200x630px)
- Formatos: JPG, PNG, WebP
- Peso máximo: 5MB
- Fuentes recomendadas:
  - Unsplash.com (gratis)
  - Pexels.com (gratis)
  - Tu propia galería

---

## 🔒 **10. SEGURIDAD**

### Wallets de Admin

Actualmente, los admins están definidos en el código:
```typescript
// criptounam/src/constants/admin.ts
export const ADMIN_ADDRESSES = [
  '0xTuWalletAddress'
];
```

Para agregar más admins:
1. Edita el archivo `admin.ts`
2. Agrega la wallet address
3. Haz commit y push
4. Redeploy en Vercel

### Permisos

Los admins pueden:
- ✅ Crear newsletters
- ✅ Editar newsletters
- ✅ Eliminar newsletters
- ✅ Crear cursos
- ✅ Crear eventos
- ✅ Ver estadísticas

Los usuarios normales pueden:
- ✅ Ver contenido
- ✅ Dar likes
- ✅ Suscribirse al newsletter
- ✅ Registrarse a eventos

---

## 🚀 **11. FLUJO DE TRABAJO RECOMENDADO**

### Para publicar un nuevo artículo:

1. **Escribe el contenido** en un editor Markdown (Notion, VS Code, etc.)
2. **Prepara las imágenes** (optimiza el peso)
3. **Sube las imágenes** a un hosting (Imgur, Cloudinary, o Supabase Storage)
4. **Copia las URLs** de las imágenes
5. **Ve a tu sitio web** y conecta wallet
6. **Click en "Agregar Newsletter"**
7. **Pega el contenido** y las URLs
8. **Selecciona tags** relevantes
9. **Preview** antes de publicar
10. **Publica** y comparte en redes sociales

### Para crear un curso:

1. **Define los objetivos** del curso
2. **Prepara el temario**
3. **Crea una imagen** promocional
4. **Sube la imagen** a Supabase Storage
5. **Ve a la página de cursos**
6. **Click en "Agregar Curso"**
7. **Llena todos los campos**
8. **Publica** y promociona

---

## 📞 **12. SOPORTE Y AYUDA**

### Problemas comunes:

**"No veo el botón de admin"**
- Verifica que tu wallet esté conectada
- Verifica que tu address esté en `admin.ts`
- Recarga la página

**"Error al subir imagen"**
- Verifica el tamaño (máx 5MB)
- Verifica el formato (JPG, PNG, WebP)
- Usa una URL directa si falla la subida

**"No se guarda el contenido"**
- Verifica la conexión a Supabase
- Revisa la consola del navegador (F12)
- Verifica que los campos requeridos estén llenos

---

## 🎯 **RESUMEN RÁPIDO**

| Acción | Dónde | Requisito |
|--------|-------|-----------|
| Agregar Newsletter | `/newsletter` | Wallet de admin conectada |
| Agregar Curso | `/cursos` | Wallet de admin conectada |
| Agregar Evento | `/comunidad` | Wallet de admin conectada |
| Ver estadísticas | Supabase SQL | Acceso a Supabase |
| Ver suscriptores | Supabase | Acceso a Supabase |
| Enviar emails | Automático | Resend configurado |

---

**¡Ahora puedes administrar todo el contenido de CriptoUNAM desde el frontend!** 🚀

**Commits completados**: 64/110 (58%)


# 📘 Explicación de Archivos SQL - CriptoUNAM

## 📂 Tienes 3 archivos SQL, aquí está la diferencia:

---

## 1️⃣ `supabase-schema.sql` (ARCHIVO VIEJO ⚠️)

### ¿Qué hace?
- Es el esquema **original** de tu proyecto
- Usa `DROP TABLE IF EXISTS` - **BORRA las tablas existentes**
- Más simple, menos funcionalidades

### Tablas que crea:
- ✅ `eventos` (próximos y anteriores)
- ✅ `cursos` (cursos de la plataforma)
- ✅ `newsletter` (singular - artículos del blog)
- ✅ `suscripciones_newsletter` (emails suscritos)
- ✅ `registros_comunidad` (formularios de registro)
- ✅ `wallets_conectadas` (wallets que se conectan)

### ⚠️ **PELIGRO**:
```sql
DROP TABLE IF EXISTS eventos CASCADE;  -- ¡BORRA TODO!
```

### ❌ **NO USES ESTE ARCHIVO** si ya tienes datos

---

## 2️⃣ `supabase-complete-schema.sql` (ARCHIVO NUEVO - COMPLETO)

### ¿Qué hace?
- Esquema **completo** con TODAS las nuevas funcionalidades
- Usa `CREATE TABLE IF NOT EXISTS` - **NO BORRA nada**
- Incluye sistema de likes, PUMA, transacciones

### Tablas que crea:
- ✅ `newsletters` (plural - con likes y vistas)
- ✅ `likes` (sistema de likes para newsletters)
- ✅ `email_subscriptions` (suscripciones mejoradas)
- ✅ `puma_users` (usuarios del sistema de recompensas)
- ✅ `puma_transactions` (historial de transacciones PUMA)
- ✅ `cursos` (cursos mejorados)
- ✅ `eventos` (eventos mejorados)

### ✅ **SEGURO**:
```sql
CREATE TABLE IF NOT EXISTS public.newsletters (  -- ¡Solo crea si no existe!
```

### Funcionalidades avanzadas:
- ✅ Triggers automáticos para actualizar contadores
- ✅ Funciones para incrementar/decrementar likes
- ✅ Row Level Security (RLS) configurado
- ✅ Índices para optimización
- ✅ 3 newsletters de ejemplo con contenido real

### ⚠️ **PROBLEMA**:
Si ya tienes una tabla llamada `newsletter` (singular), este archivo no la actualizará, solo creará las nuevas.

---

## 3️⃣ `supabase-migration-safe.sql` (ARCHIVO RECOMENDADO ⭐)

### ¿Qué hace?
- **MIGRACIÓN INTELIGENTE** que NO pierde datos
- Detecta qué tablas ya existen
- Actualiza y agrega columnas sin borrar nada
- Renombra tablas antiguas automáticamente

### Lo que hace paso a paso:

#### 1. **Verifica qué tienes actualmente**
```sql
SELECT table_name FROM information_schema.tables...
```

#### 2. **Renombra tablas antiguas**
```sql
ALTER TABLE newsletter RENAME TO newsletters;  -- Si existe la vieja
ALTER TABLE suscripciones_newsletter RENAME TO email_subscriptions;
```

#### 3. **Agrega columnas faltantes**
```sql
-- Si la tabla existe pero le falta una columna:
ALTER TABLE newsletters ADD COLUMN like_count INTEGER DEFAULT 0;
```

#### 4. **Crea tablas nuevas solo si no existen**
```sql
CREATE TABLE IF NOT EXISTS public.likes (...)
CREATE TABLE IF NOT EXISTS public.puma_users (...)
```

#### 5. **Inserta datos de ejemplo solo si está vacío**
```sql
IF NOT EXISTS (SELECT 1 FROM newsletters LIMIT 1) THEN
    INSERT INTO newsletters ...
END IF;
```

### ✅ **100% SEGURO**:
- ✅ NO borra datos existentes
- ✅ NO sobreescribe tablas
- ✅ Actualiza estructura sin pérdida de información
- ✅ Muestra notificaciones de progreso
- ✅ Verifica todo al final

---

## 🎯 ¿Cuál archivo debes usar?

### Si NO tienes ninguna tabla en Supabase:
```
Usa: supabase-complete-schema.sql
```
Es más simple y crea todo desde cero.

### Si YA tienes tablas con datos:
```
Usa: supabase-migration-safe.sql ⭐ RECOMENDADO
```
Migra todo sin perder información.

### Si quieres empezar desde cero (BORRANDO TODO):
```
Usa: supabase-schema.sql ⚠️ PELIGROSO
```
Solo si estás 100% seguro de que no hay datos importantes.

---

## 📊 Comparación Visual

| Característica | supabase-schema.sql | supabase-complete-schema.sql | supabase-migration-safe.sql |
|----------------|---------------------|------------------------------|----------------------------|
| **Borra datos** | ❌ SÍ (`DROP TABLE`) | ✅ NO | ✅ NO |
| **Sistema de likes** | ❌ NO | ✅ SÍ | ✅ SÍ |
| **Sistema PUMA** | ❌ NO | ✅ SÍ | ✅ SÍ |
| **Migración automática** | ❌ NO | ❌ NO | ✅ SÍ |
| **Detecta tablas existentes** | ❌ NO | ⚠️ Parcial | ✅ SÍ |
| **Datos de ejemplo** | ⚠️ Básicos | ✅ Completos | ✅ Completos |
| **Seguro con datos existentes** | ❌ NO | ⚠️ Parcial | ✅ SÍ |

---

## 🚀 Instrucciones de uso

### Opción 1: Setup completo desde cero
```sql
-- 1. Ve a Supabase SQL Editor
-- 2. Copia TODO el contenido de: supabase-complete-schema.sql
-- 3. Pégalo y ejecuta
-- 4. ¡Listo! Tendrás 3 newsletters de ejemplo
```

### Opción 2: Migración segura (RECOMENDADO si ya tienes datos)
```sql
-- 1. Ve a Supabase SQL Editor
-- 2. Copia TODO el contenido de: supabase-migration-safe.sql
-- 3. Pégalo y ejecuta
-- 4. Verás notificaciones de progreso
-- 5. Al final verás un resumen de todas las tablas
```

---

## 🔍 Verificar que todo funcionó

Después de ejecutar cualquier script, ejecuta esto:

```sql
-- Ver todas las tablas
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns 
     WHERE table_name = t.table_name) as columnas
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Ver cuántos registros hay en cada tabla
SELECT 'newsletters' as tabla, COUNT(*) as registros FROM public.newsletters
UNION ALL
SELECT 'likes', COUNT(*) FROM public.likes
UNION ALL
SELECT 'email_subscriptions', COUNT(*) FROM public.email_subscriptions
UNION ALL
SELECT 'cursos', COUNT(*) FROM public.cursos
UNION ALL
SELECT 'eventos', COUNT(*) FROM public.eventos;
```

---

## 🐛 Solución de problemas

### "ERROR: table already exists"
**Causa**: Intentaste usar `supabase-complete-schema.sql` con tablas existentes pero con nombres diferentes.
**Solución**: Usa `supabase-migration-safe.sql` en su lugar.

### "ERROR: column does not exist"
**Causa**: Tu código espera columnas que no existen en tus tablas antiguas.
**Solución**: Ejecuta `supabase-migration-safe.sql` para agregar las columnas faltantes.

### "No hay newsletters en la página"
**Causa**: Las tablas existen pero están vacías.
**Solución**: 
```sql
-- Verificar si hay datos
SELECT COUNT(*) FROM public.newsletters;

-- Si está vacío (0), inserta datos de ejemplo:
-- (Copia la sección de DATOS DE EJEMPLO de cualquier archivo SQL)
```

---

## 📝 Resumen

### Para TI (con tus tablas existentes):

1. **USA**: `supabase-migration-safe.sql` ⭐
2. **Por qué**: 
   - Mantiene tus datos actuales
   - Actualiza la estructura
   - Agrega nuevas funcionalidades
   - Todo sin riesgo

### Lo que hará por ti:
- ✅ Renombrar `newsletter` → `newsletters`
- ✅ Agregar columnas `like_count`, `view_count`
- ✅ Crear tabla `likes`
- ✅ Crear tablas `puma_users` y `puma_transactions`
- ✅ Actualizar `email_subscriptions`
- ✅ Configurar triggers automáticos
- ✅ Insertar 3 newsletters de ejemplo (solo si la tabla está vacía)

---

## 🎉 Resultado Final

Después de ejecutar `supabase-migration-safe.sql`:

```
✅ Todas tus tablas existentes intactas
✅ Nuevas tablas creadas (likes, puma_users, puma_transactions)
✅ Columnas faltantes agregadas
✅ Triggers y funciones configuradas
✅ Datos de ejemplo insertados (si no había)
✅ Newsletter funcionando en tu sitio web
```

---

**Fecha**: 11 de Octubre, 2025  
**Commits completados**: 62/110 (56%)


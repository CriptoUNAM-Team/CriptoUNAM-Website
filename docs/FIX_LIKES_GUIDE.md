# 🔧 Guía Rápida: Arreglar Sistema de Likes

## 🐛 **Problema Actual:**

```
Error 406: Not Acceptable
Error 400: Bad Request
```

Los likes no funcionan porque la tabla necesita:
1. Columna `created_at` (falta)
2. Políticas RLS (Row Level Security) correctas

---

## ✅ **Solución (2 minutos):**

### **Paso 1: Abrir Supabase**
1. Ve a: https://supabase.com/dashboard/project/shccrrwnmogswspvlakf
2. Click en **SQL Editor** (menú izquierdo)

### **Paso 2: Ejecutar el script de fix**
1. Click en **"New Query"**
2. Abre el archivo: `criptounam/fix-likes-table.sql`
3. **Copia TODO el contenido**
4. Pégalo en el editor de Supabase
5. Click en **"Run"** o `Cmd/Ctrl + Enter`

### **Paso 3: Verificar que funcionó**
Verás mensajes como:
```
NOTICE: Columna created_at agregada a likes
NOTICE: ✅ Tabla de likes corregida exitosamente
```

Y verás una tabla mostrando la estructura de la tabla `likes`.

---

## 🧪 **Probar que funciona:**

1. **Recarga tu sitio** web
2. **Ve a un newsletter**: `/newsletter/[id]`
3. **Conecta tu wallet**
4. **Click en el botón de like** ❤️
5. **Debería funcionar** sin errores

---

## 📊 **Lo que hace el script:**

1. ✅ Agrega columna `created_at` si no existe
2. ✅ Elimina políticas RLS viejas que causan conflicto
3. ✅ Crea nuevas políticas permisivas:
   - Todos pueden leer likes
   - Todos pueden insertar likes
   - Todos pueden eliminar likes
4. ✅ Habilita RLS en la tabla
5. ✅ Muestra la estructura final

---

## 🔐 **Sobre Seguridad:**

Las políticas actuales son **permisivas** (todos pueden hacer todo) para facilitar el desarrollo. 

En producción, podrías restringirlas a:
```sql
-- Solo autenticados pueden insertar
CREATE POLICY "Solo autenticados dan like"
ON public.likes
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Solo pueden eliminar sus propios likes
CREATE POLICY "Solo eliminar propios likes"
ON public.likes
FOR DELETE
USING (user_id = auth.uid()::text);
```

Pero por ahora, las políticas permisivas funcionan bien.

---

## 📝 **Comandos útiles después del fix:**

### Ver todos los likes:
```sql
SELECT * FROM public.likes ORDER BY created_at DESC;
```

### Ver likes por newsletter:
```sql
SELECT 
    newsletter_id,
    COUNT(*) as total_likes
FROM public.likes
GROUP BY newsletter_id
ORDER BY total_likes DESC;
```

### Ver likes por usuario:
```sql
SELECT 
    user_id,
    COUNT(*) as total_likes_given
FROM public.likes
GROUP BY user_id
ORDER BY total_likes_given DESC;
```

---

## 🚀 **Después de ejecutar el script:**

Las newsletters deberían tener likes funcionando completamente:
- ✅ Dar like
- ✅ Quitar like
- ✅ Ver contador de likes
- ✅ Verificar si ya diste like
- ✅ Persistencia en Supabase

---

**¡Ejecuta el script y los likes funcionarán!** 🎉


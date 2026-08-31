# SQL en uso (Supabase)

**Un solo archivo:** [`supabase/schema.sql`](../supabase/schema.sql)

Ejecútalo en el **SQL Editor** de tu proyecto Supabase. Crea todas las tablas compatibles con el código en una sola pasada:

- newsletters, likes, email_subscriptions, suscripciones_newsletter  
- puma_users, puma_transactions  
- cursos, eventos, registros_comunidad, wallets_conectadas  
- curso_inscripciones, curso_progreso, perfiles_puntos  
- Buckets de Storage (imagenes-publicas, eventos, cursos, newsletter, galerias)

Sin `DROP` ni borrado de datos. Idempotente (puedes volver a ejecutarlo; usa `CREATE IF NOT EXISTS` y `DROP POLICY IF EXISTS` + `CREATE POLICY`).

Documentación detallada: [SQL_ARCHIVOS_EN_USO.md](SQL_ARCHIVOS_EN_USO.md).

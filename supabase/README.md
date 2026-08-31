# Supabase (CriptoUNAM)

Ejecutar en el **SQL Editor** del proyecto, en este orden:

1. [`schema.sql`](schema.sql) — tablas, storage e índices (antes `supabase-schema-unico.sql`)
2. [`rls.sql`](rls.sql) — políticas RLS
3. [`cursos.sql`](cursos.sql) — tablas extra de cursos, si aplica
4. [`hackathon/`](hackathon/) — schema y migraciones del hackathon
   - Tras el schema inicial, aplicar `hackathon-migration-03-tracks-ai-blockchain-innovacion.sql` para los tracks **AI · Blockchain · Innovación**.

Detalle de qué tablas usa el código: [docs/SQL_ARCHIVOS_EN_USO.md](../docs/SQL_ARCHIVOS_EN_USO.md).

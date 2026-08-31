# Uso real de los archivos SQL en CriptoUNAM

El proyecto usa **un solo script SQL** para Supabase: [`supabase/schema.sql`](../supabase/schema.sql) (antes `supabase-schema-unico.sql`).

---

## Tablas que crea el esquema único (y dónde se usan)

| Tabla | Dónde se usa |
|-------|----------------|
| **newsletters** | `supabaseApi`, `likes.service`, `diagnostics`, `NewsletterEntry` |
| **likes** | `likes.service` (user_id = wallet, newsletter_id) |
| **email_subscriptions** | `email.service`, `supabase.ts` |
| **suscripciones_newsletter** | `supabaseApi` |
| **puma_users** | `puma.service` |
| **puma_transactions** | `puma.service` |
| **cursos** | `supabaseApi`, `cursos.service` |
| **eventos** | `supabaseApi` |
| **registros_comunidad** | `supabaseApi` |
| **wallets_conectadas** | `supabaseApi` |
| **curso_inscripciones** | `progresoCurso.service` |
| **curso_progreso** | `progresoCurso.service` |
| **perfiles_puntos** | `progresoCurso.service`, perfil |

Otras tablas que menciona el código pero **no** están en el esquema único (opcionales para ampliar luego): `email_queue`, `email_analytics`, `puma_missions`, `puma_mission_completions`, `users`, `user_profiles`, `lecciones`, `inscripciones_cursos`, `progreso_lecciones`, `certificados`. Si en el futuro necesitas esas funciones, se pueden añadir al mismo script o como migración aparte.

---

## Cómo usar

1. Abre el **SQL Editor** de tu proyecto en [Supabase](https://supabase.com/dashboard).
2. Pega todo el contenido de **`supabase/schema.sql`**.
3. Ejecuta el script.

Con eso quedan creadas todas las tablas y los buckets de Storage. No hace falta ejecutar ningún otro `.sql`.

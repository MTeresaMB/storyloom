Estructura y scripts SQL para StoryLoom. Ejecuta estos archivos en el SQL Editor de Supabase (o usando Supabase CLI) en el orden indicado.
Orden de ejecución:

1. migrations/0001_core_tables.sql
2. migrations/0002_triggers.sql
3. migrations/0003_rls_policies.sql
4. seed/seed_dev.sql (opcional)

Notas:

- Migraciones idempotentes cuando es posible.
- RLS activado con políticas por auth.uid().
- El backend hoy filtra por x-user-id; luego integraremos Auth JWT.

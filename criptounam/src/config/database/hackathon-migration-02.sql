-- ============================================================================
-- Hackathon UNAM — Migración 02: foto de perfil de participantes
-- ----------------------------------------------------------------------------
-- Ejecutar UNA VEZ en el SQL Editor de Supabase, después de la migración 01.
-- Las fotos se suben al bucket 'hackathon' (creado en la migración 01) vía
-- /api/hackathon/upload; aquí solo guardamos la URL pública.
-- ============================================================================

alter table hackathon_participants
  add column if not exists avatar_url varchar(500);

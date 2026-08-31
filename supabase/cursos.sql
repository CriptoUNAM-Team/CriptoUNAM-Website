-- ============================================================
-- CriptoUNAM — Addon al schema oficial: curso_certificados
-- ============================================================
-- Esta tabla NO está en supabase-schema-unico.sql.
-- La usa /api/courses/auto-certificate para idempotencia del mint
-- y src/services/progresoCurso.service para listar el certificado
-- emitido al alumno.
--
-- Correr DESPUÉS de supabase-schema-unico.sql.

CREATE TABLE IF NOT EXISTS public.curso_certificados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  curso_id VARCHAR(50) NOT NULL,
  badge_ref VARCHAR(255) NOT NULL,
  token_id NUMERIC,
  tx_hash VARCHAR(255),
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (wallet_address, badge_ref)
);

CREATE INDEX IF NOT EXISTS idx_curso_certificados_wallet
  ON public.curso_certificados(wallet_address);
CREATE INDEX IF NOT EXISTS idx_curso_certificados_badge
  ON public.curso_certificados(badge_ref);

ALTER TABLE public.curso_certificados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "curso_certificados_select" ON public.curso_certificados;
CREATE POLICY "curso_certificados_select" ON public.curso_certificados
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "curso_certificados_write" ON public.curso_certificados;
CREATE POLICY "curso_certificados_write" ON public.curso_certificados
  FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- CriptoUNAM - Esquema único para Supabase
-- ==========================================
-- Proyecto sin tablas: ejecutar este archivo en Supabase SQL Editor.
-- Crea todas las tablas compatibles con el código (sin DROP, sin borrar datos).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. NEWSLETTERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  contenido TEXT NOT NULL,
  autor VARCHAR(255) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  imagen VARCHAR(500),
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_newsletters_published_at ON public.newsletters(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_like_count ON public.newsletters(like_count DESC);
CREATE INDEX IF NOT EXISTS idx_newsletters_autor ON public.newsletters(autor);
CREATE INDEX IF NOT EXISTS idx_newsletters_tags ON public.newsletters USING GIN (tags);

-- ==========================================
-- 2. LIKES (user_id = wallet address)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  newsletter_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, newsletter_id),
  CONSTRAINT fk_likes_newsletter FOREIGN KEY (newsletter_id) REFERENCES public.newsletters(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_newsletter_id ON public.likes(newsletter_id);

-- ==========================================
-- 3. EMAIL_SUBSCRIPTIONS (email.service, supabase config)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  preferences JSONB DEFAULT '{"notifications": true, "weekly_digest": true, "new_content": true}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  verification_token VARCHAR(255),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON public.email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_is_active ON public.email_subscriptions(is_active);

-- ==========================================
-- 4. SUSCRIPCIONES_NEWSLETTER (supabaseApi)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.suscripciones_newsletter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  fuente VARCHAR(50) DEFAULT 'home',
  activo BOOLEAN DEFAULT true,
  creadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_suscripciones_email ON public.suscripciones_newsletter(email);
CREATE INDEX IF NOT EXISTS idx_suscripciones_activo ON public.suscripciones_newsletter(activo);

-- ==========================================
-- 5. PUMA_USERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.puma_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  balance BIGINT DEFAULT 0,
  total_earned BIGINT DEFAULT 0,
  total_spent BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  experience_points BIGINT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_puma_users_user_id ON public.puma_users(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_users_balance ON public.puma_users(balance DESC);

-- ==========================================
-- 6. PUMA_TRANSACTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.puma_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  amount BIGINT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('earn', 'spend', 'transfer', 'reward')),
  reason VARCHAR(500),
  transaction_hash VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_user_id ON public.puma_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_puma_transactions_created_at ON public.puma_transactions(created_at DESC);

-- ==========================================
-- 7. CURSOS (supabaseApi, compatible con .order('creadoen'))
-- ==========================================
CREATE TABLE IF NOT EXISTS public.cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT NOT NULL,
  nivel VARCHAR(50) NOT NULL CHECK (nivel IN ('Principiante', 'Intermedio', 'Avanzado')),
  duracion VARCHAR(100),
  instructor VARCHAR(255),
  imagen VARCHAR(500),
  enlace VARCHAR(500),
  precio DECIMAL(10, 2) DEFAULT 0,
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_fin TIMESTAMP WITH TIME ZONE,
  cupo INTEGER,
  inscritos INTEGER DEFAULT 0,
  creadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cursos_nivel ON public.cursos(nivel);
CREATE INDEX IF NOT EXISTS idx_cursos_creadoen ON public.cursos(creadoen DESC);

-- ==========================================
-- 8. EVENTOS (supabaseApi, compatible con lugar/creadoen)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('proximo', 'anterior')),
  titulo VARCHAR(500) NOT NULL,
  descripcion TEXT,
  fecha VARCHAR(100) NOT NULL,
  hora VARCHAR(50),
  lugar VARCHAR(500) NOT NULL,
  cupo INTEGER,
  registrados INTEGER DEFAULT 0,
  enlace VARCHAR(500),
  imagen VARCHAR(500),
  imagen_principal VARCHAR(500),
  registro_link VARCHAR(500),
  fotos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  presentaciones TEXT[] DEFAULT '{}',
  creadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON public.eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON public.eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_eventos_creadoen ON public.eventos(creadoen DESC);

-- ==========================================
-- 9. REGISTROS_COMUNIDAD (supabaseApi)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.registros_comunidad (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  carrera VARCHAR(255) NOT NULL,
  plantel VARCHAR(255) NOT NULL,
  numerocuenta VARCHAR(50) NOT NULL,
  edad INTEGER NOT NULL,
  motivacion TEXT NOT NULL,
  twitter VARCHAR(255),
  instagram VARCHAR(255),
  linkedin VARCHAR(255),
  facebook VARCHAR(255),
  telegram VARCHAR(255),
  creadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_registros_creadoen ON public.registros_comunidad(creadoen);
CREATE INDEX IF NOT EXISTS idx_registros_plantel ON public.registros_comunidad(plantel);

-- ==========================================
-- 10. WALLETS_CONECTADAS (supabaseApi)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.wallets_conectadas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address VARCHAR(42) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  conectadoen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON public.wallets_conectadas(address);
CREATE INDEX IF NOT EXISTS idx_wallets_conectadoen ON public.wallets_conectadas(conectadoen DESC);

-- ==========================================
-- 11. CURSO_INSCRIPCIONES (progresoCurso.service)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.curso_inscripciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  curso_id VARCHAR(50) NOT NULL,
  inscrito_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nombre_completo VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, curso_id)
);
CREATE INDEX IF NOT EXISTS idx_curso_inscripciones_wallet ON public.curso_inscripciones(wallet_address);
CREATE INDEX IF NOT EXISTS idx_curso_inscripciones_curso ON public.curso_inscripciones(curso_id);

-- ==========================================
-- 12. CURSO_PROGRESO (progresoCurso.service)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.curso_progreso (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address VARCHAR(255) NOT NULL,
  curso_id VARCHAR(50) NOT NULL,
  leccion_index INTEGER NOT NULL,
  completado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, curso_id, leccion_index)
);
CREATE INDEX IF NOT EXISTS idx_curso_progreso_wallet ON public.curso_progreso(wallet_address);
CREATE INDEX IF NOT EXISTS idx_curso_progreso_curso ON public.curso_progreso(curso_id);

-- ==========================================
-- 13. PERFILES_PUNTOS (progresoCurso.service, perfil)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.perfiles_puntos (
  wallet_address VARCHAR(255) PRIMARY KEY,
  puntos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_actualizadoen_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizadoen = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_newsletter_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.newsletters SET like_count = like_count + 1 WHERE id = NEW.newsletter_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_newsletter_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.newsletters SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.newsletter_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_newsletters_updated_at ON public.newsletters;
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_subscriptions_updated_at ON public.email_subscriptions;
CREATE TRIGGER update_email_subscriptions_updated_at BEFORE UPDATE ON public.email_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_puma_users_updated_at ON public.puma_users;
CREATE TRIGGER update_puma_users_updated_at BEFORE UPDATE ON public.puma_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cursos_actualizadoen ON public.cursos;
CREATE TRIGGER update_cursos_actualizadoen BEFORE UPDATE ON public.cursos
  FOR EACH ROW EXECUTE FUNCTION update_actualizadoen_column();

DROP TRIGGER IF EXISTS update_eventos_actualizadoen ON public.eventos;
CREATE TRIGGER update_eventos_actualizadoen BEFORE UPDATE ON public.eventos
  FOR EACH ROW EXECUTE FUNCTION update_actualizadoen_column();

DROP TRIGGER IF EXISTS on_like_added ON public.likes;
CREATE TRIGGER on_like_added AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION increment_newsletter_likes();

DROP TRIGGER IF EXISTS on_like_removed ON public.likes;
CREATE TRIGGER on_like_removed AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION decrement_newsletter_likes();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suscripciones_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puma_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puma_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_comunidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets_conectadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curso_inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curso_progreso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_puntos ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura pública y escritura (idempotente con DROP IF EXISTS)
DROP POLICY IF EXISTS "newsletters_select" ON public.newsletters;
CREATE POLICY "newsletters_select" ON public.newsletters FOR SELECT USING (true);
DROP POLICY IF EXISTS "likes_select" ON public.likes;
DROP POLICY IF EXISTS "likes_insert" ON public.likes;
DROP POLICY IF EXISTS "likes_delete" ON public.likes;
CREATE POLICY "likes_select" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "likes_delete" ON public.likes FOR DELETE USING (true);
DROP POLICY IF EXISTS "email_subscriptions_all" ON public.email_subscriptions;
CREATE POLICY "email_subscriptions_all" ON public.email_subscriptions FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "suscripciones_select" ON public.suscripciones_newsletter;
DROP POLICY IF EXISTS "suscripciones_insert" ON public.suscripciones_newsletter;
CREATE POLICY "suscripciones_select" ON public.suscripciones_newsletter FOR SELECT USING (true);
CREATE POLICY "suscripciones_insert" ON public.suscripciones_newsletter FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "puma_select" ON public.puma_users;
DROP POLICY IF EXISTS "puma_insert" ON public.puma_users;
DROP POLICY IF EXISTS "puma_update" ON public.puma_users;
CREATE POLICY "puma_select" ON public.puma_users FOR SELECT USING (true);
CREATE POLICY "puma_insert" ON public.puma_users FOR INSERT WITH CHECK (true);
CREATE POLICY "puma_update" ON public.puma_users FOR UPDATE USING (true);
DROP POLICY IF EXISTS "puma_tx_all" ON public.puma_transactions;
CREATE POLICY "puma_tx_all" ON public.puma_transactions FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "cursos_select" ON public.cursos;
DROP POLICY IF EXISTS "cursos_all" ON public.cursos;
CREATE POLICY "cursos_select" ON public.cursos FOR SELECT USING (true);
CREATE POLICY "cursos_all" ON public.cursos FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "eventos_select" ON public.eventos;
DROP POLICY IF EXISTS "eventos_all" ON public.eventos;
CREATE POLICY "eventos_select" ON public.eventos FOR SELECT USING (true);
CREATE POLICY "eventos_all" ON public.eventos FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "registros_select" ON public.registros_comunidad;
DROP POLICY IF EXISTS "registros_insert" ON public.registros_comunidad;
CREATE POLICY "registros_select" ON public.registros_comunidad FOR SELECT USING (true);
CREATE POLICY "registros_insert" ON public.registros_comunidad FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "wallets_select" ON public.wallets_conectadas;
DROP POLICY IF EXISTS "wallets_insert" ON public.wallets_conectadas;
CREATE POLICY "wallets_select" ON public.wallets_conectadas FOR SELECT USING (true);
CREATE POLICY "wallets_insert" ON public.wallets_conectadas FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "curso_inscripciones_all" ON public.curso_inscripciones;
CREATE POLICY "curso_inscripciones_all" ON public.curso_inscripciones FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "curso_progreso_all" ON public.curso_progreso;
CREATE POLICY "curso_progreso_all" ON public.curso_progreso FOR ALL USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "perfiles_puntos_all" ON public.perfiles_puntos;
CREATE POLICY "perfiles_puntos_all" ON public.perfiles_puntos FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- STORAGE (buckets) - opcional: si falla, crear buckets desde el dashboard
-- ==========================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('imagenes-publicas', 'imagenes-publicas', true),
  ('eventos', 'eventos', true),
  ('cursos', 'cursos', true),
  ('newsletter', 'newsletter', true),
  ('galerias', 'galerias', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage (ejecutar si storage.objects existe)
DROP POLICY IF EXISTS "Permitir lectura pública de imagenes-publicas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida de imagenes-publicas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización de imagenes-publicas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación de imagenes-publicas" ON storage.objects;
CREATE POLICY "Permitir lectura pública de imagenes-publicas" ON storage.objects FOR SELECT USING (bucket_id = 'imagenes-publicas');
CREATE POLICY "Permitir subida de imagenes-publicas" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'imagenes-publicas');
CREATE POLICY "Permitir actualización de imagenes-publicas" ON storage.objects FOR UPDATE USING (bucket_id = 'imagenes-publicas');
CREATE POLICY "Permitir eliminación de imagenes-publicas" ON storage.objects FOR DELETE USING (bucket_id = 'imagenes-publicas');

DROP POLICY IF EXISTS "Permitir lectura pública de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización de eventos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación de eventos" ON storage.objects;
CREATE POLICY "Permitir lectura pública de eventos" ON storage.objects FOR SELECT USING (bucket_id = 'eventos');
CREATE POLICY "Permitir subida de eventos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'eventos');
CREATE POLICY "Permitir actualización de eventos" ON storage.objects FOR UPDATE USING (bucket_id = 'eventos');
CREATE POLICY "Permitir eliminación de eventos" ON storage.objects FOR DELETE USING (bucket_id = 'eventos');

DROP POLICY IF EXISTS "Permitir lectura pública de cursos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida de cursos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización de cursos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación de cursos" ON storage.objects;
CREATE POLICY "Permitir lectura pública de cursos" ON storage.objects FOR SELECT USING (bucket_id = 'cursos');
CREATE POLICY "Permitir subida de cursos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cursos');
CREATE POLICY "Permitir actualización de cursos" ON storage.objects FOR UPDATE USING (bucket_id = 'cursos');
CREATE POLICY "Permitir eliminación de cursos" ON storage.objects FOR DELETE USING (bucket_id = 'cursos');

DROP POLICY IF EXISTS "Permitir lectura pública de newsletter" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida de newsletter" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización de newsletter" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación de newsletter" ON storage.objects;
CREATE POLICY "Permitir lectura pública de newsletter" ON storage.objects FOR SELECT USING (bucket_id = 'newsletter');
CREATE POLICY "Permitir subida de newsletter" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'newsletter');
CREATE POLICY "Permitir actualización de newsletter" ON storage.objects FOR UPDATE USING (bucket_id = 'newsletter');
CREATE POLICY "Permitir eliminación de newsletter" ON storage.objects FOR DELETE USING (bucket_id = 'newsletter');

DROP POLICY IF EXISTS "Permitir lectura pública de galerias" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida de galerias" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización de galerias" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación de galerias" ON storage.objects;
CREATE POLICY "Permitir lectura pública de galerias" ON storage.objects FOR SELECT USING (bucket_id = 'galerias');
CREATE POLICY "Permitir subida de galerias" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'galerias');
CREATE POLICY "Permitir actualización de galerias" ON storage.objects FOR UPDATE USING (bucket_id = 'galerias');
CREATE POLICY "Permitir eliminación de galerias" ON storage.objects FOR DELETE USING (bucket_id = 'galerias');

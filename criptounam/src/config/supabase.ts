// Configuración de Supabase
import { createClient } from '@supabase/supabase-js'
import { ENV_CONFIG } from './env'

// Validar configuración de Supabase
const supabaseUrl = ENV_CONFIG.SUPABASE_URL
const supabaseAnonKey = ENV_CONFIG.SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.warn('⚠️ SUPABASE_URL no está configurada. La aplicación funcionará en modo offline.')
}

if (!supabaseAnonKey) {
  console.warn('⚠️ SUPABASE_ANON_KEY no está configurada. La aplicación funcionará en modo offline.')
}

// Cliente de Supabase (solo si las credenciales están disponibles)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Configuración de tablas
export const TABLES = {
  EMAIL_SUBSCRIPTIONS: 'email_subscriptions',
  EMAIL_QUEUE: 'email_queue',
  EMAIL_ANALYTICS: 'email_analytics',
  LIKES: 'likes',
  NEWSLETTERS: 'newsletters',
  PUMA_USERS: 'puma_users',
  PUMA_TRANSACTIONS: 'puma_transactions',
  PUMA_MISSIONS: 'puma_missions',
  PUMA_MISSION_COMPLETIONS: 'puma_mission_completions',
  USERS: 'users',
  // Tablas de cursos
  CURSOS: 'cursos',
  MODULOS: 'modulos',
  LECCIONES: 'lecciones',
  INSCRIPCIONES_CURSOS: 'inscripciones_cursos',
  PROGRESO_LECCIONES: 'progreso_lecciones',
  CERTIFICADOS: 'certificados',
  // Tablas de eventos
  EVENTOS: 'eventos',
  // Tablas del Hackathon
  HACKATHONS: 'hackathons',
  HACKATHON_TRACKS: 'hackathon_tracks',
  HACKATHON_PARTICIPANTS: 'hackathon_participants',
  HACKATHON_TEAMS: 'hackathon_teams',
  HACKATHON_TEAM_MEMBERS: 'hackathon_team_members',
  HACKATHON_PROJECTS: 'hackathon_projects',
  HACKATHON_QUESTIONS: 'hackathon_questions',
  HACKATHON_ANSWERS: 'hackathon_answers',
  HACKATHON_SCORES: 'hackathon_scores'
} as const

// Esquemas de base de datos
export const DATABASE_SCHEMAS = {
  // Tabla de suscripciones de email
  EMAIL_SUBSCRIPTIONS: `
    CREATE TABLE IF NOT EXISTS email_subscriptions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      preferences JSONB DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      unsubscribed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Tabla de cola de emails
  EMAIL_QUEUE: `
    CREATE TABLE IF NOT EXISTS email_queue (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      to_email VARCHAR(255) NOT NULL,
      template_id VARCHAR(255),
      subject VARCHAR(500),
      html_content TEXT,
      text_content TEXT,
      variables JSONB DEFAULT '{}',
      status VARCHAR(50) DEFAULT 'pending',
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 3,
      scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      sent_at TIMESTAMP WITH TIME ZONE,
      error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Tabla de analytics de emails
  EMAIL_ANALYTICS: `
    CREATE TABLE IF NOT EXISTS email_analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email_id UUID NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      metadata JSONB DEFAULT '{}',
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      user_agent TEXT,
      ip_address INET
    );
  `,

  // Tabla de likes
  LIKES: `
    CREATE TABLE IF NOT EXISTS likes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      newsletter_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, newsletter_id)
    );
  `,

  // Tabla de newsletters
  NEWSLETTERS: `
    CREATE TABLE IF NOT EXISTS newsletters (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      author VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      tags TEXT[],
      featured_image VARCHAR(500),
      like_count INTEGER DEFAULT 0,
      view_count INTEGER DEFAULT 0,
      published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Tabla de usuarios PUMA
  PUMA_USERS: `
    CREATE TABLE IF NOT EXISTS puma_users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      balance BIGINT DEFAULT 0,
      total_earned BIGINT DEFAULT 0,
      total_spent BIGINT DEFAULT 0,
      level INTEGER DEFAULT 1,
      badges TEXT[] DEFAULT '{}',
      experience_points BIGINT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Tabla de transacciones PUMA
  PUMA_TRANSACTIONS: `
    CREATE TABLE IF NOT EXISTS puma_transactions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      amount BIGINT NOT NULL,
      description TEXT,
      category VARCHAR(100),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Tabla de misiones PUMA
  PUMA_MISSIONS: `
    CREATE TABLE IF NOT EXISTS puma_missions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      reward BIGINT NOT NULL,
      requirements JSONB DEFAULT '{}',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `,

  // Tabla de completado de misiones
  PUMA_MISSION_COMPLETIONS: `
    CREATE TABLE IF NOT EXISTS puma_mission_completions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      mission_id UUID NOT NULL REFERENCES puma_missions(id),
      completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, mission_id)
    );
  `,

  // Tabla de usuarios
  USERS: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      wallet_address VARCHAR(255) UNIQUE,
      username VARCHAR(255),
      email VARCHAR(255),
      avatar VARCHAR(500),
      bio TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
} as const

// Funciones de utilidad para Supabase
export class SupabaseUtils {
  // Inicializar base de datos
  static async initializeDatabase(): Promise<boolean> {
    if (!supabase) {
      console.warn('⚠️ Supabase no está configurado. Saltando inicialización de base de datos.')
      return false
    }

    try {
      console.log('Inicializando base de datos Supabase...')
      
      // Ejecutar esquemas
      for (const [tableName, schema] of Object.entries(DATABASE_SCHEMAS)) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: schema })
          if (error) {
            console.error(`Error creando tabla ${tableName}:`, error)
          } else {
            console.log(`✅ Tabla ${tableName} creada/verificada`)
          }
        } catch (err) {
          console.error(`Error ejecutando esquema para ${tableName}:`, err)
        }
      }

      // Crear índices
      await this.createIndexes()
      
      console.log('✅ Base de datos inicializada correctamente')
      return true
    } catch (error) {
      console.error('❌ Error inicializando base de datos:', error)
      return false
    }
  }

  // Crear índices para optimizar consultas
  static async createIndexes(): Promise<void> {
    if (!supabase) {
      console.warn('⚠️ Supabase no está configurado. Saltando creación de índices.')
      return
    }

    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);',
      'CREATE INDEX IF NOT EXISTS idx_email_subscriptions_active ON email_subscriptions(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);',
      'CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_likes_newsletter_id ON likes(newsletter_id);',
      'CREATE INDEX IF NOT EXISTS idx_puma_users_user_id ON puma_users(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_puma_transactions_user_id ON puma_transactions(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_puma_transactions_created_at ON puma_transactions(created_at);',
      'CREATE INDEX IF NOT EXISTS idx_newsletters_published_at ON newsletters(published_at);',
      'CREATE INDEX IF NOT EXISTS idx_newsletters_like_count ON newsletters(like_count);'
    ]

    for (const indexQuery of indexes) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: indexQuery })
        if (error) {
          console.error('Error creando índice:', error)
        }
      } catch (err) {
        console.error('Error ejecutando índice:', err)
      }
    }
  }

  // Verificar conexión
  static async testConnection(): Promise<boolean> {
    if (!supabase) {
      console.warn('⚠️ Supabase no está configurado. No se puede probar la conexión.')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('count')
        .limit(1)

  if (error) {
        console.error('Error probando conexión:', error)
        return false
      }

      console.log('✅ Conexión a Supabase exitosa')
      return true
    } catch (error) {
      console.error('❌ Error de conexión a Supabase:', error)
      return false
    }
  }

  // Obtener estadísticas de la base de datos
  static async getDatabaseStats(): Promise<any> {
    if (!supabase) {
      console.warn('⚠️ Supabase no está configurado. No se pueden obtener estadísticas.')
      return {}
    }

    try {
      const stats = {}
      
      for (const tableName of Object.values(TABLES)) {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        if (!error) {
          stats[tableName] = count || 0
        }
      }

      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      return {}
    }
  }
}

export default supabase
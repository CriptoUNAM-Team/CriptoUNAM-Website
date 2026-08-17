import { supabase } from './supabase'
import { apiFetch } from '../services/apiClient'

// Tipos locales
export interface Evento {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  lugar: string
  imagen: string
  enlace: string
  created_at: string
  tipo?: string
  cupo?: number
  hora?: string
  registrolink?: string
  imagenPrincipal?: string
  fotos?: string[]
  videos?: string[]
  presentaciones?: string[]
}

export interface Curso {
  id: string
  titulo: string
  descripcion: string
  nivel: string
  duracion: string
  imagen: string
  enlace: string
  created_at: string
  instructor?: string
  precio?: number
  fechaInicio?: string
  fechaFin?: string
  cupo?: number
}

export interface NewsletterEntry {
  id: string
  titulo: string
  contenido: string
  autor: string
  fecha: string
  imagen: string
  created_at: string
  tags?: string[]
}

// Funciones de utilidad
export const uploadImageToSupabase = async (file: File): Promise<string> => {
  // Implementación simplificada
  return 'placeholder-image-url'
}

export const uploadMultipleImagesToSupabase = async (files: File[]): Promise<string[]> => {
  // Implementación simplificada
  return files.map(() => 'placeholder-image-url')
}

// API para Eventos
export const eventosApi = {
  // Obtener todos los eventos
  async getAll(): Promise<Evento[]> {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Obtener evento por ID
  async getById(id: string): Promise<Evento | null> {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Crear evento
  async create(evento: Omit<Evento, 'id' | 'created_at'>): Promise<Evento> {
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Actualizar evento
  async update(id: string, evento: Partial<Evento>): Promise<Evento> {
    const { data, error } = await supabase
      .from('eventos')
      .update(evento)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar evento
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Subir imagen de evento
  async uploadEventImage(file: File): Promise<string> {
    return uploadImageToSupabase(file)
  },

  // Subir múltiples imágenes
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    return uploadMultipleImagesToSupabase(files)
  }
}

// API para Cursos
export const cursosApi = {
  async getAll(): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Curso | null> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(curso: Omit<Curso, 'id' | 'created_at'>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .insert([curso])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, curso: Partial<Curso>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .update(curso)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadCourseImage(file: File): Promise<string> {
    return uploadImageToSupabase(file)
  }
}

// API para Newsletter
export const newsletterApi = {
  async getAll(): Promise<NewsletterEntry[]> {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<NewsletterEntry | null> {
    const { data, error } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(entry: Omit<NewsletterEntry, 'id' | 'created_at'>): Promise<NewsletterEntry> {
    const { data, error } = await supabase
      .from('newsletters')
      .insert([entry])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, entry: Partial<NewsletterEntry>): Promise<NewsletterEntry> {
    const { data, error } = await supabase
      .from('newsletters')
      .update(entry)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('newsletters')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadNewsletterImage(file: File): Promise<string> {
    return uploadImageToSupabase(file)
  }
}

// API para suscripciones de newsletter
export const suscripcionesApi = {
  create: async (email: string, source: string = 'website'): Promise<void> => {
    console.log('📧 suscripcionesApi.create iniciado:', { email, source });
    // Solo usar campos que sabemos que existen, dejar que Supabase maneje el timestamp automáticamente
    const dataToInsert = { email, fuente: source };
    console.log('📊 Datos a insertar en suscripciones_newsletter:', dataToInsert);
    
    const { error } = await supabase
      .from('suscripciones_newsletter')
      .insert([dataToInsert])
    
    if (error) {
      console.error('❌ Error en suscripcionesApi.create:', error);
      throw error;
    }
    console.log('✅ Suscripción creada exitosamente en Supabase');
  },

  /**
   * Listado para el panel de admin. Pasa por `/api/admin/lists` porque la
   * tabla dejó de ser de lectura pública: con la anon key (que viaja en el
   * bundle) cualquiera podía descargarse los correos de los suscriptores.
   */
  getAll: async () => {
    const { items } = await apiFetch<{ items: any[] }>('/admin/lists', {
      query: { list: 'suscripciones' },
    })
    return items
  }
}

// API para registros de comunidad
export const registrosComunidadApi = {
  create: async (datos: {
    nombre: string
    apellidos: string
    carrera: string
    plantel: string
    numeroCuenta: string
    edad: number
    motivacion: string
    twitter?: string
    instagram?: string
    linkedin?: string
    facebook?: string
    telegram?: string
  }): Promise<void> => {
    console.log('🎓 registrosComunidadApi.create iniciado con datos:', datos);
    
    // Mapear todos los campos usando los nombres exactos de la tabla en Supabase
    const dataToInsert = {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      carrera: datos.carrera,
      plantel: datos.plantel,
      numerocuenta: datos.numeroCuenta, // Usar el nombre exacto de la columna
      edad: datos.edad,
      motivacion: datos.motivacion,
      twitter: datos.twitter || null,
      instagram: datos.instagram || null,
      linkedin: datos.linkedin || null,
      facebook: datos.facebook || null,
      telegram: datos.telegram || null
    };
    
    console.log('📊 Datos a insertar en registros_comunidad (todos los campos):', dataToInsert);
    
    const { error } = await supabase
      .from('registros_comunidad')
      .insert([dataToInsert])
    
    if (error) {
      console.error('❌ Error en registrosComunidadApi.create:', error);
      throw error;
    }
    console.log('✅ Registro de comunidad creado exitosamente en Supabase');
  },

  /** Listado para admins (datos personales): ver nota en suscripcionesApi. */
  getAll: async () => {
    const { items } = await apiFetch<{ items: any[] }>('/admin/lists', {
      query: { list: 'registros' },
    })
    return items
  }
}

// API para wallets conectadas
export const walletsApi = {
  create: async (datos: {
    address: string
    provider: string
    chainId?: string
    timestamp: string
  }): Promise<void> => {
    const { error } = await supabase
      .from('wallets_conectadas')
      .insert([{
        address: datos.address,
        provider: datos.provider,
        conectadoen: datos.timestamp
      }])
    
    if (error) throw error
  },

  /** Listado para admins: ver nota en suscripcionesApi. */
  getAll: async () => {
    const { items } = await apiFetch<{ items: any[] }>('/admin/lists', {
      query: { list: 'wallets' },
    })
    return items
  }
}

// Los tipos ya están exportados arriba, no necesitamos re-exportarlos

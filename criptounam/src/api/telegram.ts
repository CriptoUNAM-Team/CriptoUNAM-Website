import axios from 'axios'
import { getUserAnalytics, formatUserInfoForTelegram, UserAnalytics } from '../utils/userAnalytics'
import { suscripcionesApi, registrosComunidadApi, walletsApi } from '../config/supabaseApi'

interface RegistrationData {
  nombre: string
  apellidos: string
  carrera: string
  plantel: string
  numeroCuenta: string
  edad: string
  motivacion: string
  twitter: string
  instagram: string
  linkedin: string
  facebook: string
  telegram: string
}

interface TelegramResponse {
  ok: boolean;
  result?: any;
  description?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export const sendTelegramMessage = async (message: string, chatId: string): Promise<ApiResponse> => {
  try {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN?.trim()
    const defaultChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID?.trim()

    if (!botToken) {
      console.warn('VITE_TELEGRAM_BOT_TOKEN no configurado; no se envía a Telegram.')
      return { success: false, message: 'Telegram no configurado' }
    }

    const finalChatId = chatId || defaultChatId || ''
    if (!finalChatId) {
      return { success: false, message: 'Falta chat_id de Telegram' }
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`

    // Validación de la URL
    if (!url.startsWith('https://api.telegram.org/bot')) {
      console.error('Error: URL de Telegram inválida');
      return { success: false, message: 'Error de configuración: URL inválida' };
    }

    // Validación del mensaje
    if (!message || message.trim().length === 0) {
      console.error('Error: Mensaje vacío');
      return { success: false, message: 'Error: El mensaje no puede estar vacío' };
    }

    const response = await axios.post<TelegramResponse>(
      url,
      {
        chat_id: finalChatId,
        text: message,
        parse_mode: 'HTML'
      },
      {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.ok) {
      return { success: true, message: 'Mensaje enviado correctamente' };
    } else {
      return { 
        success: false, 
        message: response.data.description || 'Error al enviar el mensaje a Telegram' 
      };
    }
  } catch (error: any) {
    if (error.response) {
      // Error de respuesta HTTP
      const errorMessage = error.response?.data?.description || error.message || 'Error de respuesta del servidor';
      return { 
        success: false, 
        message: `Error al enviar el mensaje: ${errorMessage}` 
      };
    }
    return { 
      success: false, 
      message: 'Error inesperado al enviar el mensaje' 
    };
  }
};

export const handleRegistration = async (data: RegistrationData): Promise<ApiResponse> => {
  try {
    console.log('🎓 handleRegistration iniciado con datos:', data);
    
    // Guardar en Supabase primero
    console.log('💾 Guardando registro en Supabase...');
    const registroData = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      carrera: data.carrera,
      plantel: data.plantel,
      numeroCuenta: data.numeroCuenta,
      edad: parseInt(data.edad),
      motivacion: data.motivacion,
      twitter: data.twitter,
      instagram: data.instagram,
      linkedin: data.linkedin,
      facebook: data.facebook,
      telegram: data.telegram
    };
    console.log('📊 Datos a enviar a Supabase:', registroData);
    
    await registrosComunidadApi.create(registroData);
    console.log('✅ Registro guardado en Supabase exitosamente');
    
    // Obtener información detallada del usuario
    const analytics = await getUserAnalytics();
    const userInfo = formatUserInfoForTelegram(analytics);
    
    const mensaje = `🎓 **Nuevo Registro en CriptoUNAM** 🎓

👤 **Información Personal**
• 👨‍🎓 **Nombre:** ${data.nombre} ${data.apellidos}
• 📅 **Edad:** ${data.edad}
• 🏛️ **Carrera:** ${data.carrera} (${data.plantel})
• 🔢 **Número de Cuenta:** ${data.numeroCuenta}
• 📱 **Telegram:** ${data.telegram}

💭 **Motivación**
${data.motivacion}

🔗 **Redes Sociales**
• 🐦 **Twitter:** ${data.twitter || 'No proporcionado'}
• 📸 **Instagram:** ${data.instagram || 'No proporcionado'}
• 💼 **LinkedIn:** ${data.linkedin || 'No proporcionado'}
• 👍 **Facebook:** ${data.facebook || 'No proporcionado'}

📊 **Información del Usuario:**
${userInfo}`;

    return await sendTelegramMessage(mensaje, import.meta.env.VITE_TELEGRAM_CHAT_ID);
  } catch (error) {
    console.error('Error obteniendo analytics del usuario:', error);
    // Fallback a mensaje simple si hay error
    const mensaje = `🎓 **Nuevo Registro en CriptoUNAM** 🎓

👤 **Información Personal**
• 👨‍🎓 **Nombre:** ${data.nombre} ${data.apellidos}
• 📅 **Edad:** ${data.edad}
• 🏛️ **Carrera:** ${data.carrera} (${data.plantel})
• 🔢 **Número de Cuenta:** ${data.numeroCuenta}
• 📱 **Telegram:** ${data.telegram}

💭 **Motivación**
${data.motivacion}

🔗 **Redes Sociales**
• 🐦 **Twitter:** ${data.twitter || 'No proporcionado'}
• 📸 **Instagram:** ${data.instagram || 'No proporcionado'}
• 💼 **LinkedIn:** ${data.linkedin || 'No proporcionado'}
• 👍 **Facebook:** ${data.facebook || 'No proporcionado'}`;
    return await sendTelegramMessage(mensaje, import.meta.env.VITE_TELEGRAM_CHAT_ID);
  }
}

export const handleNewsletterSubscription = async (email: string, source: 'home' | 'newsletter' = 'newsletter'): Promise<ApiResponse> => {
  try {
    console.log('📧 handleNewsletterSubscription iniciado:', { email, source });
    
    // Guardar en Supabase (base de datos)
    console.log('💾 Guardando suscripción en Supabase...');
    await suscripcionesApi.create(email, source);
    console.log('✅ Suscripción guardada en Supabase exitosamente');
    
    return { success: true, message: '¡Suscripción guardada exitosamente!' };
  } catch (error) {
    console.error('❌ Error al guardar suscripción en base de datos:', error);
    const msg = error instanceof Error ? error.message : 'Error al guardar la suscripción en base de datos';
    return { success: false, message: msg };
  }
}

export const handleWalletNotification = async (address: string, provider: string): Promise<ApiResponse> => {
  try {
    console.log('🔐 handleWalletNotification iniciado:', { address, provider });
    
    // Guardar en Supabase primero
    console.log('💾 Guardando wallet en Supabase...');
    await walletsApi.create({
      address,
      provider,
      timestamp: new Date().toISOString()
    });
    console.log('✅ Wallet guardada en Supabase exitosamente');
    
    // Obtener información detallada del usuario
    console.log('📊 Obteniendo analytics del usuario...');
    const analytics = await getUserAnalytics(address, provider);
    const userInfo = formatUserInfoForTelegram(analytics);
    console.log('📊 Analytics obtenidos:', analytics);
    
    const message = `🔐 **Nueva Wallet Conectada**
-----------------------------
💰 **Dirección:** \`${address}\`
🔧 **Proveedor:** ${provider}

📊 **Información del Usuario:**
${userInfo}
-----------------------------`;

    console.log('📱 Enviando mensaje a Telegram...');
    const result = await sendTelegramMessage(message, import.meta.env.VITE_TELEGRAM_CHAT_ID);
    console.log('📱 Resultado de Telegram:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en handleWalletNotification:', error);
    // Fallback a mensaje simple si hay error
    const message = `🔐 **Nueva Wallet Conectada**
-----------------------------
💰 **Dirección:** \`${address}\`
🔧 **Proveedor:** ${provider}
⏰ **Fecha:** ${new Date().toLocaleString()}
-----------------------------`;
    console.log('📱 Enviando mensaje de fallback a Telegram...');
    return await sendTelegramMessage(message, import.meta.env.VITE_TELEGRAM_CHAT_ID);
  }
} 
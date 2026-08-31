# 🚀 Instrucciones de Configuración - CriptoUNAM

## ⚠️ IMPORTANTE: Newsletter sin datos

Las newsletters no se muestran porque **Supabase no está configurado**. La aplicación funciona en "modo offline" actualmente.

---

## 📋 Configuración Paso a Paso

### 1. 🗄️ Configurar Supabase (URGENTE - Necesario para Newsletters)

#### 1.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Guarda la URL y la ANON KEY

#### 1.2 Ejecutar esquemas SQL
Copia y ejecuta estos comandos en el SQL Editor de Supabase:

```sql
-- Tabla de newsletters
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(500) NOT NULL,
  contenido TEXT NOT NULL,
  autor VARCHAR(255) NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  imagen VARCHAR(500),
  tags TEXT[],
  like_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de likes
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  newsletter_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, newsletter_id)
);

-- Tabla de suscripciones de email
CREATE TABLE IF NOT EXISTS email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  preferences JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios PUMA
CREATE TABLE IF NOT EXISTS puma_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  balance BIGINT DEFAULT 0,
  total_earned BIGINT DEFAULT 0,
  total_spent BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  badges TEXT[] DEFAULT '{}',
  experience_points BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_newsletter_id ON likes(newsletter_id);
CREATE INDEX IF NOT EXISTS idx_newsletters_published_at ON newsletters(published_at);
CREATE INDEX IF NOT EXISTS idx_newsletters_like_count ON newsletters(like_count);
```

#### 1.3 Insertar newsletters de ejemplo
```sql
INSERT INTO newsletters (titulo, contenido, autor, imagen, tags) VALUES
('Bitcoin: El Futuro del Dinero Digital', 
 'Bitcoin ha revolucionado el mundo financiero desde su creación en 2009. Aprende sobre su tecnología, adopción y futuro.', 
 'CriptoUNAM Team',
 'https://example.com/bitcoin.jpg',
 ARRAY['bitcoin', 'blockchain', 'finanzas']),
 
('Ethereum y los Contratos Inteligentes',
 'Descubre cómo Ethereum está transformando las aplicaciones descentralizadas con contratos inteligentes.',
 'Dr. Juan Pérez',
 'https://example.com/ethereum.jpg',
 ARRAY['ethereum', 'smart-contracts', 'defi']),
 
('DeFi: La Revolución de las Finanzas Descentralizadas',
 'Las finanzas descentralizadas están democratizando el acceso a servicios financieros en todo el mundo.',
 'María González',
 'https://example.com/defi.jpg',
 ARRAY['defi', 'finanzas', 'descentralización']);
```

#### 1.4 Configurar variables de entorno en Vercel
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. 📧 Configurar Resend (Emails Automáticos)

#### 2.1 Crear cuenta en Resend
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta
3. Obtén tu API key

#### 2.2 Configurar en Vercel
```env
RESEND_API_KEY=tu_clave_de_resend_desde_el_dashboard
RESEND_FROM_EMAIL=noreply@criptounam.com
```

#### 2.3 Configurar dominio personalizado (Opcional)
Si tienes un dominio, agrega estos registros DNS:

**DKIM Record:**
```
Tipo: TXT
Nombre: resend._domainkey.criptounam.com
Valor: [obtenlo desde Resend Dashboard]
```

**SPF Record:**
```
Tipo: TXT
Nombre: criptounam.com
Valor: v=spf1 include:resend.com ~all
```

**DMARC Record:**
```
Tipo: TXT
Nombre: _dmarc.criptounam.com
Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc@resend.com
```

---

### 3. 💰 Configurar Sistema PUMA (Opcional - Para Tokens Reales)

#### 3.1 Desplegar contrato inteligente
El contrato está en: `criptounam-contracts/contracts/PUMAToken.sol`

```bash
# Instalar dependencias
npm install hardhat @openzeppelin/contracts

# Compilar contrato
npx hardhat compile

# Desplegar (configura tu red primero)
npx hardhat run scripts/deploy.js --network mainnet
```

#### 3.2 Configurar variables de entorno
```env
VITE_PUMA_TOKEN_ADDRESS=0x1234567890abcdef...
VITE_CHAIN_ID=1
VITE_RPC_URL=https://mainnet.infura.io/v3/tu-infura-id
```

---

### 4. 🔐 Otras Configuraciones Opcionales

#### Analytics y Monitoreo
```env
VITE_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### Configuración de Blockchain
```env
VITE_INFURA_ID=tu_infura_id
VITE_NETWORK=mainnet
```

---

## ✅ Checklist de Configuración

### Configuración Mínima (Para que funcione)
- [ ] Crear proyecto en Supabase
- [ ] Ejecutar esquemas SQL en Supabase
- [ ] Insertar newsletters de ejemplo
- [ ] Agregar VITE_SUPABASE_URL en Vercel
- [ ] Agregar VITE_SUPABASE_ANON_KEY en Vercel
- [ ] Hacer redeploy en Vercel

### Configuración Completa (Todas las funcionalidades)
- [ ] Configurar Resend para emails
- [ ] Configurar dominio DNS para emails
- [ ] Desplegar contrato PUMA
- [ ] Configurar variables de blockchain
- [ ] Configurar analytics
- [ ] Configurar monitoreo de errores

---

## 🐛 Solución de Problemas

### Las newsletters no se muestran
**Causa**: Supabase no configurado
**Solución**: Sigue los pasos 1.1 a 1.4

### Error: "supabaseUrl is required"
**Causa**: Variables de entorno no configuradas
**Solución**: Agrega las variables en Vercel → Settings → Environment Variables

### Los emails no se envían
**Causa**: Resend no configurado
**Solución**: Agrega RESEND_API_KEY en variables de entorno

### Los tokens PUMA no funcionan
**Causa**: Contrato no desplegado
**Solución**: El sistema PUMA funciona con datos mock por ahora. Para tokens reales, despliega el contrato.

---

## 📞 Contacto y Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que las tablas de Supabase existan

---

## 🎉 Una vez configurado

Después de configurar Supabase:
1. Las newsletters se mostrarán automáticamente
2. Los usuarios podrán dar likes
3. Las suscripciones funcionarán
4. El sistema PUMA mostrará datos reales

---

**Fecha de última actualización**: 11 de Octubre, 2025
**Commits completados**: 56/110 (51%)


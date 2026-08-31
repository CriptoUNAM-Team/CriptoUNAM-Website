# 🚀 Guía de Despliegue para Producción - CriptoUNAM

Esta guía te ayudará a configurar CriptoUNAM para producción con todas las funcionalidades implementadas.

## 📋 Prerrequisitos

- Node.js 18+
- Cuenta de Vercel
- Cuenta de Supabase
- Cuenta de Resend
- Wallet con ETH para gas fees
- Dominio personalizado (opcional)

## 🔧 Configuración paso a paso

### 1. 📧 Configurar Resend (Sistema de Emails)

#### 1.1 Crear cuenta en Resend
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta
3. Obtén tu API key

#### 1.2 Configurar dominio personalizado
```bash
# Instalar dependencias
npm install resend

# Configurar dominio
npx resend domains:add criptounam.com
```

#### 1.3 Configurar registros DNS
Agrega estos registros en tu proveedor DNS:

**DKIM Record:**
```
Tipo: TXT
Nombre: resend._domainkey.criptounam.com
Valor: v=DKIM1; k=rsa; p=[tu_public_key]
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
Valor: v=DMARC1; p=quarantine; rua=mailto:dmarc@criptounam.com
```

**MX Record:**
```
Tipo: MX
Nombre: criptounam.com
Valor: feedback-smtp.us-east-1.amazonses.com
Prioridad: 10
```

### 2. 🗄️ Configurar Supabase (Base de Datos)

#### 2.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén URL y API key

#### 2.2 Configurar tablas
```sql
-- Ejecutar en SQL Editor de Supabase
-- (Los esquemas están en src/config/supabase.ts)
```

#### 2.3 Configurar RLS (Row Level Security)
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE puma_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE puma_transactions ENABLE ROW LEVEL SECURITY;
```

### 3. 🔗 Configurar Contrato Inteligente

#### 3.1 Compilar contrato
```bash
# Instalar dependencias
npm install @openzeppelin/contracts
npm install hardhat

# Compilar contrato
npx hardhat compile
```

#### 3.2 Desplegar contrato
```bash
# Configurar red
npx hardhat run scripts/deploy.js --network mainnet

# Obtener dirección del contrato
```

#### 3.3 Verificar contrato
```bash
# Verificar en Etherscan
npx hardhat verify --network mainnet [CONTRACT_ADDRESS]
```

### 4. 🌐 Configurar Variables de Entorno

Crea un archivo `.env.local` en Vercel:

```env
# Web3 Configuration
VITE_APP_INFURA_ID=tu_infura_id
VITE_APP_CHAIN_ID=1
VITE_APP_NETWORK=mainnet
VITE_APP_RPC_URL=https://mainnet.infura.io/v3/tu_infura_id

# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@criptounam.com

# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PUMA Token Configuration
PUMA_TOKEN_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
PUMA_TOKEN_DECIMALS=18
PUMA_REWARD_RATE=100

# Admin Configuration
ADMIN_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12

# App Configuration
NEXT_PUBLIC_APP_URL=https://criptounam.xyz
NEXT_PUBLIC_APP_NAME=CriptoUNAM

# Telegram Bot (Opcional)
VITE_TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 5. 🚀 Desplegar en Vercel

#### 5.1 Conectar repositorio
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno

#### 5.2 Configurar dominio personalizado
1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones

#### 5.3 Configurar build
```json
// vercel.json
{
  "buildCommand": "cd criptounam && npm run build",
  "outputDirectory": "criptounam/dist",
  "installCommand": "cd criptounam && npm install"
}
```

### 6. 🔐 Configurar Seguridad

#### 6.1 Configurar CORS
```typescript
// src/config/cors.ts
export const corsOptions = {
  origin: ['https://criptounam.xyz'],
  credentials: true
}
```

#### 6.2 Configurar Rate Limiting
```typescript
// src/middleware/rateLimit.ts
export const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
}
```

#### 6.3 Configurar HTTPS
- Vercel maneja HTTPS automáticamente
- Configura redirects HTTP → HTTPS

### 7. 📊 Configurar Monitoreo

#### 7.1 Analytics
```typescript
// src/utils/analytics.ts
export const trackEvent = (event: string, properties: any) => {
  // Integrar con Google Analytics, Mixpanel, etc.
}
```

#### 7.2 Error Tracking
```typescript
// src/utils/errorTracking.ts
export const trackError = (error: Error, context: any) => {
  // Integrar con Sentry, LogRocket, etc.
}
```

### 8. 🧪 Testing en Producción

#### 8.1 Verificar funcionalidades
- [ ] Conexión de wallet
- [ ] Sistema de emails
- [ ] Sistema de likes
- [ ] Sistema PUMA
- [ ] Contrato inteligente
- [ ] Base de datos

#### 8.2 Verificar rendimiento
- [ ] Tiempo de carga < 3s
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] SEO optimizado

### 9. 🔄 Configurar CI/CD

#### 9.1 GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

#### 9.2 Automatizar despliegue
- Push a main → Deploy automático
- Tests automáticos antes del deploy
- Rollback automático si hay errores

### 10. 📈 Optimizaciones de Producción

#### 10.1 Performance
```typescript
// Lazy loading de componentes
const LazyComponent = React.lazy(() => import('./Component'))

// Code splitting
const routes = [
  { path: '/', component: lazy(() => import('./Home')) },
  { path: '/cursos', component: lazy(() => import('./Cursos')) }
]
```

#### 10.2 Caching
```typescript
// Service Worker para caching
// Configurar cache headers en Vercel
```

#### 10.3 CDN
- Vercel Edge Network automático
- Optimización de imágenes
- Compresión gzip/brotli

## 🚨 Troubleshooting

### Problemas comunes:

1. **Error de CORS**
   - Verificar configuración de dominios en Vercel
   - Revisar headers de respuesta

2. **Error de conexión a Supabase**
   - Verificar URL y API key
   - Revisar configuración de RLS

3. **Error de Resend**
   - Verificar API key
   - Revisar configuración de dominio

4. **Error de contrato inteligente**
   - Verificar dirección del contrato
   - Revisar configuración de red

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Revisa la configuración de DNS
4. Contacta al equipo de desarrollo

---

**¡Felicitaciones! 🎉 Tu aplicación CriptoUNAM está lista para producción.**

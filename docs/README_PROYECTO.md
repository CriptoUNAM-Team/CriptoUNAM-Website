# CriptoUNAM - Plataforma educativa descentralizada

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Web3](https://img.shields.io/badge/Web3-F16822?style=for-the-badge&logo=web3.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**🎓 Plataforma educativa descentralizada para aprender sobre blockchain, criptomonedas y Web3.**

**🚀 [Ver sitio web en vivo](https://criptounam.xyz/)**

[![Website Status](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A//criptounam.xyz/)](https://criptounam.xyz/)

[📚 Documentación](https://github.com/MarxMad/CriptoUNAM-Website) · [🐛 Reportar bug](https://github.com/MarxMad/CriptoUNAM-Website/issues)

</div>

## 📖 Descripción

CriptoUNAM es una plataforma educativa descentralizada diseñada para la comunidad universitaria y entusiastas de la tecnología blockchain. Ofrecemos cursos especializados, eventos, y una comunidad activa para aprender sobre criptomonedas, contratos inteligentes y el ecosistema Web3.

## ✨ Características principales

- 📚 **Cursos especializados** sobre blockchain y criptomonedas
- 🔗 **Integración Web3** con wallets compatibles
- 🏆 **Sistema de certificaciones** en blockchain
- 👥 **Comunidad activa** de estudiantes y desarrolladores
- 📅 **Eventos y workshops** regulares
- 🌙 **Modo oscuro/claro** para mejor experiencia
- 📱 **Diseño responsive** optimizado para todos los dispositivos
- 🎮 **Juegos educativos** interactivos (Memoria, Adivinanza, Reacción, Serpiente)
- 📧 **Newsletter** con las últimas noticias del ecosistema cripto
- 💰 **Sistema de recompensas $PUMA** con tokens y gamificación
- ❤️ **Sistema de likes** para newsletters y contenido
- 📬 **Emails automáticos** con Resend para notificaciones
- 🏅 **Sistema de insignias y logros** para usuarios
- 📊 **Dashboard de perfil** con estadísticas y progreso
- 🔔 **Notificaciones toast** para feedback en tiempo real

## 🛠️ Stack tecnológico

- **Frontend**: React + TypeScript + Vite
- **Blockchain**: Ethers.js + Web3
- **Routing**: React Router
- **Estilos**: CSS Modules + Styled Components
- **Backend**: Node.js + Express
- **Base de datos**: Supabase + MongoDB
- **Email**: Resend API
- **Autenticación**: JWT + Web3
- **Deployment**: Vercel
- **Iconos**: FontAwesome
- **Notificaciones**: Sistema toast personalizado

## 🖼️ Vista previa

![CriptoUNAM Homepage](https://criptounam.xyz/)

> 📸 *Visita el [sitio web en vivo](https://criptounam.xyz/) para explorar todas las funcionalidades*

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn
- MetaMask u otra wallet Web3
- Git

## 🔧 Instalación y configuración

### Frontend

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/MarxMad/CriptoUNAM-Website.git
   cd CriptoUNAM-Website/CriptoUNAM-Website/criptounam
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   # Web3 Configuration
   VITE_APP_INFURA_ID=tu_infura_id
   VITE_APP_CHAIN_ID=1
   VITE_APP_NETWORK=mainnet
   
   # Telegram Bot
   VITE_TELEGRAM_BOT_TOKEN=tu_token_de_telegram
   
   # Email Service (Resend)
   RESEND_API_KEY=tu_resend_api_key
   RESEND_FROM_EMAIL=noreply@criptounam.com
   
   # Database (Supabase)
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=CriptoUNAM
   
   # PUMA Token Configuration
   PUMA_TOKEN_ADDRESS=0x1234567890abcdef
   PUMA_TOKEN_DECIMALS=18
   PUMA_REWARD_RATE=100
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

### Backend (Opcional)

Para funcionalidades completas como notificaciones:

1. **Navegar al directorio del backend:**
   ```bash
   cd pinata-backend
   ```

2. **Instalar dependencias del backend:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno del backend:**
   ```bash
   # Configura tu base de datos MongoDB y otras variables
   ```

4. **Iniciar el servidor backend:**
   ```bash
   npm start
   ```

## 🏗️ Estructura del proyecto

```
CriptoUNAM-Website/
├── criptounam/                       # Frontend principal
│   ├── src/
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── Navbar.tsx          # Barra de navegación
│   │   │   ├── Footer.tsx          # Pie de página
│   │   │   ├── ConnectedWallets.tsx # Gestión de wallets
│   │   │   ├── Email/              # Componentes de email
│   │   │   │   └── EmailSubscription.tsx
│   │   │   ├── Likes/              # Sistema de likes
│   │   │   │   └── LikeButton.tsx
│   │   │   ├── Puma/               # Sistema PUMA
│   │   │   │   └── PumaBalance.tsx
│   │   │   ├── Profile/            # Perfil de usuario
│   │   │   │   └── ProfileBonus.tsx
│   │   │   └── Notifications/       # Sistema de notificaciones
│   │   │       └── NotificationToast.tsx
│   │   ├── pages/                  # Páginas principales
│   │   │   ├── Home.tsx            # Página de inicio
│   │   │   ├── Cursos.tsx          # Catálogo de cursos
│   │   │   ├── Juegos.tsx          # Juegos educativos
│   │   │   ├── Comunidad.tsx       # Página de comunidad
│   │   │   ├── Newsletter.tsx      # Suscripción al newsletter
│   │   │   └── Perfil.tsx          # Perfil de usuario
│   │   ├── context/                # Contextos de React
│   │   │   ├── WalletContext.tsx  # Gestión de wallets Web3
│   │   │   ├── EmailContext.tsx    # Contexto de emails
│   │   │   ├── LikesContext.tsx    # Contexto de likes
│   │   │   └── PumaContext.tsx     # Contexto de PUMA
│   │   ├── hooks/                  # Hooks personalizados
│   │   │   ├── useEmail.ts         # Hook para emails
│   │   │   ├── useLikes.ts         # Hook para likes
│   │   │   └── usePuma.ts          # Hook para PUMA
│   │   ├── services/               # Servicios de backend
│   │   │   ├── email.service.ts    # Servicio de emails
│   │   │   ├── resend.service.ts   # Servicio Resend
│   │   │   ├── likes.service.ts    # Servicio de likes
│   │   │   └── puma.service.ts     # Servicio PUMA
│   │   ├── api/                    # Rutas de API
│   │   │   ├── email.routes.ts     # Rutas de email
│   │   │   ├── likes.routes.ts     # Rutas de likes
│   │   │   └── puma.routes.ts      # Rutas de PUMA
│   │   ├── middleware/             # Middleware
│   │   │   └── auth.middleware.ts  # Autenticación
│   │   ├── utils/                 # Utilidades
│   │   │   ├── email.utils.ts     # Utilidades de email
│   │   │   └── validation.utils.ts # Validaciones
│   │   ├── types/                 # Tipos TypeScript
│   │   │   ├── email.ts           # Tipos de email
│   │   │   ├── likes.ts           # Tipos de likes
│   │   │   └── puma.ts            # Tipos de PUMA
│   │   ├── interfaces/            # Interfaces
│   │   │   ├── email.interface.ts
│   │   │   ├── likes.interface.ts
│   │   │   └── puma.interface.ts
│   │   ├── config/                # Configuración
│   │   │   ├── env.ts             # Variables de entorno
│   │   │   └── database/          # Esquemas de BD
│   │   │       ├── likes.sql
│   │   │       └── puma.sql
│   │   ├── constants/             # Datos estáticos
│   │   ├── styles/               # Estilos CSS
│   │   └── utils/                # Utilidades generales
│   └── public/                   # Archivos estáticos
└── README.md                     # Este archivo
```

## 🎯 Funcionalidades principales

### 🎓 **Educación**
- Cursos estructurados sobre blockchain y DeFi
- Material didáctico interactivo
- Certificaciones verificables en blockchain
- Sistema de progreso y seguimiento

### 🎮 **Gamificación**
- **4 Juegos educativos**: Memoria, Adivinanza, Reacción, Serpiente
- Sistema de puntuación y logros
- Competencias entre estudiantes
- **Sistema $PUMA**: Tokens de recompensa por participación

### 🔗 **Integración Web3**
- Conexión con múltiples wallets (MetaMask, WalletConnect, etc.)
- Interacción con contratos inteligentes
- Gestión de tokens y NFTs educativos
- Autenticación descentralizada

### 👥 **Comunidad**
- Foros de discusión
- Eventos y workshops en vivo
- Newsletter con actualizaciones del ecosistema
- **Sistema de likes** para contenido
- **Notificaciones automáticas** por email

### 💰 **Sistema de Recompensas $PUMA**
- **Tokens PUMA** por participación activa
- **Misiones y desafíos** para ganar recompensas
- **Sistema de niveles** y experiencia
- **Insignias y logros** desbloqueables
- **Leaderboard** semanal de usuarios activos

### 📱 **Experiencia de usuario**
- Diseño responsive para móviles y desktop
- Modo oscuro/claro
- Interfaz intuitiva y accesible
- **Notificaciones toast** en tiempo real
- **Dashboard de perfil** completo

## 🔍 Scripts disponibles

- **Desarrollo**: 
    ```bash
    npm run dev
    ```
    Inicia servidor de desarrollo.

- **Construcción**:
    ```bash
    npm run build
    ```
    Construye para producción.

    ```bash
    npm run preview
    ```
    Vista previa de la build.

- **Testing**:
    ```bash
    npm run test
    ```
    Ejecuta tests.

    ```bash
    npm run test:watch
    ```
    Ejecuta tests en modo watch.

- **Linting**:
    ```bash
    npm run lint
    ```
    Ejecuta ESLint.

    ```bash
    npm run lint:fix
    ```
    Corrige errores de linting.

## 🤝 Contribuir

1. Fork el proyecto.
2. Crea tu rama de feature:
    ```bash
    git checkout -b feature/AmazingFeature
    ```

3. Commit tus cambios:
    ```bash
    git commit -m 'Add: nueva característica'
    ```

4. Push a la rama:
    ```bash
    git push origin feature/AmazingFeature
    ```

5. Abre un Pull Request.

## 📝 Convenciones de código

- Usar TypeScript para todo el código nuevo.
- Seguir el estilo de código existente.
- Documentar componentes y funciones complejas.
- Escribir tests para nuevas características.
- Usar nombres descriptivos para variables y funciones.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para detalles.

## 👥 Equipo

- **Gerardo Pedrizco Vela** - UI/UX
- **Fernanda Tello Arzate** - UI/UX  
- **Adrian Armenta Sequeira** - Smart Contracts
- **Daniel Cruz** - Desarrollo de negocios

## 📞 Contacto y enlaces

- **🌐 Website**: [criptounam.xyz](https://criptounam.xyz/)
- **📧 Email**: criptounam@gmail.com
- **🐦 Twitter**: [@Cripto_UNAM](https://twitter.com/Cripto_UNAM)
- **💬 Discord**: Servidor de CriptoUNAM
- **📱 Telegram**: [Canal oficial](https://t.me/criptounam)
- **💻 GitHub**: [Repositorio del proyecto](https://github.com/MarxMad/CriptoUNAM-Website)

## 🆕 Nuevas funcionalidades implementadas

### 🎮 **Sistema de Juegos Educativos**
- **Juego de Memoria**: Entrena tu memoria con conceptos blockchain
- **Juego de Adivinanza**: Adivina números relacionados con cripto
- **Juego de Reacción**: Mide tu tiempo de respuesta
- **Juego de Serpiente**: Versión educativa del clásico juego

### 💰 **Sistema de Recompensas $PUMA**
- **Tokens PUMA**: Sistema de recompensas por participación
- **Misiones**: Completa tareas para ganar tokens
- **Niveles**: Sistema de progresión con XP
- **Insignias**: Logros desbloqueables
- **Leaderboard**: Ranking semanal de usuarios

### ❤️ **Sistema de Likes**
- **Like a newsletters**: Sistema de likes para contenido
- **Estadísticas**: Contador de likes por artículo
- **Trending**: Contenido más popular
- **Historial**: Seguimiento de likes del usuario

### 📬 **Sistema de Emails Automáticos**
- **Resend Integration**: Envío automático de emails
- **Notificaciones**: Alertas de nuevo contenido
- **Newsletter**: Suscripción automática
- **Templates**: Plantillas personalizadas

### 🔔 **Sistema de Notificaciones**
- **Toast Notifications**: Notificaciones en tiempo real
- **Tipos**: Success, Error, Warning, Info, Reward
- **Animaciones**: Transiciones suaves
- **Responsive**: Adaptable a móviles

### 👤 **Dashboard de Perfil Mejorado**
- **Sección Bonus**: Gestión de tokens PUMA
- **Estadísticas**: Progreso y logros
- **Misiones**: Lista de tareas disponibles
- **Transacciones**: Historial de actividad

## 🚀 Estado del proyecto

Este proyecto está en **desarrollo activo**. Nuevas funcionalidades se agregan regularmente. 

**Última actualización**: 30 commits implementados con nuevas funcionalidades de gamificación, sistema de recompensas, emails automáticos y notificaciones.

[![Website Status](https://img.shields.io/website?down_color=red&down_message=offline&up_color=green&up_message=online&url=https%3A//criptounam.xyz/)](https://criptounam.xyz/)

## 🙏 Agradecimientos

- **UNAM** por el apoyo institucional y la visión educativa
- **Comunidad de desarrolladores Web3** por su inspiración y contribuciones
- **Vercel** por el hosting y deployment gratuito
- **Todos los estudiantes y usuarios** que han probado y dado feedback sobre la plataforma

---

<div align="center">

**⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub ⭐**

*Desarrollado con ❤️ por el equipo de CriptoUNAM*

</div> 
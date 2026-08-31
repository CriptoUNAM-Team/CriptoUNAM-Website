# Sistema de Administración - CriptoUNAM

## Descripción

El sistema de administración de CriptoUNAM permite que solo wallets autorizadas puedan crear, editar y eliminar contenido en la plataforma.

## Características

### 🔐 Autenticación por Wallet
- Solo las wallets de administrador pueden realizar acciones administrativas
- Validación tanto en frontend como backend
- Sistema de permisos granular

### 👑 Funcionalidades de Admin
- **Cursos**: Crear, editar y eliminar cursos
- **Newsletter**: Crear, editar y eliminar entradas
- **Eventos**: Crear, editar y eliminar eventos
- **Notificaciones**: Gestionar notificaciones globales

### 🛡️ Seguridad
- Middleware de autenticación en backend
- Validación de permisos en frontend
- Headers de wallet en todas las peticiones admin

## Configuración

### Wallets de Administrador

Las wallets autorizadas se configuran en:
- **Frontend**: `src/constants/admin.ts`
- **Backend**: `pinata-backend/middleware/auth.js`

```typescript
// Frontend
export const ADMIN_WALLETS = [
  '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase(),
  // Agregar más wallets aquí
];
```

```javascript
// Backend
const ADMIN_WALLETS = [
  '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase(),
  // Agregar más wallets aquí
];
```

### Agregar Nuevo Admin

1. Agregar la wallet en `src/constants/admin.ts`
2. Agregar la wallet en `pinata-backend/middleware/auth.js`
3. Reiniciar el servidor backend

## Uso

### Frontend

```typescript
import { useAdmin } from '../hooks/useAdmin';

const MyComponent = () => {
  const { isAdmin, canCreateCourse, canDeleteCourse } = useAdmin();
  
  if (!canCreateCourse) {
    return <div>No tienes permisos para crear cursos</div>;
  }
  
  // Lógica de admin...
};
```

### Backend

```javascript
const { requireAdmin } = require('./middleware/auth');

// Endpoint protegido
app.post('/curso', requireAdmin, express.json(), async (req, res) => {
  // Solo admins pueden acceder
});
```

## Endpoints Protegidos

### Cursos
- `POST /curso` - Crear curso
- `DELETE /curso/:id` - Eliminar curso

### Newsletter
- `POST /newsletter` - Crear entrada
- `DELETE /newsletter/:id` - Eliminar entrada

### Eventos
- `POST /evento` - Crear evento
- `DELETE /evento/:id` - Eliminar evento

### Notificaciones
- `POST /notificaciones` - Crear notificación

## UI de Admin

- **Indicador de Admin**: Badge dorado en la esquina superior derecha
- **Botones de Admin**: Solo visibles para usuarios admin
- **Validación**: Mensajes de error cuando no hay permisos

## Seguridad

### Validaciones
- ✅ Wallet conectada
- ✅ Wallet en lista de admins
- ✅ Headers de autenticación
- ✅ Middleware de backend

### Recomendaciones
1. Mantener las wallets de admin seguras
2. Usar wallets dedicadas para admin
3. Revisar logs de acceso regularmente
4. Rotar wallets de admin periódicamente

## Troubleshooting

### Error: "Acceso denegado"
- Verificar que la wallet esté conectada
- Verificar que la wallet esté en la lista de admins
- Verificar que el backend esté corriendo

### Error: "Wallet no autorizada"
- La wallet no está en la lista de administradores
- Agregar la wallet a `ADMIN_WALLETS` en ambos archivos

### Error: "No tienes permisos"
- Verificar permisos específicos en el hook `useAdmin`
- Verificar que la acción esté permitida en `ADMIN_PERMISSIONS`

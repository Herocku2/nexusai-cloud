# 🔐 ADMIN AREA - NEXUS AI MLM

## Credenciales de Acceso

### Admin Principal
```
URL: http://localhost:3003/admin/login
Email: admin@nexusai.com
Password: NexusAdmin2024!SecurePass
```

### Master Password (Login como cualquier usuario)
```
Master Password: NexusMaster2024!SuperSecure
```

**Uso del Master Password:**
1. Ir a Admin > Users
2. Click en el botón "Login As" (escudo verde) de cualquier usuario
3. Ingresar la Master Password cuando se solicite
4. Serás redirigido al dashboard del usuario

---

## Funcionalidades del Admin Area

### 📊 Dashboard
- Estadísticas generales del sistema
- Total de usuarios, usuarios activos
- Membresías activas
- Retiros pendientes
- Ingresos totales
- Accesos rápidos a todas las secciones

### 👥 Gestión de Usuarios
**Ubicación:** `/admin/users`

**Funcionalidades:**
- ✅ Ver todos los usuarios con paginación
- ✅ Buscar usuarios por nombre/email
- ✅ Filtrar por estado (active, pending, blocked)
- ✅ Editar datos de usuarios (nombre, balance, PV, etc.)
- ✅ Cambiar estado de usuarios (activar/bloquear)
- ✅ Eliminar usuarios
- ✅ Resetear contraseñas de usuarios
- ✅ Login como usuario con Master Password
- ✅ Ver balance, PV, membresía de cada usuario
- ✅ Acciones en masa (Bulk Actions)

### 📚 Gestión de Cursos (Academia)
**Ubicación:** `/admin/courses`

**Funcionalidades:**
- ✅ Ver todos los cursos
- ✅ Crear nuevos cursos
- ✅ Editar cursos existentes
- ✅ Eliminar cursos
- ✅ Activar/desactivar cursos
- ✅ Configurar:
  - Título y descripción
  - Categoría
  - URL del video (YouTube, Vimeo, etc.)
  - Duración en minutos
  - Tipo de acceso (Free/Premium)
  - Thumbnail
  - Requisitos de rango

### 💰 Gestión de Retiros
**Ubicación:** `/admin/withdrawals`

**Funcionalidades:**
- ✅ Ver retiros pendientes
- ✅ Aprobar retiros con TX Hash
- ✅ Rechazar retiros (devuelve balance al usuario)
- ✅ Ver detalles completos:
  - Usuario que solicita
  - Monto
  - Red (TRC20/ERC20)
  - Dirección de destino
  - Fecha de solicitud
- ✅ Historial de retiros procesados

### 💳 Gestión de Depósitos
**Ubicación:** `/admin/deposits`

**Funcionalidades:**
- ✅ Ver depósitos pendientes de confirmación
- ✅ Aprobar depósitos (añade balance al usuario)
- ✅ Rechazar depósitos
- ✅ Ver TX Hash reportado por el usuario
- ✅ Verificación manual de blockchain

### 🎫 Gestión de Membresías
**Ubicación:** `/admin/memberships`

**Funcionalidades:**
- ✅ Ver todas las membresías activas
- ✅ Ver membresías próximas a vencer
- ✅ Extender membresías manualmente
- ✅ Activar membresías para usuarios
- ✅ Cambiar tipo de membresía
- ✅ Ver historial de renovaciones

### ⚙️ Configuración del Sistema
**Ubicación:** `/admin/settings`

**Funcionalidades:**
- ✅ Configurar parámetros del sistema MLM:
  - Porcentajes de comisiones
  - Requisitos de rangos
  - Valores de membresía
  - Límites de retiro
  - Comisiones de red
- ✅ Configurar depósitos:
  - Direcciones de wallet TRC20/ERC20
  - Mínimo de depósito
  - Confirmaciones requeridas
- ✅ Configurar academia:
  - Requisitos de acceso
  - Categorías de cursos

### 📈 Reportes y Analytics
**Ubicación:** `/admin/reports`

**Funcionalidades:**
- ✅ Reportes de ingresos
- ✅ Estadísticas de usuarios
- ✅ Análisis de comisiones
- ✅ Métricas de la academia
- ✅ Exportar datos

---

## Estructura de Archivos

```
app/
├── admin/
│   ├── layout.tsx              # Layout del admin con sidebar
│   ├── login/
│   │   └── page.tsx           # Login del admin
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard principal
│   ├── users/
│   │   ├── page.tsx           # Lista de usuarios
│   │   ├── create/            # Crear usuario
│   │   ├── edit/[id]/         # Editar usuario
│   │   ├── login-as/[id]/     # Login como usuario
│   │   └── reset-password/[id]/ # Reset password
│   ├── courses/
│   │   ├── page.tsx           # Lista de cursos
│   │   ├── create/            # Crear curso
│   │   └── edit/[id]/         # Editar curso
│   ├── withdrawals/
│   │   └── page.tsx           # Gestión de retiros
│   ├── deposits/
│   │   └── page.tsx           # Gestión de depósitos
│   ├── memberships/
│   │   ├── page.tsx           # Gestión de membresías
│   │   └── expiring/          # Membresías por vencer
│   └── settings/
│       ├── page.tsx           # Configuración general
│       └── mlm/               # Configuración MLM
│
├── actions/
│   ├── admin.ts               # Actions de administración general
│   └── admin-courses.ts       # Actions de cursos, retiros, depósitos
```

---

## Seguridad Implementada

### RLS (Row Level Security)
- ✅ Políticas RLS en todas las tablas
- ✅ Solo admin puede modificar datos sensibles
- ✅ Usuarios solo ven sus propios datos

### Autenticación
- ✅ Login separado para admin
- ✅ Sesión independiente del área de usuario
- ✅ Master password para acceso de emergencia

### Validaciones
- ✅ Validación de permisos en todas las acciones
- ✅ Sanitización de inputs
- ✅ Protección contra SQL injection
- ✅ Rate limiting en acciones críticas

---

## Middleware y Hooks

### Middleware de Admin
**Archivo:** `middleware.ts`
```typescript
// Protege rutas /admin/* 
// Verifica autenticación de admin
// Redirect a /admin/login si no autenticado
```

### Hooks Personalizados
```typescript
useAdminAuth()     // Verificar sesión de admin
useUserImpersonate() // Login como usuario
useMasterPassword()  // Validar master password
```

### Edge Functions
```typescript
// Funciones serverless para:
- Validación de TX Hash en blockchain
- Notificaciones automáticas
- Cálculo de comisiones
- Procesamiento de membresías
```

---

## Configuración CORS

**Archivo:** `next.config.js`
```javascript
headers: [
  {
    source: '/admin/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
    ],
  },
]
```

---

## Puerto del Admin Area

**Puerto Configurado:** `3003` (Puerto diferente al dashboard de usuario)

Para cambiar el puerto, editar `package.json`:
```json
{
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "start": "next start -p 3003"
  }
}
```

---

## Base de Datos Configurada

### Tablas Principales
- ✅ user_profiles
- ✅ academy_content
- ✅ user_content_progress
- ✅ transactions
- ✅ withdrawal_requests
- ✅ memberships
- ✅ commissions
- ✅ binary_positions
- ✅ user_ranks
- ✅ ranks
- ✅ system_settings

### Funciones PostgreSQL
- ✅ get_binary_downline()
- ✅ calculate_binary_commission()
- ✅ get_direct_referrals_count()
- ✅ calculate_leg_volume()
- ✅ find_next_available_position()

### Políticas RLS Activas
- ✅ 33 políticas configuradas
- ✅ Protección en todas las tablas
- ✅ Separación admin/usuario

---

## Próximos Pasos

1. ✅ Implementar notificaciones por email
2. ✅ Agregar 2FA para admin
3. ✅ Dashboard de analytics avanzado
4. ✅ Exportación de reportes (PDF/Excel)
5. ✅ Sistema de logs de auditoría
6. ✅ Backup automático de datos

---

## Soporte

Para soporte técnico o consultas:
- Email: support@nexusai.com
- Documentación: [docs.nexusai.com](https://docs.nexusai.com)

---

**Última actualización:** 2025-01-17
**Versión:** 1.0.0
**Estado:** ✅ Producción Ready

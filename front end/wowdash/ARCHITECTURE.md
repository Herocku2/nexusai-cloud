# 🏗️ Arquitectura de Autenticación - Supabase + WowDash

## 📐 Diagrama de Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Login    │  │   Register   │  │  Forgot Password     │   │
│  │   Form     │  │     Form     │  │       Form           │   │
│  └─────┬──────┘  └──────┬───────┘  └──────────┬───────────┘   │
│        │                │                      │               │
│        └────────────────┴──────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│              ┌──────────────────────┐                          │
│              │  Client Components   │                          │
│              │  - LoginForm.tsx     │                          │
│              │  - RegisterForm.tsx  │                          │
│              │  - ForgotPassword    │                          │
│              └──────────┬───────────┘                          │
│                         │                                       │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS MIDDLEWARE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  middleware.ts                                           │  │
│  │  • Intercepta todas las peticiones                       │  │
│  │  • Refresca tokens automáticamente                       │  │
│  │  • Protege rutas privadas                                │  │
│  │  • Maneja cookies de sesión                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVER ACTIONS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app/actions/auth.ts                                     │  │
│  │                                                           │  │
│  │  • login(formData)          → Sign in usuario            │  │
│  │  • signup(formData)         → Registrar nuevo usuario    │  │
│  │  • signOut()                → Cerrar sesión              │  │
│  │  • resetPassword(formData)  → Enviar email de reset      │  │
│  │  • updatePassword(formData) → Actualizar contraseña      │  │
│  │  • getCurrentUser()         → Obtener usuario actual     │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLIENTS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐     ┌──────────────────────────┐    │
│  │  Client-Side Client  │     │   Server-Side Client     │    │
│  │                      │     │                          │    │
│  │  • Browser only      │     │  • Server Components     │    │
│  │  • Real-time updates │     │  • Server Actions        │    │
│  │  • Auth state change │     │  • Route Handlers        │    │
│  │                      │     │  • API Routes            │    │
│  │  utils/supabase/     │     │  utils/supabase/         │    │
│  │  client.ts           │     │  server.ts               │    │
│  └──────────┬───────────┘     └──────────┬───────────────┘    │
│             │                            │                      │
│             └────────────┬───────────────┘                      │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐  ┌────────────────┐  ┌──────────────┐ │
│  │  Authentication    │  │   Database     │  │   Storage    │ │
│  │                    │  │                │  │              │ │
│  │  • Email/Password  │  │  • Users       │  │  • Avatars   │ │
│  │  • OAuth (Google)  │  │  • Profiles    │  │  • Files     │ │
│  │  • OAuth (GitHub)  │  │  • Sessions    │  │              │ │
│  │  • Magic Links     │  │  • Metadata    │  │              │ │
│  │  • JWT Tokens      │  │                │  │              │ │
│  └────────────────────┘  └────────────────┘  └──────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Registro de Usuario

```
1. Usuario → Completa formulario de registro
              ↓
2. RegisterForm.tsx → Valida datos con Zod
              ↓
3. Server Action → signup(formData)
              ↓
4. Supabase Auth → Crea usuario + Envía email de confirmación
              ↓
5. Usuario → Recibe email
              ↓
6. Usuario → Hace clic en link de confirmación
              ↓
7. Route Handler → /auth/confirm → Verifica token
              ↓
8. Redirección → Dashboard
```

## 🔐 Flujo de Inicio de Sesión

```
1. Usuario → Ingresa credenciales
              ↓
2. LoginForm.tsx → Valida datos
              ↓
3. Server Action → login(formData)
              ↓
4. Supabase Auth → Verifica credenciales
              ↓
5. Supabase → Genera JWT token + Refresh token
              ↓
6. Middleware → Establece cookies de sesión
              ↓
7. Redirección → Dashboard
```

## 🛡️ Flujo de Protección de Rutas

```
1. Usuario → Accede a ruta protegida
              ↓
2. Middleware → Intercepta petición
              ↓
3. Middleware → Verifica token en cookies
              ↓
4. Supabase → Valida token con getUser()
              ↓
5a. Token válido → Permite acceso
              ↓
    Renderiza página protegida
              
5b. Token inválido → Redirige a /auth/login
```

## 📁 Estructura de Archivos

```
/app
├── /actions
│   └── auth.ts                    # Server Actions para autenticación
├── /auth
│   ├── /login
│   │   └── page.tsx              # Página de login
│   ├── /register
│   │   └── page.tsx              # Página de registro
│   ├── /forgot-password
│   │   └── page.tsx              # Recuperación de contraseña
│   ├── /create-password
│   │   └── page.tsx              # Crear nueva contraseña
│   ├── /confirm
│   │   └── route.ts              # Route handler para confirmación
│   └── layout.tsx                # Layout de autenticación
└── /protected-example
    └── page.tsx                   # Ejemplo de página protegida

/components
└── /auth
    ├── login-form.tsx            # Formulario de login
    ├── register-form.tsx         # Formulario de registro
    ├── forgot-password.tsx       # Formulario de recuperación
    ├── create-password-component.tsx
    ├── social-login.tsx          # Login social
    └── user-profile.tsx          # Perfil de usuario (ejemplo)

/utils
└── /supabase
    ├── client.ts                 # Cliente para componentes del cliente
    ├── server.ts                 # Cliente para componentes del servidor
    └── middleware.ts             # Utilidad para middleware

/hooks
└── use-auth.ts                   # Hook personalizado para auth

/types
└── supabase.ts                   # Tipos de TypeScript

middleware.ts                      # Middleware principal
.env.local                        # Variables de entorno
```

## 🔑 Componentes Principales

### 1. Server Actions (`app/actions/auth.ts`)
- Funciones del servidor para autenticación
- Ejecutadas en el servidor de Next.js
- Acceso seguro a Supabase

### 2. Middleware (`middleware.ts`)
- Protege rutas automáticamente
- Refresca tokens expirados
- Maneja cookies de sesión

### 3. Supabase Clients
- **Client-side**: Para componentes del cliente
- **Server-side**: Para Server Components y Actions

### 4. Forms (`components/auth/`)
- Validación con Zod
- Manejo de estados con React Hook Form
- Feedback visual con toast notifications

## 🔒 Seguridad

### Buenas Prácticas Implementadas

✅ **Uso de `getUser()` en lugar de `getSession()`**
   - Valida el token en cada petición
   - Previene suplantación de identidad

✅ **Middleware para refrescar tokens**
   - Tokens siempre actualizados
   - Sesiones persistentes

✅ **Server Actions para operaciones sensibles**
   - Ejecución en servidor
   - Credenciales nunca expuestas al cliente

✅ **Validación de formularios**
   - Validación en cliente y servidor
   - Previene inyección de datos

✅ **HTTPS en producción**
   - Cookies seguras
   - Comunicación encriptada

## 📊 Estados de Autenticación

```typescript
// Estado no autenticado
user = null
isAuthenticated = false

// Estado autenticado
user = {
  id: "uuid",
  email: "user@example.com",
  user_metadata: {
    username: "usuario"
  },
  email_confirmed_at: "timestamp"
}
isAuthenticated = true

// Estado cargando
loading = true
```

## 🎯 Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**
   - Cliente, servidor y autenticación separados
   - Fácil de mantener y escalar

2. **Seguridad**
   - Autenticación manejada por Supabase
   - Tokens JWT seguros
   - Validación en cada petición

3. **Experiencia de Usuario**
   - Sesiones persistentes
   - Redirecciones automáticas
   - Feedback en tiempo real

4. **Escalabilidad**
   - Supabase maneja la infraestructura
   - Optimizado para producción
   - Fácil agregar nuevos proveedores

5. **Developer Experience**
   - TypeScript tipado
   - Hooks personalizados
   - Documentación completa

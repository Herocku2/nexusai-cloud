# 🔐 Autenticación Supabase - WowDash

> **Autenticación completa implementada con Supabase siguiendo las mejores prácticas de Next.js 15**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)]()
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)]()
[![Supabase](https://img.shields.io/badge/Supabase-latest-green)]()

---

## 🎯 ¿Qué Hay Aquí?

Una **implementación completa de autenticación** usando Supabase que incluye:

- ✅ Login con email y password
- ✅ Registro de usuarios
- ✅ Confirmación por email
- ✅ Recuperación de contraseña
- ✅ Protección de rutas
- ✅ Persistencia de sesión
- ✅ TypeScript completo
- ✅ Documentación extensa

---

## 🚀 Inicio Rápido (5 minutos)

### Opción 1: Quiero Probar Ya ⚡

**Sigue esta guía:**
```
📖 INICIO_RAPIDO.md
```

5 pasos simples para tener la autenticación funcionando.

### Opción 2: Configuración Completa 📚

**Sigue esta guía:**
```
📖 SUPABASE_SETUP_GUIDE.md
```

Guía detallada paso a paso con screenshots.

---

## 📂 Documentación Disponible

### Para Empezar
| Documento | Descripción | Tiempo |
|-----------|-------------|--------|
| 📖 [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) | Configuración en 5 minutos | ⏱️ 5 min |
| 📖 [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) | Guía detallada de configuración | ⏱️ 15 min |

### Para Entender
| Documento | Descripción |
|-----------|-------------|
| 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) | Diagramas y flujos del sistema |
| 📖 [SUPABASE_AUTH_README.md](./SUPABASE_AUTH_README.md) | Documentación técnica completa |

### Para Desarrollar
| Documento | Descripción |
|-----------|-------------|
| 📖 [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) | 12+ ejemplos de código |
| 📖 [RESUMEN_IMPLEMENTACION.md](./RESUMEN_IMPLEMENTACION.md) | Resumen de lo implementado |

---

## 🎨 Características

### Autenticación
- [x] Email/Password login
- [x] Registro de usuarios
- [x] Confirmación por email
- [x] Recuperación de contraseña
- [x] Logout
- [x] Sesiones persistentes

### Seguridad
- [x] Middleware para refrescar tokens
- [x] Protección de rutas automática
- [x] Validación server-side
- [x] Cookies HTTP-only
- [x] CSRF protection

### Developer Experience
- [x] TypeScript completo
- [x] Server Actions
- [x] Custom Hooks
- [x] Validación con Zod
- [x] Toast notifications
- [x] Loading states

---

## 📁 Estructura del Proyecto

```
/app
├── /actions/auth.ts              # Server Actions
├── /auth
│   ├── /login                    # Página de login
│   ├── /register                 # Página de registro
│   ├── /forgot-password          # Recuperación
│   ├── /create-password          # Nueva contraseña
│   └── /confirm                  # Confirmación email
└── /protected-example            # Ejemplo

/components/auth
├── login-form.tsx               # Login integrado
├── register-form.tsx            # Registro integrado
├── forgot-password.tsx          # Recuperación
└── user-profile.tsx             # Ejemplo de perfil

/utils/supabase
├── client.ts                    # Cliente browser
├── server.ts                    # Cliente server
└── middleware.ts                # Middleware helper

/hooks
└── use-auth.ts                  # Hook custom

middleware.ts                    # Middleware principal
.env.local                       # Variables entorno
```

---

## 🛠️ Tecnologías

- **Next.js 15.3** - App Router
- **Supabase** - Backend as a Service
- **TypeScript 5.8** - Type safety
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas
- **Tailwind CSS** - Estilos
- **Shadcn/ui** - Componentes UI

---

## 📖 Guía de Uso Rápida

### 1. Configurar Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Iniciar Desarrollo

```bash
npm run dev
```

### 3. Rutas Disponibles

```
📄 /auth/login           - Login
📄 /auth/register        - Registro
📄 /auth/forgot-password - Recuperación
📄 /protected-example    - Ejemplo protegido
```

---

## 💻 Ejemplos de Código

### Server Component

```typescript
import { getCurrentUser } from '@/app/actions/auth'

export default async function Page() {
  const user = await getCurrentUser()
  return <div>Hello {user?.email}</div>
}
```

### Client Component

```typescript
import { useAuth } from '@/hooks/use-auth'

export default function Profile() {
  const { user, isAuthenticated } = useAuth()
  return <div>{user?.email}</div>
}
```

### Logout

```typescript
import { signOut } from '@/app/actions/auth'

<form action={signOut}>
  <button>Logout</button>
</form>
```

**Más ejemplos:** [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)

---

## 🔐 Seguridad

### Implementado

✅ **JWT Tokens** - Manejados por Supabase  
✅ **Refresh Tokens** - Automático en middleware  
✅ **HTTP-only Cookies** - Seguridad mejorada  
✅ **Server-side Validation** - Usando `getUser()`  
✅ **CSRF Protection** - Built-in Next.js  

### Recomendaciones

1. Siempre usa `getUser()` en servidor
2. Nunca confíes en `getSession()` server-side
3. Habilita Row Level Security (RLS)
4. Usa HTTPS en producción
5. Configura SMTP personalizado

---

## 🐛 Troubleshooting

### Problemas Comunes

| Problema | Solución |
|----------|----------|
| Invalid API key | Verifica `.env.local` y reinicia servidor |
| Email no llega | Revisa spam y template en Supabase |
| Redirección infinita | Limpia cookies y verifica URLs |
| Errores de CORS | Agrega URL a Redirect URLs en Supabase |

**Guía completa:** [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)

---

## 📊 Testing

### Build Status

```bash
npm run build
# ✅ Build successful
# ⚠️ Minor Edge Runtime warnings (normal with Supabase)
```

### Rutas Generadas

```
✅ /auth/login
✅ /auth/register
✅ /auth/forgot-password
✅ /auth/create-password
✅ /protected-example
```

---

## 🎯 Próximos Pasos

Después de configurar, puedes:

1. **Agregar OAuth**
   - Google, GitHub, etc.
   
2. **Crear Perfiles**
   - Tabla de perfiles en Supabase
   
3. **Implementar Roles**
   - Admin, User, etc.
   
4. **Storage de Archivos**
   - Avatares de usuario
   
5. **Real-time Features**
   - Notificaciones en vivo

---

## 📚 Recursos

### Documentación
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Comunidad
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

---

## ✨ Arquitectura

```
Cliente (Browser)
       ↓
Client Components (React)
       ↓
Server Actions
       ↓
Supabase Client (Server/Client)
       ↓
Supabase Backend
```

**Diagrama completo:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📝 Changelog

### v1.0.0 (Actual)
- ✅ Implementación inicial completa
- ✅ Login, registro, recuperación
- ✅ Middleware configurado
- ✅ Documentación completa
- ✅ Ejemplos de código
- ✅ TypeScript completo

---

## 🤝 Contribuir

Si encuentras mejoras o problemas:

1. Revisa la documentación
2. Verifica los ejemplos
3. Consulta troubleshooting
4. Abre un issue si es necesario

---

## 📄 Licencia

Este código es parte del proyecto WowDash.

---

## 🎊 Conclusión

**Todo está listo para usar.** Solo necesitas:

1. Crear proyecto en Supabase
2. Copiar credenciales
3. Configurar `.env.local`
4. `npm run dev`

**¡Disfruta de tu autenticación!** 🚀

---

## 📞 Soporte

- 📖 Lee [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) primero
- 📖 Consulta [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)
- 📖 Revisa [ARCHITECTURE.md](./ARCHITECTURE.md)
- 🔍 Busca en la documentación de Supabase

---

**Hecho con ❤️ usando Supabase + Next.js**

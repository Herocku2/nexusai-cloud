# 🔧 Solución: Dashboard del Backoffice muestra perfil incorrecto

## 🐛 Problema Identificado

Después de iniciar sesión con un usuario normal (demo@nexusai.com) en el backoffice, el dashboard muestra el perfil de otro usuario ("Robiul Hasan") en lugar del perfil real del usuario autenticado.

### Síntomas

- ✅ Login funciona correctamente
- ✅ Sesión se crea exitosamente  
- ❌ **Perfil mostrado es incorrecto** (muestra "Robiul Hasan" en lugar de "Demo User")
- ❌ El dropdown de perfil muestra datos hardcodeados
- ❌ El nombre del usuario no corresponde al autenticado

---

## 🔍 Causa Raíz

El problema estaba en el componente **`components/shared/profile-dropdown.tsx`**:

### Código Problemático (ANTES):

```typescript
import { useSession } from "next-auth/react"; // ❌ Usando NextAuth

const ProfileDropdown = () => {
  const { data: session } = useSession(); // ❌ Session de NextAuth (no Supabase)

  return (
    // ...
    <h6>
      {session?.user?.image && session?.user?.name
        ? session?.user?.name
        : "Robiul Hasan"}  // ❌ HARDCODED FALLBACK
    </h6>
    <span>Admin</span>  // ❌ SIEMPRE muestra "Admin"
    // ...
  )
}
```

### Problemas identificados:

1. **❌ Usaba `useSession()` de NextAuth** en lugar del hook de Supabase
2. **❌ Nombre hardcodeado** como fallback: `"Robiul Hasan"`
3. **❌ Rol hardcodeado**: Siempre mostraba `"Admin"`
4. **❌ No consultaba la base de datos** para obtener el perfil del usuario
5. **❌ No usaba `user.id`** de la sesión actual de Supabase

---

## ✅ Correcciones Aplicadas

### 1. **components/shared/profile-dropdown.tsx** - Usar Supabase Auth

**Cambios:**

```typescript
// ✅ DESPUÉS (CORRECTO)
import { useAuth } from "@/lib/hooks/useAuth"; // ✅ Hook de Supabase

const ProfileDropdown = () => {
  const { user, loading } = useAuth(); // ✅ Usuario de Supabase
  
  // ✅ Construir nombre desde el perfil real
  const displayName = user?.profile?.first_name && user?.profile?.last_name
    ? `${user.profile.first_name} ${user.profile.last_name}`
    : user?.email?.split('@')[0] || 'User';
  
  // ✅ Rol basado en is_admin del perfil
  const isAdmin = (user?.profile as any)?.is_admin || false;
  const userRole = isAdmin ? 'Admin' : 'User';

  return (
    // ...
    <h6>
      {loading ? 'Loading...' : displayName}  // ✅ Nombre real del usuario
    </h6>
    <span>{loading ? '' : userRole}</span>  // ✅ Rol real del usuario
    // ...
  )
}
```

### 2. **lib/hooks/useAuth.ts** - Hook existente que SÍ funciona correctamente

Este hook **YA estaba bien implementado** y obtiene correctamente:

```typescript
export function useAuth() {
  // ...
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (authUser) {
    // ✅ Obtiene perfil del usuario usando auth.user.id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)  // ✅ Usa el ID correcto
      .single()

    setUser({ ...authUser, profile: profile || undefined })
  }
  // ...
}
```

### 3. **lib/types/database.ts** - Agregar `is_admin` al tipo

**Antes:**
```typescript
user_profiles: {
  Row: {
    id: string
    // ... otros campos
    status: 'active' | 'inactive' | 'suspended'
    // ❌ is_admin NO estaba en el tipo
  }
}
```

**Después:**
```typescript
user_profiles: {
  Row: {
    id: string
    // ... otros campos
    status: 'active' | 'inactive' | 'suspended'
    is_admin: boolean | null  // ✅ Agregado
  }
}
```

---

## 📊 Flujo Corregido

### Antes (INCORRECTO):

```
Usuario hace login (demo@nexusai.com)
        ↓
Login exitoso con Supabase ✅
        ↓
Dashboard carga
        ↓
ProfileDropdown usa useSession() de NextAuth ❌
        ↓
NextAuth NO tiene sesión (porque usamos Supabase)
        ↓
Fallback a "Robiul Hasan" hardcodeado ❌
        ↓
Usuario ve perfil INCORRECTO ❌
```

### Después (CORRECTO):

```
Usuario hace login (demo@nexusai.com)
        ↓
Login exitoso con Supabase ✅
        ↓
Dashboard carga
        ↓
ProfileDropdown usa useAuth() de Supabase ✅
        ↓
useAuth() obtiene user.id de supabase.auth.getUser() ✅
        ↓
Consulta user_profiles con eq('id', user.id) ✅
        ↓
Obtiene perfil real: {
  first_name: 'Demo',
  last_name: 'User',
  is_admin: false
} ✅
        ↓
Muestra "Demo User" y rol "User" ✅
        ↓
Usuario ve su perfil CORRECTO ✅
```

---

## 🎯 Verificación

### Checklist de prueba:

1. [ ] **Login con usuario normal** (demo@nexusai.com)
2. [ ] **Dashboard carga correctamente**
3. [ ] **Dropdown de perfil muestra "Demo User"**
4. [ ] **Rol muestra "User" (no "Admin")**
5. [ ] **Login con admin** (admin@nexusai.com o con is_admin=true)
6. [ ] **Dashboard admin muestra el nombre del admin**
7. [ ] **Rol muestra "Admin"**
8. [ ] **No hay cruces de datos entre usuarios**

### Resultado esperado por usuario:

| Usuario | Email | Nombre mostrado | Rol mostrado | is_admin |
|---------|-------|-----------------|--------------|----------|
| Demo User | demo@nexusai.com | Demo User | User | false |
| Usuario Prueba | usuario@nexusai.com | Usuario Prueba | User | false |
| Admin Nexus | admin@nexusai.com | Admin Nexus | Admin | true |

---

## 📝 Archivos Modificados

### 1. ✅ [components/shared/profile-dropdown.tsx](components/shared/profile-dropdown.tsx)
- **Líneas 14-24**: Cambiado de `useSession()` (NextAuth) a `useAuth()` (Supabase)
- **Líneas 58-63**: Eliminado hardcodeo de "Robiul Hasan", ahora usa `displayName` dinámico
- **Línea 64**: Eliminado hardcodeo de "Admin", ahora usa `userRole` dinámico

### 2. ✅ [lib/types/database.ts](lib/types/database.ts)
- **Línea 27**: Agregado `is_admin: boolean | null` al tipo `Row`
- **Línea 44**: Agregado `is_admin?: boolean | null` al tipo `Insert`
- **Línea 61**: Agregado `is_admin?: boolean | null` al tipo `Update`

### 3. ✅ [lib/hooks/useAuth.ts](lib/hooks/useAuth.ts)
- **Sin cambios** - Ya estaba implementado correctamente
- Obtiene perfil usando `eq('id', authUser.id)` ✅
- Escucha cambios de autenticación correctamente ✅

---

## 🔒 Aislamiento Admin vs Backoffice

### Confirmado - NO hay cruces:

| Aspecto | Admin Area | Backoffice |
|---------|-----------|------------|
| **Ruta de login** | `/admin/login` | `/auth/login` |
| **Action de login** | `adminLogin()` | `login()` |
| **Validación** | `is_admin = true` | Sin validación de admin |
| **Dashboard** | `/admin/dashboard` | `/dashboard` |
| **Componente perfil** | ProfileDropdown (mismo, pero detecta rol) | ProfileDropdown (mismo, pero detecta rol) |
| **Hook de sesión** | `useAuth()` de Supabase | `useAuth()` de Supabase |
| **Middleware** | Protege `/admin/*` | Protege `/dashboard/*` |

**✅ Ambos usan el mismo hook `useAuth()` pero cada uno muestra el perfil correcto según `user.id`**

---

## 🧪 Cómo Probar

### Prueba 1: Usuario Normal (Backoffice)

```bash
# 1. Limpiar cookies
# DevTools > Application > Clear site data

# 2. Acceder al login del backoffice
URL: http://localhost:3000/auth/login

# 3. Iniciar sesión
Email: demo@nexusai.com
Password: Demo2024!Test

# 4. Verificar en el dashboard:
✅ Nombre: "Demo User"
✅ Rol: "User"
✅ Balance: $0.00
✅ Email: demo@nexusai.com
```

### Prueba 2: Usuario Admin

```bash
# 1. Cerrar sesión

# 2. Acceder al login del admin
URL: http://localhost:3000/admin/login

# 3. Iniciar sesión con usuario admin
Email: admin@nexusai.com  # O el que tenga is_admin=true
Password: [tu contraseña]

# 4. Verificar en el dashboard:
✅ Nombre: [Nombre del admin]
✅ Rol: "Admin"
✅ Puede acceder a /admin/*
```

### Prueba 3: Verificar aislamiento

```bash
# 1. Login como usuario normal
# 2. Copiar el ID del usuario desde la consola del navegador
# 3. Logout
# 4. Login como otro usuario normal
# 5. Verificar que el perfil cambió completamente
```

---

## 💡 Notas Técnicas

### ¿Por qué había "Robiul Hasan"?

Probablemente es un **nombre de ejemplo** de la plantilla WowDash que se usó como base del proyecto. Se quedó hardcodeado como fallback cuando no había sesión de NextAuth (que nunca se configuró porque el proyecto usa Supabase).

### ¿Por qué usaba NextAuth si el proyecto usa Supabase?

El componente `ProfileDropdown` fue tomado de la plantilla WowDash que originalmente usaba NextAuth. No se actualizó para usar Supabase Auth.

### ¿Se puede unificar con el admin?

**Sí**, el componente ahora funciona tanto para admin como para usuarios normales porque:
- Usa `useAuth()` que obtiene el usuario actual
- Detecta automáticamente `is_admin`
- Muestra el rol correcto según el perfil

---

## 📚 Documentación Relacionada

- [SOLUCION_BACKOFFICE_LOGIN.md](SOLUCION_BACKOFFICE_LOGIN.md) - Solución del loop de login
- [SOLUCION_LOGIN_PENSANDO.md](SOLUCION_LOGIN_PENSANDO.md) - Solución del login admin
- [CONFIGURACION_LOGIN_ADMIN_FINAL.md](CONFIGURACION_LOGIN_ADMIN_FINAL.md) - Configuración admin completa

---

## ⚠️ Áreas NO Modificadas

- ✅ `/app/actions/admin.ts` - Sin cambios
- ✅ `/app/actions/auth.ts` - Sin cambios
- ✅ `/app/admin/login/page.tsx` - Sin cambios
- ✅ `/middleware.ts` - Sin cambios
- ✅ `/utils/supabase/middleware.ts` - Sin cambios

---

**Fecha:** 2025-10-19  
**Status:** ✅ CORREGIDO  
**Área afectada:** Backoffice - Visualización de perfil  
**Componente corregido:** ProfileDropdown  
**Área NO afectada:** Admin Area (funciona correctamente)

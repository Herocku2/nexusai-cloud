# 🔐 CONFIGURACIÓN DE OAUTH CON SUPABASE - GOOGLE & GITHUB

## ✅ IMPLEMENTACIÓN COMPLETADA

Ya he implementado todo el código necesario para el login social con Supabase. Ahora necesitas configurar los proveedores en Supabase Dashboard y obtener las credenciales.

---

## 📋 ARCHIVOS CREADOS/MODIFICADOS

### ✅ Archivos Nuevos
1. **`app/actions/social-auth.ts`** - Server actions para OAuth
2. **`app/auth/callback/route.ts`** - Ruta de callback OAuth
3. Este documento de configuración

### ✅ Archivos Modificados
1. **`components/auth/social-login.tsx`** - Componente actualizado
2. **`app/actions/index.ts`** - Exportaciones actualizadas
3. **`middleware.ts`** - Ruta callback agregada
4. **`utils/supabase/middleware.ts`** - Callback en rutas públicas

---

## 🔧 CONFIGURACIÓN DE GOOGLE OAUTH

### Paso 1: Crear Proyecto en Google Cloud Console

1. **Ve a Google Cloud Console:**
   ```
   https://console.cloud.google.com
   ```

2. **Crea un nuevo proyecto o selecciona uno existente**

3. **Habilita Google+ API:**
   - Ve a "APIs & Services" → "Library"
   - Busca "Google+ API"
   - Click en "Enable"

### Paso 2: Crear OAuth 2.0 Client ID

1. **Ve a Credentials:**
   ```
   APIs & Services → Credentials
   ```

2. **Configurar pantalla de consentimiento:**
   - Click en "Configure Consent Screen"
   - Selecciona "External"
   - Completa la información:
     - App name: `Nexus AI Platform`
     - User support email: tu email
     - Developer contact: tu email
   - Guarda

3. **Crear credenciales:**
   - Click en "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `Nexus AI - Production`

4. **Configurar URLs autorizadas:**

   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://tu-dominio.com (producción)
   ```

   **Authorized redirect URIs:**
   ```
   https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

5. **Copiar credenciales:**
   - Client ID
   - Client Secret

### Paso 3: Configurar en Supabase

1. **Ve a Supabase Dashboard:**
   ```
   https://app.supabase.com/project/syjougqrwcvqbqleqtss
   ```

2. **Ir a Authentication → Providers:**
   ```
   Authentication → Settings → Auth Providers
   ```

3. **Buscar y habilitar Google:**
   - Toggle "Google" a ON
   - Pega el **Client ID** de Google
   - Pega el **Client Secret** de Google
   - Click en "Save"

---

## 🔧 CONFIGURACIÓN DE GITHUB OAUTH

### Paso 1: Crear OAuth App en GitHub

1. **Ve a GitHub Settings:**
   ```
   https://github.com/settings/developers
   ```

2. **OAuth Apps → New OAuth App:**
   - Application name: `Nexus AI Platform`
   - Homepage URL: `http://localhost:3000`
   - Application description: `Plataforma MLM + Academia IA`
   
3. **Authorization callback URL:**
   ```
   https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
   ```

4. **Registrar aplicación:**
   - Click en "Register application"

5. **Copiar credenciales:**
   - Client ID (visible)
   - Click en "Generate a new client secret"
   - Copia el Client Secret (solo se muestra una vez)

### Paso 2: Configurar en Supabase

1. **Ve a Supabase Dashboard:**
   ```
   https://app.supabase.com/project/syjougqrwcvqbqleqtss
   ```

2. **Ir a Authentication → Providers:**
   ```
   Authentication → Settings → Auth Providers
   ```

3. **Buscar y habilitar GitHub:**
   - Toggle "GitHub" a ON
   - Pega el **Client ID** de GitHub
   - Pega el **Client Secret** de GitHub
   - Click en "Save"

---

## 🔑 CONFIGURAR VARIABLES DE ENTORNO (OPCIONAL)

Aunque las credenciales se guardan en Supabase, puedes documentarlas en tu `.env.local`:

```env
# OAuth Providers (solo para referencia - se configuran en Supabase)
# Google OAuth
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=tu-github-client-id
GITHUB_CLIENT_SECRET=tu-github-client-secret
```

**NOTA:** Estas variables NO son necesarias en el código porque Supabase maneja todo internamente.

---

## 🧪 PROBAR LA CONFIGURACIÓN

### Paso 1: Reiniciar el Servidor

```bash
# Detener el servidor actual (Ctrl+C)
# Iniciar de nuevo
cd "nexusai/front end/wowdash"
npm run dev
```

### Paso 2: Probar Login con Google

1. Ve a: `http://localhost:3000/auth/login`
2. Click en el botón "Google"
3. Deberías ser redirigido a la página de login de Google
4. Selecciona tu cuenta de Google
5. Autoriza la aplicación
6. Serás redirigido a `/dashboard`

### Paso 3: Probar Login con GitHub

1. Ve a: `http://localhost:3000/auth/login`
2. Click en el botón "Github"
3. Deberías ser redirigido a la página de login de GitHub
4. Autoriza la aplicación
5. Serás redirigido a `/dashboard`

---

## 🔍 VERIFICAR QUE FUNCIONA

### En Supabase Dashboard

1. **Ver usuarios autenticados:**
   ```
   Authentication → Users
   ```
   - Verás los usuarios que se registraron con Google/GitHub
   - El campo "Provider" mostrará "google" o "github"

2. **Ver datos del perfil:**
   ```
   Table Editor → user_profiles
   ```
   - Se creará automáticamente un perfil para cada usuario OAuth
   - Nombre extraído de los datos de Google/GitHub

### En la Aplicación

1. **Login exitoso:**
   - Usuario redirigido a `/dashboard`
   - Datos del usuario visibles
   - Sesión activa

2. **Perfil creado:**
   - Balance: $0.00
   - Status: inactive
   - Nombre del usuario de Google/GitHub

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: "Invalid redirect_uri"

**Causa:** La URL de redirección no está autorizada

**Solución:**
1. Verifica que agregaste la URL correcta en Google Cloud Console / GitHub
2. La URL debe ser exactamente:
   ```
   https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
   ```

### Error: "Client ID not found"

**Causa:** Credenciales incorrectas en Supabase

**Solución:**
1. Revisa que pegaste correctamente Client ID y Secret
2. Verifica que el proveedor esté habilitado (toggle ON)

### Error: "User not found"

**Causa:** El perfil del usuario no se creó

**Solución:**
1. El código del callback debería crear el perfil automáticamente
2. Verifica la tabla `user_profiles` en Supabase
3. Revisa los logs del servidor

### No redirige al dashboard

**Causa:** Problema con el callback

**Solución:**
1. Verifica que la ruta `/auth/callback` existe
2. Revisa los logs del servidor para errores
3. Verifica que el middleware permite la ruta

---

## 📊 FLUJO COMPLETO DEL OAUTH

```
1. Usuario → Click en botón Google/GitHub
   ↓
2. Server Action (doSocialLogin)
   ↓
3. Supabase.auth.signInWithOAuth()
   ↓
4. Redirect a Google/GitHub
   ↓
5. Usuario autoriza
   ↓
6. Redirect a /auth/callback?code=xxx
   ↓
7. exchangeCodeForSession()
   ↓
8. Crear perfil si no existe
   ↓
9. Redirect a /dashboard
   ✓ Usuario autenticado
```

---

## 🔐 SEGURIDAD

### ✅ Implementado

- [x] PKCE flow automático por Supabase
- [x] Tokens seguros httpOnly
- [x] Validación de código OAuth
- [x] Creación automática de perfil
- [x] Redirect URLs validadas
- [x] CSRF protection

### 📝 Recomendaciones

1. **Producción:** Usa HTTPS siempre
2. **Secrets:** Nunca expongas Client Secrets
3. **Scopes:** Solo pide permisos necesarios
4. **Emails:** Verifica emails de usuarios OAuth

---

## 📱 PARA PRODUCCIÓN

### Actualizar URLs en Google Cloud Console

**Authorized JavaScript origins:**
```
https://tu-dominio.com
```

**Authorized redirect URIs:**
```
https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
https://tu-dominio.com/auth/callback
```

### Actualizar URLs en GitHub OAuth App

**Homepage URL:**
```
https://tu-dominio.com
```

**Authorization callback URL:**
```
https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### Google OAuth
- [ ] Proyecto creado en Google Cloud Console
- [ ] Google+ API habilitada
- [ ] Pantalla de consentimiento configurada
- [ ] OAuth Client ID creado
- [ ] URLs autorizadas configuradas
- [ ] Credenciales copiadas
- [ ] Google habilitado en Supabase
- [ ] Client ID pegado en Supabase
- [ ] Client Secret pegado en Supabase
- [ ] Configuración guardada

### GitHub OAuth
- [ ] OAuth App creada en GitHub
- [ ] Callback URL configurado
- [ ] Client ID copiado
- [ ] Client Secret generado y copiado
- [ ] GitHub habilitado en Supabase
- [ ] Client ID pegado en Supabase
- [ ] Client Secret pegado en Supabase
- [ ] Configuración guardada

### Testing
- [ ] Servidor reiniciado
- [ ] Login con Google probado
- [ ] Login con GitHub probado
- [ ] Perfil creado correctamente
- [ ] Redirección al dashboard funciona
- [ ] Usuario visible en Supabase

---

## 🎉 ¡LISTO!

Una vez completes la configuración en Supabase Dashboard, el login social estará completamente funcional.

**Los usuarios podrán:**
✅ Registrarse con Google
✅ Registrarse con GitHub
✅ Iniciar sesión con Google
✅ Iniciar sesión con GitHub
✅ Tener perfil creado automáticamente
✅ Acceder al dashboard inmediatamente

---

**Última actualización:** 2025-10-19  
**Estado:** ✅ Código implementado - Configuración pendiente en
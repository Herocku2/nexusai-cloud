# 🧪 GUÍA RÁPIDA DE PRUEBA - OAUTH CON SUPABASE

## ⚡ PASOS RÁPIDOS PARA PROBAR

### 1️⃣ Configurar en Supabase Dashboard (5 minutos)

**Ve a tu proyecto Supabase:**
```
https://app.supabase.com/project/syjougqrwcvqbqleqtss/auth/providers
```

**Habilita Google:**
1. Busca "Google" en la lista de providers
2. Activa el toggle
3. Deja los campos vacíos por ahora (modo de desarrollo)
4. Click "Save"

**Habilita GitHub:**
1. Busca "GitHub" en la lista de providers
2. Activa el toggle
3. Deja los campos vacíos por ahora (modo de desarrollo)
4. Click "Save"

**NOTA:** En modo de desarrollo, Supabase permite probar OAuth sin configurar credenciales, pero solo para testing local.

---

### 2️⃣ Verificar Código Implementado ✅

Ya está todo listo:
- ✅ Server actions creadas
- ✅ Ruta de callback configurada
- ✅ Componente de social login actualizado
- ✅ Middleware configurado
- ✅ Integrado en login y registro

---

### 3️⃣ Probar Login Social

**Opción A: Modo de Desarrollo (Sin credenciales)**

1. Abre tu navegador en:
   ```
   http://localhost:3000/auth/login
   ```

2. Verás los botones de Google y GitHub

3. Click en "Google" o "Github"

4. **Resultado esperado:**
   - En desarrollo sin credenciales: Error de configuración
   - Con credenciales: Redirección a la página de login del proveedor

**Opción B: Con Credenciales Completas**

Sigue la guía completa en `CONFIGURACION_OAUTH_SUPABASE.md` para obtener:
- Google Client ID y Secret
- GitHub Client ID y Secret

---

## 🔧 CONFIGURACIÓN RÁPIDA PARA TESTING

### Google OAuth (10 minutos)

1. **Google Cloud Console:**
   ```
   https://console.cloud.google.com
   ```

2. **Crear proyecto → APIs & Services → Credentials**

3. **Configurar OAuth consent screen:**
   - User Type: External
   - App name: Nexus AI
   - Support email: tu-email@example.com

4. **Crear OAuth Client ID:**
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
     ```

5. **Copiar Client ID y Secret**

6. **Pegar en Supabase:**
   - Dashboard → Auth → Providers → Google
   - Enabled: ON
   - Client ID: [pegar]
   - Client Secret: [pegar]
   - Save

### GitHub OAuth (5 minutos)

1. **GitHub Settings:**
   ```
   https://github.com/settings/developers
   ```

2. **New OAuth App:**
   - Application name: Nexus AI
   - Homepage URL: http://localhost:3000
   - Authorization callback URL:
     ```
     https://syjougqrwcvqbqleqtss.supabase.co/auth/v1/callback
     ```

3. **Copiar Client ID**

4. **Generate Client Secret → Copiar**

5. **Pegar en Supabase:**
   - Dashboard → Auth → Providers → GitHub
   - Enabled: ON
   - Client ID: [pegar]
   - Client Secret: [pegar]
   - Save

---

## 🎯 PROBAR FLUJO COMPLETO

### Test 1: Login con Google

1. Ve a `http://localhost:3000/auth/login`
2. Click en botón "Google"
3. Selecciona cuenta de Google
4. Autoriza la aplicación
5. **Resultado esperado:**
   - Redirección a `/dashboard`
   - Usuario autenticado
   - Perfil creado en base de datos

### Test 2: Login con GitHub

1. Ve a `http://localhost:3000/auth/login`
2. Click en botón "Github"
3. Autoriza con GitHub
4. **Resultado esperado:**
   - Redirección a `/dashboard`
   - Usuario autenticado
   - Perfil creado en base de datos

### Test 3: Registro con Google

1. Ve a `http://localhost:3000/auth/register`
2. Click en botón "Google"
3. Selecciona cuenta de Google
4. Autoriza
5. **Resultado esperado:**
   - Usuario creado
   - Perfil generado
   - Redirección a `/dashboard`

---

## ✅ VERIFICAR QUE FUNCIONA

### En Supabase Dashboard

**Ver usuarios creados:**
```
https://app.supabase.com/project/syjougqrwcvqbqleqtss/auth/users
```

**Verificar:**
- [x] Usuario aparece en la lista
- [x] Provider es "google" o "github"
- [x] Email del proveedor OAuth
- [x] Avatar del proveedor

**Ver perfiles creados:**
```
https://app.supabase.com/project/syjougqrwcvqbqleqtss/editor
```

Tabla: `user_profiles`
- [x] Registro creado con user_id del OAuth
- [x] Nombre extraído del proveedor
- [x] Status: inactive
- [x] Balance: 0

### En la Aplicación

**Dashboard:**
```
http://localhost:3000/dashboard
```

Verificar:
- [x] Nombre del usuario visible
- [x] Email del OAuth
- [x] Avatar (si disponible)
- [x] Sesión activa
- [x] Puede navegar por la app

---

## 🐛 DEBUGGING

### Ver logs del servidor

El servidor ya está corriendo. Verás los logs de:
- Inicio de OAuth
- Callback recibido
- Sesión creada
- Perfil creado
- Redirección al dashboard

### Errores comunes

**"Invalid redirect_uri"**
→ Verifica la URL de callback en Google/GitHub

**"Client ID not found"**
→ Revisa las credenciales en Supabase

**"User profile not created"**
→ Revisa los logs del callback

---

## 📊 DATOS DE PRUEBA

Puedes usar tus propias cuentas:
- Google personal
- GitHub personal
- Múltiples cuentas para probar

Cada cuenta OAuth creará:
- 1 usuario en Supabase Auth
- 1 perfil en user_profiles
- Sesión activa

---

## 🚀 PRÓXIMOS PASOS

Una vez que el OAuth funcione:

1. **Personalizar datos del perfil:**
   - Agregar más información del proveedor
   - Configurar avatar
   - Extraer más metadata

2. **Vincular con sponsor:**
   - Permitir link de referido con OAuth
   - Guardar sponsor_id en el callback

3. **Mejorar UX:**
   - Loading states
   - Mensajes de error personalizados
   - Confirmación de email si es necesario

---

## 🎉 ¡TODO LISTO!

El código está implementado. Solo necesitas:

1. ✅ Habilitar proveedores en Supabase
2. ✅ Obtener credenciales (opcional para testing)
3. ✅ Probar el login

**El servidor ya está corriendo en:**
```
http://localhost:3000
```

**Puedes empezar a probar inmediatamente!** 🚀

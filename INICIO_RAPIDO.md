# 🚀 INICIO RÁPIDO - 5 Minutos para Probar la Autenticación

## ⏱️ Configuración Express (5 minutos)

### Paso 1: Crear Proyecto en Supabase (2 min)

1. Ve a: https://app.supabase.com
2. Click en **"New Project"**
3. Completa:
   - Name: `wowdash-test`
   - Database Password: (guarda esto)
   - Region: Más cercana a ti
4. Click **"Create new project"**
5. Espera 1-2 minutos

### Paso 2: Copiar Credenciales (1 min)

1. En tu proyecto, ve a: **Settings** ⚙️ → **API**
2. Copia estos dos valores:

```
Project URL: https://xxxxx.supabase.co
anon key: eyJhbGci...
```

### Paso 3: Configurar Variables de Entorno (30 seg)

1. Abre el archivo `.env.local`
2. Pega tus credenciales:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Guarda el archivo

### Paso 4: Configurar Email Template (1 min)

1. En Supabase Dashboard: **Authentication** → **Email Templates**
2. Click en **"Confirm signup"**
3. Busca: `{{ .ConfirmationURL }}`
4. Reemplaza con:
```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```
5. Click **"Save"**

### Paso 5: Reiniciar Servidor (30 seg)

```bash
# Detén el servidor (Ctrl + C)
npm run dev
```

## ✅ ¡Listo para Probar!

### Opción 1: Deshabilitar Confirmación de Email (Desarrollo)

Para testing rápido sin emails:

1. **Authentication** → **Providers** → **Email**
2. Desactiva **"Confirm email"**
3. Click **"Save"**

### Opción 2: Usar Confirmación de Email (Recomendado)

Mantén la confirmación activada y revisa tu email.

---

## 🧪 Probar Ahora

### 1. Registrarse

```
URL: http://localhost:3000/auth/register

1. Ingresa tu email real
2. Crea un username
3. Elige una contraseña
4. Click "Sign Up"
```

**Con confirmación:** Revisa tu email  
**Sin confirmación:** Serás redirigido al dashboard

### 2. Iniciar Sesión

```
URL: http://localhost:3000/auth/login

1. Ingresa tu email
2. Ingresa tu contraseña
3. Click "Sign In"
```

### 3. Ver Página Protegida

```
URL: http://localhost:3000/protected-example

Verás tu información de usuario
```

---

## 🎯 Verificar que Funciona

### En Supabase Dashboard

1. Ve a **Authentication** → **Users**
2. Deberías ver tu usuario registrado
3. Verifica el estado de confirmación

### En el Navegador

1. Abre DevTools (F12)
2. Ve a **Application** → **Cookies**
3. Busca cookies que empiecen con `sb-`
4. Deberías ver el access token

---

## 🐛 Problemas Comunes

### "Invalid API key"
```
✓ Verifica que copiaste las credenciales correctamente
✓ Reinicia el servidor: npm run dev
✓ Limpia caché del navegador
```

### No puedo iniciar sesión
```
✓ Verifica que el email esté confirmado
✓ O desactiva la confirmación para testing
✓ Revisa la consola del navegador
```

### Email no llega
```
✓ Revisa carpeta de spam
✓ Verifica el template en Supabase
✓ Supabase free tier: 3 emails/hora
```

### Redirección infinita
```
✓ Limpia cookies del navegador
✓ Verifica NEXT_PUBLIC_SITE_URL
✓ Reinicia el servidor
```

---

## 📝 Siguiente Paso

Una vez que funcione, lee la documentación completa:

```
📚 SUPABASE_SETUP_GUIDE.md    - Guía detallada
📚 USAGE_EXAMPLES.md          - Ejemplos de código
📚 ARCHITECTURE.md            - Cómo funciona todo
```

---

## 💡 Tips de Desarrollo

### Ver Logs de Autenticación

En Supabase Dashboard:
- **Authentication** → **Logs**
- Verás todos los intentos de login/registro

### Testing sin Email

Para desarrollo rápido:
1. Desactiva confirmación de email
2. Usa emails ficticios: `test1@test.com`
3. Reactiva confirmación para producción

### Debugging

```typescript
// En cualquier componente del cliente
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()
const { data } = await supabase.auth.getSession()
console.log('Current session:', data)
```

---

## 🎊 ¡Éxito!

Si llegaste aquí y todo funciona:

✅ **Autenticación configurada**  
✅ **Usuarios pueden registrarse**  
✅ **Usuarios pueden iniciar sesión**  
✅ **Rutas están protegidas**  
✅ **Sesión persiste**  

**¡Ahora puedes construir tu aplicación!** 🚀

---

## 📞 ¿Necesitas Ayuda?

1. Revisa `SUPABASE_SETUP_GUIDE.md` para guía detallada
2. Revisa `USAGE_EXAMPLES.md` para ejemplos de código
3. Consulta la documentación de Supabase
4. Únete al Discord de Supabase

---

**Tiempo total:** ~5 minutos  
**Dificultad:** Fácil  
**Resultado:** Autenticación completa funcionando ✨

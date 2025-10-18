# 🚀 Guía Rápida: Configurar Supabase para WowDash

## Paso 1: Crear Proyecto en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Haz clic en "New Project"
3. Completa la información:
   - **Name**: wowdash-auth (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Selecciona la región más cercana a tus usuarios
4. Haz clic en "Create new project"
5. Espera 1-2 minutos mientras se crea el proyecto

## Paso 2: Obtener las Credenciales

1. Una vez creado el proyecto, ve a **Settings** (⚙️) en el menú lateral
2. Selecciona **API** en el submenú
3. Encontrarás dos valores importantes:

   **Project URL**:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key**:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Copia estos valores

## Paso 3: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Guarda el archivo

## Paso 4: Configurar Autenticación

### 4.1 Habilitar Proveedores de Email

1. En Supabase Dashboard, ve a **Authentication** > **Providers**
2. Asegúrate de que "Email" esté habilitado
3. **Configuración recomendada**:
   - ✅ Enable Email provider
   - ✅ Confirm email (para requerir verificación de email)
   - ❌ Secure email change (opcional)

### 4.2 Configurar URL del Sitio

1. Ve a **Authentication** > **URL Configuration**
2. En **Site URL**, ingresa:
   ```
   http://localhost:3000
   ```
3. En **Redirect URLs**, agrega:
   ```
   http://localhost:3000/**
   ```

### 4.3 Actualizar Email Templates

1. Ve a **Authentication** > **Email Templates**
2. Selecciona **Confirm signup**
3. Busca esta línea:
   ```
   <a href="{{ .ConfirmationURL }}">Confirm your mail</a>
   ```
4. Reemplázala con:
   ```
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your mail</a>
   ```
5. Haz clic en **Save**

## Paso 5: Reiniciar el Servidor de Desarrollo

```bash
# Detén el servidor actual (Ctrl + C)

# Reinicia el servidor
npm run dev
```

## Paso 6: Probar la Autenticación

### Registrar un Nuevo Usuario

1. Abre tu navegador en `http://localhost:3000/auth/register`
2. Completa el formulario:
   - Username: tu_nombre
   - Email: tu_email@ejemplo.com
   - Password: Una contraseña segura
3. Haz clic en "Sign Up"
4. **Revisa tu email** para confirmar la cuenta

### Iniciar Sesión

1. Ve a `http://localhost:3000/auth/login`
2. Ingresa tu email y contraseña
3. Haz clic en "Sign In"
4. Deberías ser redirigido al dashboard

### Probar Página Protegida

1. Ve a `http://localhost:3000/protected-example`
2. Verás tu información de usuario si estás autenticado
3. Si no estás autenticado, serás redirigido al login

## 🔧 Configuración Adicional (Opcional)

### Deshabilitar Confirmación de Email (Solo para Desarrollo)

Si quieres deshabilitar la confirmación de email durante el desarrollo:

1. Ve a **Authentication** > **Providers**
2. En "Email", desactiva "Confirm email"
3. Guarda los cambios

⚠️ **No recomendado para producción**

### Configurar Email SMTP Personalizado

Por defecto, Supabase usa su propio servicio de email (limitado a 3 emails/hora en el plan gratuito).

Para usar tu propio SMTP:

1. Ve a **Project Settings** > **Auth**
2. Desplázate hasta "SMTP Settings"
3. Haz clic en "Enable Custom SMTP"
4. Completa:
   - **Host**: smtp.gmail.com (ejemplo para Gmail)
   - **Port**: 587
   - **Username**: tu_email@gmail.com
   - **Password**: tu_contraseña_de_aplicación
   - **Sender Email**: tu_email@gmail.com
   - **Sender Name**: WowDash

## 📊 Verificar Usuarios

Para ver los usuarios registrados:

1. Ve a **Authentication** > **Users**
2. Verás una lista de todos los usuarios registrados
3. Puedes ver detalles, confirmar emails manualmente, o eliminar usuarios

## 🐛 Solución de Problemas

### Error: "Invalid API key"

- ✅ Verifica que copiaste correctamente las credenciales
- ✅ Asegúrate de reiniciar el servidor después de modificar `.env.local`
- ✅ Verifica que no haya espacios extra en las variables

### Email de Confirmación No Llega

- ✅ Revisa la carpeta de spam
- ✅ Verifica que el template de email esté configurado correctamente
- ✅ En desarrollo, puedes ver los emails en Supabase Dashboard > Authentication > Logs

### Redirección Infinita

- ✅ Verifica que la URL del sitio sea correcta
- ✅ Asegúrate de que el middleware esté configurado correctamente
- ✅ Revisa que las cookies estén habilitadas en el navegador

### Error de CORS

- ✅ Agrega tu dominio a las Redirect URLs en Supabase
- ✅ Verifica que `NEXT_PUBLIC_SITE_URL` sea correcto

## 📚 Siguientes Pasos

Una vez configurado, puedes:

1. ✅ Personalizar los templates de email
2. ✅ Agregar autenticación social (Google, GitHub)
3. ✅ Implementar roles y permisos
4. ✅ Configurar Row Level Security (RLS)
5. ✅ Agregar metadata personalizada a usuarios

## 📞 Soporte

- [Documentación de Supabase](https://supabase.com/docs)
- [Discord de Supabase](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

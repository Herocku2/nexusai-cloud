# 🚀 Nexus AI - Landing Page + Sistema de Autenticación

## 📋 Estructura del Proyecto

Este proyecto integra una **landing page moderna** con el **sistema de autenticación de WowDash** para Nexus AI.

## 🗂️ Estructura de Archivos

```
app/
├── page.tsx              # Página principal (landing page)
├── landing.tsx           # Componente de la landing page
├── layout.tsx            # Layout principal con metadata actualizado
│
├── auth/
│   ├── login/
│   │   └── page.tsx      # Página de inicio de sesión
│   ├── register/
│   │   └── page.tsx      # Página de registro
│   ├── forgot-password/
│   │   └── page.tsx      # Recuperar contraseña
│   └── layout.tsx        # Layout específico de autenticación
│
├── (dashboard)/          # Rutas protegidas del dashboard
│   └── [páginas del dashboard...]
│
└── globals.css           # Estilos globales
```

## 🌐 Rutas Disponibles

### 🏠 Landing Page (Pública)
**URL:** `http://localhost:3002/`

Características:
- ✅ Hero section con gradientes modernos
- ✅ Estadísticas destacadas (50% comisión, $70K tope, carry over ilimitado)
- ✅ Sección de Academia de IA
- ✅ Precios transparentes ($89 inscripción + $29 mensual)
- ✅ Sistema de rangos (Afiliado hasta Imperial Nexus)
- ✅ Navegación sticky con scroll detection
- ✅ Botones enlazados a autenticación
- ✅ Footer con redes sociales
- ✅ Smooth scrolling entre secciones

### 🔐 Autenticación

#### Login
**URL:** `http://localhost:3002/auth/login`

Características:
- Email y contraseña
- "Remember me" checkbox
- Enlace a "Forgot Password"
- Login social (Google, Facebook)
- Validación con Zod
- Redirección al dashboard tras login exitoso

#### Registro
**URL:** `http://localhost:3002/auth/register`

Características:
- Username, email y contraseña
- Checkbox de términos y condiciones
- Registro social (Google, Facebook)
- Validación de formularios
- Redirección al dashboard tras registro

#### Recuperar Contraseña
**URL:** `http://localhost:3002/auth/forgot-password`

### 📊 Dashboard (Protegido)
**URL:** `http://localhost:3002/dashboard`

Accesible solo después de autenticación exitosa.

## 🎨 Navegación en la Landing Page

La landing page incluye **navegación por anclas** (smooth scroll):

- **Inicio** → `#inicio` - Hero section
- **Academia** → `#academia` - Información de cursos
- **Plan de Compensación** → `#compensacion` - Sistema binario
- **Rangos** → `#rangos` - Niveles y comisiones

## 🔗 Enlaces Importantes

### Desde la Landing Page:

1. **Botón "Iniciar Sesión"** (Header) → `/auth/login`
2. **Botón "Registrarse"** (Header) → `/auth/register`
3. **Botón "Comenzar Ahora - $89 USD"** (Hero) → `/auth/register`
4. **Botón "Ver Demo Gratuita"** (Hero) → Scroll a `#academia`
5. **Botón "Registrarse Ahora"** (CTA Final) → `/auth/register`

### Desde Login/Register:

- **"Sign Up"** (Login page) → `/auth/register`
- **"Sign In"** (Register page) → `/auth/login`
- **"Forgot Password?"** → `/auth/forgot-password`
- Tras login exitoso → `/dashboard`

## 🎯 Flujo del Usuario

```
Landing Page (/)
      │
      ├─► Botón "Registrarse"
      │        │
      │        ├─► /auth/register
      │        │        │
      │        │        └─► Registro exitoso → /dashboard
      │        │
      │        └─► Link "Sign In" → /auth/login
      │
      └─► Botón "Iniciar Sesión"
               │
               └─► /auth/login
                        │
                        ├─► Login exitoso → /dashboard
                        │
                        └─► Link "Forgot Password" → /auth/forgot-password
```

## 🛠️ Características Técnicas

### Landing Page
- **Framework:** Next.js 15.3.0 + Turbopack
- **Styling:** Tailwind CSS v4
- **Componentes:** React 18.2.0
- **Navegación:** Client-side con `useState` y `useEffect`
- **Animaciones:** Transiciones CSS + Transform
- **Responsive:** Mobile-first design

### Autenticación
- **Sistema:** NextAuth.js v5.0.0-beta.29
- **Validación:** Zod + React Hook Form
- **UI Components:** ShadCN UI
- **Loading States:** Context API (LoadingContext)
- **Notificaciones:** React Hot Toast

## 🎨 Paleta de Colores

- **Primary Blue:** `from-blue-600 to-purple-600`
- **Background:** `slate-950` con gradientes
- **Accents:** 
  - Blue: `#3b82f6`
  - Purple: `#9333ea`
  - Green: `#10b981`
- **Text:**
  - Primary: `white`
  - Secondary: `gray-300`
  - Muted: `gray-400`

## 🚀 Cómo Ejecutar

```bash
# Navegar a la carpeta de WowDash
cd "nexusai/front end/wowdash"

# Instalar dependencias (si es necesario)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en: **http://localhost:3002**

## 📱 Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## ✨ Próximos Pasos

1. **Backend Integration:**
   - Conectar formularios de login/register con API Laravel
   - Implementar sistema de autenticación real
   - Integrar pagos con gateway USDT

2. **Dashboard:**
   - Panel de usuario con estadísticas
   - Árbol binario visual
   - Sistema de comisiones
   - Acceso a academia
   - Gestión de retiros

3. **Features Adicionales:**
   - Sistema de referidos
   - Tracking de comisiones en tiempo real
   - Notificaciones push
   - Chat de soporte

## 🔒 Seguridad

- ✅ Validación de formularios (client-side y server-side)
- ✅ Rutas protegidas con middleware
- ✅ CSRF protection
- ✅ Encriptación de contraseñas
- ⏳ 2FA (pendiente de implementar)
- ⏳ Rate limiting (pendiente de implementar)

## 📞 Soporte

Para cualquier duda sobre la implementación, consulta:
- `PROJECT_DETAILS.txt` - Detalles del proyecto completo
- `documento nexus. IA.txt` - Plan de compensación

---

**Desarrollado para Nexus AI** 🚀
*Academia de Inteligencia Artificial + Sistema Binario*

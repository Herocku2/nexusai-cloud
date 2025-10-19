# Guía de Uso del Sistema de Traducciones (i18n)

## 🎯 Cómo Usar las Traducciones

### 1. En Server Components (Componentes de Servidor)

```typescript
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('overview')}</p>
    </div>
  );
}
```

### 2. En Client Components (Componentes de Cliente)

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function MyButton() {
  const t = useTranslations('common');
  
  return (
    <button onClick={() => alert(t('welcome'))}>
      {t('login')}
    </button>
  );
}
```

### 3. Múltiples Namespaces

```typescript
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const tCommon = useTranslations('common');
  const tProfile = useTranslations('profile');
  
  return (
    <div>
      <h1>{tProfile('title')}</h1>
      <button>{tCommon('save')}</button>
    </div>
  );
}
```

## 📚 Estructura de Traducciones Disponibles

### common (Común)
```json
{
  "welcome": "Bienvenido / Welcome",
  "logout": "Cerrar Sesión / Logout",
  "login": "Iniciar Sesión / Login",
  "signup": "Registrarse / Sign Up",
  "save": "Guardar / Save",
  "cancel": "Cancelar / Cancel",
  "edit": "Editar / Edit",
  "delete": "Eliminar / Delete",
  "confirm": "Confirmar / Confirm",
  "close": "Cerrar / Close",
  "search": "Buscar / Search",
  "filter": "Filtrar / Filter",
  "loading": "Cargando... / Loading..."
}
```

### nav (Navegación)
```json
{
  "dashboard": "Panel Principal / Dashboard",
  "team": "Mi Equipo / My Team",
  "academy": "Academia / Academy",
  "wallet": "Billetera / Wallet",
  "payments": "Pagos & Depósitos / Payments & Deposits",
  "commissions": "Comisiones / Commissions",
  "ranks": "Mi Rango / My Rank",
  "profile": "Mi Perfil / My Profile",
  "messages": "Mensajes / Messages",
  "notifications": "Notificaciones / Notifications"
}
```

### dashboard (Panel Principal)
```json
{
  "title": "Panel de Control / Dashboard",
  "overview": "Resumen / Overview",
  "stats": "Estadísticas / Statistics",
  "recent": "Actividad Reciente / Recent Activity",
  "totalEarnings": "Ganancias Totales / Total Earnings",
  "activeMembers": "Miembros Activos / Active Members",
  "monthlyGrowth": "Crecimiento Mensual / Monthly Growth",
  "pendingPayments": "Pagos Pendientes / Pending Payments",
  "quickActions": "Acciones Rápidas / Quick Actions"
}
```

### team (Equipo)
```json
{
  "title": "Mi Equipo / My Team",
  "totalMembers": "Total de Miembros / Total Members",
  "directReferrals": "Referencias Directas / Direct Referrals",
  "leftLeg": "Pierna Izquierda / Left Leg",
  "rightLeg": "Pierna Derecha / Right Leg",
  "binaryTree": "Árbol Binario / Binary Tree",
  "genealogy": "Genealogía / Genealogy",
  "volume": "Volumen / Volume"
}
```

### academy (Academia)
```json
{
  "title": "Academia / Academy",
  "courses": "Cursos / Courses",
  "progress": "Progreso / Progress",
  "certificates": "Certificados / Certificates",
  "myCourses": "Mis Cursos / My Courses",
  "available": "Disponibles / Available",
  "completed": "Completados / Completed",
  "inProgress": "En Progreso / In Progress"
}
```

### wallet (Billetera)
```json
{
  "title": "Billetera / Wallet",
  "balance": "Saldo / Balance",
  "withdraw": "Retirar / Withdraw",
  "deposit": "Depositar / Deposit",
  "history": "Historial / History",
  "available": "Disponible / Available",
  "pending": "Pendiente / Pending",
  "total": "Total / Total"
}
```

### payments (Pagos)
```json
{
  "title": "Pagos & Depósitos / Payments & Deposits",
  "membership": "Membresía / Membership",
  "renewMembership": "Renovar Membresía / Renew Membership",
  "status": "Estado / Status",
  "active": "Activa / Active",
  "expired": "Expirada / Expired",
  "nextPayment": "Próximo Pago / Next Payment",
  "paymentHistory": "Historial de Pagos / Payment History"
}
```

### ranks (Rangos)
```json
{
  "title": "Mi Rango / My Rank",
  "currentRank": "Rango Actual / Current Rank",
  "nextRank": "Próximo Rango / Next Rank",
  "progress": "Progreso / Progress",
  "requirements": "Requisitos / Requirements",
  "benefits": "Beneficios / Benefits",
  "history": "Historial / History"
}
```

### profile (Perfil)
```json
{
  "title": "Mi Perfil / My Profile",
  "personalInfo": "Información Personal / Personal Information",
  "accountSettings": "Configuración de Cuenta / Account Settings",
  "security": "Seguridad / Security",
  "changePassword": "Cambiar Contraseña / Change Password",
  "twoFactor": "Autenticación de Dos Factores / Two-Factor Auth",
  "notifications": "Notificaciones / Notifications"
}
```

### auth (Autenticación)
```json
{
  "login": "Iniciar Sesión / Login",
  "signup": "Registrarse / Sign Up",
  "forgotPassword": "¿Olvidaste tu contraseña? / Forgot Password?",
  "resetPassword": "Restablecer Contraseña / Reset Password",
  "email": "Correo Electrónico / Email",
  "password": "Contraseña / Password",
  "confirmPassword": "Confirmar Contraseña / Confirm Password",
  "rememberMe": "Recordarme / Remember Me"
}
```

### admin (Administración)
```json
{
  "title": "Panel de Administración / Admin Panel",
  "users": "Usuarios / Users",
  "courses": "Cursos / Courses",
  "reports": "Reportes / Reports",
  "settings": "Configuración / Settings",
  "analytics": "Analíticas / Analytics",
  "withdrawals": "Retiros / Withdrawals",
  "deposits": "Depósitos / Deposits"
}
```

## 🔧 Ejemplos Prácticos

### Ejemplo 1: Sidebar con Traducciones

```typescript
'use client';

import { useTranslations } from 'next-intl';
import { House, Network, Wallet } from 'lucide-react';

export function Sidebar() {
  const t = useTranslations('nav');
  
  const menuItems = [
    { title: t('dashboard'), url: '/dashboard', icon: House },
    { title: t('team'), url: '/dashboard/team', icon: Network },
    { title: t('wallet'), url: '/dashboard/wallet', icon: Wallet },
  ];
  
  return (
    <nav>
      {menuItems.map((item) => (
        <a key={item.url} href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </a>
      ))}
    </nav>
  );
}
```

### Ejemplo 2: Dashboard con Múltiples Namespaces

```typescript
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const tDash = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  
  return (
    <div>
      <h1>{tDash('title')}</h1>
      <p>{tDash('overview')}</p>
      
      <div className="stats">
        <div>
          <label>{tDash('totalEarnings')}</label>
          <p>$1,234.56</p>
        </div>
        <div>
          <label>{tDash('activeMembers')}</label>
          <p>45</p>
        </div>
      </div>
      
      <button>{tCommon('save')}</button>
    </div>
  );
}
```

### Ejemplo 3: Formulario de Login

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function LoginForm() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  
  return (
    <form>
      <h1>{t('login')}</h1>
      
      <label>{t('email')}</label>
      <input type="email" placeholder={t('email')} />
      
      <label>{t('password')}</label>
      <input type="password" placeholder={t('password')} />
      
      <label>
        <input type="checkbox" />
        {t('rememberMe')}
      </label>
      
      <button type="submit">{tCommon('login')}</button>
      
      <a href="/auth/forgot-password">
        {t('forgotPassword')}
      </a>
    </form>
  );
}
```

### Ejemplo 4: Selector de Idiomas (Ya Implementado)

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSelect() {
  const locale = useLocale(); // 'es' o 'en'
  const router = useRouter();
  const pathname = usePathname();
  
  const changeLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\\/es|^\\/en/, '') || '/';
    const newPath = newLocale === 'es' 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
    router.refresh();
  };
  
  return (
    <select value={locale} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="es">🇪🇸 Español</option>
      <option value="en">🇺🇸 English</option>
    </select>
  );
}
```

## 🚀 Migración de Componentes Existentes

### Antes (Sin Traducciones)
```typescript
export function Header() {
  return (
    <header>
      <h1>Panel Principal</h1>
      <button>Cerrar Sesión</button>
    </header>
  );
}
```

### Después (Con Traducciones)
```typescript
'use client';

import { useTranslations } from 'next-intl';

export function Header() {
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');
  
  return (
    <header>
      <h1>{tNav('dashboard')}</h1>
      <button>{tCommon('logout')}</button>
    </header>
  );
}
```

## 🎨 Componentes a Actualizar

Lista de archivos que necesitan migración a traducciones:

### Alta Prioridad
1. ✅ `components/shared/language-select.tsx` - **Completado**
2. 🔄 `components/sidebar-data.ts` - Menú de navegación
3. 🔄 `components/layout/header.tsx` - Header principal
4. 🔄 `app/dashboard/page.tsx` - Dashboard principal
5. 🔄 `app/auth/login/page.tsx` - Login

### Media Prioridad
6. 🔄 `app/dashboard/team/page.tsx` - Vista de equipo
7. 🔄 `app/dashboard/academy/page.tsx` - Academia
8. 🔄 `app/dashboard/wallet/page.tsx` - Billetera
9. 🔄 `app/dashboard/payments/page.tsx` - Pagos
10. 🔄 `app/dashboard/ranks/page.tsx` - Rangos

### Baja Prioridad
11. 🔄 `app/dashboard/profile/page.tsx` - Perfil
12. 🔄 Otros componentes según necesidad

## ✅ Checklist de Migración

Para cada componente:
- [ ] Importar `useTranslations` desde 'next-intl'
- [ ] Identificar namespace correcto (nav, dashboard, common, etc.)
- [ ] Reemplazar strings hardcodeados con `t('key')`
- [ ] Probar en ambos idiomas (es/en)
- [ ] Verificar que no haya errores de compilación
- [ ] Confirmar que el diseño se mantiene igual

## 🌐 URLs con Idiomas

El sistema maneja automáticamente las URLs:

- **Español (por defecto)**: `/dashboard`, `/dashboard/team`
- **Inglés**: `/en/dashboard`, `/en/team`

El middleware de next-intl se encarga de:
1. Detectar el idioma del navegador en primera visita
2. Guardar preferencia en cookies
3. Redirigir automáticamente según preferencia
4. Mantener el idioma al navegar entre páginas

## 🐛 Debugging

Si las traducciones no aparecen:

1. **Verificar que el componente tiene 'use client'** (si usa hooks)
2. **Verificar que el namespace existe** en `messages/es.json` y `messages/en.json`
3. **Verificar que la key existe** en el namespace
4. **Revisar consola del navegador** para errores
5. **Reiniciar servidor** si hiciste cambios en archivos de mensajes

```bash
# Detener servidor
Ctrl + C

# Iniciar nuevamente
npm run dev
```

## 📖 Recursos

- [Documentación next-intl](https://next-intl-docs.vercel.app/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Archivo de traducciones ES](/messages/es.json)
- [Archivo de traducciones EN](/messages/en.json)

---

**Última actualización**: 2025-10-19
**Estado**: ✅ Sistema implementado y funcionando
**Próximos pasos**: Migrar componentes existentes a usar traducciones

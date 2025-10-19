# 🚀 Nexus AI - Sistema MLM Binario + Academia LMS

**Versión**: 1.0.0  
**Tecnologías**: Next.js 15 + Supabase + WowDash + Tailwind CSS  
**Estado**: ✅ Configuración Inicial Completada

---

## 📖 ÍNDICE

1. [Resumen del Proyecto](#-resumen-del-proyecto)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Lo Que YA Funciona](#-lo-que-ya-funciona)
4. [Nuevo Menú Implementado](#-nuevo-menú-implementado)
5. [Estructura de Archivos](#-estructura-de-archivos)
6. [Documentación Disponible](#-documentación-disponible)
7. [Próximos Pasos](#-próximos-pasos)
8. [Guía Rápida de Desarrollo](#-guía-rápida-de-desarrollo)

---

## 🎯 RESUMEN DEL PROYECTO

Nexus AI es una plataforma completa de **Academia LMS + Sistema Multinivel Binario (MLM)** construida con tecnologías modernas:

- **Academia LMS**: Cursos de Inteligencia Artificial con videos, quizzes, certificados y clases en vivo
- **Sistema Binario MLM**: Red binaria con comisiones, rangos y bonos según plan de compensación
- **Pagos en Criptomonedas**: Depósitos y retiros en USDT (BEP-20) en Binance Smart Chain

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **Next.js 15.3** - Framework React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **WowDash Template** - Template admin profesional
- **Tailwind CSS 4** - Framework CSS utility-first
- **TypeScript** - Tipado estático
- **Shadcn/UI** - Componentes UI reutilizables

### Backend
- **Supabase Auth** - Autenticación completa
- **Supabase Database** - PostgreSQL con RLS
- **Supabase Edge Functions** - Funciones serverless
- **Supabase Realtime** - Actualizaciones en tiempo real
- **Supabase Storage** - Almacenamiento de archivos

### Pagos & Notificaciones
- **NowPayments API** - Procesamiento de USDT (BEP-20)
- **SendGrid** - Envío de emails
- **Binance Smart Chain** - Red blockchain para pagos

---

## ✅ LO QUE YA FUNCIONA

### 🔐 Autenticación Completa (NO TOCAR - YA FUNCIONA)
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Verificación de email
- ✅ Recuperación de contraseña
- ✅ Redirección al dashboard después del login
- ✅ Protección de rutas con middleware
- ✅ Sesión persistente

### 🎨 UI/UX
- ✅ Landing page responsive
- ✅ Dashboard layout con sidebar
- ✅ Tema claro/oscuro
- ✅ Navegación funcional
- ✅ Componentes UI (buttons, cards, forms, etc.)

### 🗄️ Configuración Base
- ✅ Supabase conectado y configurado
- ✅ Variables de entorno configuradas
- ✅ TypeScript configurado
- ✅ Tailwind CSS configurado
- ✅ Proyecto corriendo en puerto 3003

---

## 🧭 NUEVO MENÚ IMPLEMENTADO

El menú lateral ha sido completamente rediseñado para el negocio MLM + Academia:

```
📊 Dashboard
└── Panel principal con estadísticas

🌐 RED & NEGOCIOS
├── Mi Red Binaria
│   ├── Árbol Binario          (/binary-tree)
│   ├── Mi Red                  (/my-network)
│   ├── Patrocinados            (/sponsored)
│   └── Genealogía              (/genealogy)
│
├── Comisiones
│   ├── Resumen de Ganancias    (/commissions/earnings)
│   ├── Historial               (/commissions/history)
│   ├── Bono Inicio Rápido      (/commissions/fast-start)
│   ├── Bono Binario            (/commissions/binary)
│   ├── Bono Igualación         (/commissions/matching)
│   └── Reportes                (/commissions/reports)
│
├── Billetera
│   ├── Balance                 (/wallet/balance)
│   ├── Depositar USDT          (/wallet/deposit)
│   ├── Retirar Fondos          (/wallet/withdraw)
│   ├── Transacciones           (/wallet/transactions)
│   └── Membresía               (/wallet/membership)
│
└── Mi Rango
    ├── Rango Actual            (/rank/current)
    ├── Progreso                (/rank/progress)
    ├── Requisitos              (/rank/requirements)
    └── Historial de Rangos     (/rank/history)

🎓 ACADEMIA & APRENDIZAJE
└── Academia
    ├── Mis Cursos              (/academy/courses)
    ├── Categorías              (/academy/categories)
    ├── Mi Progreso             (/academy/progress)
    ├── Certificados            (/academy/certificates)
    ├── Clases en Vivo          (/academy/live-classes)
    └── Recursos                (/academy/resources)

💬 COMUNICACIÓN
├── Mensajes                    (/messages)
└── Notificaciones              (/notifications)

⚙️ CONFIGURACIÓN
├── Mi Perfil
│   ├── Información Personal    (/profile/info)
│   ├── Seguridad               (/profile/security)
│   └── Configuración           (/profile/settings)
│
└── Ayuda & Soporte
    ├── Centro de Ayuda         (/support/help-center)
    ├── FAQs                    (/support/faqs)
    └── Contactar Soporte       (/support/contact)
```

### Archivo Modificado:
✅ `components/sidebar-data.ts`

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
nexusai/front end/wowdash/
├── app/
│   ├── (dashboard)/              # Rutas protegidas
│   │   ├── (homes)/
│   │   │   └── dashboard/        # ✅ YA EXISTE
│   │   ├── binary-tree/          # 🔴 CREAR
│   │   ├── my-network/           # 🔴 CREAR
│   │   ├── commissions/          # 🔴 CREAR
│   │   ├── wallet/               # 🔴 CREAR
│   │   ├── rank/                 # 🔴 CREAR
│   │   ├── academy/              # 🔴 CREAR
│   │   ├── profile/              # 🔴 CREAR
│   │   └── support/              # 🔴 CREAR
│   │
│   ├── auth/                     # ✅ YA EXISTE (NO TOCAR)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── confirm/
│   │
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts               # ✅ YA EXISTE
│   │   ├── binary.ts             # 🔴 CREAR
│   │   ├── academy.ts            # 🔴 CREAR
│   │   ├── commissions.ts        # 🔴 CREAR
│   │   └── wallet.ts             # 🔴 CREAR
│   │
│   └── api/                      # API Routes
│       └── webhooks/             # 🔴 CREAR
│
├── components/
│   ├── auth/                     # ✅ YA EXISTE
│   ├── binary/                   # 🔴 CREAR
│   ├── academy/                  # 🔴 CREAR
│   ├── wallet/                   # 🔴 CREAR
│   ├── commissions/              # 🔴 CREAR
│   ├── sidebar-data.ts           # ✅ ACTUALIZADO
│   └── nav-main.tsx              # ✅ YA EXISTE
│
├── utils/
│   ├── supabase/                 # ✅ YA EXISTE
│   ├── binary-calculations.ts   # 🔴 CREAR
│   ├── commission-calculator.ts # 🔴 CREAR
│   └── crypto-helpers.ts        # 🔴 CREAR
│
├── lib/
│   ├── types/
│   │   ├── database.ts           # 🔴 GENERAR (desde Supabase)
│   │   ├── binary.ts             # 🔴 CREAR
│   │   ├── academy.ts            # 🔴 CREAR
│   │   └── commission.ts         # 🔴 CREAR
│   └── constants.ts              # 🔴 CREAR
│
└── middleware.ts                 # ✅ YA EXISTE

# Supabase (Backend)
supabase/
├── migrations/                   # 🔴 CREAR (ver SUPABASE_MIGRATIONS_GUIDE.md)
│   ├── 001_user_profiles.sql
│   ├── 002_ranks.sql
│   ├── 003_binary_positions.sql
│   └── ...
│
├── functions/                    # 🔴 CREAR
│   ├── calculate-commissions/
│   ├── process-payment/
│   └── update-ranks/
│
└── seed.sql                      # 🔴 CREAR
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

### En `nexusai/front end/wowdash/`:
1. ✅ **NEXUS_AI_IMPLEMENTATION_SUMMARY.md** - Resumen ejecutivo completo
2. ✅ **README_NEXUS_AI.md** - Este archivo

### En `nexusai/specs/001-nexusai-lms-binary/`:
1. ✅ **spec.md** - Especificación de requerimientos (ORIGINAL)
2. ✅ **plan.md** - Plan de implementación (ACTUALIZADO a Next.js + Supabase)
3. ✅ **research.md** - Investigación técnica (ACTUALIZADO a Next.js + Supabase)
4. ✅ **data-model.md** - Modelo de datos (ORIGINAL)
5. ✅ **quickstart.md** - Guía de inicio rápido (ORIGINAL)
6. ✅ **tasks.md** - Lista de tareas (ORIGINAL)
7. ✅ **SUPABASE_MIGRATIONS_GUIDE.md** - Guía de migraciones (NUEVO)
8. ✅ **contracts/** - Contratos de API y base de datos (ORIGINAL)

### Archivos de Autenticación (YA EXISTENTES):
- ✅ `AUTH_README.md`
- ✅ `SUPABASE_SETUP_GUIDE.md`
- ✅ `SOLUCION_LOGIN_DASHBOARD.md`
- ✅ `VERIFICACION_LOGIN_DASHBOARD.md`

---

## 🚀 PRÓXIMOS PASOS

### PASO 1: Configurar Base de Datos en Supabase ⚡

```bash
# 1. Ir a Supabase Dashboard
https://app.supabase.com

# 2. Abrir SQL Editor

# 3. Ejecutar las migraciones en orden
# Ver: specs/001-nexusai-lms-binary/SUPABASE_MIGRATIONS_GUIDE.md
```

### PASO 2: Generar Tipos TypeScript

```bash
# Desde la carpeta del proyecto
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.ts
```

### PASO 3: Crear Páginas del Dashboard

Empezar con las páginas prioritarias:

1. **Árbol Binario** (`app/(dashboard)/binary-tree/page.tsx`)
2. **Billetera** (`app/(dashboard)/wallet/`)
3. **Comisiones** (`app/(dashboard)/commissions/`)
4. **Academia** (`app/(dashboard)/academy/`)

### PASO 4: Implementar Server Actions

Crear las acciones necesarias en:
- `app/actions/binary.ts`
- `app/actions/wallet.ts`
- `app/actions/commissions.ts`
- `app/actions/academy.ts`

### PASO 5: Edge Functions de Supabase

Crear funciones para:
- Cálculo diario de comisiones
- Procesamiento de pagos
- Actualización de rangos
- Envío de notificaciones

---

## 🎓 GUÍA RÁPIDA DE DESARROLLO

### Crear una Nueva Página

```typescript
// app/(dashboard)/binary-tree/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function BinaryTreePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // Obtener datos del binario
  const { data: binaryPosition } = await supabase
    .from('binary_positions')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  return (
    <div>
      <h1>Mi Árbol Binario</h1>
      {/* Componente de visualización */}
    </div>
  )
}
```

### Crear un Server Action

```typescript
// app/actions/binary.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMyBinaryTree() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }
  
  const { data, error } = await supabase
    .rpc('get_binary_downline', { root_user_id: user.id })
  
  if (error) throw error
  
  return data
}
```

### Usar Supabase Realtime

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function BinaryTreeRealtime() {
  const [positions, setPositions] = useState([])
  const supabase = createClient()
  
  useEffect(() => {
    // Suscribirse a cambios en binary_positions
    const channel = supabase
      .channel('binary-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'binary_positions'
      }, (payload) => {
        console.log('Cambio detectado:', payload)
        // Actualizar estado
      })
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
  
  return <div>...</div>
}
```

---

## 💡 TIPS DE DESARROLLO

### 1. Estructura de Carpetas Recomendada

Para cada feature, crea:
- Página principal (`page.tsx`)
- Componentes específicos (en `/components/[feature]`)
- Server actions (en `/app/actions/[feature].ts`)
- Tipos TypeScript (en `/lib/types/[feature].ts`)

### 2. Manejo de Errores

```typescript
try {
  const { data, error } = await supabase...
  
  if (error) throw error
  
  return data
} catch (error) {
  console.error('Error:', error)
  toast.error('Algo salió mal')
}
```

### 3. Loading States

```typescript
'use client'

import { useState } from 'react'

export function Component() {
  const [loading, setLoading] = useState(false)
  
  async function handleAction() {
    setLoading(true)
    try {
      // ... acción
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button disabled={loading}>
      {loading ? 'Cargando...' : 'Acción'}
    </button>
  )
}
```

---

## 📊 PLAN DE COMPENSACIÓN

### Costos:
- **Inscripción**: $89 USD (32 PV)
  - $9 administrativos
  - $40 Bono Inicio Rápido Nivel 1
  - $8 Bono Inicio Rápido Nivel 2
  - 32 PV al binario
- **Mensualidad**: $29 USD (29 PV)

### Bonos:
- **Inicio Rápido**: 50% nivel 1, 10% nivel 2
- **Binario**: 50% de la pierna débil
- **Igualación**: 50% del binario de directos

### Rangos (13 niveles):
Desde Afiliado ($100/día máx) hasta Imperial Nexus ($70,000/día máx)

---

## 🔗 RECURSOS ÚTILES

- [Documentación de Next.js 15](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de WowDash](https://wowdash-docs.vercel.app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)

---

## ⚠️ IMPORTANTE: NO TOCAR

### ❌ NO MODIFICAR:
- `app/auth/**` - Sistema de autenticación (funciona perfecto)
- `app/actions/auth.ts` - Server actions de auth
- `utils/supabase/**` - Clientes de Supabase
- `middleware.ts` - Middleware de autenticación
- `components/auth/**` - Componentes de autenticación
- `app/landing.tsx` - Landing page

### ✅ SEGURO PARA MODIFICAR:
- `components/sidebar-data.ts` - Ya actualizado
- Cualquier nueva página en `app/(dashboard)/`
- Nuevos componentes en `components/`
- Nuevas server actions en `app/actions/`

---

## 📞 SOPORTE

Para preguntas o problemas:

1. Revisar la documentación en `specs/`
2. Consultar `NEXUS_AI_IMPLEMENTATION_SUMMARY.md`
3. Verificar guías de migraciones

---

**Última Actualización**: 2025-10-17  
**Versión**: 1.0.0  
**Estado**: ✅ Listo para desarrollo de features

# 🚀 Nexus AI Cloud

**Plataforma MLM Binary + Academia LMS**

Sistema completo de Network Marketing con árbol binario y academia educativa integrada, construido con Next.js 15 y Supabase.

---

## ✨ Características Principales

### 🌳 Sistema MLM Binary
- **Árbol Binario Ilimitado** con posiciones left/right
- **13 Rangos de Compensación** (Afiliado → Imperial Nexus)
- **3 Tipos de Comisiones:**
  - 💰 Fast Start: $40 nivel 1, $8 nivel 2
  - 📊 Binary: 50% de pierna débil con carry-over ilimitado
  - 🎯 Matching Bonus: 50% del binario de directos (5 niveles según rango)
- **Daily Caps por Rango** ($100 - $70,000)
- **Dashboard Genealógico** con visualización de árbol

### 🎓 Academia LMS
- **Contenido Educativo Multi-formato**
  - 📹 Videos on-demand
  - 📄 Documentos y artículos
  - 📝 Quizzes interactivos
  - 🎥 Sesiones Zoom en vivo
- **Sistema de Progreso** con tracking detallado
- **Contenido por Rango** (acceso progresivo)

### 💳 Sistema Financiero
- **Membresía Inicial:** $89 USDT (100 PV)
- **Membresía Mensual:** $29 USDT (30 PV)
- **Pagos en USDT** (TRC20/ERC20)
- **Retiros Automáticos** con fee 3%
- **Wallet Integrado** con historial completo

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** (App Router + Server Components)
- **TypeScript** (Type-safe completo)
- **Tailwind CSS** (Diseño responsive)
- **WowDash Template** (Dashboard UI/UX premium)
- **Shadcn/ui** (Componentes reutilizables)

### Backend
- **Supabase**
  - PostgreSQL con RLS (Row Level Security)
  - Authentication (Email + OAuth)
  - Realtime subscriptions
  - Edge Functions
  - Storage para contenido

### Blockchain
- **TRON/Ethereum** para pagos USDT
- **TronWeb.js** para interacción blockchain
- **Webhooks** para confirmaciones automáticas

---

## 📊 Base de Datos

### Tablas Principales (11)
```
✅ user_profiles          - Perfiles MLM
✅ ranks                   - 13 rangos del plan
✅ binary_positions        - Árbol binario
✅ memberships             - Membresías activas
✅ transactions            - Historial financiero
✅ commissions             - Comisiones generadas
✅ academy_content         - Contenido LMS
✅ user_content_progress   - Progreso en cursos
✅ notifications           - Sistema de alertas
✅ withdrawal_requests     - Solicitudes de retiro
✅ system_settings         - Configuración
```

### Funciones PostgreSQL (6)
- `get_binary_downline()` - Traversal recursivo
- `calculate_leg_volume()` - Cálculo de PV
- `update_binary_volumes()` - Actualización ascendente
- `calculate_binary_commission()` - Comisión con capping
- `get_direct_referrals_count()` - Contador de referidos
- `find_next_available_position()` - Placement automático

---

## 🚀 Instalación Local

### Prerrequisitos
- Node.js 18+
- npm/yarn/pnpm
- Cuenta de Supabase
- Cuenta de GitHub (opcional)

### Setup

```bash
# Clonar repositorio
git clone https://github.com/Herocku2/nexusai-cloud.git
cd nexusai-cloud

# Instalar dependencias del frontend
cd "front end/wowdash"
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Ejecutar migraciones de Supabase (si es necesario)
cd ../../supabase
# Las migraciones ya están aplicadas en el proyecto base

# Iniciar desarrollo
cd "../front end/wowdash"
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
nexusai/
├── front end/
│   └── wowdash/              # Next.js 15 App
│       ├── app/              # App Router
│       ├── components/       # Componentes React
│       ├── lib/              # Utilidades y tipos
│       │   └── types/
│       │       └── database.ts  # Tipos TypeScript de Supabase
│       ├── public/           # Assets estáticos
│       └── styles/           # Estilos globales
│
├── supabase/
│   ├── migrations/           # 12 archivos SQL
│   │   ├── 001_user_profiles.sql
│   │   ├── 002_ranks_and_binary.sql
│   │   ├── ...
│   │   └── 012_rls_policies.sql
│   ├── MIGRATION_REPORT.md  # Reporte de migración
│   └── README.md
│
└── docs/                     # Documentación
    ├── MLM_BINARY_PLAN.md
    └── API_REFERENCE.md
```

---

## 🎯 Roadmap

### ✅ Fase 1 - Completada (100%)
- [x] Arquitectura base de datos Supabase
- [x] 11 tablas con RLS
- [x] 6 funciones PostgreSQL
- [x] 33 políticas de seguridad
- [x] Tipos TypeScript generados
- [x] Seed data (13 rangos + 14 settings)

### 🔄 Fase 2 - En Progreso (0%)
- [ ] Sistema de autenticación Next.js
- [ ] Dashboard de usuario
- [ ] Visualización de árbol binario
- [ ] Panel de comisiones
- [ ] Academia LMS básica

### 📋 Fase 3 - Planificada
- [ ] Sistema de pagos USDT
- [ ] Wallet integrado
- [ ] Retiros automáticos
- [ ] Notificaciones push
- [ ] Panel administrativo

### 🚀 Fase 4 - Futura
- [ ] App móvil (React Native)
- [ ] Sistema de tickets
- [ ] Chat en vivo
- [ ] Gamificación
- [ ] Marketplace interno

---

## 🔐 Seguridad

- ✅ **Row Level Security** en todas las tablas
- ✅ **JWT Authentication** con Supabase Auth
- ✅ **HTTPS** obligatorio en producción
- ⚠️ **2FA** (próximamente)
- ⚠️ **Leaked Password Protection** (configurar en Supabase Auth)

---

## 📈 Performance

### Optimizaciones Implementadas
- ✅ Server Components de Next.js
- ✅ Índices en columnas críticas
- ✅ Materialized path para árbol binario
- ✅ Recursive CTEs para queries complejas

### Optimizaciones Pendientes
- ⏳ RLS policy optimization (`auth.uid()` → `(select auth.uid())`)
- ⏳ Function search_path configuration
- ⏳ Query caching con React Query
- ⏳ CDN para assets estáticos

---

## 🤝 Contribución

Este es un proyecto privado en desarrollo. Contactar al equipo para colaboraciones.

---

## 📄 Licencia

Copyright © 2025 Nexus AI. Todos los derechos reservados.

---

## 📞 Soporte

- **Email:** soporte@nexusai.cloud
- **Documentación:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/Herocku2/nexusai-cloud/issues)

---

## 🙏 Agradecimientos

- **Supabase** - Backend as a Service
- **Vercel** - Deployment platform
- **WowDash** - Dashboard template
- **Next.js Team** - Framework increíble

---

**🌟 Hecho con ❤️ por el equipo de Nexus AI**

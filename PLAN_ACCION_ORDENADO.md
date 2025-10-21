# 🎯 PLAN DE ACCIÓN ORDENADO - NEXUS AI MLM

**Fecha**: 21 Octubre 2025  
**Objetivo**: Completar implementación sin hardcodear nada, usando solo Supabase y librerías establecidas

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ LO QUE YA ESTÁ IMPLEMENTADO

#### 1. Base de Datos (90% completo)
```
✅ 20 migraciones SQL ejecutadas
✅ Tablas creadas:
   - user_profiles
   - binary_positions
   - ranks
   - memberships
   - transactions
   - commissions
   - academy_content
   - user_content_progress
   - notifications
   - withdrawal_requests
   - system_settings

✅ Funciones SQL:
   - get_downline_count
   - calculate_leg_volume
   - update_binary_volumes
   - get_binary_downline
   - find_available_position
   - count_direct_referrals_batch
   
✅ RLS policies configuradas
✅ Seed data (rangos y settings)
```

#### 2. Frontend Base (80% completo)
```
✅ Next.js 15 + TypeScript
✅ Autenticación con Supabase
✅ Layout principal
✅ Menú de navegación
✅ Dashboard básico
✅ Componentes UI (Shadcn/UI)
✅ Internacionalización (i18n)
```

#### 3. Árbol Binario Admin (100% completo)
```
✅ ReactFlow integrado
✅ Visualización completa
✅ Búsqueda y filtros
✅ Estadísticas
✅ Modal de detalles
```

---

## 🔴 LO QUE FALTA POR IMPLEMENTAR

### Prioridad 1 (CRÍTICO - Semana 1)

#### T1. Sistema de Membresías
**Estado**: ❌ NO IMPLEMENTADO  
**Necesita**:
- Página de compra de membresía
- Integración con pasarelas de pago (Supabase no lo hace)
- Procesamiento de pagos USDT

**Investigación requerida**:
- [ ] Revisar pasarelas crypto (CoinPayments, NOWPayments, BitPay)
- [ ] Ver si Supabase tiene webhooks para esto

#### T2. Sistema de Retiros
**Estado**: ❌ NO IMPLEMENTADO  
**Necesita**:
- Página de solicitud de retiro
- Validación de saldo mínimo
- Fee del 3%
- Estado de solicitudes

**Usa Supabase**: ✅ SÍ (tabla withdrawal_requests existe)

#### T3. Dashboard de Usuario Real
**Estado**: ⚠️ PARCIAL (existe pero vacío)  
**Necesita**:
- Mostrar datos reales de:
  - Balance actual
  - Comisiones ganadas
  - Referidos directos
  - Volumen binario
  - Próximo rango

**Usa Supabase**: ✅ SÍ (RPC functions ya existen)

---

### Prioridad 2 (IMPORTANTE - Semana 2)

#### T4. Sistema de Comisiones Automáticas
**Estado**: ❌ NO IMPLEMENTADO  
**Necesita**:
- Cron job para calcular comisiones binarias diarias
- Cálculo de Fast Start automático
- Matching bonus
- Registro en tabla commissions

**Investigación requerida**:
- [ ] Revisar Supabase Edge Functions + Cron
- [ ] Alternativa: Supabase Database Webhooks
- [ ] pg_cron (extensión PostgreSQL)

#### T5. Academia LMS
**Estado**: ❌ NO IMPLEMENTADO  
**Necesita**:
- Reproductor de video
- Tracking de progreso
- Certificados
- Integración Zoom

**Investigación requerida**:
- [ ] Supabase Storage para videos
- [ ] Revisar librerías de video player (Video.js, Plyr)
- [ ] Zoom API vs Zoom SDK

#### T6. Sistema de Notificaciones
**Estado**: ⚠️ TABLA EXISTE, NO UI  
**Necesita**:
- Centro de notificaciones
- Notificaciones en tiempo real
- Email notifications

**Usa Supabase**: ✅ SÍ
- Supabase Realtime para notificaciones live
- Supabase Auth puede enviar emails

---

### Prioridad 3 (DESEABLE - Semana 3-4)

#### T7. Árbol Binario Usuario (Vista Simple)
**Estado**: ⚠️ EXISTE PERO VACÍO  
**Necesita**:
- Mostrar MI posición y mis directos
- Menos complejo que admin
- Usar mismas funciones SQL

**Usa Supabase**: ✅ SÍ (reutilizar código admin)

#### T8. Sistema de Rangos Visualizado
**Estado**: ❌ NO IMPLEMENTADO  
**Necesita**:
- Mostrar rango actual
- Progreso al siguiente
- Requisitos faltantes
- Histórico de rangos

**Usa Supabase**: ✅ SÍ (tabla user_ranks existe)

#### T9. Perfil de Usuario
**Estado**: ⚠️ EXISTE PERO INCOMPLETO  
**Necesita**:
- Edición de datos
- Avatar
- Datos bancarios para retiros
- Historial de transacciones

**Usa Supabase**: ✅ SÍ

#### T10. Panel de Admin Completo
**Estado**: ⚠️ PARCIAL  
**Lo que falta**:
- Gestión de usuarios
- Aprobar/rechazar retiros
- Ver todas las transacciones
- Estadísticas globales
- Configuración del sistema

**Usa Supabase**: ✅ SÍ

---

## 📋 PLAN DE EJECUCIÓN ORDENADO

### SEMANA 1: FUNCIONALIDADES CRÍTICAS

#### DÍA 1: Dashboard Real de Usuario
```
✅ Ventaja: Ya tenemos las funciones SQL
✅ Ventaja: Ya tenemos componentes UI

Tareas:
1. Crear Server Actions para obtener datos
   - getUserBalance()
   - getUserStats()
   - getRecentCommissions()
   
2. Actualizar página /dashboard/page.tsx
   - Mostrar balance real
   - Mostrar stats reales
   - Gráficos de earnings

3. Testing con usuario real

Usa: Supabase RPC + Next.js Server Actions
Tiempo estimado: 4 horas
```

#### DÍA 2: Sistema de Retiros
```
Tareas:
1. Crear página /dashboard/withdrawals
   - Form de solicitud
   - Validar balance >= $20
   - Calcular fee 3%
   
2. Server Action: createWithdrawal()
   - Insertar en withdrawal_requests
   - Actualizar balance
   
3. Vista de solicitudes pendientes

4. Email de confirmación (Supabase Auth)

Usa: Solo Supabase
Tiempo estimado: 6 horas
```

#### DÍA 3: Árbol Binario Usuario
```
Tareas:
1. Simplificar componente del admin
2. Mostrar solo 3 niveles
3. Resaltar posición del usuario
4. Botón "Ver completo" → árbol admin

Usa: Código ya existente + Supabase RPC
Tiempo estimado: 4 horas
```

#### DÍA 4-5: Sistema de Membresías
```
⚠️ REQUIERE INVESTIGACIÓN PRIMERO

Opción 1: Pasarela Externa
- Investigar: CoinPayments API
- Investigar: NOWPayments
- Webhooks → Supabase Edge Function

Opción 2: Manual (MVP)
- Admin aprueba manualmente
- Usuario sube comprobante
- Tabla: pending_membership_payments

Recomendación: Opción 2 para MVP
Tiempo estimado: 8 horas (manual) / 16 horas (integración)
```

---

### SEMANA 2: AUTOMATIZACIÓN

#### DÍA 6: Comisiones Automáticas
```
Investigación:
- [ ] pg_cron en Supabase (¿está disponible?)
- [ ] Supabase Edge Functions + Cron
- [ ] Supabase Database Webhooks

Implementación:
1. Función SQL: process_daily_binary_commissions()
2. Trigger automático o cron
3. Registrar en tabla commissions
4. Notificar usuarios

Usa: Supabase Functions + SQL
Tiempo estimado: 12 horas
```

#### DÍA 7: Sistema de Notificaciones
```
Tareas:
1. Centro de notificaciones UI
2. Supabase Realtime subscription
3. Marcar como leídas
4. Email notifications (Supabase Auth)

Usa: Supabase Realtime + Auth
Tiempo estimado: 6 horas
```

#### DÍA 8-9: Academia LMS Básica
```
Fase 1 (MVP):
1. Upload videos a Supabase Storage
2. Player simple (Video.js)
3. Lista de contenidos
4. Tracking de progreso

Fase 2 (Futuro):
- Zoom integration
- Certificados PDF
- Quizzes

Usa: Supabase Storage + Video.js
Tiempo estimado: 12 horas (Fase 1)
```

#### DÍA 10: Sistema de Rangos
```
Tareas:
1. Página /dashboard/ranks
2. Card con rango actual
3. Progreso bar al siguiente
4. Requisitos detallados
5. Histórico de rangos

Usa: Supabase RPC (función ya existe)
Tiempo estimado: 4 horas
```

---

### SEMANA 3-4: ADMIN Y REFINAMIENTO

#### Admin Panel
```
Páginas a crear:
- /admin/users (gestión)
- /admin/withdrawals (aprobar/rechazar)
- /admin/transactions (ver todas)
- /admin/commissions (ver cálculos)
- /admin/settings (configuración)

Tiempo estimado: 20 horas
```

#### Testing & Bug Fixes
```
- Testing end-to-end
- Corregir bugs
- Optimizar queries
- Documentar

Tiempo estimado: 12 horas
```

---

## 🛠️ DECISIONES TECNOLÓGICAS

### ✅ USAR SUPABASE PARA:
- ✅ Base de datos (PostgreSQL)
- ✅ Autenticación
- ✅ Storage (archivos, videos)
- ✅ Realtime (notificaciones)
- ✅ Edge Functions (crons, webhooks)
- ✅ RPC Functions (lógica compleja)
- ✅ Email (Auth triggers)

### ⚠️ NECESITA LIBRERÍA EXTERNA:
- **Pagos Crypto**: CoinPayments o manual
- **Video Player**: Video.js (ya existe)
- **Charts**: ApexCharts (ya instalado)
- **PDF**: jsPDF (para certificados)
- **Zoom**: Zoom SDK (si se requiere)

### ❌ NO REINVENTAR:
- ❌ No crear sistema de auth propio
- ❌ No crear sistema de storage propio
- ❌ No crear sistema de realtime propio
- ❌ Usar RPC en vez de lógica en frontend

---

## 📊 CHECKLIST DE PRIORIDADES

### Esta Semana (Crítico)
- [ ] Dashboard con datos reales
- [ ] Sistema de retiros funcional
- [ ] Árbol binario para usuario
- [ ] Membresías (al menos manual)

### Próxima Semana (Importante)
- [ ] Comisiones automáticas
- [ ] Notificaciones en tiempo real
- [ ] Academia LMS básica
- [ ] Sistema de rangos visualizado

### Después (Deseable)
- [ ] Admin panel completo
- [ ] Integración Zoom
- [ ] Certificados PDF
- [ ] Analytics avanzado

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

```
1. ✅ Dashboard Real (DÍA 1)
   └─> Mostrar datos que ya existen en BD

2. ✅ Sistema Retiros (DÍA 2)
   └─> Funcionalidad crítica para usuarios

3. ✅ Árbol Usuario (DÍA 3)
   └─> Reutilizar código admin

4. ⚠️ Membresías Manual (DÍA 4-5)
   └─> MVP: Admin aprueba manualmente

5. ⚠️ Comisiones Auto (DÍA 6)
   └─> Investigar pg_cron primero

6. ✅ Notificaciones (DÍA 7)
   └─> Supabase Realtime

7. ✅ Academia Básica (DÍA 8-9)
   └─> Supabase Storage + Video.js

8. ✅ Sistema Rangos (DÍA 10)
   └─> UI para datos que ya existen

9. ✅ Admin Panel (SEMANA 3)
   └─> Gestión completa

10. ✅ Testing (SEMANA 4)
    └─> Pulir todo
```

---

## 📞 RECURSOS Y DOCUMENTACIÓN

### Supabase Official Docs
- Database Functions: https://supabase.com/docs/guides/database/functions
- Edge Functions: https://supabase.com/docs/guides/functions
- Realtime: https://supabase.com/docs/guides/realtime
- Storage: https://supabase.com/docs/guides/storage
- Auth: https://supabase.com/docs/guides/auth

### Librerías a Usar
- Video.js: https://videojs.com/
- ApexCharts: https://apexcharts.com/ (ya instalado)
- Shadcn/UI: https://ui.shadcn.com/ (ya instalado)
- ReactFlow: https://reactflow.dev/ (ya instalado)

### Para Investigar
- pg_cron: https://github.com/citusdata/pg_cron
- Supabase Cron: https://supabase.com/docs/guides/functions/schedule-functions
- CoinPayments: https://www.coinpayments.net/apidoc

---

## 🚀 EMPEZAMOS POR

**TAREA 1: Dashboard Real de Usuario**

Razones:
- ✅ Ya tenemos todas las funciones SQL necesarias
- ✅ Ya tenemos los componentes UI
- ✅ Solo necesitamos conectar datos
- ✅ Es rápido (4 horas)
- ✅ Da valor inmediato al usuario
- ✅ No requiere investigación adicional

**¿Comenzamos?** 🚀

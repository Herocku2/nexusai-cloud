# 📋 Lógica de Membresías Mensuales - Nexus AI MLM Platform

## 🎯 Resumen Ejecutivo

Este documento describe la implementación completa de la lógica de membresías mensuales según las reglas de negocio del documento **"documento nexus. IA.txt"**.

---

## 💰 Estructura de Membresías

### 1️⃣ Membresía Inicial (Una sola vez)
- **Costo**: $89 USD
- **Distribución**:
  - $40 USD → Bono Inicio Rápido Nivel 1 (patrocinador directo)
  - $8 USD → Bono Inicio Rápido Nivel 2 (patrocinador del patrocinador)
  - $32 USD → 32 PV al binario
  - $9 USD → Administrativos (no se reparten)

### 2️⃣ Membresía Mensual (Recurrente cada 30 días)
- **Costo**: $29 USD
- **Distribución**:
  - $29 USD → 29 PV al binario
- **Duración**: 30 días exactos desde la fecha de pago
- **Vencimiento**: Automático después de 30 días

---

## ⚠️ Reglas Críticas de Negocio

### ✅ Usuario ACTIVO requiere:
1. ✔️ Membresía inicial pagada ($89 USD) - **PERMANENTE**
2. ✔️ Membresía mensual activa ($29 USD) - **DEBE RENOVARSE CADA 30 DÍAS**

### ❌ Usuario INACTIVO (cuando vence membresía mensual):

#### **Bloqueos Totales:**
- 🚫 **NO puede retirar fondos** - Aunque tenga balance disponible
- 🚫 **NO recibe comisiones nuevas** - Binarias, Fast Start, Matching Bonus
- 🚫 **NO puede acceder a la academia** - Todo el contenido bloqueado
- 🚫 **Sus referidos NO generan comisiones** - Hasta que reactive

#### **Lo que SÍ puede hacer:**
- ✅ Ver su balance acumulado (pero no retirarlo)
- ✅ Ver historial de comisiones pasadas
- ✅ Ver su equipo y estructura binaria
- ✅ Renovar su membresía para reactivarse

---

## 🔄 Ciclo de Vida de la Membresía

```
┌─────────────────────────────────────────────────────────────┐
│  REGISTRO  →  PAGO INICIAL ($89)  →  ACTIVO (30 días)      │
│                                           ↓                  │
│                              ┌───────────────────┐          │
│                              │ DÍA 27: RECORDATORIO │       │
│                              │ (Email 3 días antes)│        │
│                              └───────────────────┘          │
│                                           ↓                  │
│           ┌──────────────────────────────────────────┐     │
│           │          DÍA 30: VENCIMIENTO             │     │
│           │         is_active = FALSE                │     │
│           └──────────────────────────────────────────┘     │
│                    ↓                       ↓                │
│        ┌───────────────────┐   ┌──────────────────────┐   │
│        │  RENOVAR $29 USD  │   │ PERMANECER INACTIVO   │   │
│        │  (dentro de 30d)  │   │  (pierde beneficios)  │   │
│        └───────────────────┘   └──────────────────────┘   │
│                    ↓                                        │
│              ACTIVO (30 días más)                          │
│              Se extiende desde fecha actual                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Implementación Técnica

### Base de Datos

#### Tabla: `user_profiles`
```sql
ALTER TABLE user_profiles 
ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
```

- `is_active = TRUE` → Usuario tiene membresía inicial Y mensual vigente
- `is_active = FALSE` → Membresía mensual vencida o no tiene inicial

#### Tabla: `memberships`
```sql
CREATE TABLE memberships (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type VARCHAR(20) NOT NULL, -- 'initial' o 'monthly'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USDT',
  pv_value DECIMAL(10,2), -- Point Value
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ, -- NULL para 'initial', fecha para 'monthly'
  transaction_id BIGINT REFERENCES transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Funciones de PostgreSQL

#### 1. `has_active_membership(user_id)`
Retorna `TRUE` si el usuario tiene:
- Membresía inicial (type='initial', status='active')
- Y membresía mensual (type='monthly', status='active', expires_at > NOW())

```sql
SELECT has_active_membership('user-uuid-here');
-- Retorna: true o false
```

#### 2. `update_user_active_status(user_id)`
Actualiza `user_profiles.is_active` basado en el resultado de `has_active_membership()`.

Se ejecuta automáticamente vía trigger cuando hay cambios en `memberships`.

#### 3. `get_memberships_expiring_soon(days_ahead)`
Obtiene lista de usuarios cuya membresía mensual vence en los próximos N días (default: 3).

```sql
SELECT * FROM get_memberships_expiring_soon(3);
```

**Retorna:**
| user_id | email | first_name | last_name | expires_at | days_remaining |
|---------|-------|------------|-----------|------------|----------------|
| uuid... | john@example.com | John | Doe | 2025-10-23 | 3 |

**Uso:** Enviar emails recordatorios automáticamente.

#### 4. `renew_monthly_membership(user_id, transaction_id)`
Crea nueva membresía mensual que se extiende 30 días desde:
- La fecha de expiración actual (si aún es válida)
- O desde NOW() (si ya expiró)

```sql
-- Renovar membresía del usuario después de pago confirmado
SELECT renew_monthly_membership('user-uuid-here', 12345);
-- Retorna: membership_id (BIGINT)
```

---

## 🔒 Validaciones en el Código

### 1. Bloqueo de Retiros

**Archivo:** `app/actions/wallet.ts`

```typescript
export async function requestWithdrawal(formData: FormData) {
  // ... código anterior ...
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('balance, is_active')
    .eq('id', user.id)
    .single()

  // VALIDACIÓN CRÍTICA
  if (!profile.is_active) {
    throw new Error(
      'No puedes retirar fondos porque tu membresía está inactiva. ' +
      'Debes renovar tu membresía mensual de $29 USD para continuar operando.'
    )
  }
  
  // ... continuar con retiro ...
}
```

### 2. UI - Alerta Visual

**Archivo:** `app/dashboard/wallet/page.tsx`

```typescript
const { data: profile } = await supabase
  .from('user_profiles')
  .select('is_active')
  .eq('id', user.id)
  .single();

const isActive = profile?.is_active ?? false;
```

Si `isActive === false`:
- ⚠️ Muestra banner amarillo de advertencia
- 🔒 Desactiva todos los inputs del formulario de retiro
- 🔒 Desactiva el botón "Solicitar Retiro"
- 📢 Muestra botón "Renovar Membresía ($29 USD)"

---

## 📧 Sistema de Recordatorios

### Flujo Recomendado

```typescript
// Ejecutar diariamente (Cron Job / Edge Function)
async function sendMembershipReminders() {
  // Obtener usuarios con membresía por vencer
  const { data: expiringUsers } = await supabase
    .rpc('get_memberships_expiring_soon', { days_ahead: 3 })
  
  for (const user of expiringUsers) {
    await sendEmail({
      to: user.email,
      subject: '⚠️ Tu membresía vence en ' + user.days_remaining + ' días',
      template: 'membership_expiring',
      data: {
        firstName: user.first_name,
        expiresAt: user.expires_at,
        daysRemaining: user.days_remaining,
        renewalUrl: `https://nexusai.cloud/dashboard/membership/renew`
      }
    })
  }
}
```

### Plantilla de Email

**Asunto:** ⚠️ Tu membresía Nexus AI vence en {days_remaining} días

**Cuerpo:**
```
Hola {firstName},

Tu membresía mensual de Nexus AI está próxima a vencer:

📅 Fecha de vencimiento: {expiresAt}
⏰ Días restantes: {daysRemaining}

⚠️ IMPORTANTE: Si no renuevas tu membresía:
- No podrás retirar tus comisiones
- No recibirás nuevas comisiones
- Perderás acceso a la academia

💳 Renueva ahora por solo $29 USD y mantén todos tus beneficios activos.

[Renovar Ahora] → {renewalUrl}

Equipo Nexus AI
```

---

## 📊 Queries Útiles para Admin

### Ver todos los usuarios inactivos con balance
```sql
SELECT 
  up.id,
  up.first_name,
  up.last_name,
  au.email,
  up.balance,
  up.is_active,
  m.expires_at as membership_expires_at
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
LEFT JOIN LATERAL (
  SELECT expires_at 
  FROM memberships 
  WHERE user_id = up.id 
    AND type = 'monthly' 
  ORDER BY expires_at DESC 
  LIMIT 1
) m ON true
WHERE up.is_active = FALSE
  AND up.balance > 0
ORDER BY up.balance DESC;
```

### Ver renovaciones del mes
```sql
SELECT 
  DATE(m.created_at) as date,
  COUNT(*) as renewals,
  SUM(m.amount) as revenue
FROM memberships m
WHERE m.type = 'monthly'
  AND m.created_at >= DATE_TRUNC('month', NOW())
GROUP BY DATE(m.created_at)
ORDER BY date DESC;
```

### Usuarios que nunca han renovado
```sql
SELECT 
  up.id,
  up.first_name,
  up.last_name,
  au.email,
  COUNT(m.id) FILTER (WHERE m.type = 'initial') as has_initial,
  COUNT(m.id) FILTER (WHERE m.type = 'monthly') as monthly_count
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
LEFT JOIN memberships m ON m.user_id = up.id
GROUP BY up.id, up.first_name, up.last_name, au.email
HAVING COUNT(m.id) FILTER (WHERE m.type = 'initial') > 0
   AND COUNT(m.id) FILTER (WHERE m.type = 'monthly') = 0;
```

---

## 🚀 Próximas Implementaciones

### 1. Página de Renovación de Membresía
**Ruta:** `/dashboard/membership`

**Características:**
- Mostrar estado actual (activo/inactivo)
- Fecha de expiración
- Contador regresivo de días
- Botón de pago ($29 USD)
- Historial de renovaciones

### 2. Integration con Gateway de Pago
**Opciones:**
- NowPayments (cripto)
- CoinPayments (cripto)
- Stripe (fiat + cripto)

**Flujo:**
1. Usuario hace clic en "Renovar Membresía"
2. Se redirige a checkout del gateway
3. Paga $29 USD en USDT
4. Gateway envía webhook de confirmación
5. Backend llama a `renew_monthly_membership(user_id, tx_id)`
6. Usuario recibe confirmación por email

### 3. Dashboard Widgets
- Card de estado de membresía
- Contador de días restantes
- Botón CTA para renovar (si < 7 días)

### 4. Bloqueo de Academia
**Archivo:** `app/academy/*`

```typescript
// Verificar antes de mostrar contenido
if (!profile.is_active) {
  return <MembershipExpiredPage />
}
```

---

## 📝 Checklist de Implementación

- [x] Migración 018 creada
- [x] Función `requestWithdrawal` actualizada
- [x] UI de wallet con alerta de membresía inactiva
- [x] Traducciones agregadas (es/en)
- [ ] Aplicar migración 018 en Supabase (MANUAL)
- [ ] Crear página de renovación de membresía
- [ ] Integrar gateway de pago
- [ ] Implementar cron job para recordatorios
- [ ] Plantilla de email de recordatorio
- [ ] Bloquear academia para usuarios inactivos
- [ ] Dashboard widget de estado de membresía
- [ ] Pruebas de flujo completo

---

**Fecha de creación:** 2025-10-20  
**Última actualización:** 2025-10-20  
**Versión:** 1.0  
**Autor:** Qoder AI Assistant

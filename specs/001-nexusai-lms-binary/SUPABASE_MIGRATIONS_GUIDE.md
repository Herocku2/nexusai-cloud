# Supabase Migrations Guide: Nexus AI Platform

**Date**: 2025-10-17  
**Feature**: [001-nexusai-lms-binary](plan.md)  
**Technology**: Next.js 15 + Supabase PostgreSQL

---

## 📋 Overview

Esta guía contiene todas las migraciones de base de datos para ejecutar en Supabase. Las migraciones están organizadas en orden secuencial y deben ejecutarse en el orden indicado.

**Total de migraciones**: 12 archivos  
**Tiempo estimado**: 10-15 minutos  
**Requisitos**: Proyecto de Supabase creado

---

## 🚀 Quick Start

### Opción 1: Supabase Dashboard (Recomendado para primera vez)

1. Ir a https://app.supabase.com
2. Seleccionar tu proyecto
3. Ir a **SQL Editor**
4. Copiar y pegar cada migración en orden
5. Ejecutar cada una con el botón "Run"

### Opción 2: Supabase CLI (Para producción)

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# All migrations are already in supabase/migrations/
# Push them to Supabase
supabase db push
```

---

## 📂 Migration Files

Todas las migraciones están en: `/nexusai/supabase/migrations/`

### Orden de Ejecución:

1. ✅ `001_user_profiles.sql` - Perfiles de usuario
2. ✅ `002_ranks_and_binary.sql` - Rangos y árbol binario
3. ✅ `003_memberships.sql` - Membresías
4. ✅ `004_transactions.sql` - Transacciones financieras
5. ✅ `005_commissions.sql` - Comisiones
6. ✅ `006_academy_content.sql` - Contenido LMS
7. ✅ `007_user_content_progress.sql` - Progreso de cursos
8. ✅ `008_notifications.sql` - Notificaciones
9. ✅ `009_withdrawal_requests.sql` - Solicitudes de retiro
10. ✅ `010_system_settings.sql` - Configuración del sistema
11. ✅ `011_functions.sql` - Funciones PostgreSQL
12. ✅ `012_rls_policies.sql` - Políticas de seguridad

---

## 📖 Descripción de Cada Migración

### 001_user_profiles.sql

**Propósito**: Extiende `auth.users` de Supabase con datos del negocio MLM

**Tablas creadas**:
- `user_profiles` - Información adicional del usuario

**Campos principales**:
- `id` - UUID que referencia `auth.users(id)`
- `sponsor_id` - Referencia al patrocinador
- `balance` - Balance actual en USDT
- `total_earnings` - Ganancias totales
- `total_pv` - Point Value total

**Índices**: sponsor_id, status, created_at

---

### 002_ranks_and_binary.sql

**Propósito**: Define el plan de compensación MLM y la estructura del árbol binario

**Tablas creadas**:
- `ranks` - 13 rangos del plan de compensación
- `binary_positions` - Posiciones en el árbol binario
- `user_ranks` - Historial de rangos alcanzados

**Seed Data**:
- 13 rangos: Afiliado → Imperial Nexus
- Cada rango con: min_pv_leg, max_daily_earnings

**Características del Binary Tree**:
- Auto-referencias: parent_id, left_child_id, right_child_id
- Volumes: left_volume, right_volume
- Carryover: left_carryover, right_carryover (ilimitado)
- Materialized path para queries eficientes

---

### 003_memberships.sql

**Propósito**: Gestión de membresías ($89 inicial, $29 mensual)

**Tabla creada**:
- `memberships`

**Tipos de membresía**:
- `initial` - $89 (89 PV)
- `monthly` - $29 (29 PV)

**Estados**: pending, active, expired, cancelled

---

### 004_transactions.sql

**Propósito**: Registro de todas las transacciones financieras

**Tabla creada**:
- `transactions`

**Tipos de transacción**:
- `deposit` - Depósitos USDT
- `withdrawal` - Retiros
- `commission` - Comisiones ganadas
- `bonus` - Bonos
- `fee` - Fees
- `membership` - Pagos de membresía

**Campos blockchain**:
- `blockchain_tx_hash` - Hash de transacción
- `confirmations` - Confirmaciones actuales
- `required_confirmations` - 12 confirmaciones requeridas

**Campos calculados**:
- `net_amount` - amount - fee (GENERATED ALWAYS)

---

### 005_commissions.sql

**Propósito**: Registro de comisiones MLM

**Tabla creada**:
- `commissions`

**Tipos de comisión**:
- `fast_start` - $40 nivel 1, $8 nivel 2
- `binary` - 50% de pierna débil
- `matching` - 50% del binario de directos

**Campos específicos**:
- `left_leg_volume`, `right_leg_volume` - Volúmenes de cada pierna
- `weaker_leg_volume` - Volumen de pierna débil
- `daily_cap` - Tope diario según rango
- `capped_amount` - Monto que fue limitado por el cap

---

### 006_academy_content.sql

**Propósito**: Contenido educativo LMS

**Tabla creada**:
- `academy_content`

**Tipos de contenido**:
- `video` - Videos educativos
- `document` - PDFs, documentos
- `quiz` - Evaluaciones
- `zoom_meeting` - Clases en vivo
- `article` - Artículos

**Control de acceso**:
- `required_rank_id` - Rango mínimo requerido
- `is_free` - Contenido gratuito

**Organización**:
- `category` - Categoría del contenido
- `tags` - Array de tags
- `order_index` - Orden de visualización

---

### 007_user_content_progress.sql

**Propósito**: Tracking del progreso de usuarios en cursos

**Tabla creada**:
- `user_content_progress`

**Tracking de videos**:
- `watch_time` - Tiempo total visto (segundos)
- `last_position` - Posición para reanudar

**Tracking de quizzes**:
- `quiz_attempts` - Número de intentos
- `quiz_score` - Puntuación (porcentaje)
- `quiz_answers` - Respuestas del usuario (JSONB)

**Estados**: not_started, in_progress, completed

---

### 008_notifications.sql

**Propósito**: Sistema de notificaciones

**Tabla creada**:
- `notifications`

**Tipos de notificación**:
- commission_earned
- rank_advanced
- new_referral
- withdrawal_approved
- etc.

**Canales**:
- In-app: `is_read`, `read_at`
- Email: `email_sent`, `email_sent_at`

---

### 009_withdrawal_requests.sql

**Propósito**: Solicitudes de retiro con fee del 3%

**Tabla creada**:
- `withdrawal_requests`

**Validaciones**:
- Mínimo: $20 USDT
- Fee: 3% (GENERATED ALWAYS)

**Redes soportadas**:
- TRC20 (TRON)
- ERC20 (Ethereum)
- BEP20 (BSC)

**Estados**: pending, processing, completed, rejected, cancelled

---

### 010_system_settings.sql

**Propósito**: Configuración del sistema

**Tabla creada**:
- `system_settings`

**Settings incluidos**:
- Precios de membresía
- Valores de PV
- Fees y mínimos
- Bonos y porcentajes de comisión
- Configuración de plataforma

**Seed data**: 15+ configuraciones iniciales

---

### 011_functions.sql

**Propósito**: Funciones PostgreSQL para cálculos complejos

**Funciones creadas**:

1. **`get_binary_downline(user_id, max_depth)`**
   - Retorna toda la red descendente usando Recursive CTE
   - Útil para visualizar el árbol

2. **`calculate_leg_volume(user_id, leg)`**
   - Calcula volumen total en pierna izquierda o derecha
   - Usa recursión para sumar todo el PV

3. **`update_binary_volumes(user_id, new_pv)`**
   - Actualiza volúmenes y propaga hacia arriba en el árbol
   - Se ejecuta cuando un usuario genera PV

4. **`calculate_binary_commission(user_id, date)`**
   - Calcula comisión binaria con capping y carryover
   - Retorna: volúmenes, comisión, cap, carryover

5. **`get_direct_referrals_count(user_id)`**
   - Cuenta referidos directos en cada pierna
   - Útil para verificar requisitos de rangos

6. **`find_next_available_position(sponsor_id, preferred_leg)`**
   - Encuentra la siguiente posición disponible en el árbol
   - Auto-placement algorithm para nuevos usuarios

---

### 012_rls_policies.sql

**Propósito**: Row Level Security - Seguridad a nivel de fila

**Habilita RLS en todas las tablas**

**Políticas principales**:

**user_profiles**:
- ✅ Users can view own profile
- ✅ Users can update own profile
- ✅ Service role can insert profiles

**binary_positions**:
- ✅ Users can view own position and downline
- ✅ Service role can insert/update positions

**transactions & commissions**:
- ✅ Users can only view their own records
- ✅ Service role can insert/update

**academy_content**:
- ✅ All users can view active content
- ✅ Rank-based access controlled at app level

**notifications**:
- ✅ Users can view/update/delete own notifications

**withdrawal_requests**:
- ✅ Users can view/insert own requests
- ✅ Users can cancel pending requests
- ✅ Service role can process requests

**system_settings**:
- ✅ Users can view public settings only

**Función helper**: `is_admin()` - Para futuras políticas de admin

---

## ✅ Verificación Post-Migración

Después de ejecutar todas las migraciones, verificar:

### 1. Verificar que las tablas existen

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Resultado esperado**: 12 tablas creadas

---

### 2. Verificar seed data de rangos

```sql
SELECT id, name, slug, min_pv_leg, max_daily_earnings 
FROM ranks 
ORDER BY order_index;
```

**Resultado esperado**: 13 rangos

---

### 3. Verificar funciones

```sql
SELECT proname 
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace
AND proname LIKE '%binary%' OR proname LIKE '%commission%';
```

**Resultado esperado**: 6 funciones

---

### 4. Verificar RLS habilitado

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Resultado esperado**: rowsecurity = true en todas las tablas

---

### 5. Verificar políticas RLS

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Resultado esperado**: 30+ políticas

---

### 6. Verificar configuración del sistema

```sql
SELECT key, value, type 
FROM system_settings 
WHERE is_public = true
ORDER BY key;
```

**Resultado esperado**: ~10 settings públicos

---

## 🔧 Generar TypeScript Types

Después de ejecutar todas las migraciones, generar los tipos TypeScript:

```bash
# Usando Supabase CLI
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types/database.ts

# O si estás usando local
npx supabase gen types typescript --local > lib/types/database.ts
```

---

## 🧪 Testing con Datos de Prueba

### Crear un usuario de prueba

```sql
-- Primero crear usuario en Supabase Auth UI o via API
-- Luego crear su perfil

INSERT INTO user_profiles (id, first_name, last_name, status)
VALUES (
    'uuid-from-auth-users',
    'Test',
    'User',
    'active'
);
```

### Crear posición binaria

```sql
-- Usar la función de auto-placement
SELECT find_next_available_position('sponsor-uuid');

-- O insertar manualmente (para el primer usuario)
INSERT INTO binary_positions (
    user_id, 
    sponsor_id, 
    position_leg, 
    level
)
VALUES (
    'uuid-from-auth-users',
    NULL, -- Primer usuario no tiene sponsor
    'left',
    1
);
```

### Simular membresía

```sql
INSERT INTO memberships (user_id, type, amount, pv_value, status)
VALUES (
    'uuid-from-auth-users',
    'initial',
    89,
    89,
    'active'
);

-- Actualizar volumen
SELECT update_binary_volumes('uuid-from-auth-users', 89);
```

### Calcular comisión de prueba

```sql
SELECT * FROM calculate_binary_commission('uuid-from-auth-users');
```

---

## 🔍 Queries Útiles

### Ver árbol binario de un usuario

```sql
SELECT * FROM get_binary_downline('user-uuid', 5);
```

### Ver todas las comisiones de un usuario

```sql
SELECT 
    type,
    SUM(amount) as total,
    COUNT(*) as count
FROM commissions
WHERE user_id = 'user-uuid'
GROUP BY type;
```

### Ver usuarios con membresías activas

```sql
SELECT 
    up.first_name,
    up.last_name,
    m.type,
    m.expires_at
FROM user_profiles up
JOIN memberships m ON m.user_id = up.id
WHERE m.status = 'active';
```

### Ver transacciones pendientes

```sql
SELECT 
    t.uuid,
    t.type,
    t.amount,
    t.status,
    t.created_at
FROM transactions t
WHERE t.status = 'pending'
ORDER BY t.created_at DESC;
```

---

## 🚨 Troubleshooting

### Error: "relation already exists"

Esto significa que ya ejecutaste la migración. Puedes:

1. Ignorar (si es el mismo contenido)
2. O hacer DROP TABLE si quieres limpiar y empezar de nuevo:

```sql
-- ⚠️ PELIGRO: Esto borra TODOS los datos
DROP TABLE IF EXISTS user_content_progress CASCADE;
DROP TABLE IF EXISTS academy_content CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS withdrawal_requests CASCADE;
DROP TABLE IF EXISTS commissions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS user_ranks CASCADE;
DROP TABLE IF EXISTS binary_positions CASCADE;
DROP TABLE IF EXISTS ranks CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
```

### Error: "function does not exist"

Asegúrate de ejecutar `011_functions.sql` después de crear todas las tablas.

### Error: "column does not exist"

Verifica que ejecutaste las migraciones en orden. Algunas tablas dependen de otras.

### RLS bloquea acceso

Verifica que `auth.uid()` retorna un valor:

```sql
SELECT auth.uid();
```

Si es NULL, el usuario no está autenticado.

---

## 📚 Próximos Pasos

Después de completar las migraciones:

1. ✅ Generar TypeScript types
2. ✅ Crear Server Actions en Next.js
3. ✅ Implementar páginas del dashboard
4. ✅ Probar flujos de usuario
5. ✅ Implementar componentes UI

Ver: [TASKS_NEXTJS_SUPABASE.md](TASKS_NEXTJS_SUPABASE.md) para las tareas de implementación.

---

## 📞 Support

Si encuentras problemas:

1. Revisa los logs en Supabase Dashboard → Logs
2. Verifica que ejecutaste todas las migraciones en orden
3. Consulta la documentación de Supabase: https://supabase.com/docs
4. Revisa [quickstart.md](quickstart.md) para troubleshooting

---

**Last Updated**: 2025-10-17  
**Version**: 1.0  
**Status**: ✅ Ready for Deployment

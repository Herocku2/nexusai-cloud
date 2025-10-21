# 📋 Instrucciones para Aplicar Migración 018 - Lógica de Membresías Mensuales

## ⚠️ IMPORTANTE
Esta migración implementa las reglas de negocio de membresías mensuales que bloquean retiros si la membresía está inactiva.

## 📌 Qué hace esta migración

1. **Agrega campo `is_active`** a `user_profiles` - Indica si el usuario tiene membresía activa
2. **Función `has_active_membership()`** - Valida que el usuario tenga membresía inicial ($89) Y mensual activa ($29)
3. **Función `update_user_active_status()`** - Actualiza el estado del usuario
4. **Trigger automático** - Actualiza `is_active` cuando cambia una membresía
5. **Función `get_memberships_expiring_soon()`** - Para recordatorios (3 días antes)
6. **Función `renew_monthly_membership()`** - Renueva la membresía mensual por 30 días

## 🚀 Pasos para Aplicar la Migración

### Opción 1: SQL Editor de Supabase (RECOMENDADO)

1. Ve a tu proyecto en Supabase: https://app.supabase.com/project/syjougqrwcvqbqleqtss

2. Navega a **SQL Editor** en el menú lateral

3. Crea una nueva query

4. Copia y pega TODO el contenido del archivo:
   ```
   supabase/migrations/018_membership_monthly_logic.sql
   ```

5. Haz clic en **"Run"** para ejecutar la migración

6. Verifica que se ejecutó correctamente (no debe haber errores en rojo)

### Opción 2: Supabase CLI (si tienes Docker)

```bash
cd nexusai
npx supabase db reset
```

## ✅ Verificación

Después de aplicar la migración, verifica que todo esté correcto:

### 1. Verificar que el campo `is_active` existe:
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name = 'is_active';
```

### 2. Verificar que las funciones fueron creadas:
```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'has_active_membership',
    'update_user_active_status',
    'check_expired_memberships',
    'get_memberships_expiring_soon',
    'renew_monthly_membership'
  );
```

Deberías ver 5 funciones.

### 3. Verificar el trigger:
```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'memberships_update_active_status';
```

### 4. Probar la función de verificación de membresía:
```sql
-- Reemplaza 'USER_ID_AQUI' con un ID real de tu tabla user_profiles
SELECT has_active_membership('USER_ID_AQUI');
```

### 5. Ver estado de todos los usuarios:
```sql
SELECT 
  id,
  first_name,
  last_name,
  email,
  is_active,
  created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 10;
```

## 🔒 Reglas de Negocio Implementadas

Según el documento **"documento nexus. IA.txt"**:

✅ **Inscripción única**: $89 USD
- $40 → Bono Inicio Rápido Nivel 1
- $8 → Bono Inicio Rápido Nivel 2
- $32 → 32 PV al binario
- $9 → Administrativos

✅ **Activación Mensual**: $29 USD (29 PV al binario)
- Se vence cada 30 días
- Requiere renovación para mantener cuenta activa

✅ **Restricción de Retiros**:
- Usuario debe tener AMBAS membresías activas (inicial + mensual vigente)
- Si `is_active = FALSE`, NO puede retirar aunque tenga balance
- Mensaje de error: "No puedes retirar fondos porque tu membresía está inactiva..."

✅ **Recordatorios**:
- Email 3 días antes del vencimiento
- Usar función `get_memberships_expiring_soon(3)`

✅ **Estado Inactivo Bloquea**:
- ❌ Retiros
- ❌ Cobro de comisiones
- ❌ Acceso a academia
- ❌ Nuevos referidos generando comisiones

## 🎯 Próximos Pasos

Después de aplicar la migración, necesitas:

1. ✅ **Implementar sistema de pagos para renovación mensual**
   - Crear página de renovación de membresía
   - Integrar gateway de pago (NowPayments / CoinPayments)
   - Al confirmar pago, llamar a `renew_monthly_membership(user_id, transaction_id)`

2. ✅ **Implementar recordatorios por email**
   - Crear cron job o función edge que se ejecute diariamente
   - Llamar a `get_memberships_expiring_soon(3)`
   - Enviar emails a usuarios con membresías próximas a vencer

3. ✅ **Actualizar UI del dashboard**
   - Mostrar fecha de expiración de membresía
   - Contador de días restantes
   - Botón prominente para renovar si está cerca de vencer

4. ✅ **Bloquear acceso a la academia**
   - Verificar `is_active` antes de mostrar contenido de cursos

## 📞 Soporte

Si encuentras algún error durante la migración, revisa:
- Los logs de Supabase en **Database → Logs**
- Que no haya tablas o funciones con nombres duplicados
- Que tengas permisos de administrador en el proyecto

---

**Última actualización**: 2025-10-20  
**Migración**: `018_membership_monthly_logic.sql`  
**Autor**: Qoder AI Assistant

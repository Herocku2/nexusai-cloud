# Supabase Migrations

**Total**: 12 archivos SQL  
**Tamaño total**: ~47KB  
**Orden**: Secuencial (001 → 012)

## 📋 Lista de Migraciones

| # | Archivo | Tamaño | Descripción | Estado |
|---|---------|--------|-------------|---------|
| 1 | `001_user_profiles.sql` | 1.9KB | Perfiles de usuario (extiende auth.users) | ✅ Ready |
| 2 | `002_ranks_and_binary.sql` | 6.1KB | Rangos + árbol binario + seed data | ✅ Ready |
| 3 | `003_memberships.sql` | 1.5KB | Membresías $89/$29 | ✅ Ready |
| 4 | `004_transactions.sql` | 2.4KB | Transacciones financieras | ✅ Ready |
| 5 | `005_commissions.sql` | 2.2KB | Comisiones MLM | ✅ Ready |
| 6 | `006_academy_content.sql` | 2.3KB | Contenido educativo LMS | ✅ Ready |
| 7 | `007_user_content_progress.sql` | 2.1KB | Progreso de usuarios en cursos | ✅ Ready |
| 8 | `008_notifications.sql` | 1.2KB | Sistema de notificaciones | ✅ Ready |
| 9 | `009_withdrawal_requests.sql` | 2.1KB | Solicitudes de retiro (3% fee) | ✅ Ready |
| 10 | `010_system_settings.sql` | 2.4KB | Configuración del sistema + seed | ✅ Ready |
| 11 | `011_functions.sql` | 12.5KB | 6 funciones PostgreSQL | ✅ Ready |
| 12 | `012_rls_policies.sql` | 10.0KB | Row Level Security (30+ políticas) | ✅ Ready |

## 🚀 Cómo Ejecutar

### Método 1: Supabase Dashboard (Recomendado)

1. Ir a https://app.supabase.com → Tu proyecto
2. SQL Editor
3. Copiar y pegar cada archivo en orden
4. Ejecutar con "Run"

### Método 2: Supabase CLI

```bash
# Desde la raíz del proyecto
cd nexusai

# Login
supabase login

# Link proyecto
supabase link --project-ref YOUR_PROJECT_REF

# Push migraciones
supabase db push
```

## 📊 Tablas Creadas

```
auth.users (Supabase nativo)
  └── user_profiles (1:1)
       └── binary_positions (1:1)
            ├── left_child
            └── right_child
       └── user_ranks (1:N)
       └── memberships (1:N)
       └── transactions (1:N)
       └── commissions (1:N)
       └── user_content_progress (1:N)
       └── notifications (1:N)
       └── withdrawal_requests (1:N)

ranks (13 rangos)
academy_content
system_settings
```

**Total**: 12 tablas principales

## 🔧 Funciones PostgreSQL

1. `get_binary_downline(user_id, max_depth)` - Obtener red descendente
2. `calculate_leg_volume(user_id, leg)` - Calcular volumen de pierna
3. `update_binary_volumes(user_id, new_pv)` - Actualizar volúmenes
4. `calculate_binary_commission(user_id, date)` - Calcular comisión binaria
5. `get_direct_referrals_count(user_id)` - Contar referidos directos
6. `find_next_available_position(sponsor_id, preferred_leg)` - Auto-placement

## 🔒 Seguridad

- ✅ RLS habilitado en todas las tablas
- ✅ 30+ políticas de seguridad
- ✅ Users solo ven sus propios datos
- ✅ Service role para operaciones del sistema
- ✅ Políticas específicas por tabla

## 📖 Documentación

Ver guía completa: [SUPABASE_MIGRATIONS_GUIDE.md](../specs/001-nexusai-lms-binary/SUPABASE_MIGRATIONS_GUIDE.md)

## ✅ Verificación

Después de ejecutar todas las migraciones:

```sql
-- Verificar tablas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Verificar rangos
SELECT COUNT(*) FROM ranks; -- Debe ser 13

-- Verificar funciones
SELECT proname FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace;

-- Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

## 🎯 Próximo Paso

Después de ejecutar las migraciones:

```bash
# Generar tipos TypeScript
npx supabase gen types typescript --project-id YOUR_ID > lib/types/database.ts
```

Luego continuar con **Fase 2: Binary Tree Visualization** según [TASKS_NEXTJS_SUPABASE.md](../specs/001-nexusai-lms-binary/TASKS_NEXTJS_SUPABASE.md)

---

**Última actualización**: 2025-10-17  
**Estado**: ✅ Todas las migraciones creadas y listas

-- ========================================
-- SCRIPT PARA CREAR USUARIO ADMINISTRADOR
-- ========================================
-- 
-- PASO 1: CREAR USUARIO EN SUPABASE AUTH (Dashboard)
-- ====================================================
-- DEBES hacer esto MANUALMENTE en el Dashboard de Supabase:
--
-- 1. Abrir https://app.supabase.com
-- 2. Seleccionar tu proyecto
-- 3. Ir a Authentication > Users
-- 4. Click en "Add User" > "Create new user"
-- 5. Ingresar:
--    Email: admin@nexusai.com
--    Password: [ELIGE UNA CONTRASEÑA SEGURA]
-- 6. ACTIVAR "Auto Confirm User"
-- 7. Click en "Create User"
--
-- PASO 2: EJECUTAR ESTE SCRIPT SQL
-- ====================================
-- Después de crear el usuario, ejecuta este script:
--
-- ========================================

-- PASO 2.1: Agregar columna is_admin si no existe
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- PASO 2.2: Crear índice para búsquedas de admin
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
ON user_profiles(is_admin) 
WHERE is_admin = TRUE;

-- PASO 2.3: Marcar al usuario admin como administrador
-- Buscar el usuario por email y marcarlo como admin
UPDATE user_profiles
SET 
  is_admin = TRUE,
  status = 'active',
  first_name = 'Admin',
  last_name = 'System',
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@nexusai.com'
);

-- PASO 2.4: Verificación - Ver el usuario admin creado
SELECT 
  u.id,
  u.email,
  u.created_at as user_created_at,
  u.email_confirmed_at,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.status
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'admin@nexusai.com';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Deberías ver una fila con:
-- - email: admin@nexusai.com
-- - email_confirmed_at: [fecha]
-- - is_admin: true
-- - status: active
--
-- Si is_admin es NULL, significa que el perfil no se creó.
-- Ejecuta este INSERT:
--
-- INSERT INTO user_profiles (id, first_name, last_name, is_admin, status)
-- SELECT id, 'Admin', 'System', TRUE, 'active'
-- FROM auth.users WHERE email = 'admin@nexusai.com';
-- ========================================

-- COMENTARIOS FINALES
COMMENT ON COLUMN user_profiles.is_admin IS 'Indica si el usuario tiene permisos de administrador del sistema';

-- ========================================
-- IMPORTANTE: CREDENCIALES DE ACCESO
-- ========================================
-- URL: http://localhost:3000/admin/login
-- Email: admin@nexusai.com
-- Password: [La que configuraste en el Dashboard]
-- ========================================

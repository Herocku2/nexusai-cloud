-- Crear usuario admin en Supabase Auth
-- NOTA: Este script debe ejecutarse manualmente o a través del dashboard de Supabase

-- Crear el usuario admin en auth.users si no existe
-- Esto normalmente se hace a través de la API de Supabase o el dashboard

-- Comentarios para el administrador del sistema:
-- 1. Ir a Supabase Dashboard -> Authentication -> Users
-- 2. Crear un nuevo usuario con:
--    Email: admin@nexusai.com
--    Password: NexusAdmin2024!SecurePass
-- 3. Confirmar el email automáticamente (toggle "Auto Confirm User")
-- 4. O usar la siguiente consulta para confirmar manualmente:

-- UPDATE auth.users 
-- SET email_confirmed_at = NOW()
-- WHERE email = 'admin@nexusai.com';

-- Crear perfil de usuario para el admin si no existe
INSERT INTO user_profiles (
  id,
  first_name,
  last_name,
  status,
  created_at,
  updated_at
)
SELECT 
  auth.uid() as id,
  'Admin' as first_name,
  'System' as last_name,
  'active' as status,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
WHERE email = 'admin@nexusai.com'
ON CONFLICT (id) DO NOTHING;

-- Agregar columna is_admin a user_profiles si no existe
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Marcar al usuario admin como admin
UPDATE user_profiles
SET is_admin = TRUE
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@nexusai.com'
);

-- Crear índice para búsquedas de admin
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
ON user_profiles(is_admin) 
WHERE is_admin = TRUE;

-- Comentario final
COMMENT ON COLUMN user_profiles.is_admin IS 'Indica si el usuario tiene permisos de administrador del sistema';

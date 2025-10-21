-- Script para diagnosticar y arreglar el perfil de demo@nexusai.com

-- 1. Verificar si el usuario existe en auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  'Usuario existe en auth.users' as status
FROM auth.users
WHERE email = 'demo@nexusai.com';

-- 2. Verificar si tiene perfil en user_profiles
SELECT 
  up.id,
  up.first_name,
  up.last_name,
  up.is_admin,
  up.status,
  'Perfil existe en user_profiles' as status
FROM user_profiles up
INNER JOIN auth.users u ON up.id = u.id
WHERE u.email = 'demo@nexusai.com';

-- 3. Si NO tiene perfil, crearlo:
-- IMPORTANTE: Ejecuta esto solo si el paso 2 NO devuelve resultados

INSERT INTO user_profiles (id, first_name, last_name, status, balance, total_earnings, total_pv, is_admin)
SELECT 
  u.id,
  'Demo',
  'User',
  'active',
  0,
  0,
  0,
  false
FROM auth.users u
WHERE u.email = 'demo@nexusai.com'
  AND NOT EXISTS (
    SELECT 1 FROM user_profiles p WHERE p.id = u.id
  );

-- 4. Verificar que todo esté correcto
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  up.first_name,
  up.last_name,
  up.is_admin,
  up.status,
  'Verificación final' as check_type
FROM auth.users u
INNER JOIN user_profiles up ON u.id = up.id
WHERE u.email = 'demo@nexusai.com';

-- 5. Si quieres ver TODOS los usuarios y sus perfiles:
SELECT 
  u.email,
  up.first_name,
  up.last_name,
  up.is_admin,
  up.status,
  CASE 
    WHEN up.id IS NULL THEN 'SIN PERFIL' 
    ELSE 'CON PERFIL' 
  END as perfil_status
FROM auth.users u
LEFT JOIN user_profiles up ON u.id = up.id
ORDER BY u.created_at DESC;

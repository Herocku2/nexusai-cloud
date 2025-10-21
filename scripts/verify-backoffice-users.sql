-- Script para verificar y corregir usuarios del backoffice
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar si existen los usuarios de prueba del backoffice
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.status
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email IN ('usuario@nexusai.com', 'demo@nexusai.com');

-- 2. Si el usuario existe pero no tiene perfil, créalo:
-- (Esto normalmente se hace automáticamente en la action login)
INSERT INTO user_profiles (id, first_name, last_name, status, balance, total_earnings, total_pv, is_admin)
SELECT 
  u.id,
  'Usuario',
  'Prueba',
  'active',
  0,
  0,
  0,
  false
FROM auth.users u
WHERE u.email = 'usuario@nexusai.com'
  AND NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = u.id);

-- Para demo@nexusai.com
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
  AND NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = u.id);

-- 3. Si el perfil existe pero status no es 'active', actualizarlo:
UPDATE user_profiles 
SET status = 'active', is_admin = false
WHERE id IN (
  SELECT id FROM auth.users WHERE email IN ('usuario@nexusai.com', 'demo@nexusai.com')
);

-- 4. Verificar que todo esté correcto:
SELECT 
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  p.is_admin,
  p.status,
  p.first_name || ' ' || p.last_name as full_name
FROM auth.users u
INNER JOIN user_profiles p ON u.id = p.id
WHERE u.email IN ('usuario@nexusai.com', 'demo@nexusai.com');

-- 5. Si los usuarios NO EXISTEN, necesitas crearlos primero con el script create-test-user
-- O puedes ejecutar desde la aplicación: http://localhost:3000/setup

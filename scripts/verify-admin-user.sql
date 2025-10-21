-- Script para verificar y corregir el usuario administrador
-- Ejecuta esto en Supabase SQL Editor

-- 1. Verificar si existe el usuario admin@nexusai.com
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.status
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'admin@nexusai.com';

-- 2. Si el usuario existe pero no tiene is_admin = true, actualízalo:
UPDATE user_profiles 
SET is_admin = true, status = 'active'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@nexusai.com'
);

-- 3. Verificar usuarios de demo también
SELECT 
  u.id,
  u.email,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.status
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email IN ('demo@nexusai.com', 'usuario@nexusai.com');

-- 4. Si quieres dar acceso admin a demo@nexusai.com:
-- UPDATE user_profiles 
-- SET is_admin = true, status = 'active'
-- WHERE id IN (
--   SELECT id FROM auth.users WHERE email = 'demo@nexusai.com'
-- );

-- 5. Verificar que todo esté correcto:
SELECT 
  u.email,
  p.is_admin,
  p.status,
  p.first_name || ' ' || p.last_name as full_name
FROM auth.users u
INNER JOIN user_profiles p ON u.id = p.id
WHERE p.is_admin = true;

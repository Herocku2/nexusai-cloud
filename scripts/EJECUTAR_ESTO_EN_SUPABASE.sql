-- ============================================
-- SCRIPT DE EJECUCIÓN DIRECTA EN SUPABASE
-- ============================================
-- Copia y pega este script completo en:
-- https://app.supabase.com/project/syjougqrwcvqbqleqtss/sql/new
--
-- Este script:
-- 1. Verifica si demo@nexusai.com existe
-- 2. Crea el perfil si no existe
-- 3. Muestra el resultado final
-- ============================================

-- Paso 1: Verificar si el usuario existe en auth.users
DO $$
DECLARE
    v_user_id UUID;
    v_profile_exists BOOLEAN;
BEGIN
    -- Buscar el ID del usuario
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'demo@nexusai.com';

    IF v_user_id IS NULL THEN
        RAISE NOTICE '❌ El usuario demo@nexusai.com NO existe en auth.users';
        RAISE NOTICE 'Debes crear el usuario primero desde /setup o el panel de Supabase';
    ELSE
        RAISE NOTICE '✅ Usuario encontrado: %', v_user_id;
        
        -- Verificar si tiene perfil
        SELECT EXISTS(
            SELECT 1 FROM user_profiles WHERE id = v_user_id
        ) INTO v_profile_exists;

        IF v_profile_exists THEN
            RAISE NOTICE '✅ El usuario ya tiene perfil en user_profiles';
        ELSE
            RAISE NOTICE '⚠️  El usuario NO tiene perfil, creando...';
            
            -- Crear el perfil
            INSERT INTO user_profiles (
                id, 
                first_name, 
                last_name, 
                is_admin, 
                status, 
                balance, 
                total_earnings, 
                total_pv
            )
            VALUES (
                v_user_id,
                'Demo',
                'User',
                false,
                'active',
                0,
                0,
                0
            );
            
            RAISE NOTICE '✅ Perfil creado exitosamente';
        END IF;
    END IF;
END $$;

-- Paso 2: Mostrar el resultado final
SELECT 
    u.email,
    p.first_name,
    p.last_name,
    p.is_admin,
    p.status,
    p.balance,
    p.total_earnings,
    p.total_pv,
    'Perfil completo verificado' as resultado
FROM auth.users u
INNER JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'demo@nexusai.com';

-- Si el SELECT anterior no devuelve resultados, el usuario no existe
-- En ese caso, ejecuta este código para crear el usuario:

/*
-- SOLO SI EL USUARIO NO EXISTE, descomenta y ejecuta esto:

-- Crear usuario en auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'demo@nexusai.com',
    crypt('Demo2024!Test', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Demo","last_name":"User"}',
    NOW(),
    NOW(),
    '',
    ''
)
RETURNING id;

-- Luego ejecuta el script completo de nuevo desde el inicio
*/

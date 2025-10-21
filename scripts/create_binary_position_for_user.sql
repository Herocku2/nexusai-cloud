-- =====================================================
-- SCRIPT: Crear Posición Binaria para Usuario
-- Descripción: Crea una posición en el árbol binario para un usuario
-- =====================================================

-- PASO 1: Crear la función get_downline_count si no existe
CREATE OR REPLACE FUNCTION get_downline_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result INTEGER;
BEGIN
  WITH RECURSIVE downline AS (
    -- Obtener los hijos directos
    SELECT user_id, parent_id
    FROM binary_positions
    WHERE parent_id = p_user_id
    
    UNION ALL
    
    -- Obtener los hijos de los hijos recursivamente
    SELECT bp.user_id, bp.parent_id
    FROM binary_positions bp
    INNER JOIN downline d ON bp.parent_id = d.user_id
  )
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM downline;
  
  RETURN count_result;
END;
$$;

-- PASO 2: Otorgar permisos
GRANT EXECUTE ON FUNCTION get_downline_count TO authenticated;

-- =====================================================
-- CREAR POSICIÓN BINARIA PARA EL USUARIO ACTUAL
-- =====================================================

-- NOTA: Reemplaza 'TU_USER_ID_AQUI' con tu ID de usuario real
-- Puedes obtener tu ID ejecutando: SELECT auth.uid();

DO $$
DECLARE
  current_user_id UUID;
  user_profile_exists BOOLEAN;
  binary_position_exists BOOLEAN;
  new_position_id BIGINT;
BEGIN
  -- Obtener el ID del usuario actual
  current_user_id := auth.uid();
  
  -- Verificar si el usuario tiene perfil
  SELECT EXISTS(
    SELECT 1 FROM user_profiles WHERE id = current_user_id
  ) INTO user_profile_exists;
  
  IF NOT user_profile_exists THEN
    RAISE NOTICE 'El usuario no tiene un perfil en user_profiles. Creando perfil...';
    
    -- Crear perfil básico
    INSERT INTO user_profiles (
      id,
      first_name,
      last_name,
      is_active,
      balance,
      total_pv,
      status
    )
    SELECT 
      id,
      COALESCE(raw_user_meta_data->>'first_name', 'Usuario'),
      COALESCE(raw_user_meta_data->>'last_name', 'Demo'),
      true,
      0,
      0,
      'active'
    FROM auth.users
    WHERE id = current_user_id
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Perfil creado para el usuario: %', current_user_id;
  END IF;
  
  -- Verificar si ya tiene posición binaria
  SELECT EXISTS(
    SELECT 1 FROM binary_positions WHERE user_id = current_user_id
  ) INTO binary_position_exists;
  
  IF binary_position_exists THEN
    RAISE NOTICE 'El usuario ya tiene una posición binaria asignada.';
  ELSE
    RAISE NOTICE 'Creando posición binaria para el usuario...';
    
    -- Crear posición binaria como raíz (primer usuario)
    -- O como hijo del primer usuario disponible
    INSERT INTO binary_positions (
      user_id,
      parent_id,
      sponsor_id,
      position_leg,
      level,
      left_volume,
      right_volume,
      left_carryover,
      right_carryover,
      path
    )
    VALUES (
      current_user_id,
      NULL, -- Raíz del árbol (sin padre)
      NULL, -- Sin sponsor (usuario raíz)
      'left', -- Posición por defecto
      0, -- Nivel 0 (raíz)
      0,
      0,
      0,
      0,
      '0' -- Path raíz
    )
    RETURNING id INTO new_position_id;
    
    RAISE NOTICE 'Posición binaria creada con ID: %', new_position_id;
    RAISE NOTICE 'Usuario: % ahora tiene una posición en el árbol binario', current_user_id;
  END IF;
  
  -- Mostrar información final
  RAISE NOTICE '===================================';
  RAISE NOTICE 'RESUMEN:';
  RAISE NOTICE 'User ID: %', current_user_id;
  RAISE NOTICE 'Perfil existe: %', user_profile_exists;
  RAISE NOTICE 'Posición binaria existe: %', binary_position_exists OR new_position_id IS NOT NULL;
  RAISE NOTICE '===================================';
  
END $$;

-- =====================================================
-- VERIFICAR LA POSICIÓN CREADA
-- =====================================================

-- Ver tu posición en el árbol
SELECT 
  bp.id,
  bp.user_id,
  bp.position_leg as position,
  bp.level,
  bp.left_volume,
  bp.right_volume,
  bp.path,
  up.first_name,
  up.last_name,
  au.email
FROM binary_positions bp
INNER JOIN user_profiles up ON bp.user_id = up.id
INNER JOIN auth.users au ON up.id = au.id
WHERE bp.user_id = auth.uid();

-- =====================================================
-- ALTERNATIVA: Script más simple si el anterior falla
-- =====================================================

-- Descomentar y ejecutar estas líneas si el script anterior no funciona:

/*
-- 1. Ver tu user ID
SELECT auth.uid() as my_user_id;

-- 2. Crear tu posición binaria (reemplaza 'TU_USER_ID' con el ID del paso 1)
INSERT INTO binary_positions (
  user_id,
  parent_id,
  sponsor_id,
  position_leg,
  level,
  left_volume,
  right_volume,
  left_carryover,
  right_carryover,
  path
)
VALUES (
  'TU_USER_ID'::UUID, -- REEMPLAZAR CON TU USER ID
  NULL,
  NULL,
  'left',
  0,
  0,
  0,
  0,
  0,
  '0'
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Verificar
SELECT * FROM binary_positions WHERE user_id = 'TU_USER_ID'::UUID;
*/

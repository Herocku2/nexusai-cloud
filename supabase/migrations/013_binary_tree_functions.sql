-- =====================================================
-- FUNCIONES RPC PARA ÁRBOL BINARIO
-- Creado: 2025-10-19
-- Descripción: Funciones necesarias para el sistema MLM Binary
-- =====================================================

-- =====================================================
-- 1. Función: get_binary_downline
-- Descripción: Obtiene el árbol de descendientes binarios
--              de un usuario hasta cierta profundidad
-- =====================================================

CREATE OR REPLACE FUNCTION get_binary_downline(
  root_user_id UUID,
  max_depth INTEGER DEFAULT 3
)
RETURNS TABLE (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  position TEXT,
  depth INTEGER,
  parent_id UUID,
  status TEXT,
  total_pv NUMERIC,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE downline AS (
    -- Caso base: hijos directos del usuario raíz
    SELECT 
      bp.user_id AS user_id,
      up.first_name AS first_name,
      up.last_name AS last_name,
      au.email AS email,
      bp.position::TEXT AS position,
      1 AS depth,
      bp.parent_id AS parent_id,
      up.status::TEXT AS status,
      up.total_pv AS total_pv,
      up.created_at AS created_at
    FROM binary_positions bp
    INNER JOIN user_profiles up ON bp.user_id = up.id
    INNER JOIN auth.users au ON up.id = au.id
    WHERE bp.parent_id = root_user_id
    
    UNION ALL
    
    -- Caso recursivo: hijos de los hijos
    SELECT 
      child_bp.user_id AS user_id,
      child_up.first_name AS first_name,
      child_up.last_name AS last_name,
      child_au.email AS email,
      child_bp.position::TEXT AS position,
      d.depth + 1 AS depth,
      child_bp.parent_id AS parent_id,
      child_up.status::TEXT AS status,
      child_up.total_pv AS total_pv,
      child_up.created_at AS created_at
    FROM binary_positions child_bp
    INNER JOIN downline d ON child_bp.parent_id = d.user_id
    INNER JOIN user_profiles child_up ON child_bp.user_id = child_up.id
    INNER JOIN auth.users child_au ON child_up.id = child_au.id
    WHERE (d.depth < max_depth OR max_depth IS NULL)
  )
  SELECT 
    downline.user_id,
    downline.first_name,
    downline.last_name,
    downline.email,
    downline.position,
    downline.depth,
    downline.parent_id,
    downline.status,
    downline.total_pv,
    downline.created_at
  FROM downline
  ORDER BY depth, position, created_at;
END;
$$;

-- Comentario de la función
COMMENT ON FUNCTION get_binary_downline IS 
'Obtiene el árbol de descendientes binarios de un usuario hasta cierta profundidad. 
Retorna información completa de cada miembro del downline incluyendo posición y nivel.';

-- =====================================================
-- 2. Función: get_direct_referrals_count
-- Descripción: Cuenta los referidos directos por posición
--              (izquierda y derecha)
-- =====================================================

CREATE OR REPLACE FUNCTION get_direct_referrals_count(
  target_user_id UUID
)
RETURNS TABLE (
  left_count BIGINT,
  right_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE bp.position = 'left') AS left_count,
    COUNT(*) FILTER (WHERE bp.position = 'right') AS right_count
  FROM binary_positions bp
  WHERE bp.parent_id = target_user_id;
END;
$$;

-- Comentario de la función
COMMENT ON FUNCTION get_direct_referrals_count IS 
'Cuenta los referidos directos de un usuario separados por posición (left/right).
Útil para validar y mostrar el estado del árbol binario de primer nivel.';

-- =====================================================
-- 3. Función: get_team_volume_by_leg
-- Descripción: Calcula el volumen total de cada pierna
--              del árbol binario
-- =====================================================

CREATE OR REPLACE FUNCTION get_team_volume_by_leg(
  target_user_id UUID
)
RETURNS TABLE (
  left_volume NUMERIC,
  right_volume NUMERIC,
  left_count BIGINT,
  right_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH downline AS (
    SELECT 
      bp.user_id,
      bp.position,
      up.total_pv
    FROM binary_positions bp
    INNER JOIN user_profiles up ON bp.user_id = up.id
    WHERE bp.parent_id = target_user_id
    
    UNION ALL
    
    SELECT 
      bp.user_id,
      d.position, -- Heredar posición del ancestro directo
      up.total_pv
    FROM binary_positions bp
    INNER JOIN downline d ON bp.parent_id = d.user_id
    INNER JOIN user_profiles up ON bp.user_id = up.id
  )
  SELECT 
    COALESCE(SUM(total_pv) FILTER (WHERE position = 'left'), 0) AS left_volume,
    COALESCE(SUM(total_pv) FILTER (WHERE position = 'right'), 0) AS right_volume,
    COUNT(*) FILTER (WHERE position = 'left') AS left_count,
    COUNT(*) FILTER (WHERE position = 'right') AS right_count
  FROM downline;
END;
$$;

-- Comentario de la función
COMMENT ON FUNCTION get_team_volume_by_leg IS 
'Calcula el volumen total (PV) de cada pierna del árbol binario.
Incluye todos los niveles descendientes y cuenta miembros por pierna.';

-- =====================================================
-- 4. Función: find_available_position
-- Descripción: Encuentra la primera posición disponible
--              en el árbol binario para un nuevo usuario
-- =====================================================

CREATE OR REPLACE FUNCTION find_available_position(
  sponsor_user_id UUID,
  preferred_position TEXT DEFAULT NULL
)
RETURNS TABLE (
  parent_id UUID,
  position TEXT,
  depth INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  queue_item RECORD;
  current_parent UUID;
  current_depth INTEGER := 1;
BEGIN
  -- Si hay preferencia y está disponible, usarla
  IF preferred_position IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM binary_positions 
      WHERE parent_id = sponsor_user_id 
      AND position = preferred_position
    ) THEN
      RETURN QUERY SELECT sponsor_user_id, preferred_position, 1;
      RETURN;
    END IF;
  END IF;

  -- Búsqueda por niveles (BFS) para encontrar primera posición disponible
  CREATE TEMP TABLE IF NOT EXISTS queue (
    user_id UUID,
    depth INTEGER
  );
  
  INSERT INTO queue VALUES (sponsor_user_id, 1);
  
  WHILE EXISTS (SELECT 1 FROM queue) LOOP
    SELECT q.user_id, q.depth INTO current_parent, current_depth
    FROM queue q
    LIMIT 1;
    
    DELETE FROM queue WHERE user_id = current_parent;
    
    -- Verificar si tiene posición left disponible
    IF NOT EXISTS (
      SELECT 1 FROM binary_positions 
      WHERE parent_id = current_parent 
      AND position = 'left'
    ) THEN
      DROP TABLE IF EXISTS queue;
      RETURN QUERY SELECT current_parent, 'left'::TEXT, current_depth;
      RETURN;
    END IF;
    
    -- Verificar si tiene posición right disponible
    IF NOT EXISTS (
      SELECT 1 FROM binary_positions 
      WHERE parent_id = current_parent 
      AND position = 'right'
    ) THEN
      DROP TABLE IF EXISTS queue;
      RETURN QUERY SELECT current_parent, 'right'::TEXT, current_depth;
      RETURN;
    END IF;
    
    -- Agregar hijos a la cola
    INSERT INTO queue
    SELECT user_id, current_depth + 1
    FROM binary_positions
    WHERE parent_id = current_parent;
  END LOOP;
  
  DROP TABLE IF EXISTS queue;
  
  -- Si no se encontró posición (no debería pasar), retornar null
  RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::INTEGER;
END;
$$;

-- Comentario de la función
COMMENT ON FUNCTION find_available_position IS 
'Encuentra la primera posición disponible en el árbol binario usando búsqueda por niveles.
Si se especifica preferencia (left/right), intenta colocar ahí primero.';

-- =====================================================
-- 5. Función: calculate_binary_commission
-- Descripción: Calcula la comisión binaria para un usuario
--              basada en el volumen de las piernas
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_binary_commission(
  target_user_id UUID,
  commission_rate NUMERIC DEFAULT 0.50
)
RETURNS TABLE (
  weaker_leg_volume NUMERIC,
  commission_amount NUMERIC,
  left_volume NUMERIC,
  right_volume NUMERIC,
  left_carryover NUMERIC,
  right_carryover NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  left_vol NUMERIC;
  right_vol NUMERIC;
  left_carry NUMERIC;
  right_carry NUMERIC;
  weaker_vol NUMERIC;
  commission NUMERIC;
BEGIN
  -- Obtener volúmenes de binary_positions
  SELECT 
    bp.left_volume, 
    bp.right_volume,
    bp.left_carryover,
    bp.right_carryover
  INTO left_vol, right_vol, left_carry, right_carry
  FROM binary_positions bp
  WHERE bp.user_id = target_user_id;
  
  -- Si no existe, retornar ceros
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      0::NUMERIC, 0::NUMERIC, 0::NUMERIC, 
      0::NUMERIC, 0::NUMERIC, 0::NUMERIC;
    RETURN;
  END IF;
  
  -- Sumar carryovers
  left_vol := COALESCE(left_vol, 0) + COALESCE(left_carry, 0);
  right_vol := COALESCE(right_vol, 0) + COALESCE(right_carry, 0);
  
  -- Calcular volumen de pierna débil
  weaker_vol := LEAST(left_vol, right_vol);
  
  -- Calcular comisión
  commission := weaker_vol * commission_rate;
  
  -- Calcular nuevos carryovers
  left_carry := GREATEST(left_vol - weaker_vol, 0);
  right_carry := GREATEST(right_vol - weaker_vol, 0);
  
  RETURN QUERY SELECT 
    weaker_vol, 
    commission,
    left_vol,
    right_vol,
    left_carry,
    right_carry;
END;
$$;

-- Comentario de la función
COMMENT ON FUNCTION calculate_binary_commission IS 
'Calcula la comisión binaria basada en el volumen de la pierna más débil.
Retorna comisión, volúmenes y carryovers actualizados.';

-- =====================================================
-- GRANTS DE PERMISOS
-- =====================================================

-- Permitir ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION get_binary_downline TO authenticated;
GRANT EXECUTE ON FUNCTION get_direct_referrals_count TO authenticated;
GRANT EXECUTE ON FUNCTION get_team_volume_by_leg TO authenticated;
GRANT EXECUTE ON FUNCTION find_available_position TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_binary_commission TO authenticated;

-- =====================================================
-- FIN DEL ARCHIVO
-- =====================================================

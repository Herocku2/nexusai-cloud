-- Migración: Fix user_ranks structure
-- Fecha: 2025-10-19
-- Problema: user_ranks no tiene columna is_current, causando errores en queries

-- Agregar columna is_current
ALTER TABLE user_ranks 
ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE;

-- Crear índice para is_current
CREATE INDEX IF NOT EXISTS idx_user_ranks_is_current ON user_ranks(user_id, is_current) 
WHERE is_current = TRUE;

-- Actualizar registros existentes: marcar el más reciente de cada usuario como current
WITH ranked_achievements AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY achieved_at DESC) as rn
  FROM user_ranks
)
UPDATE user_ranks ur
SET is_current = TRUE
FROM ranked_achievements ra
WHERE ur.id = ra.id AND ra.rn = 1;

-- Comentario
COMMENT ON COLUMN user_ranks.is_current IS 'Indicates if this is the user''s current rank';

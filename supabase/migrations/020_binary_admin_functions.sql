-- Función para contar referidos directos en batch
CREATE OR REPLACE FUNCTION count_direct_referrals_batch(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sponsor_id as user_id,
    COUNT(*)::BIGINT as count
  FROM user_profiles
  WHERE sponsor_id = ANY(user_ids)
  GROUP BY sponsor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

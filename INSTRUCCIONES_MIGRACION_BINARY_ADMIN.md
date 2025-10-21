# Aplicar Migración del Árbol Binario Admin

## Función SQL a Aplicar en Supabase

Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
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
```

## Verificar que funciona

Puedes probar la función con:

```sql
SELECT * FROM count_direct_referrals_batch(
  ARRAY['<uuid-usuario-1>', '<uuid-usuario-2>']::UUID[]
);
```

## Notas Importantes

1. Esta función optimiza las consultas del árbol binario
2. Evita N+1 queries al obtener conteos de referidos
3. Es segura y solo consulta, no modifica datos
4. Usada por las Server Actions del admin

## Verificación

Una vez aplicada, el árbol binario en `/admin/binary-tree` debería cargar correctamente.

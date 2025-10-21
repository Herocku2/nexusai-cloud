# 🌳 Cómo Ver Tu Posición en el Árbol Binario

## 📋 Problema Actual

Ves el mensaje: **"No tienes una posición en el árbol binario aún"**

Esto significa que tu usuario no tiene un registro en la tabla `binary_positions`.

---

## ✅ Solución: Crear Tu Posición Binaria

### **Opción 1: Script SQL Automático (Recomendado)**

1. **Ve al SQL Editor de Supabase:**
   - Abre tu proyecto en Supabase
   - Ve a "SQL Editor"
   - Crea una nueva query

2. **Ejecuta este script:**

```sql
-- PASO 1: Crear función si no existe
CREATE OR REPLACE FUNCTION get_downline_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result INTEGER;
BEGIN
  WITH RECURSIVE downline AS (
    SELECT user_id, parent_id
    FROM binary_positions
    WHERE parent_id = p_user_id
    
    UNION ALL
    
    SELECT bp.user_id, bp.parent_id
    FROM binary_positions bp
    INNER JOIN downline d ON bp.parent_id = d.user_id
  )
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM downline;
  
  RETURN count_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_downline_count TO authenticated;

-- PASO 2: Crear tu posición binaria
DO $$
DECLARE
  current_user_id UUID;
  user_profile_exists BOOLEAN;
  binary_position_exists BOOLEAN;
BEGIN
  -- Obtener tu ID de usuario
  current_user_id := auth.uid();
  
  -- Verificar si tienes perfil
  SELECT EXISTS(
    SELECT 1 FROM user_profiles WHERE id = current_user_id
  ) INTO user_profile_exists;
  
  IF NOT user_profile_exists THEN
    -- Crear perfil si no existe
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
    
    RAISE NOTICE 'Perfil creado';
  END IF;
  
  -- Verificar si ya tienes posición binaria
  SELECT EXISTS(
    SELECT 1 FROM binary_positions WHERE user_id = current_user_id
  ) INTO binary_position_exists;
  
  IF NOT binary_position_exists THEN
    -- Crear tu posición binaria
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
      NULL, -- Raíz (primer usuario)
      NULL, -- Sin sponsor
      'left',
      0, -- Nivel 0
      0,
      0,
      0,
      0,
      '0' -- Path raíz
    );
    
    RAISE NOTICE 'Posición binaria creada exitosamente!';
  ELSE
    RAISE NOTICE 'Ya tienes una posición binaria';
  END IF;
  
END $$;

-- PASO 3: Verificar tu posición
SELECT 
  bp.id,
  bp.user_id,
  bp.position_leg as position,
  bp.level,
  bp.left_volume,
  bp.right_volume,
  up.first_name,
  up.last_name
FROM binary_positions bp
INNER JOIN user_profiles up ON bp.user_id = up.id
WHERE bp.user_id = auth.uid();
```

3. **Ejecuta el script completo** (Ctrl/Cmd + Enter)

4. **Verifica que se creó:**
   - Deberías ver un mensaje: "Posición binaria creada exitosamente!"
   - Deberías ver tus datos en la tabla de resultados

---

### **Opción 2: Script Manual**

Si el script automático no funciona, usa este método manual:

**Paso 1: Obtén tu User ID**

```sql
SELECT auth.uid() as my_user_id;
```

Copia el UUID que aparece (ejemplo: `123e4567-e89b-12d3-a456-426614174000`)

**Paso 2: Crea la función get_downline_count**

```sql
CREATE OR REPLACE FUNCTION get_downline_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result INTEGER;
BEGIN
  WITH RECURSIVE downline AS (
    SELECT user_id, parent_id
    FROM binary_positions
    WHERE parent_id = p_user_id
    
    UNION ALL
    
    SELECT bp.user_id, bp.parent_id
    FROM binary_positions bp
    INNER JOIN downline d ON bp.parent_id = d.user_id
  )
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM downline;
  
  RETURN count_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_downline_count TO authenticated;
```

**Paso 3: Crea tu posición** (reemplaza TU_USER_ID con el UUID del Paso 1)

```sql
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
  'TU_USER_ID'::UUID, -- ⚠️ REEMPLAZAR AQUÍ
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
```

**Paso 4: Verifica**

```sql
SELECT * FROM binary_positions WHERE user_id = 'TU_USER_ID'::UUID;
```

---

## 🎯 Después de Crear Tu Posición

1. **Recarga la página** del árbol binario: `/dashboard/binary-tree`

2. **Deberías ver:**
   - Tu nodo en el centro
   - Tus estadísticas (volumen izq/der)
   - Espacios para agregar hijos

3. **Si aún no ves nada:**
   - Verifica en Supabase que el registro se creó
   - Revisa la consola del navegador por errores
   - Intenta hacer logout/login

---

## 📊 Estructura de Tu Posición Inicial

```
Tu posición se creará con:
- Nivel: 0 (raíz del árbol)
- Posición: left
- Padre: NULL (eres la raíz)
- Sponsor: NULL (primer usuario)
- Volumen izq: 0
- Volumen der: 0
- Path: '0'
```

Cuando otros usuarios se registren con tu enlace de referido, 
aparecerán como hijos en tu árbol.

---

## 🔧 Troubleshooting

### Error: "auth.uid() is null"
**Solución:** Ejecuta el script mientras estás autenticado en Supabase. El SQL Editor debe usar tu sesión activa.

### Error: "user_profiles does not exist"
**Solución:** Primero ejecuta la migración de user_profiles o crea el perfil manualmente.

### Error: "duplicate key value violates unique constraint"
**Solución:** Ya tienes una posición creada. Verifica con:
```sql
SELECT * FROM binary_positions WHERE user_id = auth.uid();
```

### No veo cambios en la app
**Solución:**
1. Cierra sesión
2. Limpia caché del navegador
3. Inicia sesión nuevamente
4. Ve a `/dashboard/binary-tree`

---

## 📝 Notas Importantes

1. **Este script solo crea TU posición inicial**
   - Serás el nodo raíz (nivel 0)
   - Los referidos se agregarán como hijos

2. **Para agregar más usuarios al árbol:**
   - Necesitas un sistema de registro que automáticamente cree posiciones
   - O ejecutar scripts similares para cada usuario

3. **El script es seguro:**
   - Usa `ON CONFLICT DO NOTHING` para evitar duplicados
   - No modifica datos existentes
   - Solo crea registros nuevos

---

## ✅ Checklist de Verificación

Después de ejecutar el script:

- [ ] La query retorna "Posición binaria creada exitosamente!"
- [ ] Puedo ver mi registro en `binary_positions`
- [ ] El campo `user_id` coincide con mi ID de usuario
- [ ] Tengo un registro en `user_profiles`
- [ ] Al recargar `/dashboard/binary-tree` veo mi posición
- [ ] No hay errores en la consola del navegador

---

## 📞 ¿Necesitas Ayuda?

Si después de seguir estos pasos aún no puedes ver tu posición:

1. Verifica los logs en la consola del navegador
2. Revisa los datos en Supabase directamente
3. Comprueba que las migraciones se aplicaron correctamente
4. Verifica que tienes un perfil en `user_profiles`

---

**¡Una vez creada tu posición, podrás ver tu árbol binario completo!** 🎉

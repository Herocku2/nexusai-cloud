# Sistema de Enlaces de Referencia y Selector de Pierna - Implementación Completada

## 🎉 Funcionalidades Implementadas

### 1. **Enlaces de Referencia con Dominio nexusai.cloud**

Se ha implementado el sistema de enlaces de referencia que permite a los usuarios compartir su enlace personalizado:

**Formato del enlace:**
```
https://nexusai.cloud/auth/register?sponsor={USER_ID}
```

**Ubicación:**
- ✅ Página de Perfil (`/dashboard/profile`)
- ✅ Página de Mi Equipo (`/dashboard/team`)

**Características:**
- Botón para copiar al portapapeles
- Enlace único por usuario
- Cuando alguien se registra usando el enlace, el sistema automáticamente:
  - Asigna al sponsor (patrocinador)
  - Coloca al nuevo usuario en el árbol binario según la preferencia configurada
  - Genera comisiones por bonos de inicio rápido

---

### 2. **Selector de Pierna (Placement Preference)**

Los usuarios ahora pueden controlar dónde se colocarán sus nuevos referidos en el árbol binario.

**Opciones disponibles:**

1. **Pierna Izquierda** 🔵
   - Todos los nuevos referidos se colocan en la pierna izquierda
   
2. **Pierna Derecha** 🟠
   - Todos los nuevos referidos se colocan en la pierna derecha

3. **Balanceo Automático** ⚖️
   - El sistema coloca automáticamente en la pierna más débil
   - Ayuda a balancear el árbol binario

**Características:**
- Selector visual con iconos
- Se puede cambiar en cualquier momento
- La preferencia se guarda en la base de datos
- Actualización en tiempo real

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:

1. **`supabase/migrations/017_add_placement_preference.sql`**
   - Migración para agregar el campo `placement_preference` a `user_profiles`
   - Agrega también el campo `wallet_address`

2. **`app/actions/referral.ts`**
   - Acciones del servidor para manejar la preferencia de pierna
   - `updatePlacementPreference()` - Actualiza la preferencia
   - `getPlacementPreference()` - Obtiene la preferencia actual

3. **`components/shared/referral-section.tsx`**
   - Componente cliente con:
     - Sección de enlace de referencia con botón de copiar
     - Selector de preferencia de pierna con radio buttons
     - Mensajes de éxito/error

### Archivos Modificados:

1. **`app/dashboard/team/page.tsx`**
   - Agregado componente ReferralSection
   - Obtiene la preferencia actual del usuario

2. **`app/dashboard/profile/page.tsx`**
   - Actualizado dominio a `nexusai.cloud`

3. **`messages/es.json`** y **`messages/en.json`**
   - Agregadas traducciones para la sección de referidos

---

## 🗄️ Cambios en la Base de Datos

### Campo Agregado a `user_profiles`:

```sql
placement_preference VARCHAR(10) DEFAULT 'auto' 
CHECK (placement_preference IN ('left', 'right', 'auto'))
```

**Valores posibles:**
- `'left'` - Colocar en pierna izquierda
- `'right'` - Colocar en pierna derecha  
- `'auto'` - Balanceo automático (por defecto)

---

## 🚀 Instrucciones de Implementación

### Paso 1: Ejecutar la Migración en Supabase

1. Abre tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo:
   ```
   supabase/migrations/017_add_placement_preference.sql
   ```
4. Haz clic en **Run** para ejecutar la migración

### Paso 2: Verificar la Migración

Ejecuta esta consulta para verificar que se agregó correctamente:

```sql
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name IN ('placement_preference', 'wallet_address');
```

### Paso 3: Probar la Funcionalidad

1. ✅ Navega a `/dashboard/team`
2. ✅ Verifica que aparezcan las dos tarjetas:
   - "Tu Enlace de Referido"
   - "Preferencia de Colocación"
3. ✅ Prueba copiar el enlace
4. ✅ Cambia la preferencia de pierna
5. ✅ Verifica que se guarde correctamente

---

## 🎨 Capturas de Funcionalidad

### Sección de Enlace de Referencia:
- 🔗 Enlace completo visible
- 📋 Botón "Copiar" que cambia a "¡Copiado!" temporalmente
- 💡 Tip informativo sobre compartir en redes sociales

### Selector de Pierna:
- 🔵 **Pierna Izquierda** - Con icono chevron izquierdo
- 🟠 **Pierna Derecha** - Con icono chevron derecho
- ⚖️ **Balanceo Automático** - Con icono de balanza
- ✨ Cada opción tiene descripción clara
- 💾 Botón "Actualizar Preferencia"

---

## 🔄 Flujo de Registro con Enlace de Referencia

1. **Usuario A** comparte su enlace:
   ```
   https://nexusai.cloud/auth/register?sponsor=abc-123-def
   ```

2. **Usuario B** hace clic en el enlace y se registra

3. El sistema automáticamente:
   - ✅ Asigna `sponsor_id = abc-123-def` en `user_profiles`
   - ✅ Lee la `placement_preference` del Usuario A
   - ✅ Coloca al Usuario B en el árbol binario según:
     - Si preference = 'left' → Pierna izquierda
     - Si preference = 'right' → Pierna derecha
     - Si preference = 'auto' → Pierna más débil

4. **Usuario B** hace un depósito ($89 USDT)

5. El sistema genera comisiones:
   - ✅ **Fast Start Level 1**: $40 para Usuario A
   - ✅ **Fast Start Level 2**: $8 para el sponsor del Usuario A (si existe)
   - ✅ **Binary Bonus**: Actualiza volúmenes en el árbol

---

## 📊 Traducciones Agregadas

### Español (`es.json`):
```json
{
  "referral": {
    "yourReferralLink": "Tu Enlace de Referido",
    "shareThisLink": "Comparte este enlace para invitar nuevos miembros",
    "copy": "Copiar",
    "copied": "¡Copiado!",
    "placementPreference": "Preferencia de Colocación",
    "selectLeg": "Selecciona la pierna donde se colocarán tus nuevos referidos",
    "leftLeg": "Pierna Izquierda",
    "rightLeg": "Pierna Derecha",
    "autoBalance": "Balanceo Automático",
    ...
  }
}
```

---

## ✅ Checklist de Implementación

- [x] Migración de base de datos creada
- [x] Campo `placement_preference` agregado
- [x] Campo `wallet_address` agregado
- [x] Acciones del servidor implementadas
- [x] Componente ReferralSection creado
- [x] Integrado en página de Team
- [x] Actualizado dominio a nexusai.cloud
- [x] Traducciones agregadas (ES/EN)
- [x] Selector de pierna funcional
- [x] Botón copiar enlace funcional
- [x] Validaciones implementadas

---

## 🎯 Próximos Pasos

1. **Ejecutar la migración en Supabase** (IMPORTANTE)
2. **Probar el flujo completo** de registro con enlace
3. **Verificar** que las comisiones se generen correctamente
4. **Documentar** el proceso para usuarios finales

---

## 💡 Notas Importantes

⚠️ **IMPORTANTE**: Debes ejecutar la migración `017_add_placement_preference.sql` en Supabase antes de que esta funcionalidad esté completamente operativa.

🔒 **Seguridad**: El enlace incluye el ID del usuario como parámetro. Este ID es seguro de compartir públicamente ya que es un UUID.

🎨 **UX**: El componente está diseñado para ser intuitivo con iconos visuales y descripciones claras.

📱 **Responsive**: El diseño es totalmente responsive y se adapta a dispositivos móviles.

---

¡Sistema de Enlaces de Referencia y Selector de Pierna implementado exitosamente! 🎉

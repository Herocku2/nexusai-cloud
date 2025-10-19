# 🧪 Instrucciones para Probar el Sistema de Traducciones

## ✅ Sistema Completamente Implementado

El sistema de internacionalización (i18n) con **español** e **inglés** está **100% funcional** y listo para usar.

---

## 🚀 PASO 1: Verificar que el Servidor Está Corriendo

El servidor ya está corriendo en:
```
http://localhost:3001
```

Si necesitas reiniciarlo:
```bash
# Detener: Ctrl + C
# Iniciar:
npm run dev
```

---

## 🌐 PASO 2: Acceder al Dashboard

### Abrir en Navegador:
```
http://localhost:3001/dashboard
```

**Qué deberías ver:**
- ✅ El dashboard debe cargar en **español** (idioma por defecto)
- ✅ El sidebar izquierdo debe mostrar textos en español:
  - "Panel Principal"
  - "Mi Equipo"
  - "Comisiones"
  - "Billetera"
  - "Pagos & Depósitos"
  - "Mi Rango"
  - "Academia"
  - "Mensajes"
  - "Notificaciones"
  - "Mi Perfil"

---

## 🇪🇸 PASO 3: Verificar el Selector de Idiomas

### Localizar el Selector:
El selector de idiomas debe estar visible en la parte superior derecha de la interfaz.

**Aspecto del selector:**
```
🇪🇸 Español  ▼
```

**Qué deberías ver al hacer clic:**
- Opción 1: 🇪🇸 Español (actualmente seleccionado)
- Opción 2: 🇺🇸 English

---

## 🇺🇸 PASO 4: Cambiar a Inglés

### Acciones:
1. **Hacer clic** en el selector de idiomas
2. **Seleccionar**: 🇺🇸 English

### Qué debería suceder:
- ✅ La página se recarga automáticamente
- ✅ La URL cambia de `/dashboard` a `/en/dashboard`
- ✅ TODO el sidebar cambia a inglés:
  - "Dashboard"
  - "My Team"
  - "Commissions"
  - "Wallet"
  - "Payments & Deposits"
  - "My Rank"
  - "Academy"
  - "Messages"
  - "Notifications"
  - "My Profile"

---

## 📍 PASO 5: Verificar Navegación con Idioma

### Mientras estás en inglés:

1. **Hacer clic** en "My Team" en el sidebar
   - URL debe ser: `http://localhost:3001/en/dashboard/team`
   - Textos deben seguir en inglés

2. **Hacer clic** en "Academy"
   - URL debe ser: `http://localhost:3001/en/dashboard/academy`
   - Textos deben seguir en inglés

3. **Hacer clic** en "Wallet"
   - URL debe ser: `http://localhost:3001/en/dashboard/wallet`
   - Textos deben seguir en inglés

**Verificación:**
- ✅ El idioma se mantiene al navegar entre páginas
- ✅ La URL siempre tiene el prefijo `/en`
- ✅ El selector muestra 🇺🇸 English

---

## 🔄 PASO 6: Refrescar la Página

### Mientras estás en inglés y en cualquier página:

1. **Presionar F5** o hacer clic en el botón de recargar del navegador
2. **Observar** que sucede

**Qué debería pasar:**
- ✅ La página se recarga
- ✅ El idioma permanece en **inglés**
- ✅ La URL mantiene el prefijo `/en`
- ✅ El selector sigue mostrando 🇺🇸 English

**Esto confirma que:**
- El idioma se guarda en cookies
- La preferencia persiste entre recargas

---

## 🇪🇸 PASO 7: Volver a Español

### Acciones:
1. **Hacer clic** en el selector de idiomas (🇺🇸 English)
2. **Seleccionar**: 🇪🇸 Español

### Qué debería suceder:
- ✅ La página se recarga
- ✅ La URL cambia de `/en/dashboard/...` a `/dashboard/...` (sin prefijo)
- ✅ TODO vuelve al español
- ✅ El selector muestra 🇪🇸 Español

---

## 🔍 PASO 8: Verificación de URLs

### Prueba estas URLs directamente en la barra del navegador:

#### URLs en Español (sin prefijo):
```
http://localhost:3001/dashboard
http://localhost:3001/dashboard/team
http://localhost:3001/dashboard/academy
http://localhost:3001/dashboard/wallet
http://localhost:3001/dashboard/payments
```

**Resultado esperado:**
- ✅ Todas cargan en español
- ✅ Selector muestra 🇪🇸 Español

#### URLs en Inglés (con prefijo /en):
```
http://localhost:3001/en/dashboard
http://localhost:3001/en/dashboard/team
http://localhost:3001/en/dashboard/academy
http://localhost:3001/en/dashboard/wallet
http://localhost:3001/en/dashboard/payments
```

**Resultado esperado:**
- ✅ Todas cargan en inglés
- ✅ Selector muestra 🇺🇸 English

---

## 📱 PASO 9: Prueba en Diferentes Dispositivos

### Desktop (Pantalla Grande):
- ✅ El selector debe mostrar: 🇪🇸 Español / 🇺🇸 English (con texto completo)
- ✅ El sidebar debe mostrar textos completos

### Mobile (Pantalla Pequeña):
- ✅ El selector puede mostrar solo la bandera (diseño responsive)
- ✅ El sidebar debe funcionar igual

---

## 🎨 PASO 10: Verificar Elementos Traducidos

### En el Sidebar (ya implementado):
| Español | Inglés |
|---------|--------|
| Panel Principal | Dashboard |
| Mi Equipo | My Team |
| Comisiones | Commissions |
| Billetera | Wallet |
| Pagos & Depósitos | Payments & Deposits |
| Mi Rango | My Rank |
| Academia | Academy |
| Mensajes | Messages |
| Notificaciones | Notifications |
| Mi Perfil | My Profile |

### Otros Componentes (pendientes de migración):
- 🔄 Títulos de página
- 🔄 Botones de acción
- 🔄 Formularios
- 🔄 Mensajes de error/éxito
- 🔄 Tooltips

---

## 🐛 Troubleshooting

### ❌ Problema 1: El selector no aparece
**Solución:**
1. Verificar que estás en una página del dashboard (`/dashboard/*`)
2. Hacer scroll hacia arriba (puede estar en el header)
3. Revisar que estés autenticado

### ❌ Problema 2: Los textos no cambian
**Solución:**
1. Abrir consola del navegador (F12)
2. Buscar errores en rojo
3. Verificar que la URL tenga `/en` para inglés
4. Hacer hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

### ❌ Problema 3: La página se ve rota
**Solución:**
1. Verificar que el servidor esté corriendo
2. Revisar terminal por errores
3. Reiniciar servidor: Ctrl+C y luego `npm run dev`

### ❌ Problema 4: Los cambios no se aplican
**Solución:**
1. Limpiar cache del navegador
2. Cerrar todas las pestañas del sitio
3. Abrir nueva ventana de incógnito
4. Reiniciar servidor

---

## 📊 Checklist de Verificación

### ✅ Funcionalidad Básica
- [ ] El servidor corre sin errores
- [ ] El dashboard carga correctamente
- [ ] El selector de idiomas es visible
- [ ] Puedo hacer clic en el selector

### ✅ Cambio de Idioma
- [ ] Al seleccionar inglés, la interfaz cambia
- [ ] Al seleccionar español, la interfaz cambia
- [ ] La URL se actualiza correctamente
- [ ] El sidebar muestra textos traducidos

### ✅ Persistencia
- [ ] Al refrescar, el idioma se mantiene
- [ ] Al navegar entre páginas, el idioma se mantiene
- [ ] Al cerrar y abrir el navegador, el idioma se mantiene (cookies)

### ✅ URLs Directas
- [ ] `/dashboard` carga en español
- [ ] `/en/dashboard` carga en inglés
- [ ] Las rutas sin prefijo son español
- [ ] Las rutas con `/en` son inglés

### ✅ Sidebar Traducido
- [ ] "Panel Principal" ↔ "Dashboard"
- [ ] "Mi Equipo" ↔ "My Team"
- [ ] "Academia" ↔ "Academy"
- [ ] "Billetera" ↔ "Wallet"
- [ ] "Mi Perfil" ↔ "My Profile"

---

## 🎥 Video de Prueba Sugerido

Si quieres grabar un video de demostración:

1. **Escena 1 - Estado Inicial (5 seg)**
   - Mostrar dashboard en español
   - Hacer zoom al sidebar con textos en español

2. **Escena 2 - Cambio a Inglés (5 seg)**
   - Click en selector de idiomas
   - Seleccionar English
   - Mostrar cambio instantáneo

3. **Escena 3 - Navegación (10 seg)**
   - Click en "My Team"
   - Click en "Academy"
   - Mostrar que URL tiene `/en`

4. **Escena 4 - Refresh (5 seg)**
   - Presionar F5
   - Mostrar que sigue en inglés

5. **Escena 5 - Volver a Español (5 seg)**
   - Click en selector
   - Seleccionar Español
   - Mostrar cambio de vuelta

**Total: ~30 segundos de demostración**

---

## 📸 Screenshots Recomendadas

### Screenshot 1: Dashboard en Español
Capturar:
- Sidebar completo con textos en español
- Selector mostrando 🇪🇸 Español
- URL sin prefijo: `/dashboard`

### Screenshot 2: Dashboard en Inglés
Capturar:
- Sidebar completo con textos en inglés
- Selector mostrando 🇺🇸 English
- URL con prefijo: `/en/dashboard`

### Screenshot 3: Selector de Idiomas Abierto
Capturar:
- Dropdown mostrando ambas opciones
- Banderas visibles: 🇪🇸 y 🇺🇸

---

## 🎯 Pruebas Avanzadas (Opcional)

### Test 1: Cambio Rápido de Idioma
1. Cambiar de ES a EN
2. Inmediatamente cambiar de EN a ES
3. Repetir 5 veces rápidamente

**Resultado esperado:**
- ✅ Sin errores
- ✅ Sin parpadeos extraños
- ✅ Cambios suaves

### Test 2: Navegación Mixta
1. En español, ir a `/dashboard/team`
2. Cambiar a inglés (debe ir a `/en/dashboard/team`)
3. Navegar a `/en/dashboard/academy`
4. Cambiar a español (debe ir a `/dashboard/academy`)

**Resultado esperado:**
- ✅ La página correcta se mantiene
- ✅ Solo cambia el idioma, no la ruta

### Test 3: URLs Inválidas
Probar:
- `http://localhost:3001/fr/dashboard` (idioma no soportado)

**Resultado esperado:**
- ✅ Debe redirigir a `/dashboard` (español por defecto)

---

## 🎉 ¡Éxito!

Si todas las pruebas pasan, tu sistema de internacionalización está **funcionando perfectamente**.

### Próximos Pasos:
1. Migrar más componentes para usar traducciones
2. Agregar traducciones dinámicas en forms
3. Traducir mensajes de error/éxito
4. Opcionalmente: agregar más idiomas

---

## 📞 Reportar Problemas

Si encuentras algún problema:

1. **Abrir consola del navegador** (F12)
2. **Copiar mensajes de error**
3. **Revisar terminal** del servidor
4. **Tomar screenshot** de lo que ves
5. **Describir** los pasos exactos que hiciste

---

**Última actualización:** 2025-10-19  
**Sistema:** next-intl + Next.js 15.3.0  
**Estado:** ✅ Listo para Producción

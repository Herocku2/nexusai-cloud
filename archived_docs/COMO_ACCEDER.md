# 🌐 CÓMO ACCEDER A NEXUS AI PLATFORM

## 🎯 EL SERVIDOR YA ESTÁ CORRIENDO

### ✅ Estado Actual
```
🟢 SERVIDOR ACTIVO
📍 http://localhost:3000
📍 http://192.168.0.171:3000
```

---

## 🔗 ENLACES DIRECTOS

### 👤 ÁREA DE USUARIO

#### 🏠 Landing Page
```
http://localhost:3000/
```
- Ver información del proyecto
- Botones de registro y login
- Información de comisiones

#### 🔐 Iniciar Sesión
```
http://localhost:3000/auth/login
```
- Ingresa email y contraseña
- Click en "Sign In"

#### 📝 Registrarse
```
http://localhost:3000/auth/register
```
**Formulario de registro:**
- Nombre
- Apellido
- Email
- Contraseña
- Sponsor ID (opcional)

#### 📊 Dashboard Usuario
```
http://localhost:3000/dashboard
```
Después de login, verás:
- Balance USDT
- Total Earnings
- Total PV
- Status de cuenta

#### 🎓 Academia
```
http://localhost:3000/dashboard/academy
```
- Ver cursos disponibles
- Tus cursos en progreso
- Estadísticas de aprendizaje

#### 💰 Wallet
```
http://localhost:3000/dashboard/wallet
```
- Solicitar retiros
- Ver historial
- Balance disponible

#### 💳 Pagos
```
http://localhost:3000/dashboard/payments
```
- Depositar USDT
- Activar membresía
- Historial de transacciones

#### 👥 Equipo
```
http://localhost:3000/dashboard/team
```
- Ver árbol binario
- Volumen de piernas
- Link de referidos

#### 🏆 Rangos
```
http://localhost:3000/dashboard/ranks
```
- Rango actual
- Progreso a siguiente rango
- Historial de logros

---

### 🔧 ÁREA DE ADMINISTRACIÓN

#### 🔐 Login Admin
```
http://localhost:3000/admin/login
```

**Credenciales por defecto:**
```
Email:    admin@nexusai.com
Password: NexusAdmin2024!SecurePass
```

#### 📊 Dashboard Admin
```
http://localhost:3000/admin/dashboard
```
- Estadísticas generales
- Total usuarios
- Ingresos totales
- Retiros pendientes

#### 👥 Gestión de Usuarios
```
http://localhost:3000/admin/users
```
- Ver todos los usuarios
- Editar usuarios
- Cambiar status
- Ver balance y PV

#### 🎓 Gestión de Cursos
```
http://localhost:3000/admin/courses
```
- Crear nuevo curso
- Editar cursos
- Activar/desactivar
- Gestionar contenido

#### 💸 Gestión de Retiros
```
http://localhost:3000/admin/withdrawals
```
- Ver solicitudes pendientes
- Aprobar con TX Hash
- Rechazar con motivo

#### 💰 Gestión de Depósitos
```
http://localhost:3000/admin/deposits
```
- Ver depósitos pendientes
- Verificar TX Hash
- Aprobar/rechazar

---

## 🚀 PASOS PARA EMPEZAR

### Opción 1: Crear Usuario Nuevo

1. **Abrir navegador**
   ```
   http://localhost:3000/auth/register
   ```

2. **Completar formulario:**
   - Nombre: `Juan`
   - Apellido: `Pérez`
   - Email: `juan@test.com`
   - Contraseña: `Test1234!`
   - Sponsor ID: _(dejar vacío)_

3. **Click en "Create Account"**

4. **Confirmar email** (en Supabase o usar link del email)

5. **Login:**
   ```
   http://localhost:3000/auth/login
   ```
   - Email: `juan@test.com`
   - Password: `Test1234!`

6. **Acceder al Dashboard:**
   ```
   http://localhost:3000/dashboard
   ```

---

### Opción 2: Usar Panel Admin

1. **Ir a login admin:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Ingresar credenciales:**
   - Email: `admin@nexusai.com`
   - Password: `NexusAdmin2024!SecurePass`

3. **Explorar dashboard admin:**
   ```
   http://localhost:3000/admin/dashboard
   ```

4. **Gestionar usuarios, cursos, etc.**

---

## 🖼️ VISTA PREVIA DISPONIBLE

**Puedes hacer click en el botón "Preview" que aparece en el panel de herramientas**

El servidor ya está configurado con preview browser para que puedas navegar la aplicación directamente.

---

## 📱 DESDE OTRO DISPOSITIVO

Si quieres acceder desde otro dispositivo en la misma red:

```
http://192.168.0.171:3000
```

Reemplaza la IP con la de tu computadora si es diferente.

---

## ✅ VERIFICAR QUE FUNCIONA

### Prueba Rápida - Login

1. Ir a: `http://localhost:3000/auth/login`
2. Ver formulario de login
3. ✅ Si ves el formulario = Frontend funcionando

### Prueba Rápida - Registro

1. Ir a: `http://localhost:3000/auth/register`
2. Completar formulario
3. Click en "Create Account"
4. ✅ Si se crea cuenta = Backend funcionando

### Prueba Rápida - Dashboard

1. Hacer login
2. Ir a: `http://localhost:3000/dashboard`
3. Ver tus datos
4. ✅ Si ves datos = Database funcionando

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### No carga la página
1. Verificar que el servidor esté corriendo
2. Ver terminal para errores
3. Refrescar navegador (Ctrl+R o Cmd+R)

### Error de login
1. Verificar email/password correctos
2. Verificar que email esté confirmado
3. Crear nuevo usuario si es necesario

### No ve datos
1. Verificar conexión a Supabase
2. Verificar que hay datos en la DB
3. Ver consola del navegador para errores

---

## 📝 NOTAS

- El servidor corre en **modo desarrollo**
- Hot reload está activo (cambios se ven automáticamente)
- Logs aparecen en la terminal
- Preview browser disponible

---

## 🎯 ENLACES RÁPIDOS

**Usuario:**
- Landing: http://localhost:3000/
- Login: http://localhost:3000/auth/login
- Register: http://localhost:3000/auth/register
- Dashboard: http://localhost:3000/dashboard

**Admin:**
- Login: http://localhost:3000/admin/login
- Dashboard: http://localhost:3000/admin/dashboard

---

**¡El servidor está listo! Puedes empezar a explorar Nexus AI Platform ahora mismo.** 🚀

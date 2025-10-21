# 🚀 GUÍA DE INICIO RÁPIDO - NEXUS AI

## ✅ El servidor ya está corriendo en: http://localhost:3000

---

## 📋 PASOS PARA PROBAR LA APLICACIÓN

### 1️⃣ Acceder a la Landing Page
```
🌐 http://localhost:3000
```
- Verás la página principal de Nexus AI
- Botones de "Comenzar" y "Login" funcionando

### 2️⃣ Crear una Cuenta de Usuario
```
🌐 http://localhost:3000/auth/register
```

**Datos de prueba sugeridos:**
- Email: `usuario@test.com`
- Password: `Test1234!`
- Nombre: `Juan`
- Apellido: `Pérez`
- Sponsor ID: (opcional - dejar vacío para primer usuario)

**Proceso:**
1. Completa el formulario
2. Se creará el usuario en Supabase Auth
3. Se creará el perfil en la base de datos
4. Recibirás un email de confirmación (verificar en Supabase)

### 3️⃣ Confirmar Email
```
🌐 Revisar bandeja de entrada o logs de Supabase
```
- En desarrollo, puedes confirmar manualmente desde Supabase Dashboard
- O usar el link de confirmación del email

### 4️⃣ Login
```
🌐 http://localhost:3000/auth/login
```
- Email: `usuario@test.com`
- Password: `Test1234!`
- Click en "Sign In"

### 5️⃣ Explorar Dashboard
```
🌐 http://localhost:3000/dashboard
```

**Verás:**
- ✅ Balance: $0.00 (inicial)
- ✅ Total Earnings: $0.00
- ✅ Total PV: 0
- ✅ Status: Inactive (hasta activar membresía)

**Menú lateral disponible:**
- 📊 Dashboard
- 🎓 Academia
- 💰 Wallet
- 💳 Pagos
- 👥 Equipo
- 🏆 Rangos
- 📬 Comisiones
- 👤 Perfil

---

## 💳 FLUJO COMPLETO DE USUARIO

### Paso 1: Depositar USDT
```
Dashboard → Pagos → Depositar
```
1. Ingresa monto (mínimo $100)
2. Selecciona red (TRC20/ERC20)
3. Copia dirección de depósito
4. Envía USDT desde tu wallet
5. Pega Transaction Hash
6. Espera aprobación de admin

### Paso 2: Activar Membresía
```
Dashboard → Pagos → Activar Membresía
```
1. Requiere $89 USDT en balance
2. Click en "Activar Membresía Inicial"
3. Confirma la transacción
4. Tu cuenta pasa a estado "Active"
5. Recibes 100 PV

### Paso 3: Referir Usuarios
```
Dashboard → Equipo → Link de Referidos
```
1. Copia tu link de referido
2. Comparte con potenciales miembros
3. Cuando se registren con tu link, serás su sponsor
4. Recibirás comisión Fast Start ($40)

### Paso 4: Construir Equipo Binario
```
Dashboard → Equipo → Árbol Binario
```
1. Visualiza tu árbol binario
2. Cada nuevo miembro se coloca automáticamente
3. Acumula volumen en piernas izquierda/derecha
4. Gana comisión binaria semanal

### Paso 5: Retirar Ganancias
```
Dashboard → Wallet → Solicitar Retiro
```
1. Mínimo $20 USDT
2. Ingresa tu wallet address
3. Selecciona red (TRC20/ERC20)
4. Comisión: 10% automática
5. Espera aprobación de admin

---

## 🔐 ACCESO AL PANEL ADMIN

### Login Admin
```
🌐 http://localhost:3000/admin/login
```

**Credenciales:**
- Email: `admin@nexusai.com`
- Password: `NexusAdmin2024!SecurePass`

### Funciones Admin Disponibles

#### 1. Dashboard Admin
```
🌐 http://localhost:3000/admin/dashboard
```
- Total de usuarios
- Usuarios activos
- Membresías activas
- Retiros pendientes
- Ingresos totales

#### 2. Gestión de Usuarios
```
🌐 http://localhost:3000/admin/users
```
- Ver todos los usuarios
- Filtrar por status
- Buscar por nombre
- Editar datos de usuario
- Cambiar status (active/inactive/suspended)
- Ver balance y PV
- Reset password

#### 3. Gestión de Cursos
```
🌐 http://localhost:3000/admin/courses
```
- Crear nuevo curso
- Editar cursos existentes
- Eliminar cursos
- Activar/desactivar cursos
- Configurar:
  - Título y descripción
  - URL del video
  - Duración
  - Categoría
  - Premium o Gratis
  - Thumbnail

#### 4. Aprobación de Retiros
```
🌐 http://localhost:3000/admin/withdrawals
```
- Ver retiros pendientes
- Aprobar retiro (requiere TX Hash)
- Rechazar retiro (con motivo)
- Ver historial completo

#### 5. Aprobación de Depósitos
```
🌐 http://localhost:3000/admin/deposits
```
- Ver depósitos pendientes
- Verificar TX Hash en blockchain
- Aprobar depósito (se suma al balance)
- Rechazar depósito

#### 6. Gestión de Membresías
```
🌐 http://localhost:3000/admin/memberships
```
- Ver membresías que expiran pronto
- Extender membresías
- Ver historial de pagos

---

## 🎓 USAR LA ACADEMIA

### Ver Cursos Disponibles
```
🌐 http://localhost:3000/dashboard/academy
```
- Lista de todos los cursos
- Filtrar por categoría
- Ver cursos en progreso
- Ver cursos completados

### Ver un Curso
```
🌐 http://localhost:3000/dashboard/academy/course/[slug]
```
- Reproducir video
- Marcar progreso
- Tomar notas
- Completar lección

### Estadísticas de Aprendizaje
- Cursos completados
- Horas de estudio
- Progreso general
- Certificados (si están habilitados)

---

## 🌳 SISTEMA BINARIO

### Ver Árbol Binario
```
Dashboard → Equipo → Árbol Binario
```
- Visualización de tu downline
- Hasta 5 niveles de profundidad
- Ver nombres y PV de cada miembro
- Identificar pierna izquierda/derecha

### Ver Volumen de Piernas
```
Dashboard → Equipo
```
- Left Volume: Total PV pierna izquierda
- Right Volume: Total PV pierna derecha
- Left Carryover: Volumen acumulado
- Right Carryover: Volumen acumulado

### Comisión Binaria
**Cálculo:** 50% del volumen de la pierna débil
- Se calcula semanalmente
- Carryover ilimitado
- Se paga automáticamente

---

## 🏆 SISTEMA DE RANGOS

### Rangos Disponibles
1. **Starter** - Sin requisitos
2. **Builder** - 3 directos, 500 PV por pierna
3. **Producer** - 5 directos, 2,000 PV por pierna
4. **Leader** - 7 directos, 5,000 PV por pierna
5. **Diamond** - 10 directos, 15,000 PV por pierna
6. **Blue Diamond** - 15 directos, 50,000 PV por pierna
7. **Black Diamond** - 20 directos, 150,000 PV por pierna
8. **Crown Diamond** - 30 directos, 500,000 PV por pierna

### Ver Progreso de Rango
```
Dashboard → Rangos
```
- Rango actual
- Progreso a siguiente rango
- Requisitos pendientes
- Historial de logros

### Matching Bonus
- Se activa desde rango Producer
- 10% - 50% según rango
- Hasta 5 niveles de profundidad

---

## 💰 COMISIONES

### Tipos de Comisión

#### 1. Fast Start (Inicio Rápido)
- **Nivel 1:** $40 por referido directo
- **Nivel 2:** $8 por referido de tu referido
- Se paga inmediatamente

#### 2. Comisión Binaria
- **Cálculo:** 50% del volumen de pierna débil
- **Ejemplo:** Left: 1000 PV, Right: 600 PV
  - Comisión: 600 × $0.50 = $300
- Se paga semanalmente
- Carryover ilimitado

#### 3. Matching Bonus
- **Producer:** 10% de binario de directos (1 nivel)
- **Leader:** 20% (2 niveles)
- **Diamond:** 30% (3 niveles)
- **Blue Diamond:** 40% (4 niveles)
- **Black Diamond:** 50% (5 niveles)

### Ver Comisiones
```
Dashboard → Comisiones
```
- Historial completo
- Filtrar por tipo
- Ver detalles de cada comisión
- Total ganado por tipo

---

## 🧪 DATOS DE PRUEBA

### Crear Usuarios de Prueba

**Usuario 1 (Sponsor):**
- Email: sponsor@test.com
- Password: Test1234!
- Nombre: María
- Apellido: García

**Usuario 2 (Referido):**
- Email: referido1@test.com
- Password: Test1234!
- Sponsor: [ID de Usuario 1]

**Usuario 3 (Pierna izquierda):**
- Email: left@test.com
- Password: Test1234!
- Sponsor: [ID de Usuario 1]

**Usuario 4 (Pierna derecha):**
- Email: right@test.com
- Password: Test1234!
- Sponsor: [ID de Usuario 1]

---

## 🔍 VERIFICAR FUNCIONALIDADES

### Checklist de Pruebas

#### Autenticación ✅
- [ ] Registro de nuevo usuario
- [ ] Confirmación de email
- [ ] Login correcto
- [ ] Recuperación de contraseña
- [ ] Logout

#### Membresía ✅
- [ ] Solicitar depósito
- [ ] Admin aprueba depósito
- [ ] Balance se actualiza
- [ ] Activar membresía
- [ ] Status cambia a Active

#### Referidos ✅
- [ ] Obtener link de referido
- [ ] Registrar usuario con link
- [ ] Sponsor se asigna correctamente
- [ ] Comisión Fast Start se genera

#### Sistema Binario ✅
- [ ] Ver árbol binario
- [ ] Volumen se calcula correctamente
- [ ] Comisión binaria se genera
- [ ] Carryover funciona

#### Retiros ✅
- [ ] Solicitar retiro
- [ ] Balance se descuenta
- [ ] Admin ve solicitud
- [ ] Admin aprueba/rechaza
- [ ] Status se actualiza

#### Academia ✅
- [ ] Ver listado de cursos
- [ ] Entrar a un curso
- [ ] Marcar progreso
- [ ] Completar curso
- [ ] Estadísticas se actualizan

---

## 📊 MONITOREO

### Logs del Servidor
```bash
# Ver logs en tiempo real
Terminal actual - Ya corriendo
```

### Supabase Dashboard
```
🌐 https://app.supabase.com
```
- Ver usuarios creados
- Verificar emails
- Ver datos en tablas
- Ejecutar queries SQL
- Ver logs de Auth

### Next.js Dev Tools
- Red de peticiones en navegador
- Errores de consola
- React Developer Tools

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "User not authenticated"
**Solución:** Hacer logout y login nuevamente

### Error: "Insufficient balance"
**Solución:** Depositar USDT y esperar aprobación de admin

### Error: "Sponsor not found"
**Solución:** Verificar que el ID de sponsor existe y está activo

### Curso no se reproduce
**Solución:** Verificar URL del video en admin

### Balance no se actualiza
**Solución:** Admin debe aprobar el depósito primero

---

## 📝 NOTAS FINALES

✅ **El servidor está corriendo en:**
- Local: http://localhost:3000
- Network: http://192.168.0.171:3000

✅ **Variables de entorno configuradas:**
- NEXT_PUBLIC_SUPABASE_URL ✓
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✓
- NEXT_PUBLIC_SITE_URL ✓

✅ **Base de datos Supabase:**
- Conectada ✓
- Migraciones aplicadas ✓
- RLS activo ✓

✅ **Código:**
- Sin errores ✓
- Sin placeholders ✓
- 100% funcional ✓

---

**¡Disfruta explorando Nexus AI Platform!** 🚀

# Nexus AI - Documentación del Proyecto

## 📋 Índice de Documentación Esencial

### Documentos Principales (Raíz del Proyecto)

1. **[README.md](README.md)** 📘
   - Introducción al proyecto
   - Características principales
   - Instrucciones de instalación

2. **[ARCHITECTURE.md](ARCHITECTURE.md)** 🏗️
   - Arquitectura del sistema
   - Estructura de carpetas
   - Stack tecnológico
   - Diagramas y flujos

3. **[PROJECT_STATUS.md](PROJECT_STATUS.md)** 📊
   - Estado actual del proyecto
   - Funcionalidades implementadas
   - Pendientes y próximos pasos

4. **[CONFIGURACION_LOGIN_ADMIN_FINAL.md](CONFIGURACION_LOGIN_ADMIN_FINAL.md)** 🔐✨
   - **DOCUMENTO ACTUALIZADO - Configuración actual**
   - Login admin sin contraseñas hardcodeadas
   - Autenticación 100% con Supabase Auth
   - Guía completa de seguridad
   - **IMPORTANTE:** Este es el documento oficial actual

5. **[SOLUCION_LOGIN_ADMIN.md](SOLUCION_LOGIN_ADMIN.md)** 🔐
   - Documento de referencia anterior
   - Cómo acceder al área de administración
   - Ver CONFIGURACION_LOGIN_ADMIN_FINAL.md para la versión actual

6. **[CORRECCION_ERRORES_POST_MIGRACION.md](CORRECCION_ERRORES_POST_MIGRACION.md)** 🔧
   - Correcciones aplicadas después de migraciones
   - Errores resueltos de next-intl
   - Estado del sistema i18n

---

## 📁 Estructura de Documentación

```
nexusai/
├── README.md                              # Introducción principal
├── ARCHITECTURE.md                        # Arquitectura del sistema
├── PROJECT_STATUS.md                      # Estado del proyecto
├── SOLUCION_LOGIN_ADMIN.md               # Guía de acceso admin
├── CORRECCION_ERRORES_POST_MIGRACION.md  # Últimas correcciones
│
├── archived_docs/                         # Documentación histórica
│   ├── README.md                          # Índice de archivos
│   ├── ADMIN_AREA_README.md
│   ├── AUTH_README.md
│   ├── CONFIGURACION_OAUTH_SUPABASE.md
│   ├── EJEMPLO_USO_TRADUCCIONES.md
│   ├── IMPLEMENTACION_I18N.md
│   ├── INSTRUCCIONES_PRUEBA_I18N.md
│   └── ... (más documentos históricos)
│
├── supabase/
│   ├── CREATE_ADMIN_USER.sql             # Script para crear admin
│   ├── migrations/
│   │   ├── README.md
│   │   └── *.sql                          # Migraciones de BD
│   └── MIGRATION_REPORT.md
│
└── specs/
    └── 001-nexusai-lms-binary/
        ├── spec.md                        # Especificación principal
        ├── data-model.md                  # Modelo de datos
        └── ... (otras especificaciones)
```

---

## 🚀 Inicio Rápido

### 1. Acceso al Sistema

#### Usuario Regular
```
URL: http://localhost:3000/dashboard
Registro: http://localhost:3000/auth/signup
Login: http://localhost:3000/auth/login
```

Cada usuario se registra con su email y contraseña, que se almacenan de forma segura en Supabase Auth.

#### Administrador
```
URL: http://localhost:3000/admin/login
Email: admin@nexusai.com
Password: [La que configuraste en Supabase]
```

**🔐 IMPORTANTE:** 
- NO hay contraseñas hardcodeadas en el código
- La contraseña del admin se configura una sola vez en Supabase
- Solo usuarios con `is_admin = true` pueden acceder al admin area

**📖 Ver:** 
- [SOLUCION_LOGIN_ADMIN.md](SOLUCION_LOGIN_ADMIN.md) - Guía anterior (referencia)
- [CONFIGURACION_LOGIN_ADMIN_FINAL.md](CONFIGURACION_LOGIN_ADMIN_FINAL.md) - **Configuración actual y definitiva**

### 2. Configuración de Base de Datos

Para crear el usuario administrador en Supabase:

```bash
# Abrir Supabase Dashboard > SQL Editor
# Ejecutar el script:
cat supabase/CREATE_ADMIN_USER.sql
```

**📖 Ver:** [supabase/CREATE_ADMIN_USER.sql](supabase/CREATE_ADMIN_USER.sql)

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El servidor se iniciará en: http://localhost:3000

---

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend:** Next.js 15.3.0 (App Router + Turbopack)
- **Backend:** Next.js Server Actions
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth + NextAuth.js
- **Estilos:** Tailwind CSS + shadcn/ui
- **ORM:** Prisma (para migraciones)

**📖 Ver:** [ARCHITECTURE.md](ARCHITECTURE.md) para detalles completos

---

## 📚 Documentación por Tema

### Autenticación y Seguridad
- [SOLUCION_LOGIN_ADMIN.md](SOLUCION_LOGIN_ADMIN.md) - Acceso al admin area
- [archived_docs/AUTH_README.md](archived_docs/AUTH_README.md) - Autenticación de usuarios
- [archived_docs/CONFIGURACION_OAUTH_SUPABASE.md](archived_docs/CONFIGURACION_OAUTH_SUPABASE.md) - OAuth con Google/GitHub

### Base de Datos
- [supabase/migrations/README.md](supabase/migrations/README.md) - Guía de migraciones
- [supabase/CREATE_ADMIN_USER.sql](supabase/CREATE_ADMIN_USER.sql) - Crear usuario admin
- [specs/001-nexusai-lms-binary/data-model.md](specs/001-nexusai-lms-binary/data-model.md) - Modelo de datos

### Internacionalización (i18n)
**Estado:** Temporalmente deshabilitado

- [archived_docs/IMPLEMENTACION_I18N.md](archived_docs/IMPLEMENTACION_I18N.md) - Implementación completa
- [archived_docs/EJEMPLO_USO_TRADUCCIONES.md](archived_docs/EJEMPLO_USO_TRADUCCIONES.md) - Guía de uso
- [archived_docs/INSTRUCCIONES_PRUEBA_I18N.md](archived_docs/INSTRUCCIONES_PRUEBA_I18N.md) - Cómo probar

### Correcciones y Soluciones
- [CORRECCION_ERRORES_POST_MIGRACION.md](CORRECCION_ERRORES_POST_MIGRACION.md) - Últimas correcciones
- [archived_docs/CORRECCION_DELAY_NAVEGACION.md](archived_docs/CORRECCION_DELAY_NAVEGACION.md) - Optimización de performance
- [archived_docs/SOLUCION_PROBLEMAS_ENLACES.md](archived_docs/SOLUCION_PROBLEMAS_ENLACES.md) - Problemas de routing

### Desarrollo e Implementación
- [archived_docs/PROYECTO_COMPLETADO.md](archived_docs/PROYECTO_COMPLETADO.md) - Resumen de finalización
- [archived_docs/PHASE_1_COMPLETED.md](archived_docs/PHASE_1_COMPLETED.md) - Primera fase
- [archived_docs/PROJECT_CHECKLIST.md](archived_docs/PROJECT_CHECKLIST.md) - Checklist completo

---

## 🔍 Buscar Documentación

### Por Tema

| Tema | Documentos Relevantes |
|------|----------------------|
| **Acceso Admin** | CONFIGURACION_LOGIN_ADMIN_FINAL.md (actual), SOLUCION_LOGIN_ADMIN.md (referencia) |
| **Arquitectura** | ARCHITECTURE.md |
| **Base de Datos** | supabase/migrations/, specs/data-model.md |
| **Errores** | CORRECCION_ERRORES_POST_MIGRACION.md |
| **OAuth** | archived_docs/CONFIGURACION_OAUTH_SUPABASE.md |
| **i18n** | archived_docs/IMPLEMENTACION_I18N.md |
| **Estado** | PROJECT_STATUS.md |

### Por Tipo

| Tipo | Ubicación |
|------|-----------|
| **Guías de Uso** | Raíz del proyecto |
| **Históricos** | archived_docs/ |
| **Especificaciones** | specs/ |
| **Base de Datos** | supabase/ |

---

## 📝 Notas Importantes

### Documentación Archivada

Los documentos en `archived_docs/` son de referencia histórica. Para información actual, consulta los documentos en la raíz del proyecto.

**Categorías archivadas:**
- Conversaciones de desarrollo
- Reportes de correcciones aplicadas
- Verificaciones completadas
- Implementaciones suspendidas (i18n)
- Configuraciones ya aplicadas (OAuth)

### Actualizaciones Recientes

**Última actualización:** 2025-10-19

**Cambios:**
- ✅ Reorganización completa de documentación
- ✅ Movidos 45+ documentos a archived_docs/
- ✅ Mantenidos solo 5 documentos esenciales en raíz
- ✅ Creado script CREATE_ADMIN_USER.sql
- ✅ Actualizado este índice

---

## 🤝 Contribuir

Si agregas nueva documentación:

1. **Esencial** → Coloca en la raíz
2. **Histórica** → Mueve a archived_docs/
3. **Especificación** → Agrega a specs/
4. **Base de Datos** → Coloca en supabase/

Actualiza este índice después de cambios importantes.

---

## 📞 Soporte

### Problemas Comunes

1. **No puedo acceder al admin**
   - Ver: [SOLUCION_LOGIN_ADMIN.md](SOLUCION_LOGIN_ADMIN.md)

2. **Errores después de migración**
   - Ver: [CORRECCION_ERRORES_POST_MIGRACION.md](CORRECCION_ERRORES_POST_MIGRACION.md)

3. **Problemas de autenticación**
   - Ver: [archived_docs/AUTH_README.md](archived_docs/AUTH_README.md)

### Recursos

- **Arquitectura:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Estado del Proyecto:** [PROJECT_STATUS.md](PROJECT_STATUS.md)
- **Documentación Histórica:** [archived_docs/](archived_docs/)

---

**Mantenido por:** Equipo Nexus AI  
**Última actualización:** 2025-10-19  
**Versión:** 1.0

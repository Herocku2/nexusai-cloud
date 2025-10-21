# 📋 PLAN DE MIGRACIÓN Y REORGANIZACIÓN DEL PROYECTO

## 🎯 Objetivo
Consolidar el proyecto en una estructura limpia, eliminando duplicaciones y organizando correctamente todos los componentes.

---

## 📦 FASE 1: PREPARACIÓN Y BACKUP

### Task 1.1: Crear Backup Completo
```bash
# Crear backup de seguridad
cd "/Volumes/DATOS/Documentos2/TRAE/NEXUS AI SERGIO"
tar -czf binarionexus_backup_$(date +%Y%m%d_%H%M%S).tar.gz binarionexus/
```

**Estimado**: 2 minutos
**Estado**: ⬜ Pendiente

---

### Task 1.2: Verificar Integridad del Proyecto WowDash
```bash
cd "binarionexus/nexusai/front end/wowdash"

# Verificar que existan los archivos críticos
ls -la app/
ls -la components/
ls -la utils/supabase/
ls -la .env.local

# Verificar que compile
npm run build
```

**Verificar**:
- ✅ `app/` con todas las rutas (dashboard, auth, admin, api)
- ✅ `components/` completo
- ✅ `utils/supabase/` con client.ts y server.ts
- ✅ `.env.local` con todas las variables
- ✅ Compilación exitosa

**Estimado**: 5 minutos  
**Estado**: ⬜ Pendiente

---

## 📂 FASE 2: REORGANIZACIÓN DE ESTRUCTURA

### Task 2.1: Crear Nueva Estructura de Directorios
```bash
cd "binarionexus"

# Crear carpeta temporal para organización
mkdir -p temp_migration/nexusai
mkdir -p temp_migration/docs
mkdir -p temp_migration/supabase
```

**Estimado**: 1 minuto  
**Estado**: ⬜ Pendiente

---

### Task 2.2: Mover Proyecto WowDash a Raíz
```bash
cd "binarionexus"

# Copiar TODO el contenido de wowdash a temp
cp -R "nexusai/front end/wowdash/"* temp_migration/nexusai/
cp "nexusai/front end/wowdash/.env.local" temp_migration/nexusai/
cp "nexusai/front end/wowdash/.gitignore" temp_migration/nexusai/

# Verificar que se copió todo
ls -la temp_migration/nexusai/
```

**Verificar**:
- ✅ Todos los archivos copiados
- ✅ `.env.local` presente
- ✅ `.gitignore` presente
- ✅ node_modules/ NO copiado (se reinstalará)

**Estimado**: 3 minutos  
**Estado**: ⬜ Pendiente

---

### Task 2.3: Mover Migraciones de Supabase
```bash
cd "binarionexus"

# Copiar migraciones
cp -R nexusai/supabase/* temp_migration/supabase/

# Crear estructura de Supabase en nuevo proyecto
mkdir -p temp_migration/nexusai/supabase
mv temp_migration/supabase/* temp_migration/nexusai/supabase/
rmdir temp_migration/supabase
```

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 2.4: Consolidar Documentación
```bash
cd "binarionexus"

# Mover docs de raíz binarionexus
mv COMO_ACCEDER.md temp_migration/docs/
mv OAUTH_IMPLEMENTADO.md temp_migration/docs/
mv RESUMEN_FINAL_PROYECTO.md temp_migration/docs/

# Mover docs de raíz nexusai
mv nexusai/PHASE_1_COMPLETED.md temp_migration/docs/
mv nexusai/PROJECT_STATUS.md temp_migration/docs/
mv nexusai/RESUMEN_EJECUTIVO_FINAL.md temp_migration/docs/
mv nexusai/README.md temp_migration/docs/NEXUSAI_README.md
mv nexusai/PROJECT_DETAILS.txt temp_migration/docs/
mv "nexusai/documento nexus. IA.txt" temp_migration/docs/

# Mantener archivo principal
echo "# Nexus AI - MLM Binary + Academia LMS

Ver documentación completa en \`docs/\`

## Inicio Rápido
\`\`\`bash
cd nexusai
npm install
npm run dev
\`\`\`

Acceso: http://localhost:3000
" > temp_migration/README.md
```

**Estimado**: 3 minutos  
**Estado**: ⬜ Pendiente

---

## 🗑️ FASE 3: LIMPIEZA DE ARCHIVOS ANTIGUOS

### Task 3.1: Eliminar Proyecto Duplicado de Raíz
```bash
cd "binarionexus"

# Eliminar estructura antigua de nexusai raíz
rm -rf nexusai/src/
rm -rf nexusai/.next/
rm -rf nexusai/node_modules/
rm nexusai/package.json
rm nexusai/package-lock.json
rm nexusai/next.config.ts
rm nexusai/postcss.config.mjs
rm nexusai/tsconfig.json
rm nexusai/next-env.d.ts
```

**⚠️ ADVERTENCIA**: Verificar Task 2.2 completado antes de ejecutar

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 3.2: Eliminar Carpeta "front end"
```bash
cd "binarionexus"

# Eliminar carpeta front end y todo su contenido
rm -rf "nexusai/front end/"
```

**⚠️ ADVERTENCIA**: Verificar Task 2.2 completado antes de ejecutar

**Estimado**: 1 minuto  
**Estado**: ⬜ Pendiente

---

### Task 3.3: Limpiar Archivos Temporales
```bash
cd "binarionexus"

# Eliminar .DS_Store
find . -name ".DS_Store" -delete

# Eliminar .git duplicado si existe
rm -rf nexusai/.git
```

**Estimado**: 1 minuto  
**Estado**: ⬜ Pendiente

---

## 🔄 FASE 4: APLICAR NUEVA ESTRUCTURA

### Task 4.1: Mover Contenido Reorganizado
```bash
cd "binarionexus"

# Mover proyecto consolidado
mv temp_migration/nexusai/* nexusai/
mv temp_migration/docs .
mv temp_migration/README.md .

# Limpiar temporal
rm -rf temp_migration/
```

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 4.2: Reinstalar Dependencias
```bash
cd "binarionexus/nexusai"

# Limpiar e instalar
rm -rf node_modules/
rm package-lock.json
npm install
```

**Estimado**: 2-5 minutos (depende de conexión)  
**Estado**: ⬜ Pendiente

---

### Task 4.3: Actualizar .gitignore
```bash
cd "binarionexus/nexusai"

cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# Supabase
supabase/.branches
supabase/.temp
EOF
```

**Estimado**: 1 minuto  
**Estado**: ⬜ Pendiente

---

## 🔧 FASE 5: VERIFICACIÓN Y AJUSTES

### Task 5.1: Verificar Rutas de Importación
```bash
cd "binarionexus/nexusai"

# Buscar imports que puedan tener rutas incorrectas
grep -r "from.*front end" app/ components/ lib/ utils/ || echo "OK"
grep -r "from.*wowdash" app/ components/ lib/ utils/ || echo "OK"
```

**Acción**: Si hay coincidencias, corregir manualmente

**Estimado**: 5-10 minutos  
**Estado**: ⬜ Pendiente

---

### Task 5.2: Actualizar tsconfig.json
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 5.3: Verificar Variables de Entorno
```bash
cd "binarionexus/nexusai"

# Verificar que existan todas las variables necesarias
cat .env.local
```

**Verificar presencia de**:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `NEXT_PUBLIC_SITE_URL`
- ✅ Otras variables necesarias

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 5.4: Probar Compilación
```bash
cd "binarionexus/nexusai"

# Limpiar y construir
rm -rf .next/
npm run build
```

**Esperado**: Compilación exitosa sin errores

**Estimado**: 3-5 minutos  
**Estado**: ⬜ Pendiente

---

## 🗄️ FASE 6: SUPABASE - CREAR FUNCIONES RPC

### Task 6.1: Crear Función get_binary_downline
```sql
-- File: nexusai/supabase/migrations/[timestamp]_create_binary_tree_functions.sql

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
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE downline AS (
    -- Base case: direct children
    SELECT 
      bp.user_id,
      up.first_name,
      up.last_name,
      au.email,
      bp.position::TEXT,
      1 as depth,
      bp.parent_id,
      up.status::TEXT,
      up.total_pv,
      up.created_at
    FROM binary_positions bp
    INNER JOIN user_profiles up ON bp.user_id = up.id
    INNER JOIN auth.users au ON up.id = au.id
    WHERE bp.parent_id = root_user_id
    
    UNION ALL
    
    -- Recursive case: children of children
    SELECT 
      bp.user_id,
      up.first_name,
      up.last_name,
      au.email,
      bp.position::TEXT,
      d.depth + 1,
      bp.parent_id,
      up.status::TEXT,
      up.total_pv,
      up.created_at
    FROM binary_positions bp
    INNER JOIN downline d ON bp.parent_id = d.user_id
    INNER JOIN user_profiles up ON bp.user_id = up.id
    INNER JOIN auth.users au ON up.id = au.id
    WHERE d.depth < max_depth OR max_depth IS NULL
  )
  SELECT * FROM downline
  ORDER BY depth, position, created_at;
END;
$$;
```

**Estimado**: 5 minutos  
**Estado**: ⬜ Pendiente

---

### Task 6.2: Crear Función get_direct_referrals_count
```sql
-- Agregar al mismo archivo de migración

CREATE OR REPLACE FUNCTION get_direct_referrals_count(
  target_user_id UUID
)
RETURNS TABLE (
  left_count BIGINT,
  right_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE position = 'left') as left_count,
    COUNT(*) FILTER (WHERE position = 'right') as right_count
  FROM binary_positions
  WHERE parent_id = target_user_id;
END;
$$;
```

**Estimado**: 3 minutos  
**Estado**: ⬜ Pendiente

---

### Task 6.3: Aplicar Migraciones
```bash
cd "binarionexus/nexusai"

# Si tienes Supabase CLI instalado
supabase db push

# O aplicar manualmente en el dashboard de Supabase
# 1. Ir a SQL Editor
# 2. Copiar y pegar el contenido del archivo de migración
# 3. Ejecutar
```

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

## 🧪 FASE 7: TESTING Y DEBUGGING

### Task 7.1: Iniciar Servidor de Desarrollo
```bash
cd "binarionexus/nexusai"
npm run dev
```

**Verificar**: 
- ✅ Servidor inicia en puerto 3000
- ✅ No hay errores de compilación
- ✅ No hay errores en consola

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 7.2: Probar Autenticación
1. Ir a http://localhost:3000/auth/login
2. Ingresar con `usuario@nexusai.com` / `Usuario2024!`
3. Verificar redirección a `/dashboard`
4. Verificar que carga datos del usuario

**Esperado**: Login exitoso y datos cargados

**Estimado**: 3 minutos  
**Estado**: ⬜ Pendiente

---

### Task 7.3: Probar Navegación del Dashboard
Probar cada ruta del menú lateral:

1. ✅ `/dashboard` - Dashboard principal
2. ✅ `/dashboard/team` - Mi Equipo (verificar árbol binario)
3. ✅ `/dashboard/commissions` - Comisiones
4. ✅ `/dashboard/wallet` - Billetera
5. ✅ `/dashboard/payments` - Pagos & Depósitos
6. ✅ `/dashboard/ranks` - Mi Rango
7. ✅ `/dashboard/academy` - Academia
8. ✅ `/dashboard/profile` - Mi Perfil
9. ✅ `/messages` - Mensajes
10. ✅ `/notifications` - Notificaciones
11. ✅ `/dashboard/support` - Ayuda & Soporte

**Esperado**: Todas las rutas cargan sin errores

**Estimado**: 10 minutos  
**Estado**: ⬜ Pendiente

---

### Task 7.4: Probar Admin Area
1. Ir a http://localhost:3000/admin/login
2. Ingresar con `admin@nexusai.com` / `NexusAdmin2024!SecurePass`
3. Verificar acceso al panel de administración
4. Probar funcionalidades:
   - Ver usuarios
   - Aprobar depósitos
   - Gestionar cursos

**Esperado**: Admin area funcional

**Estimado**: 5 minutos  
**Estado**: ⬜ Pendiente

---

### Task 7.5: Debugging - Revisar Console Logs
```bash
# En el terminal donde corre npm run dev
# Verificar que no haya:
- ❌ Errores de imports
- ❌ Errores de middleware
- ❌ Errores de API
- ❌ Errores de Supabase
```

**Acción**: Corregir cualquier error encontrado

**Estimado**: Variable (5-30 minutos)  
**Estado**: ⬜ Pendiente

---

### Task 7.6: Debugging - Revisar Browser Console
Abrir DevTools (F12) y verificar:
- ✅ No hay errores en consola
- ✅ No hay warnings críticos
- ✅ Requests a API responden correctamente
- ✅ No hay errores de CORS

**Estimado**: 5 minutos  
**Estado**: ⬜ Pendiente

---

## 📝 FASE 8: DOCUMENTACIÓN FINAL

### Task 8.1: Actualizar README.md Principal
```markdown
# Nexus AI - MLM Binary + Academia LMS

Sistema completo de Marketing Multinivel con compensación binaria y plataforma LMS educativa.

## 🚀 Tecnologías

- **Frontend**: Next.js 15.3.0 + React 18
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **UI**: Tailwind CSS + Shadcn/UI
- **Autenticación**: Supabase Auth + NextAuth
- **Gráficos**: ApexCharts + D3.js

## 📦 Instalación

\`\`\`bash
cd nexusai
npm install
\`\`\`

## 🔧 Configuración

1. Copiar \`.env.example\` a \`.env.local\`
2. Configurar variables de Supabase
3. Ejecutar migraciones (ver docs/DATABASE_SETUP.md)

## 🏃 Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Acceso: http://localhost:3000

## 🌐 Accesos

### Usuario Regular
- Email: usuario@nexusai.com
- Password: Usuario2024!

### Administrador
- Email: admin@nexusai.com
- Password: NexusAdmin2024!SecurePass

## 📚 Documentación

Ver carpeta \`docs/\` para más información.

## 🏗️ Estructura del Proyecto

\`\`\`
nexusai/
├── app/              # Next.js App Router
├── components/       # Componentes React
├── lib/             # Utilidades y tipos
├── utils/           # Helpers (Supabase, etc.)
├── hooks/           # Custom hooks
├── contexts/        # React contexts
├── public/          # Assets estáticos
└── supabase/        # Migraciones y Edge Functions
\`\`\`
```

**Estimado**: 10 minutos  
**Estado**: ⬜ Pendiente

---

### Task 8.2: Crear docs/STRUCTURE.md
Documentar estructura detallada del proyecto

**Estimado**: 15 minutos  
**Estado**: ⬜ Pendiente

---

### Task 8.3: Crear docs/DEPLOYMENT.md
Instrucciones para deploy en Vercel/otras plataformas

**Estimado**: 10 minutos  
**Estado**: ⬜ Pendiente

---

## ✅ FASE 9: COMMIT Y CLEANUP FINAL

### Task 9.1: Actualizar .gitignore Raíz
```bash
cd "binarionexus"

cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment
.env*.local

# Misc
.DS_Store
*.log

# IDE
.vscode/
.idea/

# Backups
*.tar.gz
*.zip
backup_*/
EOF
```

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

### Task 9.2: Git Commit
```bash
cd "binarionexus"

git add -A
git commit -m "🎨 Reorganización completa del proyecto

- Consolidado en estructura única bajo nexusai/
- Eliminado proyecto duplicado en raíz
- Movidas migraciones a nexusai/supabase/
- Organizada documentación en docs/
- Limpiados archivos temporales
- Creadas funciones RPC de PostgreSQL
- Verificado funcionamiento completo
"
```

**Estimado**: 2 minutos  
**Estado**: ⬜ Pendiente

---

## 📊 RESUMEN DE TIEMPOS ESTIMADOS

| Fase | Descripción | Tiempo Estimado |
|------|-------------|-----------------|
| 1 | Preparación y Backup | 7 min |
| 2 | Reorganización | 9 min |
| 3 | Limpieza | 4 min |
| 4 | Aplicar Estructura | 4-7 min |
| 5 | Verificación | 14-22 min |
| 6 | Funciones RPC | 10 min |
| 7 | Testing y Debugging | 30-60 min |
| 8 | Documentación | 35 min |
| 9 | Commit Final | 4 min |

**TOTAL**: 2-3 horas

---

## ⚠️ PUNTOS CRÍTICOS

1. ✅ **BACKUP OBLIGATORIO** antes de empezar
2. ✅ Verificar Task 2.2 antes de eliminar archivos
3. ✅ No ejecutar migraciones en producción sin backup
4. ✅ Mantener `.env.local` seguro
5. ✅ Probar compilación antes de commit final

---

## 🎯 RESULTADO ESPERADO

### Antes (CAÓTICO):
```
binarionexus/
└── nexusai/
    ├── [proyecto vacío]
    └── front end/wowdash/ [proyecto real]
```

### Después (LIMPIO):
```
binarionexus/
├── docs/
└── nexusai/ [proyecto único consolidado]
```

---

**Creado**: 19 de Octubre, 2025  
**Última actualización**: 19 de Octubre, 2025  
**Estado**: ⬜ Pendiente de ejecución


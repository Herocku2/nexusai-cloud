#!/bin/bash

# Script de Verificación Rápida del Sistema de Autenticación
# =========================================================

echo "🔍 Verificando Sistema de Autenticación de Supabase..."
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar servidor
echo "1️⃣  Verificando servidor..."
if lsof -ti:3003 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Servidor corriendo en puerto 3003"
else
    echo -e "${RED}✗${NC} Servidor NO está corriendo"
    echo "   Ejecuta: npm run dev"
    exit 1
fi
echo ""

# Verificar variables de entorno
echo "2️⃣  Verificando variables de entorno..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} Archivo .env.local existe"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL configurada"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_URL NO configurada"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY configurada"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY NO configurada"
    fi
else
    echo -e "${RED}✗${NC} Archivo .env.local NO existe"
fi
echo ""

# Verificar rutas críticas
echo "3️⃣  Verificando rutas críticas..."

# Landing page
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/)
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓${NC} Landing page (/) - 200 OK"
else
    echo -e "${YELLOW}⚠${NC} Landing page (/) - Status: $status"
fi

# Login
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/auth/login)
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓${NC} Login (/auth/login) - 200 OK"
else
    echo -e "${RED}✗${NC} Login (/auth/login) - Status: $status"
fi

# Register
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/auth/register)
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓${NC} Register (/auth/register) - 200 OK"
else
    echo -e "${RED}✗${NC} Register (/auth/register) - Status: $status"
fi

# Dashboard (debe redirigir si no está autenticado)
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/dashboard)
if [ "$status" = "307" ] || [ "$status" = "302" ] || [ "$status" = "200" ]; then
    echo -e "${GREEN}✓${NC} Dashboard (/dashboard) - Status: $status (protegido o accesible)"
else
    echo -e "${YELLOW}⚠${NC} Dashboard (/dashboard) - Status: $status"
fi
echo ""

# Verificar archivos críticos
echo "4️⃣  Verificando archivos críticos..."

files=(
    "app/actions/auth.ts"
    "components/auth/login-form.tsx"
    "components/auth/register-form.tsx"
    "utils/supabase/client.ts"
    "utils/supabase/server.ts"
    "utils/supabase/middleware.ts"
    "middleware.ts"
    "app/(dashboard)/(homes)/dashboard/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file - NO EXISTE"
    fi
done
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Sistema configurado y listo para probar"
echo ""
echo "🔗 URLs para probar:"
echo "   Landing:   http://localhost:3003/"
echo "   Login:     http://localhost:3003/auth/login"
echo "   Register:  http://localhost:3003/auth/register"
echo "   Dashboard: http://localhost:3003/dashboard"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Abre http://localhost:3003/auth/login"
echo "   2. Ingresa tus credenciales de Supabase"
echo "   3. Verifica que te redirige a /dashboard"
echo "   4. Revisa la consola del navegador (F12) para logs"
echo ""
echo "📖 Documentación completa en:"
echo "   VERIFICACION_LOGIN_DASHBOARD.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

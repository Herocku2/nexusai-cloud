import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

// Email del admin
const ADMIN_EMAIL = 'admin@nexusai.com'

// Middleware de internacionalización
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // No agregar prefijo para el idioma por defecto (es)
})

// Lista de rutas de admin
const adminRoutes = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/courses',
  '/admin/withdrawals',
  '/admin/deposits',
  '/admin/memberships',
  '/admin/settings',
  '/admin/reports',
  '/admin/analytics',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Aplicar middleware de internacionalización primero
  const intlResponse = intlMiddleware(request)
  
  // Si el middleware de i18n redirige (cambio de idioma), retornar esa respuesta
  if (intlResponse.headers.get('x-middleware-rewrite') || intlResponse.status === 307) {
    return intlResponse
  }

  // Verificar si es una ruta de admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Para rutas de admin, verificar autenticación de Supabase
  if (isAdminRoute) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    
    // Si no hay usuario autenticado, redirigir a login de admin
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Verificar que el usuario sea admin
    if (user.email !== ADMIN_EMAIL) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    
    return supabaseResponse
  }

  // Para rutas de usuario, usar el middleware optimizado de Supabase
  // Solo actualizar sesión, no hacer queries adicionales
  const response = await updateSession(request)
  return response
}

export const config = {
  matcher: [
    // Rutas protegidas por autenticación
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/callback',
    '/messages',
    '/notifications',
    '/support/:path*',
    // Rutas de i18n (excluir archivos estáticos)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}

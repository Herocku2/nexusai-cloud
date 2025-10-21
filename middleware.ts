import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

// Email del admin
const ADMIN_EMAIL = 'admin@nexusai.com'

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

  // Excluir la ruta de login de admin de las verificaciones
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Verificar si es una ruta de admin (excepto login)
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

    // Verificar flag is_admin en la base de datos (mínima query necesaria)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'Unauthorized: Admin access required')
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
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/callback',
    '/messages',
    '/notifications',
    '/support/:path*',
  ],
}

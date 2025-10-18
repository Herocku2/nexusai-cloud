import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

// Lista de rutas de admin
const adminRoutes = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/courses',
  '/admin/withdrawals',
  '/admin/deposits',
  '/admin/memberships',
  '/admin/settings',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si es una ruta de admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // Para rutas de admin, verificar cookie de admin
  if (isAdminRoute) {
    const adminAuth = request.cookies.get('admin_authenticated')
    
    if (!adminAuth?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    return NextResponse.next()
  }

  // Para rutas de usuario, usar el middleware de Supabase
  return updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}

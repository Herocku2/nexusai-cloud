import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Ruta de callback para OAuth
 * Maneja la redirección después del login con proveedores sociales
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    // Intercambiar el code por una sesión
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error al intercambiar código:', error)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
    }

    if (user) {
      // Verificar si el perfil del usuario existe
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      // Si no existe perfil, crearlo
      if (!profile) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            user_id: user.id,
            first_name: user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name || null,
            last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
            status: 'inactive',
            balance: 0,
            total_earnings: 0,
            total_pv: 0,
          })

        if (profileError) {
          console.error('Error al crear perfil:', profileError)
        }
      }

      // Redirigir al dashboard
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Si no hay código o algo falló, redirigir al login
  return NextResponse.redirect(`${origin}/auth/login`)
}

'use server'

import { createAdminClient } from '@/utils/supabase/admin'

export async function createTestUser() {
  const supabase = createAdminClient()

  // Credenciales de prueba según la memoria + admin
  const testUsers = [
    {
      email: 'admin@nexusai.com',
      password: 'NexusAdmin2024!SecurePass',
      firstName: 'Admin',
      lastName: 'Nexus AI',
      isAdmin: true,
    },
    {
      email: 'demo@nexusai.com',
      password: 'Demo2024!Test',
      firstName: 'Demo',
      lastName: 'User',
      isAdmin: false,
    },
    {
      email: 'usuario@nexusai.com',
      password: 'Usuario2024!',
      firstName: 'Usuario',
      lastName: 'Prueba',
      isAdmin: false,
    }
  ]

  const results = []

  for (const testUser of testUsers) {
    try {
      // Intentar crear el usuario
      const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        email_confirm: true,
        user_metadata: {
          first_name: testUser.firstName,
          last_name: testUser.lastName,
        }
      })

      if (signUpError) {
        console.error(`Error creando ${testUser.email}:`, signUpError)
        results.push({ email: testUser.email, error: signUpError.message })
        continue
      }

      if (!authData.user) {
        results.push({ email: testUser.email, error: 'No user data returned' })
        continue
      }

      // Crear perfil
      const { error: profileError } = await (supabase
        .from('user_profiles') as any)
        .insert({
          id: authData.user.id,
          first_name: testUser.firstName,
          last_name: testUser.lastName,
          status: 'active',
          balance: 0,
          total_earnings: 0,
          total_pv: 0,
        })

      if (profileError) {
        console.error(`Error creando perfil para ${testUser.email}:`, profileError)
        // No retornamos error porque el usuario ya fue creado
      }

      results.push({ 
        email: testUser.email, 
        success: true,
        message: 'Usuario creado exitosamente'
      })
    } catch (error: any) {
      console.error(`Error general con ${testUser.email}:`, error)
      results.push({ email: testUser.email, error: error.message })
    }
  }

  return results
}

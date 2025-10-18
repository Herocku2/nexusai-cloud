'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/lib/types/database'

type UserProfile = Database['public']['Tables']['user_profiles']['Insert']

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const sponsorId = formData.get('sponsorId') as string | null

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (!authData.user) {
    return { error: 'Error creating user' }
  }

  // 2. Crear perfil de usuario
  const profile: UserProfile = {
    id: authData.user.id,
    first_name: firstName,
    last_name: lastName,
    sponsor_id: sponsorId || null,
    status: 'pending',
    balance: 0,
    total_earnings: 0,
    total_pv: 0,
  }

  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert(profile)

  if (profileError) {
    console.error('Error creating profile:', profileError)
    // No retornamos error aquí porque el usuario ya fue creado
  }

  return { 
    success: true,
    message: 'Check your email to confirm your account'
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/create-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { 
    success: true,
    message: 'Check your email for the password reset link'
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function getUser() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Obtener perfil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile,
  }
}

export async function validateSponsor(sponsorId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, status')
    .eq('id', sponsorId)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    return { valid: false, error: 'Invalid or inactive sponsor ID' }
  }

  return { 
    valid: true, 
    sponsor: {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
    }
  }
}

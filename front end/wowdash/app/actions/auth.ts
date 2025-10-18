'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        username: formData.get('username') as string,
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  
  // Redirigir al dashboard después del registro exitoso
  // Si tienes confirmación de email habilitada, podrías querer redirigir a una página de confirmación
  redirect('/dashboard')
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

  return { success: true, message: 'Check your email for the password reset link!' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Función para login social con proveedores OAuth
 */
export async function doSocialLogin(provider: 'google' | 'github' | 'facebook') {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Social login error:', error)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { success: true }
}

/**
 * Login con Google
 */
export async function loginWithGoogle() {
  return doSocialLogin('google')
}

/**
 * Login con GitHub
 */
export async function loginWithGitHub() {
  return doSocialLogin('github')
}

/**
 * Login con cualquier proveedor
 */
export async function loginWithProvider(provider: 'google' | 'github' | 'facebook') {
  return doSocialLogin(provider)
}

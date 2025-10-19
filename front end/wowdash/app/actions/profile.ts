'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/lib/types/database'

type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates: UserProfileUpdate = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string || null,
    country: formData.get('country') as string || null,
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function getBinaryPosition() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: position } = await supabase
    .from('binary_positions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return position
}

export async function getUserRank() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Obtener el rango más reciente del usuario
  const { data: userRanks } = await supabase
    .from('user_ranks')
    .select(`
      *,
      rank:ranks(*)
    `)
    .eq('user_id', user.id)
    .order('achieved_at', { ascending: false })
    .limit(1)

  if (userRanks && userRanks.length > 0) {
    return userRanks[0]
  }

  // Si no tiene ningún rango, devolver el rango por defecto (Afiliado)
  const { data: defaultRank } = await supabase
    .from('ranks')
    .select('*')
    .eq('slug', 'afiliado')
    .single()

  return {
    rank: defaultRank,
    achieved_at: null,
    total_earnings: 0,
    total_pv: 0,
  }
}

export async function getCommissions(limit: number = 10) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return commissions || []
}

export async function getTransactions(limit: number = 10) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return transactions || []
}

export async function getMembership() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return membership
}

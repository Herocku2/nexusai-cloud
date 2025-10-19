'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function getAllCourses() {
  const supabase = await createClient()
  
  const { data: courses } = await supabase
    .from('academy_content')
    .select('*')
    .order('created_at', { ascending: false })

  return courses || []
}

export async function createCourse(formData: FormData) {
  const supabase = await createClient()
  
  const course = {
    title: formData.get('title') as string,
    slug: (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    type: formData.get('type') as string,
    url: formData.get('url') as string,
    thumbnail_url: formData.get('thumbnailUrl') as string || null,
    duration: parseInt(formData.get('duration') as string),
    is_free: formData.get('isFree') === 'true',
    is_active: true,
  }

  const { error } = await supabase
    .from('academy_content')
    .insert(course)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}

export async function updateCourse(courseId: number, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    type: formData.get('type') as string,
    url: formData.get('url') as string,
    thumbnail_url: formData.get('thumbnailUrl') as string || null,
    duration: parseInt(formData.get('duration') as string),
    is_free: formData.get('isFree') === 'true',
  }

  const { error } = await supabase
    .from('academy_content')
    .update(updates)
    .eq('id', courseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}

export async function deleteCourse(courseId: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('academy_content')
    .delete()
    .eq('id', courseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}

export async function toggleCourseStatus(courseId: number, isActive: boolean) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('academy_content')
    .update({ is_active: !isActive })
    .eq('id', courseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/courses')
  return { success: true }
}

export async function getPendingWithdrawals() {
  const supabase = await createClient()
  
  const { data: withdrawals } = await supabase
    .from('withdrawal_requests')
    .select(`
      *,
      user:user_profiles(first_name, last_name, email)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return withdrawals || []
}

export async function approveWithdrawal(withdrawalId: number, txHash: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('withdrawal_requests')
    .update({
      status: 'completed',
      blockchain_tx_hash: txHash,
      processed_at: new Date().toISOString(),
    })
    .eq('id', withdrawalId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/withdrawals')
  return { success: true }
}

export async function rejectWithdrawal(withdrawalId: number, reason: string) {
  const supabase = await createClient()
  
  // Obtener el retiro para devolver el balance
  const { data: withdrawal } = await supabase
    .from('withdrawal_requests')
    .select('user_id, amount')
    .eq('id', withdrawalId)
    .single()

  if (!withdrawal) {
    return { error: 'Withdrawal not found' }
  }

  // Devolver el balance al usuario
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('balance')
    .eq('id', withdrawal.user_id)
    .single()

  if (profile) {
    await supabase
      .from('user_profiles')
      .update({
        balance: Number(profile.balance) + Number(withdrawal.amount)
      })
      .eq('id', withdrawal.user_id)
  }

  // Actualizar el estado del retiro
  const { error } = await supabase
    .from('withdrawal_requests')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      processed_at: new Date().toISOString(),
    })
    .eq('id', withdrawalId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/withdrawals')
  return { success: true }
}

export async function getPendingDepositsAdmin() {
  const supabase = await createClient()
  
  const { data: deposits } = await supabase
    .from('transactions')
    .select(`
      *,
      user:user_profiles(first_name, last_name, email)
    `)
    .eq('type', 'deposit')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return deposits || []
}

export async function approveDeposit(transactionId: number) {
  const supabase = await createClient()
  
  // Obtener la transacción
  const { data: transaction } = await supabase
    .from('transactions')
    .select('user_id, amount')
    .eq('id', transactionId)
    .single()

  if (!transaction) {
    return { error: 'Transaction not found' }
  }

  // Actualizar balance del usuario
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('balance')
    .eq('id', transaction.user_id)
    .single()

  if (profile) {
    await supabase
      .from('user_profiles')
      .update({
        balance: Number(profile.balance) + Number(transaction.amount)
      })
      .eq('id', transaction.user_id)
  }

  // Marcar transacción como completada
  const { error } = await supabase
    .from('transactions')
    .update({
      status: 'completed',
      processed_at: new Date().toISOString(),
    })
    .eq('id', transactionId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/deposits')
  return { success: true }
}

export async function getExpiringMemberships(days: number = 30) {
  const supabase = await createClient()
  
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  const { data: memberships } = await supabase
    .from('memberships')
    .select(`
      *,
      user:user_profiles(first_name, last_name, email)
    `)
    .eq('status', 'active')
    .lte('expires_at', futureDate.toISOString())
    .order('expires_at', { ascending: true })

  return memberships || []
}

export async function extendMembership(membershipId: number, days: number) {
  const supabase = await createClient()
  
  const { data: membership } = await supabase
    .from('memberships')
    .select('expires_at')
    .eq('id', membershipId)
    .single()

  if (!membership) {
    return { error: 'Membership not found' }
  }

  const newExpiry = new Date(membership.expires_at)
  newExpiry.setDate(newExpiry.getDate() + days)

  const { error } = await supabase
    .from('memberships')
    .update({ expires_at: newExpiry.toISOString() })
    .eq('id', membershipId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/memberships')
  return { success: true }
}

export async function getSystemSettings() {
  const supabase = await createClient()
  
  const { data: settings } = await supabase
    .from('system_settings')
    .select('*')
    .order('key', { ascending: true })

  return settings || []
}

export async function updateSystemSetting(key: string, value: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('system_settings')
    .update({ value })
    .eq('key', key)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/settings')
  return { success: true }
}

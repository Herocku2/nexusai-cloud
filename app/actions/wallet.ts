'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/lib/types/database'

type WithdrawalRequestInsert = Database['public']['Tables']['withdrawal_requests']['Insert']

export async function requestWithdrawal(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Obtener el perfil del usuario para verificar el balance y membresía activa
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('balance, is_active')
    .eq('id', user.id)
    .single()

  if (!profile) {
    throw new Error('Profile not found')
  }

  // VALIDACIÓN CRÍTICA: Usuario debe tener membresía activa para retirar
  if (!profile.is_active) {
    throw new Error('No puedes retirar fondos porque tu membresía está inactiva. Debes renovar tu membresía mensual de $29 USD para continuar operando.')
  }

  const amount = parseFloat(formData.get('amount') as string)
  const destinationAddress = formData.get('destinationAddress') as string
  const network = formData.get('network') as string || 'TRC20'

  // Validaciones
  if (amount < 20) {
    throw new Error('Minimum withdrawal amount is $20 USDT')
  }

  if (amount > Number(profile.balance)) {
    throw new Error('Insufficient balance')
  }

  // Crear solicitud de retiro
  const feeAmount = amount * 0.1 // 10% fee
  const netAmount = amount - feeAmount

  const withdrawal: WithdrawalRequestInsert = {
    user_id: user.id,
    amount,
    fee_amount: feeAmount,
    net_amount: netAmount,
    wallet_address: destinationAddress,
    network: network as 'TRC20' | 'ERC20',
  }

  const { error } = await supabase
    .from('withdrawal_requests')
    .insert(withdrawal)

  if (error) {
    throw new Error(error.message)
  }

  // Descontar del balance (quedará en "pending" hasta que se apruebe)
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ 
      balance: Number(profile.balance) - amount 
    })
    .eq('id', user.id)

  if (updateError) {
    throw new Error(updateError.message)
  }

  revalidatePath('/dashboard')
  revalidatePath('/wallet')
}

export async function getWithdrawals(limit: number = 10) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: withdrawals } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return withdrawals || []
}

export async function getWalletBalance() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      balance: 0,
      total_earnings: 0,
      total_withdrawn: 0,
      pending_withdrawals: 0,
    }
  }

  // Obtener balance actual
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('balance, total_earnings')
    .eq('id', user.id)
    .single()

  // Obtener retiros completados
  const { data: completedWithdrawals } = await supabase
    .from('withdrawal_requests')
    .select('net_amount')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const total_withdrawn = completedWithdrawals?.reduce(
    (sum, w) => sum + Number(w.net_amount || 0), 
    0
  ) || 0

  // Obtener retiros pendientes
  const { data: pendingWithdrawals } = await supabase
    .from('withdrawal_requests')
    .select('amount')
    .eq('user_id', user.id)
    .in('status', ['pending', 'processing'])

  const pending_withdrawals = pendingWithdrawals?.reduce(
    (sum, w) => sum + Number(w.amount || 0), 
    0
  ) || 0

  return {
    balance: Number(profile?.balance || 0),
    total_earnings: Number(profile?.total_earnings || 0),
    total_withdrawn,
    pending_withdrawals,
  }
}

export async function getTodayEarnings() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return 0
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: commissions } = await supabase
    .from('commissions')
    .select('amount')
    .eq('user_id', user.id)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  return commissions?.reduce((sum, c) => sum + Number(c.amount), 0) || 0
}

export async function getCommissionsByType() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      fast_start: 0,
      binary: 0,
      matching: 0,
    }
  }

  const { data: commissions } = await supabase
    .from('commissions')
    .select('type, amount')
    .eq('user_id', user.id)

  const grouped = {
    fast_start: 0,
    binary: 0,
    matching: 0,
  }

  commissions?.forEach(c => {
    if (c.type === 'fast_start') grouped.fast_start += Number(c.amount)
    if (c.type === 'binary') grouped.binary += Number(c.amount)
    if (c.type === 'matching') grouped.matching += Number(c.amount)
  })

  return grouped
}

export async function getWithdrawalHistory(limit: number = 20) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: withdrawals } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return withdrawals || []
}

export async function getCommissionHistory(limit: number = 50) {
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

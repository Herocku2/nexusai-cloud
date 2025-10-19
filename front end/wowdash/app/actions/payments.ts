'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/lib/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
type Membership = Database['public']['Tables']['memberships']['Row']
type MembershipInsert = Database['public']['Tables']['memberships']['Insert']

export async function createDepositRequest(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const amount = parseFloat(formData.get('amount') as string)
  const txHash = formData.get('txHash') as string
  const network = formData.get('network') as string || 'TRC20'

  // Validaciones
  if (amount < 100) {
    return { error: 'Minimum deposit amount is $100 USDT' }
  }

  if (!txHash) {
    return { error: 'Transaction hash is required' }
  }

  // Crear transacción de depósito
  const transaction: TransactionInsert = {
    user_id: user.id,
    type: 'deposit',
    amount,
    notes: `USDT Deposit via ${network}`,
    metadata: {
      tx_hash: txHash,
      network,
    },
  }

  const { error } = await supabase
    .from('transactions')
    .insert(transaction)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/payments')
  return { 
    success: true, 
    message: 'Deposit request submitted. Awaiting confirmation.' 
  }
}

export async function activateMembership(amount: number = 100) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verificar si ya tiene membresía activa
  const { data: existingMembership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (existingMembership) {
    return { error: 'You already have an active membership' }
  }

  // Obtener el perfil para verificar balance
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('balance, status')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Profile not found' }
  }

  if (Number(profile.balance) < amount) {
    return { error: 'Insufficient balance. Please deposit USDT first.' }
  }

  // Descontar del balance
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ 
      balance: Number(profile.balance) - amount,
      status: 'active' // Activar el perfil
    })
    .eq('id', user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  // Crear membresía
  const membership: MembershipInsert = {
    user_id: user.id,
    type: 'initial',
    amount: amount,
    started_at: new Date().toISOString(),
  }

  const { error: membershipError } = await supabase
    .from('memberships')
    .insert(membership)

  if (membershipError) {
    return { error: membershipError.message }
  }

  // Crear transacción de membresía
  const transaction: TransactionInsert = {
    user_id: user.id,
    type: 'membership',
    amount: -amount,
    notes: 'Standard Membership Activation',
  }

  await supabase
    .from('transactions')
    .insert(transaction)

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/payments')
  return { 
    success: true, 
    message: 'Membership activated successfully!' 
  }
}

export async function getDepositAddress() {
  // En producción, esto vendría de una API o configuración
  const addresses = {
    TRC20: 'TYourTRC20AddressHere123456789',
    ERC20: 'OxYourERC20AddressHere123456789',
  }
  
  return addresses
}

export async function getTransactionHistory(limit: number = 50) {
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

export async function getPendingDeposits() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: pending } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'deposit')
    .in('status', ['pending', 'processing'])
    .order('created_at', { ascending: false })

  return pending || []
}

export async function getPaymentStats() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      totalDeposits: 0,
      totalWithdrawals: 0,
      pendingTransactions: 0,
    }
  }

  // Total de depósitos completados
  const { data: deposits } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', user.id)
    .eq('type', 'deposit')
    .eq('status', 'completed')

  const totalDeposits = deposits?.reduce((sum: number, t: any) => sum + Number(t.amount), 0) || 0

  // Total de retiros completados
  const { count: totalWithdrawals } = await supabase
    .from('withdrawal_requests')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  // Transacciones pendientes
  const { count: pendingTransactions } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'processing'])

  return {
    totalDeposits,
    totalWithdrawals: totalWithdrawals || 0,
    pendingTransactions: pendingTransactions || 0,
  }
}

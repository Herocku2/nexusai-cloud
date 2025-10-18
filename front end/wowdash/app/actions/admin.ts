'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Credenciales de admin (en producción deberían estar en variables de entorno)
const ADMIN_EMAIL = 'admin@nexusai.com'
const ADMIN_PASSWORD = 'NexusAdmin2024!SecurePass'
const MASTER_PASSWORD = 'NexusMaster2024!SuperSecure'

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validar credenciales de admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Crear sesión de admin (en producción usar JWT o sesiones seguras)
    return { success: true }
  }

  return { error: 'Invalid admin credentials' }
}

export async function loginAsUser(userId: string, masterPassword: string) {
  if (masterPassword !== MASTER_PASSWORD) {
    return { error: 'Invalid master password' }
  }

  const supabase = await createClient()
  
  // Obtener datos del usuario
  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !user) {
    return { error: 'User not found' }
  }

  // Aquí se crearía una sesión temporal del usuario
  // En producción, esto se manejaría con tokens especiales
  return { 
    success: true, 
    redirectUrl: `/dashboard?admin_impersonate=${userId}`
  }
}

export async function getAllUsers(page: number = 1, limit: number = 20, search?: string, status?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('user_profiles')
    .select(`
      *,
      binary_position:binary_positions(position_leg, level),
      membership:memberships(status, type, expires_at)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: users, error, count } = await query

  return {
    users: users || [],
    total: count || 0,
    pages: Math.ceil((count || 0) / limit)
  }
}

export async function updateUserStatus(userId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('user_profiles')
    .update({ status })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateUserData(userId: string, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    first_name: formData.get('firstName') as string,
    last_name: formData.get('lastName') as string,
    phone: formData.get('phone') as string || null,
    country_code: formData.get('countryCode') as string || null,
    balance: parseFloat(formData.get('balance') as string) || null,
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true, message: 'User updated successfully' }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  const supabase = await createClient()
  
  // En Supabase, necesitas usar la API de admin para cambiar contraseñas
  // Esto requiere permisos especiales
  const { error } = await supabase.auth.admin.updateUserById(
    userId,
    { password: newPassword }
  )

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Password reset successfully' }
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()
  
  // Eliminar en cascada: memberships, transactions, etc.
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true, message: 'User deleted successfully' }
}

export async function getAdminStats() {
  const supabase = await createClient()
  
  // Total de usuarios
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact', head: true })

  // Usuarios activos
  const { count: activeUsers } = await supabase
    .from('user_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  // Membresías activas
  const { count: activeMemberships } = await supabase
    .from('memberships')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  // Total en retiros pendientes
  const { data: pendingWithdrawals } = await supabase
    .from('withdrawal_requests')
    .select('amount')
    .eq('status', 'pending')

  const totalPendingWithdrawals = pendingWithdrawals?.reduce(
    (sum: number, w: any) => sum + Number(w.amount), 
    0
  ) || 0

  // Ingresos totales (membresías pagadas)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('amount')

  const totalRevenue = memberships?.reduce(
    (sum: number, m: any) => sum + Number(m.amount), 
    0
  ) || 0

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    activeMemberships: activeMemberships || 0,
    totalPendingWithdrawals,
    totalRevenue,
  }
}

'use server'

import { createClient } from '@/utils/supabase/server'

export async function getBinaryTree(userId?: string, maxDepth: number = 3) {
  const supabase = await createClient()
  
  let targetUserId = userId
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    targetUserId = user.id
  }

  try {
    // Usar la función de PostgreSQL para obtener el downline
    const { data, error } = await supabase
      .rpc('get_binary_downline', {
        p_root_user_id: targetUserId,
        p_max_depth: maxDepth
      })

    if (error) {
      console.error('Error fetching binary tree:', error)
      // Si la función no existe, retornar array vacío
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception fetching binary tree:', error)
    return []
  }
}

export async function getDirectReferrals() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { left: 0, right: 0, total: 0 }
  }

  try {
    const { data, error } = await supabase
      .rpc('get_direct_referrals_count', {
        target_user_id: user.id
      })

    if (error || !data || data.length === 0) {
      console.log('No direct referrals data or RPC not found')
      return { left: 0, right: 0, total: 0 }
    }

    const result = data[0]
    return {
      left: result.left_count || 0,
      right: result.right_count || 0,
      total: (result.left_count || 0) + (result.right_count || 0)
    }
  } catch (error) {
    console.error('Exception fetching direct referrals:', error)
    return { left: 0, right: 0, total: 0 }
  }
}

export async function getTeamVolume() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { left: 0, right: 0, total: 0, left_carryover: 0, right_carryover: 0 }
  }

  try {
    // Obtener la posición binaria del usuario
    const { data: position } = await supabase
      .from('binary_positions')
      .select('left_volume, right_volume, left_carryover, right_carryover')
      .eq('user_id', user.id)
      .single()

    if (!position) {
      return { left: 0, right: 0, total: 0, left_carryover: 0, right_carryover: 0 }
    }

    return {
      left: Number(position.left_volume || 0),
      right: Number(position.right_volume || 0),
      total: Number(position.left_volume || 0) + Number(position.right_volume || 0),
      left_carryover: Number(position.left_carryover || 0),
      right_carryover: Number(position.right_carryover || 0),
    }
  } catch (error) {
    console.error('Exception fetching team volume:', error)
    return { left: 0, right: 0, total: 0, left_carryover: 0, right_carryover: 0 }
  }
}

export async function getTeamMembers(limit: number = 20) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  // Obtener miembros del equipo (downline)
  const { data: downline } = await supabase
    .rpc('get_binary_downline', {
      p_root_user_id: user.id,
      p_max_depth: 5
    })

  if (!downline || downline.length === 0) {
    return []
  }

  // Obtener información de los usuarios
  const userIds = downline.map((d: any) => d.user_id)
  
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, status, total_pv, total_earnings, created_at')
    .in('id', userIds)
    .limit(limit)

  return profiles || []
}

export async function getReferralLink() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}/auth/register?sponsor=${user.id}`
}

export async function getTotalTeamSize() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return 0
  }

  const { data: downline } = await supabase
    .rpc('get_binary_downline', {
      p_root_user_id: user.id,
      p_max_depth: null
    })

  return downline?.length || 0
}

export async function getActiveMembers() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return 0
  }

  try {
    // Obtener downline
    const { data: downline } = await supabase
      .rpc('get_binary_downline', {
        p_root_user_id: user.id,
        p_max_depth: null
      })

    if (!downline || downline.length === 0) {
      return 0
    }

    const userIds = downline.map((d: any) => d.user_id)
    
    // Contar miembros activos
    const { count } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact', head: true })
      .in('id', userIds)
      .eq('status', 'active')

    return count || 0
  } catch (error) {
    console.error('Exception fetching active members:', error)
    return 0
  }
}

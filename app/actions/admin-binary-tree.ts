'use server'

import { createClient } from "@/utils/supabase/server"

export interface AdminBinaryNode {
  id: string
  positionId: string
  userId: string
  firstName: string | null
  lastName: string | null
  email: string
  position: 'left' | 'right'
  level: number
  leftVolume: number
  rightVolume: number
  totalInvestment: number
  totalCommissions: number
  directReferrals: number
  isActive: boolean
  createdAt: string
  parentId: string | null
  sponsorId: string | null
  sponsorName: string | null
  leftChildId: string | null
  rightChildId: string | null
  path: string
  balance: number
  membershipLevel: string | null
}

export interface BinaryTreeStats {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  totalVolume: number
  totalLevels: number
  leftBranchCount: number
  rightBranchCount: number
  balanceRatio: number
}

/**
 * Obtiene el árbol binario completo desde un nodo específico
 */
export async function getAdminBinaryTree(userId: string, depth: number = 5): Promise<AdminBinaryNode | null> {
  const supabase = await createClient()
  
  // Verificar permisos de admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  return await fetchNodeRecursive(supabase, userId, 0, depth)
}

/**
 * Función recursiva para construir el árbol
 */
async function fetchNodeRecursive(
  supabase: any,
  userId: string,
  currentDepth: number,
  maxDepth: number
): Promise<AdminBinaryNode | null> {
  if (currentDepth > maxDepth) return null

  // Obtener posición binaria
  const { data: position, error: posError } = await supabase
    .from('binary_positions')
    .select(`
      id,
      user_id,
      position_leg,
      level,
      left_volume,
      right_volume,
      left_child_id,
      right_child_id,
      parent_id,
      sponsor_id,
      path,
      created_at
    `)
    .eq('user_id', userId)
    .single()

  if (posError || !position) return null

  // Obtener datos del perfil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select(`
      first_name,
      last_name,
      email,
      is_active,
      balance,
      sponsor_id
    `)
    .eq('id', userId)
    .single()

  // Obtener nombre del sponsor
  let sponsorName = null
  if (position.sponsor_id) {
    const { data: sponsor } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('id', position.sponsor_id)
      .single()
    
    if (sponsor) {
      sponsorName = `${sponsor.first_name || ''} ${sponsor.last_name || ''}`.trim()
    }
  }

  // Obtener inversión total
  const { data: memberships } = await supabase
    .from('memberships')
    .select('amount, level')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('amount', { ascending: false })
    .limit(1)

  const totalInvestment = memberships?.[0]?.amount || 0
  const membershipLevel = memberships?.[0]?.level || null

  // Obtener comisiones totales
  const { data: commissions } = await supabase
    .from('commissions')
    .select('amount')
    .eq('user_id', userId)
    .eq('status', 'paid')

  const totalCommissions = commissions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0

  // Contar referidos directos
  const { count: directCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('sponsor_id', userId)

  // Construir nodo actual
  const node: AdminBinaryNode = {
    id: `node-${position.id}`,
    positionId: position.id.toString(),
    userId: userId,
    firstName: profile?.first_name || null,
    lastName: profile?.last_name || null,
    email: profile?.email || '',
    position: position.position_leg as 'left' | 'right',
    level: position.level,
    leftVolume: parseFloat(position.left_volume) || 0,
    rightVolume: parseFloat(position.right_volume) || 0,
    totalInvestment: parseFloat(totalInvestment),
    totalCommissions,
    directReferrals: directCount || 0,
    isActive: profile?.is_active || false,
    createdAt: position.created_at,
    parentId: position.parent_id ? `node-${position.parent_id}` : null,
    sponsorId: position.sponsor_id,
    sponsorName,
    leftChildId: position.left_child_id ? `node-${position.left_child_id}` : null,
    rightChildId: position.right_child_id ? `node-${position.right_child_id}` : null,
    path: position.path,
    balance: parseFloat(profile?.balance || '0'),
    membershipLevel,
  }

  return node
}

/**
 * Obtiene todos los nodos del árbol de forma plana
 */
export async function getAllBinaryNodes(rootUserId?: string): Promise<AdminBinaryNode[]> {
  const supabase = await createClient()
  
  // Verificar permisos de admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Obtener todas las posiciones
  let query = supabase
    .from('binary_positions')
    .select(`
      id,
      user_id,
      position_leg,
      level,
      left_volume,
      right_volume,
      left_child_id,
      right_child_id,
      parent_id,
      sponsor_id,
      path,
      created_at
    `)
    .order('level', { ascending: true })
    .order('id', { ascending: true })

  // Si hay un rootUserId, filtrar por path
  if (rootUserId) {
    const { data: rootPosition } = await supabase
      .from('binary_positions')
      .select('path')
      .eq('user_id', rootUserId)
      .single()
    
    if (rootPosition) {
      query = query.or(`path.eq.${rootPosition.path},path.like.${rootPosition.path}.%`)
    }
  }

  const { data: positions, error } = await query

  if (error || !positions) return []

  // Obtener todos los user_ids
  const userIds = positions.map(p => p.user_id)

  // Obtener perfiles en batch
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, email, is_active, balance, sponsor_id')
    .in('id', userIds)

  // Crear mapa de perfiles
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Obtener membresías activas
  const { data: memberships } = await supabase
    .from('memberships')
    .select('user_id, amount, level')
    .in('user_id', userIds)
    .eq('status', 'active')

  const membershipMap = new Map(
    memberships?.map(m => [m.user_id, { amount: m.amount, level: m.level }]) || []
  )

  // Obtener comisiones
  const { data: commissions } = await supabase
    .from('commissions')
    .select('user_id, amount')
    .in('user_id', userIds)
    .eq('status', 'paid')

  const commissionsMap = new Map<string, number>()
  commissions?.forEach(c => {
    const current = commissionsMap.get(c.user_id) || 0
    commissionsMap.set(c.user_id, current + parseFloat(c.amount))
  })

  // Obtener conteo de referidos
  const { data: referralCounts } = await supabase
    .rpc('count_direct_referrals_batch', { user_ids: userIds })

  const referralMap = new Map(
    referralCounts?.map((r: any) => [r.user_id, r.count]) || []
  )

  // Construir nodos
  const nodes: AdminBinaryNode[] = positions.map(position => {
    const profile = profileMap.get(position.user_id)
    const membership = membershipMap.get(position.user_id)
    const totalCommissions = commissionsMap.get(position.user_id) || 0
    const directReferrals = referralMap.get(position.user_id) || 0

    return {
      id: `node-${position.id}`,
      positionId: position.id.toString(),
      userId: position.user_id,
      firstName: profile?.first_name || null,
      lastName: profile?.last_name || null,
      email: profile?.email || '',
      position: position.position_leg as 'left' | 'right',
      level: position.level,
      leftVolume: parseFloat(position.left_volume) || 0,
      rightVolume: parseFloat(position.right_volume) || 0,
      totalInvestment: parseFloat(membership?.amount || '0'),
      totalCommissions,
      directReferrals,
      isActive: profile?.is_active || false,
      createdAt: position.created_at,
      parentId: position.parent_id ? `node-${position.parent_id}` : null,
      sponsorId: position.sponsor_id,
      sponsorName: null,
      leftChildId: position.left_child_id ? `node-${position.left_child_id}` : null,
      rightChildId: position.right_child_id ? `node-${position.right_child_id}` : null,
      path: position.path,
      balance: parseFloat(profile?.balance || '0'),
      membershipLevel: membership?.level || null,
    }
  })

  return nodes
}

/**
 * Obtiene estadísticas del árbol binario
 */
export async function getBinaryTreeStatistics(rootUserId?: string): Promise<BinaryTreeStats> {
  const supabase = await createClient()
  
  // Verificar permisos de admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  let query = supabase.from('binary_positions').select('*')

  // Si hay un rootUserId, filtrar por path
  if (rootUserId) {
    const { data: rootPosition } = await supabase
      .from('binary_positions')
      .select('path')
      .eq('user_id', rootUserId)
      .single()
    
    if (rootPosition) {
      query = query.or(`path.eq.${rootPosition.path},path.like.${rootPosition.path}.%`)
    }
  }

  const { data: positions } = await query

  if (!positions || positions.length === 0) {
    return {
      totalMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
      totalVolume: 0,
      totalLevels: 0,
      leftBranchCount: 0,
      rightBranchCount: 0,
      balanceRatio: 0,
    }
  }

  const userIds = positions.map(p => p.user_id)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, is_active')
    .in('id', userIds)

  const activeCount = profiles?.filter(p => p.is_active).length || 0
  const totalVolume = positions.reduce((sum, p) => 
    sum + parseFloat(p.left_volume || '0') + parseFloat(p.right_volume || '0'), 0
  )

  const maxLevel = Math.max(...positions.map(p => p.level))
  const leftBranchCount = positions.filter(p => p.position_leg === 'left').length
  const rightBranchCount = positions.filter(p => p.position_leg === 'right').length

  const balanceRatio = rightBranchCount > 0 
    ? (leftBranchCount / rightBranchCount) * 100 
    : 100

  return {
    totalMembers: positions.length,
    activeMembers: activeCount,
    inactiveMembers: positions.length - activeCount,
    totalVolume,
    totalLevels: maxLevel,
    leftBranchCount,
    rightBranchCount,
    balanceRatio: Math.round(balanceRatio),
  }
}

/**
 * Buscar usuarios en el árbol binario
 */
export async function searchBinaryTreeUsers(searchTerm: string): Promise<AdminBinaryNode[]> {
  const supabase = await createClient()
  
  // Verificar permisos de admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }

  // Buscar en perfiles
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name, email, is_active, balance')
    .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .limit(50)

  if (!profiles || profiles.length === 0) return []

  const userIds = profiles.map(p => p.id)

  // Obtener sus posiciones binarias
  const { data: positions } = await supabase
    .from('binary_positions')
    .select('*')
    .in('user_id', userIds)

  if (!positions) return []

  const nodes = await Promise.all(
    positions.map(async (position) => {
      const profile = profiles.find(p => p.id === position.user_id)
      
      return {
        id: `node-${position.id}`,
        positionId: position.id.toString(),
        userId: position.user_id,
        firstName: profile?.first_name || null,
        lastName: profile?.last_name || null,
        email: profile?.email || '',
        position: position.position_leg as 'left' | 'right',
        level: position.level,
        leftVolume: parseFloat(position.left_volume) || 0,
        rightVolume: parseFloat(position.right_volume) || 0,
        totalInvestment: 0,
        totalCommissions: 0,
        directReferrals: 0,
        isActive: profile?.is_active || false,
        createdAt: position.created_at,
        parentId: position.parent_id ? `node-${position.parent_id}` : null,
        sponsorId: position.sponsor_id,
        sponsorName: null,
        leftChildId: position.left_child_id ? `node-${position.left_child_id}` : null,
        rightChildId: position.right_child_id ? `node-${position.right_child_id}` : null,
        path: position.path,
        balance: parseFloat(profile?.balance || '0'),
        membershipLevel: null,
      }
    })
  )

  return nodes
}

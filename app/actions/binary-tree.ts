'use server'

import { createClient } from "@/utils/supabase/server"

export interface BinaryTreeNode {
  id: string
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
  leftChild: BinaryTreeNode | null
  rightChild: BinaryTreeNode | null
}

export async function getBinaryTreeData(userId?: string): Promise<BinaryTreeNode | null> {
  const supabase = await createClient()
  
  // Si no se proporciona userId, obtener el del usuario actual
  let targetUserId = userId
  let userEmail = ''
  
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    targetUserId = user.id
    userEmail = user.email || ''
  }

  // Obtener la posición binaria del usuario
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
      created_at
    `)
    .eq('user_id', targetUserId)
    .single()

  if (posError || !position) {
    console.error('Error fetching binary position:', posError)
    return null
  }

  // Obtener datos del perfil del usuario
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('first_name, last_name, is_active, balance')
    .eq('id', targetUserId)
    .single()

  // Si no tenemos el email, intentar obtenerlo (para llamadas recursivas)
  if (!userEmail) {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (currentUser && currentUser.id === targetUserId) {
      userEmail = currentUser.email || ''
    } else {
      // Para otros usuarios, usar un identificador genérico
      userEmail = `user-${targetUserId.substring(0, 8)}`
    }
  }

  // Obtener inversión total (membresías)
  const { data: memberships } = await supabase
    .from('memberships')
    .select('amount')
    .eq('user_id', targetUserId)

  const totalInvestment = memberships?.reduce((sum, m) => sum + parseFloat(m.amount), 0) || 0

  // Obtener comisiones totales
  const { data: commissions } = await supabase
    .from('commissions')
    .select('amount')
    .eq('user_id', targetUserId)
    .eq('status', 'paid')

  const totalCommissions = commissions?.reduce((sum, c) => sum + parseFloat(c.amount), 0) || 0

  // Contar referidos directos
  const { count: directCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('sponsor_id', targetUserId)

  // Construir el nodo raíz
  const rootNode: BinaryTreeNode = {
    id: position.id.toString(),
    userId: targetUserId,
    firstName: profile?.first_name || null,
    lastName: profile?.last_name || null,
    email: userEmail,
    position: position.position_leg as 'left' | 'right',
    level: position.level,
    leftVolume: parseFloat(position.left_volume) || 0,
    rightVolume: parseFloat(position.right_volume) || 0,
    totalInvestment,
    totalCommissions,
    directReferrals: directCount || 0,
    isActive: profile?.is_active || false,
    createdAt: position.created_at,
    leftChild: null,
    rightChild: null,
  }

  // Obtener hijo izquierdo recursivamente
  if (position.left_child_id) {
    const { data: leftChildPos } = await supabase
      .from('binary_positions')
      .select('user_id')
      .eq('id', position.left_child_id)
      .single()
    
    if (leftChildPos) {
      rootNode.leftChild = await getBinaryTreeData(leftChildPos.user_id)
    }
  }

  // Obtener hijo derecho recursivamente
  if (position.right_child_id) {
    const { data: rightChildPos } = await supabase
      .from('binary_positions')
      .select('user_id')
      .eq('id', position.right_child_id)
      .single()
    
    if (rightChildPos) {
      rootNode.rightChild = await getBinaryTreeData(rightChildPos.user_id)
    }
  }

  return rootNode
}

export async function getBinaryTreeStats(userId?: string) {
  const supabase = await createClient()
  
  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    targetUserId = user.id
  }

  // Obtener posición binaria
  const { data: position } = await supabase
    .from('binary_positions')
    .select('left_volume, right_volume')
    .eq('user_id', targetUserId)
    .single()

  // Contar equipo total (recursivo)
  const { data: allPositions } = await supabase
    .rpc('get_downline_count', { p_user_id: targetUserId })

  // Contar referidos directos
  const { count: directCount } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('sponsor_id', targetUserId)

  return {
    leftVolume: parseFloat(position?.left_volume || '0'),
    rightVolume: parseFloat(position?.right_volume || '0'),
    totalTeam: allPositions || 0,
    directReferrals: directCount || 0,
  }
}

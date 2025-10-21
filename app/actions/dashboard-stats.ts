'use server'

import { createClient } from "@/utils/supabase/server"

/**
 * Estadísticas completas del dashboard del usuario
 * Usa las funciones RPC de Supabase que ya existen
 */

export interface DashboardStats {
  balance: number
  totalEarnings: number
  totalPV: number
  status: string
  currentRank: string
  nextRank: string
  progressToNextRank: number
  leftVolume: number
  rightVolume: number
  totalTeam: number
  directReferrals: number
  activeReferrals: number
  monthlyEarnings: number
  weeklyEarnings: number
  pendingCommissions: number
  hasActiveMembership: boolean
  membershipExpiryDate: string | null
}

export interface RecentCommission {
  id: string
  type: string
  amount: number
  status: string
  createdAt: string
  fromUser: string | null
}

export interface RecentTransaction {
  id: string
  type: string
  amount: number
  status: string
  createdAt: string
  description: string
}

/**
 * Obtiene las estadísticas completas del usuario
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const supabase = await createClient()
    
    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Obtener perfil del usuario
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return null

    // Obtener posición binaria
    const { data: position } = await supabase
      .from('binary_positions')
      .select('left_volume, right_volume')
      .eq('user_id', user.id)
      .single()

    // Contar equipo total usando función RPC
    const { data: teamCount } = await supabase
      .rpc('get_downline_count', { p_user_id: user.id })

    // Contar referidos directos
    const { count: directCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('sponsor_id', user.id)

    // Contar referidos activos
    const { count: activeCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('sponsor_id', user.id)
      .eq('is_active', true)

    // Obtener rango actual
    const { data: currentRankData } = await supabase
      .from('user_ranks')
      .select('rank_id, ranks(name, min_pv)')
      .eq('user_id', user.id)
      .eq('is_current', true)
      .single()

    // Obtener siguiente rango
    const currentRank = currentRankData?.ranks as any
    const currentMinPV = currentRank?.min_pv || 0
    const { data: nextRankData } = await supabase
      .from('ranks')
      .select('name, min_pv')
      .gt('min_pv', currentMinPV)
      .order('min_pv', { ascending: true })
      .limit(1)
      .single()

    // Calcular progreso al siguiente rango
    const progressToNextRank = nextRankData 
      ? Math.min(100, ((profile.total_pv || 0) / nextRankData.min_pv) * 100)
      : 100

    // Obtener comisiones del mes
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyCommissions } = await supabase
      .from('commissions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .gte('created_at', startOfMonth.toISOString())

    const monthlyEarnings = monthlyCommissions?.reduce(
      (sum, c) => sum + parseFloat(c.amount), 0
    ) || 0

    // Obtener comisiones de la semana
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - 7)

    const { data: weeklyCommissions } = await supabase
      .from('commissions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .gte('created_at', startOfWeek.toISOString())

    const weeklyEarnings = weeklyCommissions?.reduce(
      (sum, c) => sum + parseFloat(c.amount), 0
    ) || 0

    // Obtener comisiones pendientes
    const { data: pendingCommissions } = await supabase
      .from('commissions')
      .select('amount')
      .eq('user_id', user.id)
      .eq('status', 'pending')

    const pendingTotal = pendingCommissions?.reduce(
      (sum, c) => sum + parseFloat(c.amount), 0
    ) || 0

    // Verificar membresía activa usando función RPC
    const { data: hasActiveMembership } = await supabase
      .rpc('has_active_membership', { p_user_id: user.id })

    // Obtener fecha de expiración de membresía
    const { data: activeMembership } = await supabase
      .from('memberships')
      .select('end_date')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('end_date', { ascending: false })
      .limit(1)
      .single()

    return {
      balance: parseFloat(profile.balance || '0'),
      totalEarnings: parseFloat(profile.total_earnings || '0'),
      totalPV: parseFloat(profile.total_pv || '0'),
      status: profile.status || 'pending',
      currentRank: currentRank?.name || 'Afiliado',
      nextRank: nextRankData?.name || 'Máximo Rango',
      progressToNextRank: Math.round(progressToNextRank),
      leftVolume: parseFloat(position?.left_volume || '0'),
      rightVolume: parseFloat(position?.right_volume || '0'),
      totalTeam: teamCount || 0,
      directReferrals: directCount || 0,
      activeReferrals: activeCount || 0,
      monthlyEarnings,
      weeklyEarnings,
      pendingCommissions: pendingTotal,
      hasActiveMembership: hasActiveMembership || false,
      membershipExpiryDate: activeMembership?.end_date || null,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

/**
 * Obtiene las últimas comisiones del usuario
 */
export async function getRecentCommissions(limit: number = 5): Promise<RecentCommission[]> {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: commissions } = await supabase
      .from('commissions')
      .select(`
        id,
        type,
        amount,
        status,
        created_at,
        from_user_id
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!commissions) return []

    // Obtener nombres de los usuarios de donde vienen las comisiones
    const userIds = commissions
      .map(c => c.from_user_id)
      .filter(id => id !== null)

    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, first_name, last_name')
      .in('id', userIds)

    const profileMap = new Map(
      profiles?.map(p => [p.id, `${p.first_name} ${p.last_name}`]) || []
    )

    return commissions.map(c => ({
      id: c.id,
      type: c.type,
      amount: parseFloat(c.amount),
      status: c.status,
      createdAt: c.created_at,
      fromUser: c.from_user_id ? profileMap.get(c.from_user_id) || null : null,
    }))
  } catch (error) {
    console.error('Error fetching recent commissions:', error)
    return []
  }
}

/**
 * Obtiene las últimas transacciones del usuario
 */
export async function getRecentTransactions(limit: number = 5): Promise<RecentTransaction[]> {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, type, amount, status, created_at, description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!transactions) return []

    return transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: parseFloat(t.amount),
      status: t.status,
      createdAt: t.created_at,
      description: t.description || '',
    }))
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    return []
  }
}

/**
 * Obtiene estadísticas de crecimiento (para gráficos)
 */
export async function getGrowthStats(days: number = 30) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Obtener comisiones agrupadas por día
    const { data: dailyCommissions } = await supabase
      .from('commissions')
      .select('created_at, amount')
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    // Agrupar por día
    const dailyTotals = new Map<string, number>()
    
    dailyCommissions?.forEach(c => {
      const date = new Date(c.created_at).toISOString().split('T')[0]
      const current = dailyTotals.get(date) || 0
      dailyTotals.set(date, current + parseFloat(c.amount))
    })

    // Crear array con todos los días (incluso sin comisiones)
    const result = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      const dateStr = date.toISOString().split('T')[0]
      
      result.push({
        date: dateStr,
        amount: dailyTotals.get(dateStr) || 0,
      })
    }

    return result
  } catch (error) {
    console.error('Error fetching growth stats:', error)
    return null
  }
}

'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from './notifications'

export async function getCurrentRank() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated', rank: null }
    }

    // Get current rank
    const { data: userRank, error: rankError } = await supabase
      .from('user_ranks')
      .select(`
        *,
        ranks (*)
      `)
      .eq('user_id', user.id)
      .eq('is_current', true)
      .single()

    if (rankError && rankError.code !== 'PGRST116') throw rankError

    return {
      success: true,
      rank: userRank || null
    }
  } catch (error: any) {
    console.error('Error fetching current rank:', error)
    return {
      success: false,
      error: error.message,
      rank: null
    }
  }
}

export async function getAllRanks() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('ranks')
      .select('*')
      .order('level', { ascending: true })

    if (error) throw error

    return {
      success: true,
      ranks: data || []
    }
  } catch (error: any) {
    console.error('Error fetching ranks:', error)
    return {
      success: false,
      error: error.message,
      ranks: []
    }
  }
}

export async function getRankProgress() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated', progress: null }
    }

    // Obtener perfil, current rank y posición binaria en una sola consulta optimizada
    const [profileResult, currentRankResult, binaryPosResult, referralsResult] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('total_pv')
        .eq('id', user.id)
        .single(),
      
      supabase
        .from('user_ranks')
        .select('*, ranks(*)')
        .eq('user_id', user.id)
        .eq('is_current', true)
        .maybeSingle(),
      
      supabase
        .from('binary_positions')
        .select('left_volume, right_volume')
        .eq('user_id', user.id)
        .maybeSingle(),
      
      supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('sponsor_id', user.id)
        .eq('status', 'active')
    ])

    const profile = profileResult.data
    const currentRankData = currentRankResult.data
    const binaryPosition = binaryPosResult.data
    const referralCount = referralsResult.count || 0

    if (!profile) throw new Error('Profile not found')

    const currentRank = currentRankData?.ranks
    const currentLevel = currentRank?.level || 0

    // Obtener siguiente rango
    const { data: nextRank } = await supabase
      .from('ranks')
      .select('*')
      .gt('level', currentLevel)
      .order('level', { ascending: true })
      .limit(1)
      .maybeSingle()

    const leftVolume = binaryPosition?.left_volume || 0
    const rightVolume = binaryPosition?.right_volume || 0

    // Calcular progreso
    const progress = {
      currentRank: currentRank || null,
      nextRank: nextRank || null,
      requirements: {
        directReferrals: {
          current: referralCount,
          required: nextRank?.required_direct_referrals || 0,
          percentage: nextRank ? Math.min(100, (referralCount / nextRank.required_direct_referrals) * 100) : 100
        },
        leftPV: {
          current: leftVolume,
          required: nextRank?.required_left_pv || 0,
          percentage: nextRank ? Math.min(100, (leftVolume / nextRank.required_left_pv) * 100) : 100
        },
        rightPV: {
          current: rightVolume,
          required: nextRank?.required_right_pv || 0,
          percentage: nextRank ? Math.min(100, (rightVolume / nextRank.required_right_pv) * 100) : 100
        },
        totalPV: {
          current: profile.total_pv,
          required: nextRank?.required_total_pv || 0,
          percentage: nextRank ? Math.min(100, (profile.total_pv / nextRank.required_total_pv) * 100) : 100
        }
      }
    }

    return {
      success: true,
      progress
    }
  } catch (error: any) {
    console.error('Error calculating rank progress:', error)
    return {
      success: false,
      error: error.message,
      progress: null
    }
  }
}

export async function checkAndUpdateRank() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get current progress
    const progressResult = await getRankProgress()
    if (!progressResult.success || !progressResult.progress) {
      return { success: false, error: 'Could not get rank progress' }
    }

    const { progress } = progressResult
    const { requirements, nextRank, currentRank } = progress

    // Check if all requirements are met
    const allRequirementsMet = 
      requirements.directReferrals.percentage >= 100 &&
      requirements.leftPV.percentage >= 100 &&
      requirements.rightPV.percentage >= 100 &&
      requirements.totalPV.percentage >= 100

    if (allRequirementsMet && nextRank) {
      // Set current rank to not current
      if (currentRank) {
        await supabase
          .from('user_ranks')
          .update({ is_current: false })
          .eq('user_id', user.id)
          .eq('is_current', true)
      }

      // Create new rank achievement
      const { error: insertError } = await supabase
        .from('user_ranks')
        .insert({
          user_id: user.id,
          rank_id: nextRank.id,
          is_current: true,
          achieved_at: new Date().toISOString()
        })

      if (insertError) throw insertError

      // Create notification
      await createNotification(
        user.id,
        '🎉 Rank Achievement!',
        `Congratulations! You've achieved the rank of ${nextRank.name}!`,
        'success',
        '/dashboard/ranks'
      )

      revalidatePath('/dashboard')
      return {
        success: true,
        rankUpdated: true,
        newRank: nextRank
      }
    }

    return {
      success: true,
      rankUpdated: false,
      message: 'Requirements not yet met'
    }
  } catch (error: any) {
    console.error('Error checking rank:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function getRankHistory() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated', history: [] }
    }

    const { data, error } = await supabase
      .from('user_ranks')
      .select(`
        *,
        ranks (*)
      `)
      .eq('user_id', user.id)
      .order('achieved_at', { ascending: false })

    if (error) throw error

    return {
      success: true,
      history: data || []
    }
  } catch (error: any) {
    console.error('Error fetching rank history:', error)
    return {
      success: false,
      error: error.message,
      history: []
    }
  }
}

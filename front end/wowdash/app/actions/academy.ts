'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { Database } from '@/lib/types/database'

type AcademyContent = Database['public']['Tables']['academy_content']['Row']
type UserContentProgress = Database['public']['Tables']['user_content_progress']['Row']
type UserContentProgressInsert = Database['public']['Tables']['user_content_progress']['Insert']

export async function getAllCourses(category?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('academy_content')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: courses } = await query

  return courses || []
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient()
  
  const { data: course } = await supabase
    .from('academy_content')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return course
}

export async function getMyCourses() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: progress } = await supabase
    .from('user_content_progress')
    .select(`
      *,
      content:academy_content(*)
    `)
    .eq('user_id', user.id)
    .order('last_accessed_at', { ascending: false })

  return progress || []
}

export async function getCourseProgress(contentId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: progress } = await supabase
    .from('user_content_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .single()

  return progress
}

export async function updateCourseProgress(contentId: string, progressPercentage: number, isCompleted: boolean = false) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Verificar si ya existe progreso
  const { data: existing } = await supabase
    .from('user_content_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .single()

  const status = isCompleted ? 'completed' : (progressPercentage > 0 ? 'in_progress' : 'not_started')

  if (existing) {
    // Actualizar progreso existente
    const { error } = await supabase
      .from('user_content_progress')
      .update({
        progress_percentage: progressPercentage,
        status,
        completed_at: isCompleted ? new Date().toISOString() : null,
      })
      .eq('id', existing.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Crear nuevo registro de progreso
    const newProgress: UserContentProgressInsert = {
      user_id: user.id,
      content_id: parseInt(contentId),
      progress_percentage: progressPercentage,
      status,
      completed_at: isCompleted ? new Date().toISOString() : null,
    }

    const { error } = await supabase
      .from('user_content_progress')
      .insert(newProgress)

    if (error) {
      return { error: error.message }
    }
  }

  revalidatePath('/dashboard/academy')
  return { success: true }
}

export async function getCompletedCourses() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data: completed } = await supabase
    .from('user_content_progress')
    .select(`
      *,
      content:academy_content(*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })

  return completed || []
}

export async function getAcademyStats() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      totalHours: 0,
    }
  }

  // Total de cursos disponibles
  const { count: totalCourses } = await supabase
    .from('academy_content')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  // Cursos completados
  const { count: completedCourses } = await supabase
    .from('user_content_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'completed')

  // Cursos en progreso
  const { count: inProgressCourses } = await supabase
    .from('user_content_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'in_progress')

  // Total de horas de contenido completado
  const { data: completedContent } = await supabase
    .from('user_content_progress')
    .select(`
      content:academy_content(duration)
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const totalMinutes = completedContent?.reduce((sum: number, item: any) => {
    return sum + (item.content?.duration || 0)
  }, 0) || 0

  const totalHours = Math.floor(totalMinutes / 60)

  return {
    totalCourses: totalCourses || 0,
    completedCourses: completedCourses || 0,
    inProgressCourses: inProgressCourses || 0,
    totalHours,
  }
}

export async function getCoursesByCategory() {
  const supabase = await createClient()
  
  const { data: courses } = await supabase
    .from('academy_content')
    .select('category')
    .eq('is_active', true)

  const categories = courses?.reduce((acc: any, course: any) => {
    const cat = course.category || 'Uncategorized'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  return categories || {}
}

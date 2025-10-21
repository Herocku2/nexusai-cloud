'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePlacementPreference(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'No autenticado' }
  }

  const preference = formData.get('placement_preference') as string

  if (!['left', 'right', 'auto'].includes(preference)) {
    return { error: 'Preferencia inválida' }
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({ placement_preference: preference })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating placement preference:', error)
    return { error: 'Error al actualizar preferencia' }
  }

  revalidatePath('/dashboard/team')
  return { success: true }
}

export async function getPlacementPreference() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { preference: 'auto' }
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .select('placement_preference')
    .eq('id', user.id)
    .single()

  if (error || !data) {
    return { preference: 'auto' }
  }

  return { preference: data.placement_preference || 'auto' }
}

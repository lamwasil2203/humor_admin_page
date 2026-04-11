'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function assertSuperadmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_superadmin) redirect('/login?error=unauthorized')
}

export async function duplicateHumorFlavorAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  await assertSuperadmin()

  const flavorId = parseInt(formData.get('flavorId') as string, 10)
  const newSlug = (formData.get('slug') as string)?.trim()

  if (!newSlug) return { error: 'Slug is required' }
  if (!/^[a-z0-9_-]+$/.test(newSlug))
    return { error: 'Slug may only contain lowercase letters, numbers, hyphens, and underscores' }

  const db = createAdminClient()

  // Fetch original flavor
  const { data: original, error: flavorError } = await db
    .from('humor_flavors')
    .select('slug, description')
    .eq('id', flavorId)
    .single()

  if (flavorError || !original) return { error: 'Original flavor not found' }

  // Check slug uniqueness
  const { data: existing } = await db
    .from('humor_flavors')
    .select('id')
    .eq('slug', newSlug)
    .maybeSingle()

  if (existing) return { error: `Slug "${newSlug}" is already taken` }

  // Create new flavor
  const { data: newFlavor, error: insertError } = await db
    .from('humor_flavors')
    .insert({ slug: newSlug, description: original.description })
    .select('id')
    .single()

  if (insertError || !newFlavor) return { error: 'Failed to create flavor' }

  // Fetch all steps from original
  const { data: steps, error: stepsError } = await db
    .from('humor_flavor_steps')
    .select(
      'order_by, description, llm_temperature, llm_system_prompt, llm_user_prompt, llm_model_id, llm_input_type_id, llm_output_type_id, humor_flavor_step_type_id'
    )
    .eq('humor_flavor_id', flavorId)
    .order('order_by', { ascending: true })

  if (stepsError) {
    await db.from('humor_flavors').delete().eq('id', newFlavor.id)
    return { error: 'Failed to fetch original steps' }
  }

  // Insert steps for new flavor
  if (steps && steps.length > 0) {
    const newSteps = steps.map((s) => ({
      humor_flavor_id: newFlavor.id,
      order_by: s.order_by,
      description: s.description,
      llm_temperature: s.llm_temperature,
      llm_system_prompt: s.llm_system_prompt,
      llm_user_prompt: s.llm_user_prompt,
      llm_model_id: s.llm_model_id,
      llm_input_type_id: s.llm_input_type_id,
      llm_output_type_id: s.llm_output_type_id,
      humor_flavor_step_type_id: s.humor_flavor_step_type_id,
    }))

    const { error: insertStepsError } = await db.from('humor_flavor_steps').insert(newSteps)

    if (insertStepsError) {
      await db.from('humor_flavors').delete().eq('id', newFlavor.id)
      return { error: 'Failed to copy steps' }
    }
  }

  revalidatePath('/admin/humor-flavors')
  revalidatePath('/admin/humor-flavor-steps')
  redirect('/admin/humor-flavors')
}

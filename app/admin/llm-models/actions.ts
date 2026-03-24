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
  return { userId: user.id }
}

export async function createLlmModel(formData: FormData) {
  const { userId } = await assertSuperadmin()
  const db = createAdminClient()
  await db.from('llm_models').insert({
    name: formData.get('name') as string,
    llm_provider_id: parseInt(formData.get('llm_provider_id') as string, 10),
    provider_model_id: formData.get('provider_model_id') as string,
    is_temperature_supported: formData.get('is_temperature_supported') === 'true',
    created_by_user_id: userId,
  })
  revalidatePath('/admin/llm-models')
  redirect('/admin/llm-models')
}

export async function updateLlmModel(formData: FormData) {
  const { userId } = await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db
    .from('llm_models')
    .update({
      name: formData.get('name') as string,
      llm_provider_id: parseInt(formData.get('llm_provider_id') as string, 10),
      provider_model_id: formData.get('provider_model_id') as string,
      is_temperature_supported: formData.get('is_temperature_supported') === 'true',
      modified_by_user_id: userId,
    })
    .eq('id', id)
  revalidatePath('/admin/llm-models')
  redirect('/admin/llm-models')
}

export async function deleteLlmModel(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('llm_models').delete().eq('id', id)
  revalidatePath('/admin/llm-models')
}

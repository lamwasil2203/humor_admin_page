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

export async function createLlmProvider(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  await db.from('llm_providers').insert({ name: formData.get('name') as string })
  revalidatePath('/admin/llm-providers')
  redirect('/admin/llm-providers')
}

export async function updateLlmProvider(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('llm_providers').update({ name: formData.get('name') as string }).eq('id', id)
  revalidatePath('/admin/llm-providers')
  redirect('/admin/llm-providers')
}

export async function deleteLlmProvider(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('llm_providers').delete().eq('id', id)
  revalidatePath('/admin/llm-providers')
}

'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function assertSuperadmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_superadmin').eq('id', user.id).single()
  if (!profile?.is_superadmin) redirect('/login?error=unauthorized')
}

export async function createTerm(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  await db.from('terms').insert({
    term: formData.get('term') as string,
    definition: formData.get('definition') as string,
    example: formData.get('example') as string,
    priority: parseInt(formData.get('priority') as string, 10) || 0,
  })
  revalidatePath('/admin/terms')
  redirect('/admin/terms')
}

export async function updateTerm(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('terms').update({
    term: formData.get('term') as string,
    definition: formData.get('definition') as string,
    example: formData.get('example') as string,
    priority: parseInt(formData.get('priority') as string, 10) || 0,
    modified_datetime_utc: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath('/admin/terms')
  redirect('/admin/terms')
}

export async function deleteTerm(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('terms').delete().eq('id', id)
  revalidatePath('/admin/terms')
}

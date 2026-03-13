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

export async function createCaptionExample(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  await db.from('caption_examples').insert({
    image_description: formData.get('image_description') as string,
    caption: formData.get('caption') as string,
    explanation: formData.get('explanation') as string,
    priority: parseInt(formData.get('priority') as string, 10) || 0,
    image_id: (formData.get('image_id') as string) || null,
  })
  revalidatePath('/admin/caption-examples')
  redirect('/admin/caption-examples')
}

export async function updateCaptionExample(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('caption_examples').update({
    image_description: formData.get('image_description') as string,
    caption: formData.get('caption') as string,
    explanation: formData.get('explanation') as string,
    priority: parseInt(formData.get('priority') as string, 10) || 0,
    image_id: (formData.get('image_id') as string) || null,
    modified_datetime_utc: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath('/admin/caption-examples')
  redirect('/admin/caption-examples')
}

export async function deleteCaptionExample(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('caption_examples').delete().eq('id', id)
  revalidatePath('/admin/caption-examples')
}

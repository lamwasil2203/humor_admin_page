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

export async function updateHumorMixEntry(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  const captionCount = parseInt(formData.get('caption_count') as string, 10)
  if (isNaN(captionCount) || captionCount < 0) return
  await db.from('humor_flavor_mix').update({ caption_count: captionCount }).eq('id', id)
  revalidatePath('/admin/humor-mix')
}

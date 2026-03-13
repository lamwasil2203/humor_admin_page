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

export async function createAllowedDomain(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  await db
    .from('allowed_signup_domains')
    .insert({ apex_domain: formData.get('apex_domain') as string })
  revalidatePath('/admin/allowed-signup-domains')
  redirect('/admin/allowed-signup-domains')
}

export async function updateAllowedDomain(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db
    .from('allowed_signup_domains')
    .update({ apex_domain: formData.get('apex_domain') as string })
    .eq('id', id)
  revalidatePath('/admin/allowed-signup-domains')
  redirect('/admin/allowed-signup-domains')
}

export async function deleteAllowedDomain(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('allowed_signup_domains').delete().eq('id', id)
  revalidatePath('/admin/allowed-signup-domains')
}

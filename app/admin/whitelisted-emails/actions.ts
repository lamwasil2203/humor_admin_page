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

export async function createWhitelistedEmail(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  await db
    .from('whitelist_email_addresses')
    .insert({ email_address: formData.get('email_address') as string })
  revalidatePath('/admin/whitelisted-emails')
  redirect('/admin/whitelisted-emails')
}

export async function updateWhitelistedEmail(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db
    .from('whitelist_email_addresses')
    .update({
      email_address: formData.get('email_address') as string,
      modified_datetime_utc: new Date().toISOString(),
    })
    .eq('id', id)
  revalidatePath('/admin/whitelisted-emails')
  redirect('/admin/whitelisted-emails')
}

export async function deleteWhitelistedEmail(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('whitelist_email_addresses').delete().eq('id', id)
  revalidatePath('/admin/whitelisted-emails')
}

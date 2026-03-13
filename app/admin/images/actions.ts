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
  return { userId: user.id }
}

async function resolveImageUrl(formData: FormData, db: ReturnType<typeof createAdminClient>): Promise<string | null> {
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`
    const bytes = await file.arrayBuffer()
    const { error } = await db.storage.from('images').upload(path, bytes, { contentType: file.type, upsert: false })
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data: { publicUrl } } = db.storage.from('images').getPublicUrl(path)
    return publicUrl
  }
  const url = (formData.get('url') as string)?.trim()
  return url || null
}

export async function createImage(formData: FormData) {
  const { userId } = await assertSuperadmin()
  const db = createAdminClient()
  const url = await resolveImageUrl(formData, db)

  await db.from('images').insert({
    url,
    image_description: (formData.get('image_description') as string) || null,
    is_public: formData.get('is_public') === 'true',
    is_common_use: formData.get('is_common_use') === 'true',
    additional_context: (formData.get('additional_context') as string) || null,
    profile_id: userId,
  })

  revalidatePath('/admin/images')
  redirect('/admin/images')
}

export async function updateImage(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  const url = await resolveImageUrl(formData, db)

  await db.from('images').update({
    url: url ?? undefined,
    image_description: (formData.get('image_description') as string) || null,
    is_public: formData.get('is_public') === 'true',
    is_common_use: formData.get('is_common_use') === 'true',
    additional_context: (formData.get('additional_context') as string) || null,
    modified_datetime_utc: new Date().toISOString(),
  }).eq('id', id)

  revalidatePath('/admin/images')
  redirect('/admin/images')
}

export async function deleteImage(formData: FormData) {
  await assertSuperadmin()
  const db = createAdminClient()
  const id = formData.get('id') as string
  await db.from('images').delete().eq('id', id)
  revalidatePath('/admin/images')
}

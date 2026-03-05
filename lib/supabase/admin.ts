import { createClient } from '@supabase/supabase-js'

// Server-only admin client. Uses service role key if set (bypasses RLS).
// Falls back to anon key — requires proper RLS policies for superadmins.
// Never import this in client components.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

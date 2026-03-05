import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavLink from './nav-link'
import LogoutButton from './logout-button'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin, first_name, last_name, email')
    .eq('id', user.id)
    .single()

  if (!profile?.is_superadmin) redirect('/login?error=unauthorized')

  const displayName = profile.first_name
    ? `${profile.first_name} ${profile.last_name ?? ''}`.trim()
    : (profile.email ?? user.email ?? 'Admin')

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800">
          <span className="font-bold text-white text-lg tracking-tight">Humor Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/users">Users</NavLink>
          <NavLink href="/admin/images">Images</NavLink>
          <NavLink href="/admin/captions">Captions</NavLink>
        </nav>
        <div className="px-4 py-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 truncate mb-2">{displayName}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

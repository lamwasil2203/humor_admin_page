import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavLink from './nav-link'
import LogoutButton from './logout-button'

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">{label}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('is_superadmin, first_name, last_name, email').eq('id', user.id).single()
  if (!profile?.is_superadmin) redirect('/login?error=unauthorized')
  const displayName = profile.first_name ? `${profile.first_name} ${profile.last_name ?? ''}`.trim() : (profile.email ?? user.email ?? 'Admin')

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <aside className="w-56 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <span className="font-bold text-white text-lg tracking-tight">Humor Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4">
          <NavSection label="Overview">
            <NavLink href="/admin">Dashboard</NavLink>
          </NavSection>
          <NavSection label="Content">
            <NavLink href="/admin/users">Users</NavLink>
            <NavLink href="/admin/images">Images</NavLink>
            <NavLink href="/admin/captions">Captions</NavLink>
            <NavLink href="/admin/caption-requests">Caption Requests</NavLink>
            <NavLink href="/admin/caption-examples">Caption Examples</NavLink>
          </NavSection>
          <NavSection label="Humor">
            <NavLink href="/admin/humor-flavors">Flavors</NavLink>
            <NavLink href="/admin/humor-flavor-steps">Flavor Steps</NavLink>
            <NavLink href="/admin/humor-mix">Humor Mix</NavLink>
          </NavSection>
          <NavSection label="Vocabulary">
            <NavLink href="/admin/terms">Terms</NavLink>
          </NavSection>
          <NavSection label="LLM">
            <NavLink href="/admin/llm-providers">Providers</NavLink>
            <NavLink href="/admin/llm-models">Models</NavLink>
            <NavLink href="/admin/llm-prompt-chains">Prompt Chains</NavLink>
            <NavLink href="/admin/llm-responses">Responses</NavLink>
          </NavSection>
          <NavSection label="Access">
            <NavLink href="/admin/allowed-signup-domains">Signup Domains</NavLink>
            <NavLink href="/admin/whitelisted-emails">Whitelisted Emails</NavLink>
          </NavSection>
        </nav>
        <div className="px-4 py-3 border-t border-slate-800 flex-shrink-0">
          <p className="text-xs text-slate-500 truncate mb-2">{displayName}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NavLink from './nav-link'
import LogoutButton from './logout-button'

function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="px-3 mb-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-700">{label}</p>
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
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-52 flex-shrink-0 bg-zinc-950 border-r border-zinc-800/60 flex flex-col overflow-y-auto">
        <div className="px-5 py-5 border-b border-zinc-800/60 flex-shrink-0">
          <span className="text-sm font-medium text-zinc-100 tracking-tight">Humor Admin</span>
        </div>
        <nav className="flex-1 px-3 py-5">
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
        <div className="px-4 py-4 border-t border-zinc-800/60 flex-shrink-0">
          <p className="text-xs text-zinc-600 truncate mb-2">{displayName}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-zinc-950">{children}</main>
    </div>
  )
}

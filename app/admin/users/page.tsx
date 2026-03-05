import { createAdminClient } from '@/lib/supabase/admin'
import SearchInput from '../search-input'

function Badge({
  children,
  color,
}: {
  children: React.ReactNode
  color: 'indigo' | 'violet' | 'emerald' | 'amber'
}) {
  const colors = {
    indigo: 'bg-indigo-900/50 text-indigo-300',
    violet: 'bg-violet-900/50 text-violet-300',
    emerald: 'bg-emerald-900/50 text-emerald-300',
    amber: 'bg-amber-900/50 text-amber-300',
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let query = db
    .from('profiles')
    .select(
      'id, first_name, last_name, email, is_superadmin, is_in_study, is_matrix_admin, created_datetime_utc'
    )
    .order('created_datetime_utc', { ascending: false })

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`
    )
  }

  const { data: users } = await query

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">
            {q ? (
              <>
                <span className="text-slate-300">{users?.length ?? 0}</span> results for{' '}
                <span className="text-indigo-400">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              `${users?.length ?? 0} profiles`
            )}
          </p>
        </div>
        <SearchInput placeholder="Search by name or email…" />
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-6 py-3">
                Name
              </th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-6 py-3">
                Email
              </th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-6 py-3">
                Roles
              </th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-6 py-3">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(users ?? []).map((u) => (
              <tr key={u.id} className="hover:bg-slate-700/30">
                <td className="px-6 py-4">
                  <span className="text-slate-200 text-sm">
                    {u.first_name
                      ? `${u.first_name} ${u.last_name ?? ''}`.trim()
                      : <span className="text-slate-500">—</span>}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{u.email ?? '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {u.is_superadmin && <Badge color="indigo">Superadmin</Badge>}
                    {u.is_matrix_admin && <Badge color="violet">Matrix Admin</Badge>}
                    {u.is_in_study && <Badge color="emerald">Study</Badge>}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {u.created_datetime_utc
                    ? new Date(u.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            ))}
            {(users ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                  {q ? `No users match "${q}"` : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

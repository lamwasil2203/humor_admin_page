import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteAllowedDomainButton } from './delete-button'

export default async function AllowedSignupDomainsPage() {
  const db = createAdminClient()
  const { data: domains } = await db
    .from('allowed_signup_domains')
    .select('id, apex_domain, created_datetime_utc')
    .order('apex_domain', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Allowed Signup Domains</h1>
          <p className="text-slate-400 text-sm mt-1">{domains?.length ?? 0} domains</p>
        </div>
        <Link
          href="/admin/allowed-signup-domains/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap"
        >
          + Add Domain
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">
                Domain
              </th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">
                Added
              </th>
              <th className="text-right text-xs text-slate-400 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(domains ?? []).map((d) => (
              <tr key={d.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3">
                  <span className="text-slate-200 text-sm font-mono">{d.apex_domain}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm">
                  {d.created_datetime_utc
                    ? new Date(d.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/allowed-signup-domains/${d.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteAllowedDomainButton id={d.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(domains ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                  No domains configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

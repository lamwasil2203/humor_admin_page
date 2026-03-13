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
          <h1 className="text-lg font-medium text-zinc-100">Allowed Signup Domains</h1>
          <p className="text-zinc-500 text-sm mt-1">{domains?.length ?? 0} domains</p>
        </div>
        <Link
          href="/admin/allowed-signup-domains/new"
          className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
        >
          + Add Domain
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Domain
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Added
              </th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(domains ?? []).map((d) => (
              <tr key={d.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3">
                  <span className="text-zinc-200 text-sm font-mono">{d.apex_domain}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm">
                  {d.created_datetime_utc
                    ? new Date(d.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/allowed-signup-domains/${d.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
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
                <td colSpan={3} className="px-6 py-10 text-center text-zinc-500">
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

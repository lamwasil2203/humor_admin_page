import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteWhitelistedEmailButton } from './delete-button'
import SearchInput from '../search-input'

export default async function WhitelistedEmailsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let query = db
    .from('whitelist_email_addresses')
    .select('id, email_address, created_datetime_utc')
    .order('email_address', { ascending: true })

  if (q) {
    query = query.ilike('email_address', `%${q}%`)
  }

  const { data: emails } = await query

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Whitelisted Emails</h1>
          <p className="text-slate-400 text-sm mt-1">
            {q ? (
              <>
                <span className="text-slate-300">{emails?.length ?? 0}</span> results for{' '}
                <span className="text-indigo-400">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              `${emails?.length ?? 0} addresses`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search emails…" />
          <Link
            href="/admin/whitelisted-emails/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            + Add Email
          </Link>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">
                Email Address
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
            {(emails ?? []).map((e) => (
              <tr key={e.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-slate-200 text-sm">{e.email_address}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">
                  {e.created_datetime_utc
                    ? new Date(e.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/whitelisted-emails/${e.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteWhitelistedEmailButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(emails ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                  {q ? `No emails match "${q}"` : 'No whitelisted emails.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

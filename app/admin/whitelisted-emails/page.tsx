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
          <h1 className="text-lg font-medium text-zinc-100">Whitelisted Emails</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {q ? (
              <>
                <span className="text-zinc-300">{emails?.length ?? 0}</span> results for{' '}
                <span className="text-zinc-400">&ldquo;{q}&rdquo;</span>
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
            className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
          >
            + Add Email
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Email Address
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
            {(emails ?? []).map((e) => (
              <tr key={e.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-200 text-sm">{e.email_address}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm">
                  {e.created_datetime_utc
                    ? new Date(e.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/whitelisted-emails/${e.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
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
                <td colSpan={3} className="px-6 py-10 text-center text-zinc-500">
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

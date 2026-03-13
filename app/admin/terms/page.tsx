import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteTermButton } from './delete-button'
import SearchInput from '../search-input'

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let query = db
    .from('terms')
    .select('id, term, definition, example, priority, created_datetime_utc')
    .order('priority', { ascending: false })
    .order('term', { ascending: true })

  if (q) {
    query = query.or(`term.ilike.%${q}%,definition.ilike.%${q}%`)
  }

  const { data: terms } = await query

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-zinc-100">Terms</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {q ? (
              <><span className="text-zinc-300">{terms?.length ?? 0}</span> results for <span className="text-zinc-400">&ldquo;{q}&rdquo;</span></>
            ) : (
              `${terms?.length ?? 0} terms`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search terms…" />
          <Link href="/admin/terms/new" className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap">+ New Term</Link>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Term</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Definition</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Example</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Priority</th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(terms ?? []).map((t) => (
              <tr key={t.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-200 text-sm font-medium whitespace-nowrap">{t.term}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm max-w-xs"><p className="line-clamp-2">{t.definition}</p></td>
                <td className="px-4 py-3 text-zinc-500 text-sm max-w-xs"><p className="line-clamp-2 italic">{t.example}</p></td>
                <td className="px-4 py-3 text-zinc-500 text-sm">{t.priority}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link href={`/admin/terms/${t.id}/edit`} className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors">Edit</Link>
                    <DeleteTermButton id={t.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(terms ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-500">{q ? `No terms match "${q}"` : 'No terms found.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

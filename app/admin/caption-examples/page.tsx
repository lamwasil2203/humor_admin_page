import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteCaptionExampleButton } from './delete-button'
import SearchInput from '../search-input'

export default async function CaptionExamplesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let query = db
    .from('caption_examples')
    .select('id, image_description, caption, explanation, priority, created_datetime_utc')
    .order('priority', { ascending: false })
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  if (q) {
    query = query.or(`caption.ilike.%${q}%,image_description.ilike.%${q}%`)
  }

  const { data: examples } = await query

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Caption Examples</h1>
          <p className="text-slate-400 text-sm mt-1">
            {q ? (
              <>
                <span className="text-slate-300">{examples?.length ?? 0}</span> results for{' '}
                <span className="text-indigo-400">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              `${examples?.length ?? 0} examples`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search captions or descriptions…" />
          <Link
            href="/admin/caption-examples/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            + New Example
          </Link>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Caption</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Image Description</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Explanation</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Priority</th>
              <th className="text-right text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(examples ?? []).map((e) => (
              <tr key={e.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-slate-200 text-sm max-w-xs">
                  <p className="line-clamp-2">{e.caption}</p>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm max-w-xs">
                  <p className="line-clamp-2">{e.image_description}</p>
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm max-w-xs">
                  <p className="line-clamp-2">{e.explanation}</p>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">{e.priority}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/caption-examples/${e.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteCaptionExampleButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(examples ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  {q ? `No examples match "${q}"` : 'No caption examples found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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
          <h1 className="text-lg font-medium text-zinc-100">Caption Examples</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {q ? (
              <>
                <span className="text-zinc-300">{examples?.length ?? 0}</span> results for{' '}
                <span className="text-zinc-400">&ldquo;{q}&rdquo;</span>
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
            className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
          >
            + New Example
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Caption</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Image Description</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Explanation</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Priority</th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(examples ?? []).map((e) => (
              <tr key={e.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-200 text-sm max-w-xs">
                  <p className="line-clamp-2">{e.caption}</p>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm max-w-xs">
                  <p className="line-clamp-2">{e.image_description}</p>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm max-w-xs">
                  <p className="line-clamp-2">{e.explanation}</p>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm">{e.priority}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/caption-examples/${e.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
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
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
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

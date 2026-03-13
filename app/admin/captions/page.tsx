import { createAdminClient } from '@/lib/supabase/admin'
import SearchInput from '../search-input'

type CaptionRow = {
  id: string
  content: string | null
  like_count: number | null
  is_public: boolean
  is_featured: boolean
  created_datetime_utc: string | null
  profiles: { first_name: string | null; last_name: string | null; email: string | null } | null
  humor_flavors: { slug: string } | null
}

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let query = db
    .from('captions')
    .select(
      'id, content, like_count, is_public, is_featured, created_datetime_utc, profiles(first_name, last_name, email), humor_flavors(slug)'
    )
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  if (q) {
    query = query.ilike('content', `%${q}%`)
  }

  const { data: rawCaptions } = await query
  const captions = (rawCaptions ?? []) as unknown as CaptionRow[]

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-zinc-100">Captions</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {q ? (
              <>
                <span className="text-zinc-300">{captions.length}</span> results for{' '}
                <span className="text-zinc-400">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              `${captions.length} captions (latest 200)`
            )}
          </p>
        </div>
        <SearchInput placeholder="Search caption text…" />
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Caption
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Author
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Flavor
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                ❤️
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {captions.map((c) => {
              const p = c.profiles
              const author = p?.first_name
                ? `${p.first_name} ${p.last_name ?? ''}`.trim()
                : (p?.email ?? '—')
              return (
                <tr key={c.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 max-w-sm">
                    <p className="text-zinc-200 text-sm line-clamp-2">
                      {c.content ?? <span className="text-zinc-600">(empty)</span>}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">{author}</td>
                  <td className="px-4 py-3">
                    {c.humor_flavors?.slug && (
                      <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 whitespace-nowrap">
                        {c.humor_flavors.slug}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium w-fit ${
                          c.is_public
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {c.is_public ? 'Public' : 'Private'}
                      </span>
                      {c.is_featured && (
                        <span className="text-xs px-2 py-0.5 rounded font-medium bg-zinc-800 text-zinc-300 w-fit">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-rose-400 text-sm font-medium">
                    {c.like_count ?? 0}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                    {c.created_datetime_utc
                      ? new Date(c.created_datetime_utc).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              )
            })}
            {captions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                  {q ? `No captions match "${q}"` : 'No captions found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

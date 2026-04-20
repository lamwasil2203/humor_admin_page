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
  caption_votes: Array<{ count: number }>
}

type VoteRow = {
  vote_value: number
  caption_id: string
}

export default async function CaptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let captionQuery = db
    .from('captions')
    .select(
      'id, content, like_count, is_public, is_featured, created_datetime_utc, profiles!profile_id(first_name, last_name, email), humor_flavors(slug), caption_votes(count)'
    )
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  if (q) {
    captionQuery = captionQuery.ilike('content', `%${q}%`)
  }

  const [captionResult, votesResult, { count: totalCaptionCount }] = await Promise.all([
    captionQuery,
    db.from('caption_votes').select('vote_value, caption_id').limit(50000),
    db.from('captions').select('*', { count: 'exact', head: true }),
  ])

  const captions = (captionResult.data ?? []) as unknown as CaptionRow[]
  const voteData = (votesResult.data ?? []) as unknown as VoteRow[]

  // Aggregate rating stats
  const totalVotes = voteData.length
  const captionsRated = new Set(voteData.map((v) => v.caption_id)).size
  const avgVote =
    totalVotes > 0
      ? (voteData.reduce((s, v) => s + (v.vote_value ?? 0), 0) / totalVotes).toFixed(1)
      : '—'
  const pctRated =
    (totalCaptionCount ?? 0) > 0
      ? Math.round((captionsRated / (totalCaptionCount ?? 1)) * 100)
      : 0

  // Vote distribution
  const dist: Record<number, number> = {}
  for (const v of voteData) {
    dist[v.vote_value] = (dist[v.vote_value] ?? 0) + 1
  }
  const sortedVals = Object.keys(dist).map(Number).sort((a, b) => a - b)
  const maxDist = Math.max(...Object.values(dist), 1)

  // Per-caption vote count map
  const voteCountMap = new Map<string, number>()
  for (const v of voteData) {
    voteCountMap.set(v.caption_id, (voteCountMap.get(v.caption_id) ?? 0) + 1)
  }

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

      {/* Rating Statistics */}
      {totalVotes > 0 && (
        <div className="mb-6">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 font-medium">
            Rating Activity
          </p>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-medium">
                Total Ratings
              </p>
              <p className="text-2xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                {totalVotes.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-medium">
                Captions Rated
              </p>
              <p className="text-2xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                {captionsRated.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 mt-1">{pctRated}% of all captions</p>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-medium">
                Avg Rating
              </p>
              <p className="text-2xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
                {avgVote}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-medium">
                Distribution
              </p>
              {sortedVals.length === 0 ? (
                <p className="text-zinc-700 text-xs">No data</p>
              ) : (
                <div className="space-y-1.5 mt-1">
                  {sortedVals.map((val) => (
                    <div key={val} className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-4 text-right tabular-nums flex-shrink-0">
                        {val}
                      </span>
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-zinc-300 to-zinc-600 rounded-full"
                          style={{ width: `${((dist[val] ?? 0) / maxDist) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-600 tabular-nums flex-shrink-0">
                        {dist[val]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                Ratings
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
              const ratings = c.caption_votes?.[0]?.count ?? 0
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
                  <td className="px-4 py-3 text-zinc-400 text-sm font-medium">
                    {ratings > 0 ? ratings : <span className="text-zinc-700">—</span>}
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
                <td colSpan={7} className="px-6 py-10 text-center text-zinc-500">
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

import { createAdminClient } from '@/lib/supabase/admin'

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="group rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-5 hover:border-zinc-700/80 hover:bg-zinc-900/60 transition-all duration-300 cursor-default">
      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3 font-medium">{label}</p>
      <p className="text-2xl font-bold tracking-tight bg-gradient-to-b from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
        {value}
      </p>
      {sub && <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{sub}</p>}
    </div>
  )
}

type FlavorRow = { slug: string; captions: Array<{ count: number }> }
type CaptionRow = {
  content: string | null
  like_count: number | null
  profiles: { first_name: string | null; last_name: string | null; email: string | null } | null
}

export default async function AdminDashboard() {
  const db = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalImages },
    { count: publicImages },
    { count: commonUseImages },
    { count: totalCaptions },
    { count: publicCaptions },
    { count: featuredCaptions },
    { count: totalRequests },
    { count: totalLikes },
    { count: totalSaves },
    { count: totalShares },
    { count: bugReports },
    { data: rawTopCaptions },
    { data: rawFlavors },
  ] = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('images').select('*', { count: 'exact', head: true }),
    db.from('images').select('*', { count: 'exact', head: true }).eq('is_public', true),
    db.from('images').select('*', { count: 'exact', head: true }).eq('is_common_use', true),
    db.from('captions').select('*', { count: 'exact', head: true }),
    db.from('captions').select('*', { count: 'exact', head: true }).eq('is_public', true),
    db.from('captions').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    db.from('caption_requests').select('*', { count: 'exact', head: true }),
    db.from('caption_likes').select('*', { count: 'exact', head: true }),
    db.from('caption_saved').select('*', { count: 'exact', head: true }),
    db.from('shares').select('*', { count: 'exact', head: true }),
    db.from('bug_reports').select('*', { count: 'exact', head: true }),
    db
      .from('captions')
      .select('content, like_count, profiles(first_name, last_name, email)')
      .order('like_count', { ascending: false })
      .limit(5),
    db.from('humor_flavors').select('slug, captions(count)'),
  ])

  const tc = totalCaptions ?? 0
  const tl = totalLikes ?? 0
  const tr = totalRequests ?? 0
  const captionEfficiency = tr > 0 ? (tc / tr).toFixed(2) : '—'

  const topCaptions = (rawTopCaptions ?? []) as unknown as CaptionRow[]

  const flavors = ((rawFlavors ?? []) as unknown as FlavorRow[])
    .map((f) => ({ slug: f.slug, count: f.captions?.[0]?.count ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const maxFlavorCount = Math.max(...flavors.map((f) => f.count), 1)

  return (
    <div className="relative min-h-full">
      {/* Ambient background glow */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-white/[0.025] to-transparent pointer-events-none" />
      <div className="absolute top-32 left-1/4 w-72 h-72 bg-white/[0.012] rounded-full blur-3xl pointer-events-none" />

      <div className="relative p-10 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Dashboard</h1>
            <span className="text-xs text-zinc-700">Humor Project</span>
          </div>
          <p className="text-sm text-zinc-500 mt-0.5">Platform overview</p>
          <div className="mt-5 h-px bg-gradient-to-r from-zinc-700 via-zinc-700/40 to-transparent" />
        </div>

        {/* Primary stats */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          <StatCard label="Users" value={(totalUsers ?? 0).toLocaleString()} />
          <StatCard
            label="Images"
            value={(totalImages ?? 0).toLocaleString()}
            sub={`${publicImages ?? 0} public · ${commonUseImages ?? 0} common use`}
          />
          <StatCard
            label="Captions"
            value={tc.toLocaleString()}
            sub={`${publicCaptions ?? 0} public · ${featuredCaptions ?? 0} featured`}
          />
          <StatCard
            label="Caption Requests"
            value={tr.toLocaleString()}
            sub={`${captionEfficiency}× captions per request`}
          />
        </div>

        {/* Row divider */}
        <div className="my-3 h-px bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent" />

        {/* Engagement stats */}
        <div className="grid grid-cols-4 gap-3 mb-10">
          <StatCard label="Likes" value={tl.toLocaleString()} />
          <StatCard label="Saves" value={(totalSaves ?? 0).toLocaleString()} />
          <StatCard label="Shares" value={(totalShares ?? 0).toLocaleString()} />
          <StatCard label="Bug Reports" value={(bugReports ?? 0).toLocaleString()} />
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-2 gap-5">
          {/* Top Captions */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 hover:border-zinc-700/60 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-medium text-zinc-200 tracking-tight">Top Captions</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
            {topCaptions.length === 0 ? (
              <p className="text-zinc-700 text-sm">No captions yet.</p>
            ) : (
              <div className="space-y-5">
                {topCaptions.map((c, i) => {
                  const p = c.profiles
                  const author = p?.first_name
                    ? `${p.first_name} ${p.last_name ?? ''}`.trim()
                    : (p?.email ?? 'Unknown')
                  const rankColor =
                    i === 0
                      ? 'text-zinc-100'
                      : i === 1
                      ? 'text-zinc-400'
                      : i === 2
                      ? 'text-zinc-500'
                      : 'text-zinc-700'
                  return (
                    <div key={i} className="flex gap-3 items-start group/caption">
                      <span className={`text-xs w-4 flex-shrink-0 pt-0.5 tabular-nums font-semibold ${rankColor}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed group-hover/caption:text-zinc-300 transition-colors">
                          {c.content ?? '(no content)'}
                        </p>
                        <p className="text-xs text-zinc-700 mt-0.5">{author}</p>
                      </div>
                      <span className="text-xs text-zinc-600 flex-shrink-0 tabular-nums">
                        {c.like_count ?? 0}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Flavor Distribution */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 hover:border-zinc-700/60 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-medium text-zinc-200 tracking-tight">Flavor Distribution</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
            </div>
            {flavors.length === 0 ? (
              <p className="text-zinc-700 text-sm">No flavor data yet.</p>
            ) : (
              <div className="space-y-4">
                {flavors.map((f) => (
                  <div key={f.slug} className="group/bar">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400 group-hover/bar:text-zinc-300 transition-colors">{f.slug}</span>
                      <span className="text-zinc-700 tabular-nums">{f.count}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 bg-gradient-to-r from-zinc-200 to-zinc-600 rounded-full"
                        style={{
                          width: `${Math.max((f.count / maxFlavorCount) * 100, f.count > 0 ? 3 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

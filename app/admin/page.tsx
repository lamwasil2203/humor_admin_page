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
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5">
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100">{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-1.5">{sub}</p>}
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
    <div className="p-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-lg font-medium text-zinc-100 tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Platform overview</p>
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
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-6">
          <h2 className="text-sm font-medium text-zinc-300 mb-5">Top Captions</h2>
          {topCaptions.length === 0 ? (
            <p className="text-zinc-600 text-sm">No captions yet.</p>
          ) : (
            <div className="space-y-4">
              {topCaptions.map((c, i) => {
                const p = c.profiles
                const author = p?.first_name
                  ? `${p.first_name} ${p.last_name ?? ''}`.trim()
                  : (p?.email ?? 'Unknown')
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-xs text-zinc-600 w-4 flex-shrink-0 pt-0.5 tabular-nums">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                        {c.content ?? '(no content)'}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">{author}</p>
                    </div>
                    <span className="text-xs text-zinc-500 flex-shrink-0 tabular-nums">
                      {c.like_count ?? 0} likes
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Humor Flavor DNA */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-6">
          <h2 className="text-sm font-medium text-zinc-300 mb-5">Flavor Distribution</h2>
          {flavors.length === 0 ? (
            <p className="text-zinc-600 text-sm">No flavor data yet.</p>
          ) : (
            <div className="space-y-3.5">
              {flavors.map((f) => (
                <div key={f.slug}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">{f.slug}</span>
                    <span className="text-zinc-600 tabular-nums">{f.count}</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-1 bg-zinc-400 rounded-full"
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
  )
}

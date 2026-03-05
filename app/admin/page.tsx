import { createAdminClient } from '@/lib/supabase/admin'

function StatCard({
  label,
  value,
  sub,
  accent = 'indigo',
}: {
  label: string
  value: string | number
  sub?: string
  accent?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet'
}) {
  const borders = {
    indigo: 'border-indigo-500',
    emerald: 'border-emerald-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500',
    sky: 'border-sky-500',
    violet: 'border-violet-500',
  }
  return (
    <div className={`bg-slate-800 rounded-xl p-5 border-l-4 ${borders[accent]}`}>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )
}

function BigMetric({
  value,
  label,
  sub,
  color,
}: {
  value: string | number
  label: string
  sub: string
  color: string
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-5 text-center">
      <div className={`text-5xl font-black mb-1 ${color}`}>{value}</div>
      <div className="text-slate-300 font-medium text-sm">{label}</div>
      <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
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
  const ts = totalSaves ?? 0
  const tr = totalRequests ?? 0

  const humorQuotient = tc > 0 ? Math.round(((publicCaptions ?? 0) / tc) * 100) : 0
  const featuredRate = tc > 0 ? Math.round(((featuredCaptions ?? 0) / tc) * 100) : 0
  const avgLikes = tc > 0 ? (tl / tc).toFixed(1) : '0'
  const collectorIndex = tl > 0 ? Math.round((ts / tl) * 100) : 0
  const captionEfficiency = tr > 0 ? (tc / tr).toFixed(2) : '—'

  const topCaptions = (rawTopCaptions ?? []) as unknown as CaptionRow[]

  const flavors = ((rawFlavors ?? []) as unknown as FlavorRow[])
    .map((f) => ({ slug: f.slug, count: f.captions?.[0]?.count ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const maxFlavorCount = Math.max(...flavors.map((f) => f.count), 1)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Humor Pulse</h1>
        <p className="text-slate-400 text-sm mt-1">Platform overview &amp; engagement analytics</p>
      </div>

      {/* Core counts */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Users" value={totalUsers ?? 0} accent="indigo" />
        <StatCard
          label="Images"
          value={totalImages ?? 0}
          sub={`${publicImages ?? 0} public · ${commonUseImages ?? 0} common use`}
          accent="sky"
        />
        <StatCard
          label="Captions"
          value={tc}
          sub={`${publicCaptions ?? 0} public · ${featuredCaptions ?? 0} featured`}
          accent="emerald"
        />
        <StatCard
          label="Caption Requests"
          value={tr}
          sub={`${captionEfficiency}× captions/request`}
          accent="amber"
        />
      </div>

      {/* Engagement counts */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="❤️ Total Likes" value={tl.toLocaleString()} accent="rose" />
        <StatCard label="🔖 Total Saves" value={(totalSaves ?? 0).toLocaleString()} accent="violet" />
        <StatCard label="📤 Total Shares" value={(totalShares ?? 0).toLocaleString()} accent="sky" />
        <StatCard label="🐛 Bug Reports" value={bugReports ?? 0} accent="amber" />
      </div>

      {/* Derived metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <BigMetric
          value={`${humorQuotient}%`}
          label="Humor Quotient"
          sub="captions made public"
          color="text-indigo-400"
        />
        <BigMetric
          value={avgLikes}
          label="Avg Likes / Caption"
          sub="engagement rate"
          color="text-rose-400"
        />
        <BigMetric
          value={`${featuredRate}%`}
          label="Featured Rate"
          sub="of all captions"
          color="text-amber-400"
        />
        <BigMetric
          value={`${collectorIndex}%`}
          label="Collector Index"
          sub="saves per like"
          color="text-violet-400"
        />
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-2 gap-6">
        {/* Hall of Fame */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">🏆 Caption Hall of Fame</h2>
          {topCaptions.length === 0 && (
            <p className="text-slate-500 text-sm">No captions yet.</p>
          )}
          <div className="space-y-4">
            {topCaptions.map((c, i) => {
              const p = c.profiles
              const author = p?.first_name
                ? `${p.first_name} ${p.last_name ?? ''}`.trim()
                : (p?.email ?? 'Unknown')
              const medal =
                i === 0
                  ? 'text-amber-400'
                  : i === 1
                  ? 'text-slate-300'
                  : i === 2
                  ? 'text-amber-600'
                  : 'text-slate-600'
              return (
                <div key={i} className="flex gap-3 items-start">
                  <span className={`text-lg font-black w-5 flex-shrink-0 ${medal}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm line-clamp-2">
                      {c.content ?? '(no content)'}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">{author}</p>
                  </div>
                  <span className="text-rose-400 text-sm font-bold flex-shrink-0">
                    ❤️ {c.like_count ?? 0}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Humor Flavor DNA */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">🧬 Humor Flavor DNA</h2>
          {flavors.length === 0 && (
            <p className="text-slate-500 text-sm">No flavor data yet.</p>
          )}
          <div className="space-y-3">
            {flavors.map((f) => (
              <div key={f.slug}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{f.slug}</span>
                  <span className="text-slate-500">{f.count} captions</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{
                      width: `${Math.max((f.count / maxFlavorCount) * 100, f.count > 0 ? 3 : 0)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

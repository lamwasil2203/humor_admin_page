import { createAdminClient } from '@/lib/supabase/admin'
import { updateHumorMixEntry } from './actions'

type MixRow = {
  id: number
  caption_count: number
  created_datetime_utc: string | null
  humor_flavors: { slug: string; description: string | null } | null
}

const inputClass = 'bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-20 text-center'

export default async function HumorMixPage() {
  const db = createAdminClient()
  const { data: rawMix } = await db
    .from('humor_flavor_mix')
    .select('id, caption_count, created_datetime_utc, humor_flavors(slug, description)')
    .order('id', { ascending: true })

  const mix = (rawMix ?? []) as unknown as MixRow[]
  const total = mix.reduce((sum, m) => sum + (m.caption_count ?? 0), 0)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Humor Mix</h1>
        <p className="text-slate-400 text-sm mt-1">{mix.length} entries · {total} total captions</p>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Flavor</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Description</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Caption Count</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Share</th>
              <th className="text-right text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {mix.map((m) => (
              <tr key={m.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 font-mono">
                    {m.humor_flavors?.slug ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm max-w-xs">
                  <p className="line-clamp-1">{m.humor_flavors?.description ?? '—'}</p>
                </td>
                <td className="px-4 py-3 text-slate-200 text-sm font-semibold">{m.caption_count}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">
                  {total > 0 ? `${Math.round((m.caption_count / total) * 100)}%` : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={updateHumorMixEntry} className="flex items-center gap-2 justify-end">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="number" name="caption_count" defaultValue={m.caption_count} min={0} className={inputClass} />
                    <button type="submit" className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-500 transition-colors whitespace-nowrap">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {mix.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No humor mix entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

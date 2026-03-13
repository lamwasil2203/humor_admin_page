import { createAdminClient } from '@/lib/supabase/admin'
import { updateHumorMixEntry } from './actions'

type MixRow = {
  id: number
  caption_count: number
  created_datetime_utc: string | null
  humor_flavors: { slug: string; description: string | null } | null
}

const inputClass = 'bg-zinc-800 border border-zinc-800 rounded px-2 py-1 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm w-20 text-center'

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
        <h1 className="text-lg font-medium text-zinc-100">Humor Mix</h1>
        <p className="text-zinc-500 text-sm mt-1">{mix.length} entries · {total} total captions</p>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Flavor</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Description</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Caption Count</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Share</th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {mix.map((m) => (
              <tr key={m.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                    {m.humor_flavors?.slug ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm max-w-xs">
                  <p className="line-clamp-1">{m.humor_flavors?.description ?? '—'}</p>
                </td>
                <td className="px-4 py-3 text-zinc-200 text-sm font-semibold">{m.caption_count}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm">
                  {total > 0 ? `${Math.round((m.caption_count / total) * 100)}%` : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={updateHumorMixEntry} className="flex items-center gap-2 justify-end">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="number" name="caption_count" defaultValue={m.caption_count} min={0} className={inputClass} />
                    <button type="submit" className="px-3 py-1 bg-zinc-800 text-zinc-100 text-xs font-medium rounded hover:bg-zinc-700 transition-colors whitespace-nowrap">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {mix.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-500">No humor mix entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

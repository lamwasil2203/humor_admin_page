import { createAdminClient } from '@/lib/supabase/admin'

export default async function HumorFlavorsPage() {
  const db = createAdminClient()
  const { data: flavors } = await db
    .from('humor_flavors')
    .select('id, slug, description, created_datetime_utc')
    .order('id', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Humor Flavors</h1>
        <p className="text-slate-400 text-sm mt-1">{flavors?.length ?? 0} flavors</p>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Slug</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Description</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(flavors ?? []).map((f) => (
              <tr key={f.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-slate-500 text-sm font-mono">{f.id}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 font-mono">{f.slug}</span>
                </td>
                <td className="px-4 py-3 text-slate-300 text-sm max-w-md">
                  <p className="line-clamp-2">{f.description ?? <span className="text-slate-600">—</span>}</p>
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                  {f.created_datetime_utc ? new Date(f.created_datetime_utc).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
            {(flavors ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-500">No humor flavors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

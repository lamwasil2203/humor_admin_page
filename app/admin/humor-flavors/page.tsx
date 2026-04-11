import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function HumorFlavorsPage() {
  const db = createAdminClient()
  const { data: flavors } = await db
    .from('humor_flavors')
    .select('id, slug, description, created_datetime_utc')
    .order('id', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">Humor Flavors</h1>
        <p className="text-zinc-500 text-sm mt-1">{flavors?.length ?? 0} flavors</p>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Slug</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Description</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Created</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(flavors ?? []).map((f) => (
              <tr key={f.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-500 text-sm font-mono">{f.id}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">{f.slug}</span>
                </td>
                <td className="px-4 py-3 text-zinc-300 text-sm max-w-md">
                  <p className="line-clamp-2">{f.description ?? <span className="text-zinc-600">—</span>}</p>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                  {f.created_datetime_utc ? new Date(f.created_datetime_utc).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/humor-flavors/${f.id}/duplicate`}
                    className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
                  >
                    Duplicate
                  </Link>
                </td>
              </tr>
            ))}
            {(flavors ?? []).length === 0 && (
              <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-500">No humor flavors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

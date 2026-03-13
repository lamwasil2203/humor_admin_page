import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteLlmProviderButton } from './delete-button'

export default async function LlmProvidersPage() {
  const db = createAdminClient()
  const { data: providers } = await db
    .from('llm_providers')
    .select('id, name, created_datetime_utc')
    .order('id', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-zinc-100">LLM Providers</h1>
          <p className="text-zinc-500 text-sm mt-1">{providers?.length ?? 0} providers</p>
        </div>
        <Link
          href="/admin/llm-providers/new"
          className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
        >
          + New Provider
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Created</th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {(providers ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-500 text-sm font-mono">{p.id}</td>
                <td className="px-4 py-3 text-zinc-200 text-sm font-medium">{p.name}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm">
                  {p.created_datetime_utc
                    ? new Date(p.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/llm-providers/${p.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteLlmProviderButton id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
            {(providers ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  No providers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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
          <h1 className="text-2xl font-bold text-white">LLM Providers</h1>
          <p className="text-slate-400 text-sm mt-1">{providers?.length ?? 0} providers</p>
        </div>
        <Link
          href="/admin/llm-providers/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
        >
          + New Provider
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Created</th>
              <th className="text-right text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {(providers ?? []).map((p) => (
              <tr key={p.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-slate-500 text-sm font-mono">{p.id}</td>
                <td className="px-4 py-3 text-slate-200 text-sm font-medium">{p.name}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">
                  {p.created_datetime_utc
                    ? new Date(p.created_datetime_utc).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/llm-providers/${p.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
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
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
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

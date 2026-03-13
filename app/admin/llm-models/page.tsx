import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteLlmModelButton } from './delete-button'

type ModelRow = {
  id: number
  name: string
  provider_model_id: string
  is_temperature_supported: boolean
  created_datetime_utc: string | null
  llm_providers: { name: string } | null
}

export default async function LlmModelsPage() {
  const db = createAdminClient()
  const { data: rawModels } = await db
    .from('llm_models')
    .select(
      'id, name, provider_model_id, is_temperature_supported, created_datetime_utc, llm_providers(name)'
    )
    .order('id', { ascending: true })

  const models = (rawModels ?? []) as unknown as ModelRow[]

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">LLM Models</h1>
          <p className="text-slate-400 text-sm mt-1">{models.length} models</p>
        </div>
        <Link
          href="/admin/llm-models/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
        >
          + New Model
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Provider</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Model ID</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Temperature</th>
              <th className="text-right text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {models.map((m) => (
              <tr key={m.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-slate-200 text-sm font-medium">{m.name}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{m.llm_providers?.name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500 text-xs font-mono">{m.provider_model_id}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      m.is_temperature_supported
                        ? 'bg-emerald-900/50 text-emerald-300'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {m.is_temperature_supported ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/llm-models/${m.id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteLlmModelButton id={m.id} />
                  </div>
                </td>
              </tr>
            ))}
            {models.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No models found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

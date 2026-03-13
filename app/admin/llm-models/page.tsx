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
          <h1 className="text-lg font-medium text-zinc-100">LLM Models</h1>
          <p className="text-zinc-500 text-sm mt-1">{models.length} models</p>
        </div>
        <Link
          href="/admin/llm-models/new"
          className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
        >
          + New Model
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Provider</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Model ID</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Temperature</th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {models.map((m) => (
              <tr key={m.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-200 text-sm font-medium">{m.name}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm">{m.llm_providers?.name ?? '—'}</td>
                <td className="px-4 py-3 text-zinc-500 text-xs font-mono">{m.provider_model_id}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      m.is_temperature_supported
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {m.is_temperature_supported ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      href={`/admin/llm-models/${m.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
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
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
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

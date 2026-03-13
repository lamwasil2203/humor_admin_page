import { createAdminClient } from '@/lib/supabase/admin'
import { createLlmModel } from '../actions'
import Link from 'next/link'

const inputClass =
  'w-full bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm'

export default async function NewLlmModelPage() {
  const db = createAdminClient()
  const { data: providers } = await db.from('llm_providers').select('id, name').order('id')

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">New LLM Model</h1>
      </div>
      <form action={createLlmModel} className="bg-zinc-900 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Name <span className="text-rose-400">*</span>
          </label>
          <input name="name" required placeholder="e.g. Claude 3.5 Sonnet" className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Provider <span className="text-rose-400">*</span>
          </label>
          <select name="llm_provider_id" required className={inputClass}>
            <option value="">Select a provider…</option>
            {(providers ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Provider Model ID <span className="text-rose-400">*</span>
          </label>
          <input
            name="provider_model_id"
            required
            placeholder="e.g. claude-3-5-sonnet-20241022"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Temperature Supported</label>
          <select name="is_temperature_supported" className={inputClass}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Create Model
          </button>
          <Link
            href="/admin/llm-models"
            className="px-5 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

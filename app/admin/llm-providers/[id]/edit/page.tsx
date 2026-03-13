import { createAdminClient } from '@/lib/supabase/admin'
import { updateLlmProvider } from '../../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const inputClass =
  'w-full bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm'

export default async function EditLlmProviderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = createAdminClient()
  const { data: provider } = await db
    .from('llm_providers')
    .select('id, name')
    .eq('id', id)
    .single()
  if (!provider) notFound()

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">Edit LLM Provider</h1>
      </div>
      <form action={updateLlmProvider} className="bg-zinc-900 rounded-xl p-6 space-y-5">
        <input type="hidden" name="id" value={id} />
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Name <span className="text-rose-400">*</span>
          </label>
          <input name="name" required defaultValue={provider.name} className={inputClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Save Changes
          </button>
          <Link
            href="/admin/llm-providers"
            className="px-5 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

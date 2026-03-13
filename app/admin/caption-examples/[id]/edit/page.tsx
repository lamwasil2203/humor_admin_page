import { createAdminClient } from '@/lib/supabase/admin'
import { updateCaptionExample } from '../../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const inputClass =
  'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'

export default async function EditCaptionExamplePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = createAdminClient()
  const { data: ex } = await db
    .from('caption_examples')
    .select('id, caption, image_description, explanation, priority, image_id')
    .eq('id', id)
    .single()
  if (!ex) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Caption Example</h1>
      </div>

      <form action={updateCaptionExample} className="bg-slate-800 rounded-xl p-6 space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Caption <span className="text-rose-400">*</span>
          </label>
          <textarea name="caption" rows={2} required defaultValue={ex.caption} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Image Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="image_description"
            rows={3}
            required
            defaultValue={ex.image_description}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Explanation <span className="text-rose-400">*</span>
          </label>
          <textarea name="explanation" rows={3} required defaultValue={ex.explanation} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
            <input name="priority" type="number" defaultValue={ex.priority} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Image ID (optional)</label>
            <input name="image_id" type="text" defaultValue={ex.image_id ?? ''} placeholder="UUID..." className={inputClass} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Save Changes
          </button>
          <Link
            href="/admin/caption-examples"
            className="px-5 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

import { createCaptionExample } from '../actions'
import Link from 'next/link'

const inputClass =
  'w-full bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm'

export default function NewCaptionExamplePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">New Caption Example</h1>
      </div>

      <form action={createCaptionExample} className="bg-zinc-900 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Caption <span className="text-rose-400">*</span>
          </label>
          <textarea name="caption" rows={2} required placeholder="The example caption..." className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Image Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="image_description"
            rows={3}
            required
            placeholder="Describe the image this caption is for..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Explanation <span className="text-rose-400">*</span>
          </label>
          <textarea
            name="explanation"
            rows={3}
            required
            placeholder="Why is this a good caption?"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Priority</label>
            <input name="priority" type="number" defaultValue={0} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Image ID (optional)</label>
            <input name="image_id" type="text" placeholder="UUID..." className={inputClass} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Create Example
          </button>
          <Link
            href="/admin/caption-examples"
            className="px-5 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

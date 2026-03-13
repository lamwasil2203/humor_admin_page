import { createTerm } from '../actions'
import Link from 'next/link'

const inputClass = 'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'

export default function NewTermPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">New Term</h1>
      </div>

      <form action={createTerm} className="bg-slate-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Term <span className="text-rose-400">*</span></label>
          <input name="term" required placeholder="e.g. callback" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Definition <span className="text-rose-400">*</span></label>
          <textarea name="definition" rows={3} required placeholder="What does this term mean?" className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Example <span className="text-rose-400">*</span></label>
          <textarea name="example" rows={2} required placeholder="Example usage or sentence..." className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
          <input name="priority" type="number" defaultValue={0} className={inputClass} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors">Create Term</button>
          <Link href="/admin/terms" className="px-5 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

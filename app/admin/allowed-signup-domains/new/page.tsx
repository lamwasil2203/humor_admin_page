import { createAllowedDomain } from '../actions'
import Link from 'next/link'

const inputClass =
  'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'

export default function NewAllowedDomainPage() {
  return (
    <div className="p-8 max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add Allowed Signup Domain</h1>
      </div>
      <form action={createAllowedDomain} className="bg-slate-800 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Apex Domain <span className="text-rose-400">*</span>
          </label>
          <input
            name="apex_domain"
            required
            placeholder="e.g. university.edu"
            className={inputClass}
          />
          <p className="text-xs text-slate-500 mt-1">Enter the apex domain without protocol or www.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Add Domain
          </button>
          <Link
            href="/admin/allowed-signup-domains"
            className="px-5 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

import { createWhitelistedEmail } from '../actions'
import Link from 'next/link'

const inputClass =
  'w-full bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm'

export default function NewWhitelistedEmailPage() {
  return (
    <div className="p-8 max-w-lg">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">Add Whitelisted Email</h1>
      </div>
      <form action={createWhitelistedEmail} className="bg-zinc-900 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            name="email_address"
            type="email"
            required
            placeholder="user@example.com"
            className={inputClass}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Add Email
          </button>
          <Link
            href="/admin/whitelisted-emails"
            className="px-5 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

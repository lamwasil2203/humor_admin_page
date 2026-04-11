'use client'

import { useActionState } from 'react'
import { duplicateHumorFlavorAction } from '../../actions'
import Link from 'next/link'

type State = { error?: string }

export default function DuplicateForm({
  flavorId,
  originalSlug,
}: {
  flavorId: number
  originalSlug: string
}) {
  const [state, action, isPending] = useActionState<State, FormData>(
    duplicateHumorFlavorAction,
    {}
  )

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="flavorId" value={flavorId} />

      <div>
        <label className="block text-sm text-zinc-400 mb-2">
          New Slug
          <span className="text-zinc-600 text-xs ml-2">
            (lowercase letters, numbers, hyphens, underscores)
          </span>
        </label>
        <input
          type="text"
          name="slug"
          defaultValue={`${originalSlug}-copy`}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-zinc-100 text-sm font-mono focus:outline-none focus:border-zinc-500 placeholder:text-zinc-700"
          placeholder="new-flavor-slug"
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {state.error && (
        <p className="text-red-400 text-sm rounded-lg bg-red-950/30 border border-red-900/40 px-4 py-2.5">
          {state.error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Duplicating…' : 'Duplicate Flavor'}
        </button>
        <Link
          href="/admin/humor-flavors"
          className="px-5 py-2 text-zinc-500 rounded-lg text-sm hover:text-zinc-300 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

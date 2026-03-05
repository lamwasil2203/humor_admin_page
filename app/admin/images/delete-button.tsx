'use client'

import { deleteImage } from './actions'

export function DeleteImageButton({ id }: { id: string }) {
  return (
    <form
      action={deleteImage}
      onSubmit={(e) => {
        if (!confirm('Delete this image? This cannot be undone.')) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-rose-400 hover:text-rose-300 text-sm transition-colors"
      >
        Delete
      </button>
    </form>
  )
}

'use client'

export function DeleteButton({
  id,
  action,
  confirm: confirmMessage = 'Delete? This cannot be undone.',
}: {
  id: string | number
  action: (formData: FormData) => Promise<void>
  confirm?: string
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-rose-400 hover:text-rose-300 text-sm transition-colors">
        Delete
      </button>
    </form>
  )
}

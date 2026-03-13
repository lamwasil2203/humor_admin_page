'use client'

import { DeleteButton } from '../delete-button'
import { deleteWhitelistedEmail } from './actions'

export function DeleteWhitelistedEmailButton({ id }: { id: number }) {
  return (
    <DeleteButton
      id={id}
      action={deleteWhitelistedEmail}
      confirm="Remove this email address? This cannot be undone."
    />
  )
}

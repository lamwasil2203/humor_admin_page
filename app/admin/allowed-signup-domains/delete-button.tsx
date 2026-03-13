'use client'

import { DeleteButton } from '../delete-button'
import { deleteAllowedDomain } from './actions'

export function DeleteAllowedDomainButton({ id }: { id: number }) {
  return (
    <DeleteButton
      id={id}
      action={deleteAllowedDomain}
      confirm="Remove this domain? This cannot be undone."
    />
  )
}

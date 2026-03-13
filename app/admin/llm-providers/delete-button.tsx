'use client'

import { DeleteButton } from '../delete-button'
import { deleteLlmProvider } from './actions'

export function DeleteLlmProviderButton({ id }: { id: number }) {
  return (
    <DeleteButton
      id={id}
      action={deleteLlmProvider}
      confirm="Delete this provider? This cannot be undone."
    />
  )
}

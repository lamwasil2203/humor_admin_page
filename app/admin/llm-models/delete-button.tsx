'use client'

import { DeleteButton } from '../delete-button'
import { deleteLlmModel } from './actions'

export function DeleteLlmModelButton({ id }: { id: number }) {
  return (
    <DeleteButton
      id={id}
      action={deleteLlmModel}
      confirm="Delete this model? This cannot be undone."
    />
  )
}

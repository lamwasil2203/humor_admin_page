'use client'

import { DeleteButton } from '../delete-button'
import { deleteTerm } from './actions'

export function DeleteTermButton({ id }: { id: number }) {
  return <DeleteButton id={id} action={deleteTerm} confirm="Delete this term? This cannot be undone." />
}

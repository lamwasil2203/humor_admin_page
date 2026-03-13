'use client'

import { DeleteButton } from '../delete-button'
import { deleteCaptionExample } from './actions'

export function DeleteCaptionExampleButton({ id }: { id: number }) {
  return <DeleteButton id={id} action={deleteCaptionExample} confirm="Delete this caption example? This cannot be undone." />
}

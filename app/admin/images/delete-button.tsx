'use client'

import { DeleteButton } from '../delete-button'
import { deleteImage } from './actions'

export function DeleteImageButton({ id }: { id: string }) {
  return <DeleteButton id={id} action={deleteImage} confirm="Delete this image? This cannot be undone." />
}

import { createAdminClient } from '@/lib/supabase/admin'
import { updateImage } from '../../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const inputClass =
  'w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm'

export default async function EditImagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = createAdminClient()

  const { data: image } = await db
    .from('images')
    .select('id, url, image_description, additional_context, is_public, is_common_use')
    .eq('id', id)
    .single()

  if (!image) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Image</h1>
        <p className="text-slate-500 text-xs mt-1 font-mono">{id}</p>
      </div>

      {image.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.url}
          alt=""
          className="w-full max-h-64 object-contain rounded-xl bg-slate-800 mb-6"
        />
      )}

      <form action={updateImage} className="bg-slate-800 rounded-xl p-6 space-y-5">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            URL <span className="text-rose-400">*</span>
          </label>
          <input
            name="url"
            type="url"
            required
            defaultValue={image.url ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
          <textarea
            name="image_description"
            rows={3}
            defaultValue={image.image_description ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Additional Context
          </label>
          <textarea
            name="additional_context"
            rows={2}
            defaultValue={image.additional_context ?? ''}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Visibility</label>
            <select
              name="is_public"
              defaultValue={image.is_public ? 'true' : 'false'}
              className={inputClass}
            >
              <option value="false">Private</option>
              <option value="true">Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Common Use</label>
            <select
              name="is_common_use"
              defaultValue={image.is_common_use ? 'true' : 'false'}
              className={inputClass}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Save Changes
          </button>
          <Link
            href="/admin/images"
            className="px-5 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

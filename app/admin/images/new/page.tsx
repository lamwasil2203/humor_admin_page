import { createImage } from '../actions'
import Link from 'next/link'

const inputClass =
  'w-full bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm'

export default function NewImagePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">New Image</h1>
      </div>

      <form action={createImage} encType="multipart/form-data" className="bg-zinc-900 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Upload File</label>
          <input name="file" type="file" accept="image/*" className="w-full text-sm text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-zinc-100 hover:file:bg-zinc-700 cursor-pointer" />
          <p className="text-xs text-zinc-500 mt-1">Or enter a URL below</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">URL</label>
          <input name="url" type="url" placeholder="https://..." className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Description</label>
          <textarea name="image_description" rows={3} placeholder="Describe the image..." className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Additional Context</label>
          <textarea name="additional_context" rows={2} placeholder="Any additional context for caption generation..." className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Visibility</label>
            <select name="is_public" className={inputClass}>
              <option value="false">Private</option>
              <option value="true">Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Common Use</label>
            <select name="is_common_use" className={inputClass}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">Create Image</button>
          <Link href="/admin/images" className="px-5 py-2 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

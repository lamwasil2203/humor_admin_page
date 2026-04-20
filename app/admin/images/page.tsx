import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { DeleteImageButton } from './delete-button'
import SearchInput from '../search-input'

type ImageRow = {
  id: string
  url: string | null
  image_description: string | null
  is_public: boolean | null
  is_common_use: boolean | null
  created_datetime_utc: string | null
  captions: Array<{ count: number }>
  profiles: { first_name: string | null; last_name: string | null; email: string | null } | null
}

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const db = createAdminClient()

  let query = db
    .from('images')
    .select(
      'id, url, image_description, is_public, is_common_use, created_datetime_utc, captions(count), profiles!profile_id(email, first_name, last_name)'
    )
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  if (q) {
    query = query.or(
      `image_description.ilike.%${q}%,url.ilike.%${q}%,additional_context.ilike.%${q}%`
    )
  }

  const { data: rawImages } = await query
  const images = (rawImages ?? []) as unknown as ImageRow[]

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-zinc-100">Images</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {q ? (
              <>
                <span className="text-zinc-300">{images.length}</span> results for{' '}
                <span className="text-zinc-400">&ldquo;{q}&rdquo;</span>
              </>
            ) : (
              `${images.length} images`
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput placeholder="Search by description or URL…" />
          <Link
            href="/admin/images/new"
            className="px-4 py-2 bg-zinc-800 text-zinc-100 text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
          >
            + New Image
          </Link>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Image
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Description
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Captions
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Created
              </th>
              <th className="text-right text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {images.map((img) => {
              const captionCount = img.captions?.[0]?.count ?? 0
              const owner = img.profiles
              const ownerName = owner?.first_name
                ? `${owner.first_name} ${owner.last_name ?? ''}`.trim()
                : (owner?.email ?? '—')
              return (
                <tr key={img.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3">
                    {img.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg bg-zinc-800"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs">
                        No URL
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-200 text-sm line-clamp-2 max-w-xs">
                      {img.image_description ?? (
                        <span className="text-zinc-600">No description</span>
                      )}
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5">{ownerName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex text-xs px-2 py-0.5 rounded font-medium w-fit ${
                          img.is_public
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {img.is_public ? 'Public' : 'Private'}
                      </span>
                      {img.is_common_use && (
                        <span className="inline-flex text-xs px-2 py-0.5 rounded font-medium bg-zinc-800 text-zinc-300 w-fit">
                          Common Use
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 text-sm">{captionCount}</td>
                  <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                    {img.created_datetime_utc
                      ? new Date(img.created_datetime_utc).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-3 justify-end">
                      <Link
                        href={`/admin/images/${img.id}/edit`}
                        className="text-zinc-400 hover:text-zinc-300 text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteImageButton id={img.id} />
                    </div>
                  </td>
                </tr>
              )
            })}
            {images.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                  {q ? `No images match "${q}"` : 'No images found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { createAdminClient } from '@/lib/supabase/admin'

type RequestRow = {
  id: number
  created_datetime_utc: string | null
  profiles: {
    email: string | null
    first_name: string | null
    last_name: string | null
  } | null
  images: { url: string | null; image_description: string | null } | null
}

export default async function CaptionRequestsPage() {
  const db = createAdminClient()
  const { data: rawRequests } = await db
    .from('caption_requests')
    .select(
      'id, created_datetime_utc, profiles!profile_id(email, first_name, last_name), images(url, image_description)'
    )
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  const requests = (rawRequests ?? []) as unknown as RequestRow[]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">Caption Requests</h1>
        <p className="text-zinc-500 text-sm mt-1">{requests.length} requests (latest 200)</p>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Image</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">User</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {requests.map((r) => {
              const user = r.profiles
              const userName = user?.first_name
                ? `${user.first_name} ${user.last_name ?? ''}`.trim()
                : (user?.email ?? '—')
              return (
                <tr key={r.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-zinc-500 text-sm font-mono">{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {r.images?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.images.url}
                          alt=""
                          className="w-10 h-10 object-cover rounded bg-zinc-800 flex-shrink-0"
                        />
                      )}
                      <p className="text-zinc-500 text-sm line-clamp-1 max-w-xs">
                        {r.images?.image_description ?? (
                          <span className="text-zinc-600">No description</span>
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-sm">{userName}</td>
                  <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                    {r.created_datetime_utc
                      ? new Date(r.created_datetime_utc).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              )
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  No caption requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

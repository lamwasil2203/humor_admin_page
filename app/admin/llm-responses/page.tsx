import { createAdminClient } from '@/lib/supabase/admin'

type ResponseRow = {
  id: string
  llm_model_response: string | null
  processing_time_seconds: number
  llm_temperature: number | null
  created_datetime_utc: string | null
  llm_models: { name: string } | null
  profiles: { email: string | null; first_name: string | null } | null
  humor_flavors: { slug: string } | null
}

export default async function LlmResponsesPage() {
  const db = createAdminClient()
  const { data: rawResponses } = await db
    .from('llm_model_responses')
    .select(
      'id, llm_model_response, processing_time_seconds, llm_temperature, created_datetime_utc, llm_models(name), profiles!profile_id(email, first_name), humor_flavors(slug)'
    )
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  const responses = (rawResponses ?? []) as unknown as ResponseRow[]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">LLM Responses</h1>
        <p className="text-zinc-500 text-sm mt-1">{responses.length} responses (latest 200)</p>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Response
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Model</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Flavor</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">User</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Time (s)
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {responses.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-300 text-sm max-w-sm">
                  <p className="line-clamp-2">
                    {r.llm_model_response ?? (
                      <span className="text-zinc-600">(empty)</span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                  {r.llm_models?.name ?? '—'}
                </td>
                <td className="px-4 py-3">
                  {r.humor_flavors?.slug && (
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                      {r.humor_flavors.slug}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm">
                  {r.profiles?.first_name ?? r.profiles?.email ?? '—'}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm">{r.processing_time_seconds}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                  {r.created_datetime_utc
                    ? new Date(r.created_datetime_utc).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
            {responses.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-zinc-500">
                  No responses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

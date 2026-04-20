import { createAdminClient } from '@/lib/supabase/admin'

type ChainRow = {
  id: number
  created_datetime_utc: string | null
  caption_requests: {
    id: number
    profiles: { email: string | null; first_name: string | null } | null
  } | null
}

export default async function LlmPromptChainsPage() {
  const db = createAdminClient()
  const { data: rawChains } = await db
    .from('llm_prompt_chains')
    .select('id, created_datetime_utc, caption_requests(id, profiles!profile_id(email, first_name))')
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  const chains = (rawChains ?? []) as unknown as ChainRow[]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-zinc-100">LLM Prompt Chains</h1>
        <p className="text-zinc-500 text-sm mt-1">{chains.length} chains (latest 200)</p>
      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">
                Caption Request
              </th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">User</th>
              <th className="text-left text-xs text-zinc-500 uppercase tracking-wider px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {chains.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-800/30">
                <td className="px-4 py-3 text-zinc-500 text-sm font-mono">{c.id}</td>
                <td className="px-4 py-3 text-zinc-500 text-sm font-mono">
                  {c.caption_requests?.id ?? '—'}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm">
                  {c.caption_requests?.profiles?.first_name ??
                    c.caption_requests?.profiles?.email ??
                    '—'}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                  {c.created_datetime_utc
                    ? new Date(c.created_datetime_utc).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
            {chains.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                  No prompt chains found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

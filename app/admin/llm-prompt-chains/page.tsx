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
    .select('id, created_datetime_utc, caption_requests(id, profiles(email, first_name))')
    .order('created_datetime_utc', { ascending: false })
    .limit(200)

  const chains = (rawChains ?? []) as unknown as ChainRow[]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">LLM Prompt Chains</h1>
        <p className="text-slate-400 text-sm mt-1">{chains.length} chains (latest 200)</p>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">ID</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">
                Caption Request
              </th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">User</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {chains.map((c) => (
              <tr key={c.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3 text-slate-500 text-sm font-mono">{c.id}</td>
                <td className="px-4 py-3 text-slate-400 text-sm font-mono">
                  {c.caption_requests?.id ?? '—'}
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm">
                  {c.caption_requests?.profiles?.first_name ??
                    c.caption_requests?.profiles?.email ??
                    '—'}
                </td>
                <td className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                  {c.created_datetime_utc
                    ? new Date(c.created_datetime_utc).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
            {chains.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
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

import { createAdminClient } from '@/lib/supabase/admin'

type StepRow = {
  id: number
  order_by: number
  description: string | null
  llm_temperature: number | null
  llm_system_prompt: string | null
  llm_user_prompt: string | null
  created_datetime_utc: string | null
  humor_flavors: { slug: string } | null
  llm_models: { name: string } | null
}

export default async function HumorFlavorStepsPage() {
  const db = createAdminClient()
  const { data: rawSteps } = await db
    .from('humor_flavor_steps')
    .select('id, order_by, description, llm_temperature, llm_system_prompt, llm_user_prompt, created_datetime_utc, humor_flavors(slug), llm_models(name)')
    .order('humor_flavor_id', { ascending: true })
    .order('order_by', { ascending: true })

  const steps = (rawSteps ?? []) as unknown as StepRow[]

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Humor Flavor Steps</h1>
        <p className="text-slate-400 text-sm mt-1">{steps.length} steps</p>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Flavor</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Order</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Description</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Model</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">Temp</th>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider px-4 py-3">System Prompt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {steps.map((s) => (
              <tr key={s.id} className="hover:bg-slate-700/30">
                <td className="px-4 py-3">
                  {s.humor_flavors?.slug && (
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-900/50 text-indigo-300 font-mono whitespace-nowrap">{s.humor_flavors.slug}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300 text-sm text-center">{s.order_by}</td>
                <td className="px-4 py-3 text-slate-300 text-sm max-w-xs">
                  <p className="line-clamp-2">{s.description ?? <span className="text-slate-600">—</span>}</p>
                </td>
                <td className="px-4 py-3 text-slate-400 text-sm whitespace-nowrap">{s.llm_models?.name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-400 text-sm">{s.llm_temperature ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-sm">
                  <p className="line-clamp-2 font-mono">{s.llm_system_prompt ?? '—'}</p>
                </td>
              </tr>
            ))}
            {steps.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No steps found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

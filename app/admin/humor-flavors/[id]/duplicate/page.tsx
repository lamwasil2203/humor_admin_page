import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import DuplicateForm from './duplicate-form'

export default async function DuplicateFlavorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = createAdminClient()

  const { data: flavor } = await db
    .from('humor_flavors')
    .select('id, slug, description')
    .eq('id', parseInt(id, 10))
    .single()

  if (!flavor) notFound()

  const { count: stepCount } = await db
    .from('humor_flavor_steps')
    .select('*', { count: 'exact', head: true })
    .eq('humor_flavor_id', flavor.id)

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="text-lg font-medium text-zinc-100">Duplicate Flavor</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Copying{' '}
          <span className="text-zinc-300 font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
            {flavor.slug}
          </span>
          {(stepCount ?? 0) > 0
            ? ` and its ${stepCount} step${stepCount !== 1 ? 's' : ''}`
            : ' (no steps)'}
        </p>
        {flavor.description && (
          <p className="text-zinc-600 text-sm mt-3 leading-relaxed">{flavor.description}</p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6">
        <DuplicateForm flavorId={flavor.id} originalSlug={flavor.slug} />
      </div>
    </div>
  )
}

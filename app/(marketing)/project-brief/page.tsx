import type { Metadata } from 'next'
import ProjectBriefPageClient from '../../../components/brief/ProjectBriefPageClient'
import { briefOptionDictionary } from '../../../lib/brief/options'
import { createPageMetadata } from '../../../lib/metadata'
import { resolveBriefPageState } from '../../../lib/server/brief-page-state'

type ProjectBriefPageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>
}

export const metadata: Metadata = createPageMetadata({
  title: 'Business Project Planner',
  description:
    'Describe the part of the business that feels messy, repetitive, or too manual, and get a clearer starting direction.',
  path: '/project-brief',
})

export default async function ProjectBriefPage({
  searchParams,
}: ProjectBriefPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const { initialDraft, initialStepId } = await resolveBriefPageState(
    resolvedSearchParams,
  )

  return (
    <ProjectBriefPageClient
      initialDraft={initialDraft}
      initialStepId={initialStepId}
      optionDictionary={briefOptionDictionary}
      mode="page"
    />
  )
}

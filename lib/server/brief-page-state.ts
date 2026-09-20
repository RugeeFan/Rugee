import { BRIEF_STEPS, sanitizeDraftForBranching } from '../brief/branching'
import { createEmptyBriefDraft } from '../brief/defaults'
import { projectTypeOptions } from '../brief/options'
import { getBriefById } from './brief-repo'
import type {
  BriefStepId,
  ProjectBriefDraft,
  ProjectTypeKey,
} from '../brief/types'

export type BriefSearchParams = Record<string, string | string[] | undefined>

function getFirstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export async function resolveBriefPageState(
  searchParams: BriefSearchParams = {},
): Promise<{
  initialDraft: ProjectBriefDraft
  initialStepId: BriefStepId
}> {
  const draftId = getFirstValue(searchParams.draft)
  const stepParam = getFirstValue(searchParams.step)
  const typeParam = getFirstValue(searchParams.type)
  const existingDraft = draftId ? await getBriefById(draftId) : null
  const hasValidTypeParam = projectTypeOptions.some(option => option.key === typeParam)
  const prefilledProjectType = hasValidTypeParam
    ? (typeParam as ProjectTypeKey)
    : undefined
  const hasValidStepParam = BRIEF_STEPS.some(step => step.id === stepParam)
  const initialStepId: BriefStepId = hasValidStepParam
    ? (stepParam as BriefStepId)
    : existingDraft?.currentStepId ??
      (prefilledProjectType && prefilledProjectType !== 'unsure'
        ? 'project-context'
        : 'project-type')

  const initialDraft: ProjectBriefDraft = sanitizeDraftForBranching(
    existingDraft
      ? {
          ...existingDraft,
          currentStepId: initialStepId,
        }
      : createEmptyBriefDraft({
          currentStepId: initialStepId,
          projectType: prefilledProjectType,
        }),
  )

  return {
    initialDraft,
    initialStepId,
  }
}

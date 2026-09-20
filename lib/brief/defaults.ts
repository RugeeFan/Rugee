import type {
  BriefDraftPatch,
  ProjectBriefDraft,
} from './types'

export const BRIEF_REFERENCE_LINK_LIMIT = 3

export function createEmptyBriefDraft(
  overrides: BriefDraftPatch = {},
): ProjectBriefDraft {
  return {
    status: 'draft',
    currentStepId: 'project-type',
    completionPercent: 0,
    unsureNeeds: [],
    businessGoals: [],
    featureSelections: [],
    referenceLinks: [],
    inspirationUploads: [],
    additionalUploads: [],
    ...overrides,
  }
}


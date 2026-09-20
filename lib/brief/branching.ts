import { getFeatureOptionsForResolvedType } from './options'
import type {
  BriefDraftPatch,
  BriefFieldErrorMap,
  BriefFieldKey,
  BriefStepId,
  FeatureKey,
  ProjectBriefDraft,
  ResolvedProjectTypeKey,
  StepDefinition,
  StepValidationResult,
  ValidationIssue,
  ValidationMode,
} from './types'

export const BRIEF_STEPS: StepDefinition[] = [
  {
    id: 'project-type',
    title: 'What kind of help would make the biggest difference?',
    description:
      'Choose the closest direction. If you are unsure, start with the bottleneck and I will help narrow it down.',
  },
  {
    id: 'project-context',
    title: 'A little business context',
    description:
      'This helps me understand what is already happening behind the scenes before we talk about the shape of the solution.',
  },
  {
    id: 'features',
    title: 'What needs to happen',
    description:
      'Pick what matters in the first useful version. We can refine the details later.',
  },
  {
    id: 'design',
    title: 'Trust and presentation',
    description:
      'Show me the feeling and references you want people to experience, not technical language.',
  },
  {
    id: 'budget-timeline',
    title: 'Budget and timing',
    description: 'This helps me recommend the right first phase and delivery approach.',
  },
  {
    id: 'contact-submit',
    title: 'Final details',
    description: 'Add any extra context, then leave the rest to me.',
  },
]

function createIssue(
  field: BriefFieldKey,
  message: string,
  severity: ValidationIssue['severity'],
): ValidationIssue {
  return { field, message, severity }
}

export function coerceBriefStepId(raw?: string | null): BriefStepId {
  if (!raw) return 'project-type'
  const match = BRIEF_STEPS.find(step => step.id === raw)
  return match?.id ?? 'project-type'
}

export function getStepDefinition(stepId: BriefStepId): StepDefinition {
  return BRIEF_STEPS.find(step => step.id === stepId) ?? BRIEF_STEPS[0]
}

export function getStepIndex(stepId: BriefStepId): number {
  return BRIEF_STEPS.findIndex(step => step.id === stepId)
}

export function getNextStepId(currentStepId: BriefStepId): BriefStepId | null {
  const index = getStepIndex(currentStepId)
  if (index < 0 || index >= BRIEF_STEPS.length - 1) return null
  return BRIEF_STEPS[index + 1].id
}

export function getPreviousStepId(currentStepId: BriefStepId): BriefStepId | null {
  const index = getStepIndex(currentStepId)
  if (index <= 0) return null
  return BRIEF_STEPS[index - 1].id
}

export function resolveProjectType(
  draft: ProjectBriefDraft,
): ResolvedProjectTypeKey | undefined {
  if (!draft.projectType) return undefined
  if (draft.projectType !== 'unsure') return draft.projectType

  if (draft.unsureNeeds.includes('sell_online')) return 'ecommerce'
  if (
    draft.unsureNeeds.includes('internal_management') ||
    draft.unsureNeeds.includes('member_login')
  ) {
    return 'system'
  }

  switch (draft.unsurePrimaryNeed) {
    case 'brand':
      return 'showcase'
    case 'leads':
    case 'booking':
      return 'corporate'
    case 'sales':
      return 'ecommerce'
    case 'operations':
      return 'system'
    default:
      return undefined
  }
}

export function getAllowedFeatureKeys(
  resolvedProjectType?: ResolvedProjectTypeKey,
): FeatureKey[] {
  return getFeatureOptionsForResolvedType(resolvedProjectType).map(item => item.key)
}

export function sanitizeDraftForBranching(
  draft: ProjectBriefDraft,
): ProjectBriefDraft {
  const resolvedProjectType = resolveProjectType(draft)
  const allowedFeatureKeys = new Set(getAllowedFeatureKeys(resolvedProjectType))
  const nextFeatureSelections = draft.featureSelections.filter(featureKey =>
    allowedFeatureKeys.has(featureKey),
  )

  const nextDraft: ProjectBriefDraft = {
    ...draft,
    resolvedProjectType,
    featureSelections: nextFeatureSelections,
  }

  if (draft.projectType !== 'unsure') {
    nextDraft.unsurePrimaryNeed = undefined
    nextDraft.unsureNeeds = []
  }

  if (resolvedProjectType !== 'showcase' && resolvedProjectType !== 'corporate') {
    nextDraft.pageCountBand = undefined
  }

  if (resolvedProjectType !== 'ecommerce') {
    nextDraft.catalogSizeBand = undefined
  }

  if (resolvedProjectType !== 'system') {
    nextDraft.systemAudienceBand = undefined
  }

  nextDraft.completionPercent = getCompletionPercent(nextDraft)

  return nextDraft
}

export function patchDraftState(
  currentDraft: ProjectBriefDraft,
  patch: BriefDraftPatch,
): ProjectBriefDraft {
  const mergedDraft = {
    ...currentDraft,
    ...patch,
  }

  return sanitizeDraftForBranching(mergedDraft)
}

export function getCompletionPercent(draft: ProjectBriefDraft): number {
  const completedSteps = BRIEF_STEPS.reduce((count, step) => {
    const result = validateStep(step.id, draft, 'step')
    return count + (result.isValidForNext ? 1 : 0)
  }, 0)

  return Math.round((completedSteps / BRIEF_STEPS.length) * 100)
}

export function getVisibleFieldsForStep(
  stepId: BriefStepId,
  draft: ProjectBriefDraft,
): BriefFieldKey[] {
  const resolvedProjectType = resolveProjectType(draft)

  switch (stepId) {
    case 'project-type':
      return ['projectType', 'unsurePrimaryNeed', 'unsureNeeds']
    case 'project-context':
      return [
        'industry',
        'businessGoals',
        'currentPresence',
        'buildScope',
        'contentReadiness',
      ]
    case 'features':
      switch (resolvedProjectType) {
        case 'showcase':
        case 'corporate':
          return ['pageCountBand', 'featureSelections', 'integrationLevel', 'customFeatureNote']
        case 'ecommerce':
          return ['catalogSizeBand', 'featureSelections', 'integrationLevel', 'customFeatureNote']
        case 'system':
          return ['systemAudienceBand', 'featureSelections', 'integrationLevel', 'customFeatureNote']
        default:
          return ['unsureNeeds', 'integrationLevel']
      }
    case 'design':
      return [
        'styleDirection',
        'colorDirection',
        'motionLevel',
        'referenceLinks',
        'inspirationUploads',
      ]
    case 'budget-timeline':
      return [
        'budgetBand',
        'launchWindow',
        'phasedDelivery',
        'needsDiscoverySupport',
      ]
    case 'contact-submit':
      return [
        'additionalNotes',
        'voiceNote',
        'additionalUploads',
        'contactName',
        'contactEmail',
        'contactPhone',
        'companyName',
        'preferredContactMethod',
        'consentToFollowUp',
      ]
    default:
      return []
  }
}

export function validateStep(
  stepId: BriefStepId,
  draft: ProjectBriefDraft,
  mode: ValidationMode = 'step',
): StepValidationResult {
  const blockingIssues: ValidationIssue[] = []
  const advisoryIssues: ValidationIssue[] = []
  const resolvedProjectType = resolveProjectType(draft)

  switch (stepId) {
    case 'project-type': {
      if (!draft.projectType) {
        blockingIssues.push(
          createIssue('projectType', 'Please choose the closest project type.', 'blocking'),
        )
      }

      if (draft.projectType === 'unsure' && !draft.unsurePrimaryNeed) {
        blockingIssues.push(
          createIssue(
            'unsurePrimaryNeed',
            'Pick the closest business need so I can guide you.',
            'blocking',
          ),
        )
      }

      if (draft.projectType === 'unsure' && draft.unsureNeeds.length === 0) {
        advisoryIssues.push(
          createIssue(
            'unsureNeeds',
            'Optional, but selecting a few messy areas will improve the recommendation.',
            'advisory',
          ),
        )
      }
      break
    }

    case 'project-context': {
      if (!draft.industry) {
        blockingIssues.push(createIssue('industry', 'Choose the closest industry.', 'blocking'))
      }
      if (draft.businessGoals.length === 0) {
        blockingIssues.push(
          createIssue('businessGoals', 'Choose at least one business outcome.', 'blocking'),
        )
      }
      if (!draft.currentPresence) {
        blockingIssues.push(
          createIssue('currentPresence', 'Tell me what you already have today.', 'blocking'),
        )
      }
      if (!draft.buildScope) {
        blockingIssues.push(
          createIssue(
            'buildScope',
            'Tell me whether this is new work, a rework, or an extension.',
            'blocking',
          ),
        )
      }
      if (!draft.contentReadiness) {
        blockingIssues.push(
          createIssue(
            'contentReadiness',
            'Tell me how ready the content, assets, or source material already are.',
            'blocking',
          ),
        )
      }
      break
    }

    case 'features': {
      if (!resolvedProjectType) {
        blockingIssues.push(
          createIssue(
            'projectType',
            'Please confirm the direction before choosing what needs to happen.',
            'blocking',
          ),
        )
        break
      }

      if (
        (resolvedProjectType === 'showcase' || resolvedProjectType === 'corporate') &&
        !draft.pageCountBand
      ) {
        blockingIssues.push(
          createIssue(
            'pageCountBand',
            'Choose how much information needs to be explained.',
            'blocking',
          ),
        )
      }

      if (resolvedProjectType === 'ecommerce' && !draft.catalogSizeBand) {
        blockingIssues.push(
          createIssue('catalogSizeBand', 'Choose the rough store size.', 'blocking'),
        )
      }

      if (resolvedProjectType === 'system' && !draft.systemAudienceBand) {
        blockingIssues.push(
          createIssue(
            'systemAudienceBand',
            'Choose who needs this workflow or system.',
            'blocking',
          ),
        )
      }

      if (!draft.integrationLevel) {
        blockingIssues.push(
          createIssue('integrationLevel', 'Choose how connected this needs to be.', 'blocking'),
        )
      }

      if (draft.featureSelections.length === 0) {
        blockingIssues.push(
          createIssue(
            'featureSelections',
            'Choose at least one thing that needs to happen in version one.',
            'blocking',
          ),
        )
      }
      break
    }

    case 'design': {
      if (!draft.styleDirection) {
        blockingIssues.push(
          createIssue('styleDirection', 'Choose the closest visual direction.', 'blocking'),
        )
      }
      if (!draft.colorDirection) {
        blockingIssues.push(
          createIssue('colorDirection', 'Choose a color direction.', 'blocking'),
        )
      }
      if (!draft.motionLevel) {
        blockingIssues.push(
          createIssue('motionLevel', 'Choose how much motion you want.', 'blocking'),
        )
      }

      if (draft.referenceLinks.length === 0 && draft.inspirationUploads.length === 0) {
        advisoryIssues.push(
          createIssue(
            'referenceLinks',
            'Optional, but references make alignment much faster.',
            'advisory',
          ),
        )
      }
      break
    }

    case 'budget-timeline': {
      if (!draft.budgetBand) {
        blockingIssues.push(
          createIssue('budgetBand', 'Choose the closest budget direction.', 'blocking'),
        )
      }
      if (!draft.launchWindow) {
        blockingIssues.push(
          createIssue(
            'launchWindow',
            'Choose when you would like this pressure to ease.',
            'blocking',
          ),
        )
      }
      if (typeof draft.phasedDelivery !== 'boolean') {
        blockingIssues.push(
          createIssue('phasedDelivery', 'Tell me if a staged rollout would help.', 'blocking'),
        )
      }
      if (typeof draft.needsDiscoverySupport !== 'boolean') {
        blockingIssues.push(
          createIssue(
            'needsDiscoverySupport',
            'Tell me whether you want help shaping the best starting plan.',
            'blocking',
          ),
        )
      }
      break
    }

    case 'contact-submit': {
      if (!draft.contactName?.trim()) {
        blockingIssues.push(createIssue('contactName', 'Your name is required.', 'blocking'))
      }
      if (!draft.contactEmail?.trim()) {
        blockingIssues.push(createIssue('contactEmail', 'Your email is required.', 'blocking'))
      }
      if (!draft.preferredContactMethod) {
        blockingIssues.push(
          createIssue(
            'preferredContactMethod',
            'Choose how you would like me to contact you.',
            'blocking',
          ),
        )
      }
      if (!draft.consentToFollowUp) {
        blockingIssues.push(
          createIssue(
            'consentToFollowUp',
            'Please confirm that I can contact you about this planner submission.',
            'blocking',
          ),
        )
      }

      if (mode === 'submit') {
        if (
          !draft.additionalNotes?.trim() &&
          !draft.voiceNote &&
          draft.additionalUploads.length === 0
        ) {
          advisoryIssues.push(
            createIssue(
              'additionalNotes',
              'Optional, but one extra detail or reference usually helps me shape the reply faster.',
              'advisory',
            ),
          )
        }
      }
      break
    }
  }

  return {
    stepId,
    blockingIssues,
    advisoryIssues,
    isValidForNext: blockingIssues.length === 0,
  }
}

export function validateDraftForSubmit(
  draft: ProjectBriefDraft,
): StepValidationResult[] {
  return BRIEF_STEPS.map(step => validateStep(step.id, draft, 'submit'))
}

export function getOwningStepIdForField(field: BriefFieldKey): BriefStepId {
  switch (field) {
    case 'projectType':
    case 'resolvedProjectType':
    case 'unsurePrimaryNeed':
    case 'unsureNeeds':
      return 'project-type'
    case 'industry':
    case 'businessGoals':
    case 'currentPresence':
    case 'buildScope':
    case 'contentReadiness':
      return 'project-context'
    case 'pageCountBand':
    case 'catalogSizeBand':
    case 'systemAudienceBand':
    case 'integrationLevel':
    case 'featureSelections':
    case 'customFeatureNote':
      return 'features'
    case 'styleDirection':
    case 'colorDirection':
    case 'motionLevel':
    case 'referenceLinks':
    case 'inspirationUploads':
      return 'design'
    case 'budgetBand':
    case 'launchWindow':
    case 'phasedDelivery':
    case 'needsDiscoverySupport':
      return 'budget-timeline'
    case 'additionalNotes':
    case 'voiceNote':
    case 'additionalUploads':
    case 'contactName':
    case 'contactEmail':
    case 'contactPhone':
    case 'companyName':
    case 'preferredContactMethod':
    case 'consentToFollowUp':
      return 'contact-submit'
    default:
      return 'project-type'
  }
}

export function buildValidationResultFromFieldErrors(
  stepId: BriefStepId,
  fieldErrors: BriefFieldErrorMap,
): StepValidationResult {
  const blockingIssues = Object.entries(fieldErrors).flatMap(([field, message]) => {
    if (!message) return []

    const typedField = field as BriefFieldKey
    if (getOwningStepIdForField(typedField) !== stepId) {
      return []
    }

    return [createIssue(typedField, message, 'blocking')]
  })

  return {
    stepId,
    blockingIssues,
    advisoryIssues: [],
    isValidForNext: blockingIssues.length === 0,
  }
}

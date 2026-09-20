import type {
  BriefDraftPatch,
  PersistableBriefFieldKey,
  PersistableProjectBriefPayload,
  ProjectBriefDraft,
} from './types'

export const PERSISTABLE_BRIEF_FIELDS = [
  'projectType',
  'unsurePrimaryNeed',
  'unsureNeeds',
  'industry',
  'businessGoals',
  'currentPresence',
  'buildScope',
  'contentReadiness',
  'pageCountBand',
  'catalogSizeBand',
  'systemAudienceBand',
  'integrationLevel',
  'featureSelections',
  'customFeatureNote',
  'styleDirection',
  'colorDirection',
  'motionLevel',
  'referenceLinks',
  'inspirationUploads',
  'budgetBand',
  'launchWindow',
  'phasedDelivery',
  'needsDiscoverySupport',
  'additionalNotes',
  'voiceNote',
  'additionalUploads',
  'contactName',
  'contactEmail',
  'contactPhone',
  'companyName',
  'preferredContactMethod',
  'consentToFollowUp',
] as const satisfies PersistableBriefFieldKey[]

function cloneSerializableValue<T>(value: T): T {
  if (value === undefined || value === null) {
    return value
  }

  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.parse(JSON.stringify(value)) as T
  }

  return value
}

export function serializePersistableDraft(
  draft: ProjectBriefDraft,
): PersistableProjectBriefPayload {
  const payload: PersistableProjectBriefPayload = {}

  for (const key of PERSISTABLE_BRIEF_FIELDS) {
    const value = draft[key]
    payload[key] = value === undefined ? null : cloneSerializableValue(value)
  }

  return payload
}

export function diffPersistableDraftPayload(
  previousPayload: PersistableProjectBriefPayload,
  nextPayload: PersistableProjectBriefPayload,
): PersistableProjectBriefPayload {
  const patch: PersistableProjectBriefPayload = {}

  for (const key of PERSISTABLE_BRIEF_FIELDS) {
    const previousValue = previousPayload[key]
    const nextValue = nextPayload[key]

    if (JSON.stringify(previousValue) !== JSON.stringify(nextValue)) {
      patch[key] = cloneSerializableValue(nextValue)
    }
  }

  return patch
}

export function isEmptyPersistablePatch(
  patch: PersistableProjectBriefPayload,
): boolean {
  return Object.keys(patch).length === 0
}

export function deserializePersistablePatch(
  payload: PersistableProjectBriefPayload,
): BriefDraftPatch {
  const patch: BriefDraftPatch = {}

  for (const key of PERSISTABLE_BRIEF_FIELDS) {
    if (!(key in payload)) continue

    const rawValue = payload[key]
    ;(patch as Record<string, unknown>)[key] =
      rawValue === null ? undefined : cloneSerializableValue(rawValue)
  }

  return patch
}

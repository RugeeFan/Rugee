'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  BRIEF_STEPS,
  buildValidationResultFromFieldErrors,
  getNextStepId,
  getOwningStepIdForField,
  getPreviousStepId,
  getStepDefinition,
  getStepIndex,
  getVisibleFieldsForStep,
  patchDraftState,
  validateDraftForSubmit,
  validateStep,
} from '../lib/brief/branching'
import type {
  BriefFieldErrorMap,
  BriefDraftPatch,
  BriefFieldKey,
  BriefStepId,
  ProjectBriefDraft,
  StepValidationResult,
} from '../lib/brief/types'

export interface UseBriefWizardOptions {
  initialDraft: ProjectBriefDraft
  initialStepId: BriefStepId
}

export interface UseBriefWizardResult {
  draft: ProjectBriefDraft
  currentStepId: BriefStepId
  currentStepIndex: number
  currentStepDefinition: ReturnType<typeof getStepDefinition>
  visibleFields: ReturnType<typeof getVisibleFieldsForStep>
  validation: StepValidationResult
  isFirstStep: boolean
  isLastStep: boolean
  isSubmitting: boolean
  patchDraft: (patch: BriefDraftPatch) => void
  syncServerDraftMeta: (patch: Pick<ProjectBriefDraft, 'id' | 'updatedAt' | 'completionPercent'>) => void
  applyServerFieldErrors: (fieldErrors: BriefFieldErrorMap) => void
  goBack: () => void
  validateCurrentStep: () => StepValidationResult
  advanceToNextStep: () => void
  startSubmitting: () => void
  finishSubmitting: () => void
  prepareSubmit: () => {
    ok: boolean
    results: StepValidationResult[]
    blockingStep?: BriefStepId
  }
}

function createEmptyValidation(stepId: BriefStepId): StepValidationResult {
  return {
    stepId,
    blockingIssues: [],
    advisoryIssues: [],
    isValidForNext: true,
  }
}

export function useBriefWizard({
  initialDraft,
  initialStepId,
}: UseBriefWizardOptions): UseBriefWizardResult {
  const [draft, setDraft] = useState<ProjectBriefDraft>(() =>
    patchDraftState(initialDraft, { currentStepId: initialStepId }),
  )
  const [submittedValidation, setSubmittedValidation] = useState<StepValidationResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepId = draft.currentStepId
  const currentStepIndex = getStepIndex(currentStepId)
  const currentStepDefinition = getStepDefinition(currentStepId)
  const visibleFields = useMemo(
    () => getVisibleFieldsForStep(currentStepId, draft),
    [currentStepId, draft],
  )
  const validation =
    submittedValidation?.stepId === currentStepId
      ? submittedValidation
      : createEmptyValidation(currentStepId)

  const patchDraft = useCallback((patch: BriefDraftPatch) => {
    setDraft(currentDraft => patchDraftState(currentDraft, patch))
    setSubmittedValidation(null)
  }, [])

  const syncServerDraftMeta = useCallback((patch: Pick<ProjectBriefDraft, 'id' | 'updatedAt' | 'completionPercent'>) => {
    setDraft(currentDraft =>
      patchDraftState(currentDraft, patch),
    )
  }, [])

  const applyServerFieldErrors = useCallback((fieldErrors: BriefFieldErrorMap) => {
    const firstField = Object.keys(fieldErrors)[0] as BriefFieldKey | undefined
    if (!firstField) return

    const targetStepId = getOwningStepIdForField(firstField)
    setDraft(currentDraft =>
      patchDraftState(currentDraft, { currentStepId: targetStepId }),
    )
    setSubmittedValidation(buildValidationResultFromFieldErrors(targetStepId, fieldErrors))
  }, [])

  const goBack = useCallback(() => {
    const previousStepId = getPreviousStepId(currentStepId)
    if (!previousStepId) return

    setDraft(currentDraft =>
      patchDraftState(currentDraft, { currentStepId: previousStepId }),
    )
    setSubmittedValidation(null)
  }, [currentStepId])

  const validateCurrentStep = useCallback(() => {
    const result = validateStep(currentStepId, draft, 'step')
    setSubmittedValidation(result)
    return result
  }, [currentStepId, draft])

  const advanceToNextStep = useCallback(() => {
    const nextStepId = getNextStepId(currentStepId)
    if (!nextStepId) return

    setDraft(currentDraft =>
      patchDraftState(currentDraft, { currentStepId: nextStepId }),
    )
    setSubmittedValidation(null)
  }, [currentStepId])

  const prepareSubmit = useCallback(() => {
    const results = validateDraftForSubmit(draft)
    const firstBlocking = results.find(result => !result.isValidForNext)

    if (firstBlocking) {
      setDraft(currentDraft =>
        patchDraftState(currentDraft, { currentStepId: firstBlocking.stepId }),
      )
      setSubmittedValidation(firstBlocking)

      return {
        ok: false,
        results,
        blockingStep: firstBlocking.stepId,
      }
    }

    return {
      ok: true,
      results,
      blockingStep: undefined,
    }
  }, [draft])

  const startSubmitting = useCallback(() => {
    setIsSubmitting(true)
  }, [])

  const finishSubmitting = useCallback(() => {
    setIsSubmitting(false)
  }, [])

  return {
    draft,
    currentStepId,
    currentStepIndex,
    currentStepDefinition,
    visibleFields,
    validation,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === BRIEF_STEPS.length - 1,
    isSubmitting,
    patchDraft,
    syncServerDraftMeta,
    applyServerFieldErrors,
    goBack,
    validateCurrentStep,
    advanceToNextStep,
    startSubmitting,
    finishSubmitting,
    prepareSubmit,
  }
}

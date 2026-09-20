'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { trackEvent } from '../../lib/analytics'
import { BRIEF_STEPS } from '../../lib/brief/branching'
import { getFeatureOptionsForResolvedType } from '../../lib/brief/options'
import { serializePersistableDraft } from '../../lib/brief/serializers'
import { useDraftAutosave } from '../../hooks/useDraftAutosave'
import { useDirectUpload } from '../../hooks/useDirectUpload'
import { useBriefWizard } from '../../hooks/useBriefWizard'
import StepBudgetTimeline from './steps/StepBudgetTimeline'
import StepContactSubmit from './steps/StepContactSubmit'
import StepDesign from './steps/StepDesign'
import StepFeatures from './steps/StepFeatures'
import StepProjectContext from './steps/StepProjectContext'
import StepProjectType from './steps/StepProjectType'
import { SummaryRow } from './steps/shared'
import InlineDetails from '../ui/InlineDetails'
import type {
  ApiErrorResponse,
  BriefOptionDictionary,
  BriefOptionItem,
  BriefStepId,
  BriefUploadAsset,
  BriefUploadItemStatus,
  BriefUploadListItem,
  ProjectBriefDraft,
  SubmitBriefResponse,
  UploadKind,
} from '../../lib/brief/types'
import type { BriefStepProps } from './steps/types'

type ProjectBriefPageClientProps = {
  initialDraft: ProjectBriefDraft
  initialStepId: BriefStepId
  optionDictionary: BriefOptionDictionary
  mode?: 'page' | 'modal'
  onRequestClose?: () => void
}

const CALCULATION_STEPS = [
  'Reviewing scope, complexity, and priorities.',
  'Balancing timeline, integrations, and delivery approach.',
  'Preparing a preliminary price and timeframe range.',
]

export default function ProjectBriefPageClient({
  initialDraft,
  initialStepId,
  optionDictionary,
  mode = 'page',
  onRequestClose,
}: ProjectBriefPageClientProps) {
  const isModal = mode === 'modal'
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    draft,
    currentStepId,
    currentStepIndex,
    currentStepDefinition,
    visibleFields,
    validation,
    isFirstStep,
    isLastStep,
    isSubmitting,
    patchDraft,
    syncServerDraftMeta,
    applyServerFieldErrors,
    goBack,
    validateCurrentStep,
    advanceToNextStep,
    prepareSubmit,
    startSubmitting,
    finishSubmitting,
  } = useBriefWizard({
    initialDraft,
    initialStepId,
  })
  const [uploadItems, setUploadItems] = useState<BriefUploadListItem[]>(() =>
    buildInitialUploadItems(initialDraft),
  )
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationStepIndex, setCalculationStepIndex] = useState(0)
  const draftRef = useRef(draft)
  const uploadItemsRef = useRef(uploadItems)
  const trackedStepIdsRef = useRef<Set<string>>(new Set())

  const {
    isUploading,
    pendingUploadCount,
    uploadError,
    clearUploadError,
    uploadFiles,
  } = useDirectUpload()

  const {
    isSaving,
    lastSavedAt,
    saveError,
    saveNow,
    savePatchNow,
  } = useDraftAutosave({
    draft,
    onSaveSuccess: payload => {
      syncServerDraftMeta({
        id: payload.briefId,
        updatedAt: payload.updatedAt,
        completionPercent: payload.completionPercent,
      })
      setUploadItems(currentItems =>
        markPersistedUploadItemsSaved(currentItems, draftRef.current),
      )
    },
  })

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  useEffect(() => {
    uploadItemsRef.current = uploadItems
  }, [uploadItems])

  useEffect(() => {
    const trackingKey = `${mode}:${currentStepId}`
    if (trackedStepIdsRef.current.has(trackingKey)) {
      return
    }

    trackedStepIdsRef.current.add(trackingKey)
    trackEvent('planner_step_viewed', {
      mode,
      step_id: currentStepId,
      step_index: currentStepIndex + 1,
    })
  }, [currentStepId, currentStepIndex, mode])

  useEffect(() => {
    if (!isCalculating) {
      setCalculationStepIndex(0)
      return
    }

    const timer = window.setInterval(() => {
      setCalculationStepIndex(index => (index + 1) % CALCULATION_STEPS.length)
    }, 900)

    return () => window.clearInterval(timer)
  }, [isCalculating])

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString())
    let changed = false

    if (draft.id) {
      if (nextParams.has('type')) {
        nextParams.delete('type')
        changed = true
      }

      if (nextParams.get('draft') !== draft.id) {
        nextParams.set('draft', draft.id)
        changed = true
      }
    } else if (nextParams.has('draft')) {
      nextParams.delete('draft')
      changed = true
    }

    if (nextParams.get('step') !== currentStepId) {
      nextParams.set('step', currentStepId)
      changed = true
    }

    if (!changed) {
      return
    }

    const nextUrl = `${pathname}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`
    router.replace(nextUrl, { scroll: false })
  }, [currentStepId, draft.id, pathname, router, searchParams])

  const handleSaveNow = useCallback(async () => saveNow(), [saveNow])

  const handleBack = useCallback(() => {
    setGlobalError(null)
    clearUploadError()
    goBack()
  }, [clearUploadError, goBack])

  const handleNext = useCallback(async () => {
    setGlobalError(null)
    clearUploadError()
    const result = validateCurrentStep()
    if (!result.isValidForNext) {
      return
    }

    try {
      await handleSaveNow()
    } catch {
      setGlobalError('Your latest changes could not be saved. Please try again before continuing.')
      return
    }

    trackEvent('planner_step_completed', {
      mode,
      step_id: currentStepId,
      step_index: currentStepIndex + 1,
      project_type: draft.resolvedProjectType ?? draft.projectType ?? 'unspecified',
    })
    advanceToNextStep()
  }, [
    advanceToNextStep,
    clearUploadError,
    currentStepId,
    currentStepIndex,
    draft.projectType,
    draft.resolvedProjectType,
    handleSaveNow,
    mode,
    validateCurrentStep,
  ])

  const submissionGuardMessage = useMemo(() => {
    const hasUploadingItems = uploadItems.some(item => item.status === 'uploading')
    const hasPendingSaveItems = uploadItems.some(item => item.status === 'pending-save')
    const hasFailedSaveItems = uploadItems.some(item => item.status === 'failed-save')

    if (isUploading || pendingUploadCount > 0 || hasUploadingItems) {
      return 'Please wait for uploads to finish before calculating your range.'
    }

    if (hasPendingSaveItems) {
      return 'Some uploaded files are still being attached to your brief. Please wait a moment and try again.'
    }

    if (hasFailedSaveItems) {
      return 'One or more uploaded files still need to be saved to your brief. Please retry save before continuing.'
    }

    if (isSaving) {
      return 'Please wait while your latest changes finish saving.'
    }

    return null
  }, [isSaving, isUploading, pendingUploadCount, uploadItems])

  const feedbackMessage = useMemo(
    () => globalError ?? uploadError ?? saveError,
    [globalError, saveError, uploadError],
  )

  const uploadItemsByKind = useMemo(
    () => groupUploadItemsByKind(uploadItems),
    [uploadItems],
  )

  const handleUploadFiles = useCallback(
    async (kind: UploadKind, files: File[]) => {
      setGlobalError(null)
      clearUploadError()
      const previousUploadItems = uploadItemsRef.current
      const uploadingItems = createUploadingItems(kind, files)
      setUploadItems(currentItems => applyUploadStart(currentItems, kind, uploadingItems))

      let ensuredBriefId = draft.id
      try {
        const saveResult = await handleSaveNow()
        ensuredBriefId = saveResult?.briefId ?? draft.id
      } catch {
        setUploadItems(previousUploadItems)
        setGlobalError('Please save your draft before uploading files.')
        return
      }

      try {
        const uploadedAssets = await uploadFiles({
          kind,
          files,
          briefId: ensuredBriefId,
        })

        if (uploadedAssets.length === 0) {
          setUploadItems(previousUploadItems)
          return
        }

        const pendingSaveItems = buildUploadedItems(kind, uploadedAssets, 'pending-save')
        setUploadItems(currentItems =>
          replaceUploadingItems(currentItems, kind, uploadingItems, pendingSaveItems),
        )

        let uploadPatch: Partial<ProjectBriefDraft>
        if (kind === 'reference_asset') {
          uploadPatch = {
            inspirationUploads: [...draft.inspirationUploads, ...uploadedAssets],
          }
        } else if (kind === 'voice_note') {
          uploadPatch = {
            voiceNote: uploadedAssets[0],
          }
        } else {
          uploadPatch = {
            additionalUploads: [...draft.additionalUploads, ...uploadedAssets],
          }
        }

        patchDraft(uploadPatch)

        try {
          const saveResult = await savePatchNow(uploadPatch)
          if (saveResult) {
            syncServerDraftMeta({
              id: saveResult.briefId,
              updatedAt: saveResult.updatedAt,
              completionPercent: saveResult.completionPercent,
            })
          }
          setUploadItems(currentItems =>
            updateUploadItemStatuses(
              currentItems,
              pendingSaveItems.map(item => item.uiId),
              'saved',
            ),
          )
        } catch {
          setUploadItems(currentItems =>
            updateUploadItemStatuses(
              currentItems,
              pendingSaveItems.map(item => item.uiId),
              'failed-save',
              'Upload finished, but saving it to your brief failed.',
            ),
          )
          setGlobalError('Your file uploaded, but the brief could not be saved yet. Please wait a moment or try again.')
        }
      } catch (error) {
        setUploadItems(previousUploadItems)
        setGlobalError(
          error instanceof Error
            ? error.message
            : 'Unable to upload your file right now.',
        )
      }
    },
    [
      clearUploadError,
      draft.additionalUploads,
      draft.id,
      draft.inspirationUploads,
      handleSaveNow,
      patchDraft,
      savePatchNow,
      syncServerDraftMeta,
      uploadFiles,
    ],
  )

  const handleRemoveUpload = useCallback(
    async (kind: UploadKind, asset: BriefUploadAsset) => {
      setGlobalError(null)
      clearUploadError()
      const previousDraft = draftRef.current
      const previousUploadItems = uploadItemsRef.current

      let removalPatch: Partial<ProjectBriefDraft>
      if (kind === 'reference_asset') {
        removalPatch = {
          inspirationUploads: draft.inspirationUploads.filter(
            existingAsset => existingAsset.id !== asset.id,
          ),
        }
      } else if (kind === 'voice_note') {
        removalPatch = {
          voiceNote:
            draft.voiceNote?.id === asset.id
              ? undefined
              : draft.voiceNote,
        }
      } else {
        removalPatch = {
          additionalUploads: draft.additionalUploads.filter(
            existingAsset => existingAsset.id !== asset.id,
          ),
        }
      }

      setUploadItems(currentItems =>
        currentItems.filter(currentItem => currentItem.asset?.id !== asset.id),
      )
      patchDraft(removalPatch)

      try {
        const saveResult = await savePatchNow(removalPatch)
        if (saveResult) {
          syncServerDraftMeta({
            id: saveResult.briefId,
            updatedAt: saveResult.updatedAt,
            completionPercent: saveResult.completionPercent,
          })
        }
      } catch {
        setUploadItems(previousUploadItems)
        patchDraft(getUploadRestorePatch(kind, asset, previousDraft))
        setGlobalError('The file was removed locally, but the brief could not be saved yet. Please try again.')
      }
    },
    [
      clearUploadError,
      draft.additionalUploads,
      draft.inspirationUploads,
      draft.voiceNote,
      patchDraft,
      savePatchNow,
      syncServerDraftMeta,
    ],
  )

  const handleRetryUploadSave = useCallback(
    async (_kind: UploadKind, item: BriefUploadListItem) => {
      if (!item.asset) {
        return
      }

      setGlobalError(null)
      clearUploadError()
      setUploadItems(currentItems =>
        updateUploadItemStatuses(currentItems, [item.uiId], 'pending-save'),
      )

      try {
        const saveResult = await saveNow()
        if (saveResult) {
          syncServerDraftMeta({
            id: saveResult.briefId,
            updatedAt: saveResult.updatedAt,
            completionPercent: saveResult.completionPercent,
          })
        }
        setUploadItems(currentItems =>
          markPersistedUploadItemsSaved(currentItems, draftRef.current),
        )
      } catch {
        setUploadItems(currentItems =>
          updateUploadItemStatuses(
            currentItems,
            [item.uiId],
            'failed-save',
            'Metadata still needs to be saved to your brief.',
          ),
        )
        setGlobalError('Could not save uploaded file metadata. Please try Retry Save again.')
      }
    },
    [clearUploadError, saveNow, syncServerDraftMeta],
  )

  const handleSubmit = useCallback(async () => {
    setGlobalError(null)
    clearUploadError()
    if (submissionGuardMessage) {
      setGlobalError(submissionGuardMessage)
      return
    }

    const submissionCheck = prepareSubmit()
    if (!submissionCheck.ok) {
      return
    }

    startSubmitting()
    try {
      await handleSaveNow()
    } catch {
      setGlobalError('Your latest changes could not be saved. Please try again before continuing.')
      finishSubmitting()
      return
    }

    setIsCalculating(true)

    try {
      const [response] = await Promise.all([
        fetch('/api/project-brief/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            briefId: draft.id,
            payload: serializePersistableDraft(draft),
          }),
        }),
        new Promise(resolve => window.setTimeout(resolve, 2800)),
      ])

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as ApiErrorResponse | null
        if (errorPayload?.error.fieldErrors) {
          applyServerFieldErrors(errorPayload.error.fieldErrors)
        }
        setGlobalError(errorPayload?.error.message ?? 'Unable to submit your brief.')
        return
      }

      const result = (await response.json()) as SubmitBriefResponse
      trackEvent('planner_submitted', {
        mode,
        project_type: draft.resolvedProjectType ?? draft.projectType ?? 'unspecified',
        budget_band: draft.budgetBand ?? 'unspecified',
        launch_window: draft.launchWindow ?? 'unspecified',
      })
      router.push(result.successUrl)
    } catch (error) {
      setGlobalError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your brief right now.',
      )
    } finally {
      setIsCalculating(false)
      finishSubmitting()
    }
  }, [
    applyServerFieldErrors,
    clearUploadError,
    draft,
    finishSubmitting,
    handleSaveNow,
    prepareSubmit,
    router,
    startSubmitting,
    submissionGuardMessage,
    mode,
  ])

  const shellClassName = isModal
    ? 'flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[36px] border border-black/8 bg-white text-primary shadow-[0_36px_120px_rgba(0,0,0,0.18)]'
    : 'min-h-screen bg-white text-primary'
  const containerClassName = isModal ? '' : 'mx-auto max-w-7xl lg:px-8'

  return (
    <>
      {isCalculating ? (
        <CalculationOverlay
          title="Calculating your preliminary range"
          message={CALCULATION_STEPS[calculationStepIndex]}
        />
      ) : null}

      <div className={shellClassName}>
        <div className="border-b border-black/5 bg-white/90 backdrop-blur">
          <div
            className={`flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between ${containerClassName}`}
          >
            <div>
              {!isModal ? (
                <Link
                  href="/"
                  className="mb-3 inline-flex text-xs uppercase tracking-[0.22em] text-secondary transition hover:text-primary"
                >
                  Back to home
                </Link>
              ) : null}
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">
                Business Project Planner
              </p>
              <h1 className="text-lg font-semibold">
                Tell us where the business feels messy
              </h1>
            </div>
            <div className="flex flex-col gap-3 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between lg:text-right">
              <div>
                <p>Guided business planning</p>
                <p>Start with the bottleneck, not a technical spec.</p>
              </div>
              {isModal && onRequestClose ? (
                <button
                  type="button"
                  onClick={onRequestClose}
                  className="self-start rounded-full border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black/3 hover:text-primary sm:self-auto"
                >
                  Close
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className={isModal ? 'overflow-y-auto' : ''}>
          <div className="sticky top-0 z-20 border-b border-black/5 bg-section-bg/80 backdrop-blur">
            <div
              className={`flex flex-col gap-3 px-4 py-3 sm:px-6 ${containerClassName}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="min-w-fit text-sm font-medium">
                  Step {currentStepIndex + 1} of {BRIEF_STEPS.length}
                </span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-300"
                    style={{
                      width: `${Math.max(
                        draft.completionPercent,
                        ((currentStepIndex + 1) / BRIEF_STEPS.length) * 100,
                      )}%`,
                    }}
                  />
                </div>
                <AutosaveStatus
                  isSaving={isSaving}
                  lastSavedAt={lastSavedAt}
                  saveError={saveError}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {BRIEF_STEPS.map((step, index) => {
                  const isCurrent = step.id === currentStepId
                  const isCompleted = index < currentStepIndex

                  return (
                    <div
                      key={step.id}
                      className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        isCurrent
                          ? 'border-black bg-black text-white'
                          : isCompleted
                            ? 'border-black/10 bg-white text-primary'
                            : 'border-black/8 bg-white/60 text-secondary'
                      }`}
                    >
                      {index + 1}. {step.title}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <main
            className={`grid gap-8 px-4 py-8 sm:px-6 ${
              isModal
                ? 'lg:grid-cols-[minmax(0,1fr)_300px]'
                : 'mx-auto max-w-7xl lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8'
            }`}
          >
            <section className="rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_20px_80px_rgba(0,0,0,0.04)] sm:p-8">
              <header className="mb-8">
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-secondary">
                  {currentStepDefinition.id}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {currentStepDefinition.title}
                </h2>
                <InlineDetails label="Why this matters" className="mt-4">
                  <p>{currentStepDefinition.description}</p>
                </InlineDetails>
              </header>

              {feedbackMessage ? (
                <div
                  role="alert"
                  className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                >
                  {feedbackMessage}
                </div>
              ) : null}

              <StepRenderer
                stepId={currentStepId}
                draft={draft}
                options={optionDictionary}
                visibleFields={visibleFields}
                validation={validation}
                resolvedProjectType={draft.resolvedProjectType}
                onPatch={patchDraft}
                isUploading={isUploading}
                pendingUploadCount={pendingUploadCount}
                uploadItems={uploadItemsByKind}
                submitGuardMessage={
                  currentStepId === 'contact-submit'
                    ? submissionGuardMessage
                    : null
                }
                onUploadFiles={handleUploadFiles}
                onRemoveUpload={handleRemoveUpload}
                onRetryUploadSave={handleRetryUploadSave}
              />

              <div
                className={`mt-10 border-t border-black/8 pt-6 ${
                  isModal
                    ? 'flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4'
                    : 'hidden lg:flex lg:items-center lg:justify-between lg:gap-4'
                }`}
              >
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isFirstStep || isSubmitting}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary transition hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={isLastStep ? handleSubmit : handleNext}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLastStep
                    ? isSubmitting
                      ? 'Calculating...'
                      : submissionGuardMessage
                        ? 'Finish Uploads First'
                        : 'Double-check & calculate'
                    : 'Continue'}
                </button>
              </div>
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <SummaryRail draft={draft} options={optionDictionary} />
              </div>
            </aside>
          </main>

          {!isModal ? (
            <div className="border-t border-black/8 bg-white/95 px-4 py-4 shadow-[0_-12px_30px_rgba(0,0,0,0.03)] lg:hidden">
              <div className="mx-auto max-w-7xl">
                <InlineDetails label="Brief snapshot">
                  <SummaryRail draft={draft} options={optionDictionary} compact />
                </InlineDetails>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isFirstStep || isSubmitting}
                    className="flex-1 rounded-full border border-black/10 px-4 py-3 text-sm font-medium disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={isLastStep ? handleSubmit : handleNext}
                    disabled={isSubmitting}
                    className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {isLastStep
                      ? isSubmitting
                        ? 'Calculating...'
                        : submissionGuardMessage
                          ? 'Finish Uploads First'
                          : 'Double-check & calculate'
                      : 'Continue'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

function StepRenderer({
  stepId,
  ...props
}: BriefStepProps & { stepId: BriefStepId }) {
  switch (stepId) {
    case 'project-type':
      return <StepProjectType {...props} />
    case 'project-context':
      return <StepProjectContext {...props} />
    case 'features':
      return <StepFeatures {...props} />
    case 'design':
      return <StepDesign {...props} />
    case 'budget-timeline':
      return <StepBudgetTimeline {...props} />
    case 'contact-submit':
      return <StepContactSubmit {...props} />
    default:
      return null
  }
}

function SummaryRail({
  draft,
  options,
  compact = false,
}: {
  draft: ProjectBriefDraft
  options: BriefOptionDictionary
  compact?: boolean
}) {
  const projectTypeLabel = findLabel(options.projectTypes, draft.projectType)
  const goalLabels = findLabels(options.businessGoals, draft.businessGoals)
  const featureLabels = findLabels(
    getFeatureOptionsForResolvedType(draft.resolvedProjectType),
    draft.featureSelections,
  )
  const goalsPreview =
    goalLabels.length > 0
      ? `${goalLabels.slice(0, 2).join(', ')}${goalLabels.length > 2 ? ` +${goalLabels.length - 2}` : ''}`
      : 'Not chosen yet'
  const featuresPreview =
    featureLabels.length > 0
      ? `${featureLabels.slice(0, 3).join(', ')}${featureLabels.length > 3 ? ` +${featureLabels.length - 3}` : ''}`
      : 'Not chosen yet'

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-black/8 bg-section-bg p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary">
          Project snapshot
        </p>
        <div className="mt-4 space-y-4 text-sm">
          <SummaryRow label="Type" value={projectTypeLabel ?? 'Not chosen yet'} />
          <SummaryRow label="Goals" value={goalsPreview} />
          <SummaryRow label="Features" value={featuresPreview} />
        </div>
      </div>

      {!compact ? (
        <div className="rounded-[24px] border border-black/8 bg-white p-5">
          <p className="text-sm font-medium">No early price anchoring</p>
          <p className="mt-2 text-sm text-secondary">
            We calculate the preliminary range only after the final double-check, so the pricing direction reflects the full brief instead of a half-finished guess.
          </p>
        </div>
      ) : null}

      {!compact ? (
        <div className="rounded-[24px] border border-black/8 bg-white p-5">
          <p className="text-sm font-medium">Direct review</p>
          <p className="mt-2 text-sm text-secondary">
            You do not need to write a technical spec. Pick what fits, skip what does not, and I will shape the rest during review.
          </p>
        </div>
      ) : null}
    </div>
  )
}

function AutosaveStatus({
  isSaving,
  lastSavedAt,
  saveError,
}: {
  isSaving: boolean
  lastSavedAt: string | null
  saveError: string | null
}) {
  const label = saveError
    ? 'Save failed'
    : isSaving
      ? 'Saving...'
      : lastSavedAt
        ? `Saved ${formatRelativeTime(lastSavedAt)}`
        : 'Ready'

  return (
    <span
      className={`min-w-fit text-xs ${saveError ? 'text-red-700' : 'text-secondary'}`}
    >
      {label}
    </span>
  )
}

function CalculationOverlay({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-white/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] border border-black/8 bg-white p-8 text-center shadow-[0_24px_90px_rgba(0,0,0,0.12)]">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-black/10 border-t-black" />
        <p className="mt-6 text-xs uppercase tracking-[0.22em] text-secondary">
          Calculating
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-secondary">{message}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/8">
          <div className="h-full w-full origin-left animate-pulse rounded-full bg-black" />
        </div>
      </div>
    </div>
  )
}

function findLabel<T extends string>(
  options: BriefOptionItem<T>[],
  key: T | undefined,
): string | null {
  if (!key) return null
  return options.find(option => option.key === key)?.label ?? null
}

function findLabels<T extends string>(
  options: BriefOptionItem<T>[],
  values: T[],
): string[] {
  const optionMap = new Map(options.map(option => [option.key, option.label]))
  return values.map(value => optionMap.get(value)).filter(Boolean) as string[]
}

function formatRelativeTime(value: string): string {
  const savedAt = new Date(value).getTime()
  if (Number.isNaN(savedAt)) return 'recently'

  const diffSeconds = Math.max(0, Math.round((Date.now() - savedAt) / 1000))
  if (diffSeconds < 5) return 'just now'
  if (diffSeconds < 60) return `${diffSeconds}s ago`

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  return `${diffHours}h ago`
}

function buildInitialUploadItems(
  draft: ProjectBriefDraft,
): BriefUploadListItem[] {
  return [
    ...draft.inspirationUploads.map(asset => createUploadListItem('reference_asset', asset, 'saved')),
    ...draft.additionalUploads.map(asset => createUploadListItem('additional_file', asset, 'saved')),
    ...(draft.voiceNote ? [createUploadListItem('voice_note', draft.voiceNote, 'saved')] : []),
  ]
}

function createUploadListItem(
  kind: UploadKind,
  asset: BriefUploadAsset,
  status: BriefUploadItemStatus,
  errorMessage?: string,
): BriefUploadListItem {
  return {
    uiId: asset.id,
    kind,
    filename: asset.originalFilename,
    status,
    asset,
    errorMessage,
  }
}

function createUploadingItems(
  kind: UploadKind,
  files: File[],
): BriefUploadListItem[] {
  return files.map(file => ({
    uiId:
      typeof crypto !== 'undefined'
        ? crypto.randomUUID()
        : `${Date.now()}-${file.name}`,
    kind,
    filename: file.name,
    status: 'uploading',
  }))
}

function buildUploadedItems(
  kind: UploadKind,
  assets: BriefUploadAsset[],
  status: BriefUploadItemStatus,
): BriefUploadListItem[] {
  return assets.map(asset => createUploadListItem(kind, asset, status))
}

function applyUploadStart(
  currentItems: BriefUploadListItem[],
  kind: UploadKind,
  uploadingItems: BriefUploadListItem[],
): BriefUploadListItem[] {
  if (kind === 'voice_note') {
    return [
      ...currentItems.filter(item => item.kind !== kind),
      ...uploadingItems,
    ]
  }

  return [...currentItems, ...uploadingItems]
}

function replaceUploadingItems(
  currentItems: BriefUploadListItem[],
  kind: UploadKind,
  uploadingItems: BriefUploadListItem[],
  nextItems: BriefUploadListItem[],
): BriefUploadListItem[] {
  const uploadingIds = new Set(uploadingItems.map(item => item.uiId))
  const preservedItems = currentItems.filter(item => !uploadingIds.has(item.uiId))

  if (kind === 'voice_note') {
    return [...preservedItems.filter(item => item.kind !== kind), ...nextItems]
  }

  return [...preservedItems, ...nextItems]
}

function updateUploadItemStatuses(
  currentItems: BriefUploadListItem[],
  targetIds: string[],
  status: BriefUploadItemStatus,
  errorMessage?: string,
): BriefUploadListItem[] {
  const targetIdSet = new Set(targetIds)

  return currentItems.map(item => {
    if (!targetIdSet.has(item.uiId)) {
      return item
    }

    return {
      ...item,
      status,
      errorMessage,
    }
  })
}

function markPersistedUploadItemsSaved(
  currentItems: BriefUploadListItem[],
  draft: ProjectBriefDraft,
): BriefUploadListItem[] {
  return currentItems.map(item => {
    if (!item.asset) {
      return item
    }

    if (!isAssetPersistedInDraft(item.kind, item.asset, draft)) {
      return item
    }

    if (item.status === 'saved') {
      return item
    }

    return {
      ...item,
      status: 'saved',
      errorMessage: undefined,
    }
  })
}

function isAssetPersistedInDraft(
  kind: UploadKind,
  asset: BriefUploadAsset,
  draft: ProjectBriefDraft,
): boolean {
  if (kind === 'reference_asset') {
    return draft.inspirationUploads.some(currentAsset => currentAsset.id === asset.id)
  }

  if (kind === 'additional_file') {
    return draft.additionalUploads.some(currentAsset => currentAsset.id === asset.id)
  }

  return draft.voiceNote?.id === asset.id
}

function groupUploadItemsByKind(
  items: BriefUploadListItem[],
): Record<UploadKind, BriefUploadListItem[]> {
  return {
    reference_asset: items.filter(item => item.kind === 'reference_asset'),
    additional_file: items.filter(item => item.kind === 'additional_file'),
    voice_note: items.filter(item => item.kind === 'voice_note'),
  }
}

function getUploadRestorePatch(
  kind: UploadKind,
  asset: BriefUploadAsset,
  draft: ProjectBriefDraft,
): Partial<ProjectBriefDraft> {
  if (kind === 'reference_asset') {
    return {
      inspirationUploads: [...draft.inspirationUploads],
    }
  }

  if (kind === 'additional_file') {
    return {
      additionalUploads: [...draft.additionalUploads],
    }
  }

  return {
    voiceNote: asset,
  }
}

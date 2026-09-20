'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ProjectBriefPageClient from '../brief/ProjectBriefPageClient'
import { trackEvent } from '../../lib/analytics'
import { sanitizeDraftForBranching } from '../../lib/brief/branching'
import { createEmptyBriefDraft } from '../../lib/brief/defaults'
import type {
  BriefOptionDictionary,
  BriefStepId,
  ProjectBriefDraft,
  ProjectTypeKey,
} from '../../lib/brief/types'

type HomeBriefModalControllerProps = {
  initialDraft: ProjectBriefDraft
  initialStepId: BriefStepId
  optionDictionary: BriefOptionDictionary
  openOnLoad: boolean
}

const launcherOptions: Array<{
  key: ProjectTypeKey
  label: string
  hint: string
}> = [
  {
    key: 'showcase',
    label: 'Website',
    hint: 'A lean site to explain the business clearly and build trust.',
  },
  {
    key: 'ecommerce',
    label: 'Store',
    hint: 'A product store with checkout, fulfilment, and simpler operations.',
  },
  {
    key: 'system',
    label: 'System',
    hint: 'A workflow tool, portal, or internal setup that reduces repeated admin.',
  },
  {
    key: 'unsure',
    label: 'Not sure',
    hint: 'Start with the bottleneck and let the planner guide the direction.',
  },
]

type ModalStage = 'chooser' | 'wizard'

function buildSeedFromType(projectType?: ProjectTypeKey) {
  const currentStepId: BriefStepId =
    projectType && projectType !== 'unsure'
      ? 'project-context'
      : 'project-type'

  const draft = sanitizeDraftForBranching(
    createEmptyBriefDraft({
      currentStepId,
      projectType,
    }),
  )

  return {
    draft,
    stepId: currentStepId,
  }
}

function isMeaningfulDraft(
  draft: ProjectBriefDraft,
  stepId: BriefStepId,
) {
  return Boolean(draft.id || draft.projectType || stepId !== 'project-type')
}

export default function HomeBriefModalController({
  initialDraft,
  initialStepId,
  optionDictionary,
  openOnLoad,
}: HomeBriefModalControllerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialWizardSeed = useMemo(
    () => sanitizeDraftForBranching(initialDraft),
    [initialDraft],
  )

  const [isOpen, setIsOpen] = useState(openOnLoad)
  const [stage, setStage] = useState<ModalStage>(() =>
    openOnLoad && isMeaningfulDraft(initialWizardSeed, initialStepId)
      ? 'wizard'
      : 'chooser',
  )
  const [wizardDraft, setWizardDraft] = useState<ProjectBriefDraft>(initialWizardSeed)
  const [wizardStepId, setWizardStepId] = useState<BriefStepId>(initialStepId)
  const [wizardKey, setWizardKey] = useState(0)

  const openWizard = useCallback((projectType?: ProjectTypeKey) => {
    trackEvent('planner_quick_start_selected', {
      project_type: projectType ?? 'unspecified',
    })
    const seed = buildSeedFromType(projectType)
    setWizardDraft(seed.draft)
    setWizardStepId(seed.stepId)
    setStage('wizard')
    setIsOpen(true)
    setWizardKey(current => current + 1)
  }, [])

  const openChooser = useCallback(() => {
    trackEvent('planner_modal_opened', {
      source: 'homepage',
    })
    setStage('chooser')
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleOpenBrief = (event: WindowEventMap['open-brief']) => {
      const nextProjectType = event.detail?.projectType

      if (nextProjectType) {
        openWizard(nextProjectType)
        return
      }

      openChooser()
    }

    window.addEventListener('open-brief', handleOpenBrief)
    return () => {
      window.removeEventListener('open-brief', handleOpenBrief)
    }
  }, [openChooser, openWizard])

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString())
    let changed = false

    if (isOpen) {
      if (nextParams.get('brief') !== 'open') {
        nextParams.set('brief', 'open')
        changed = true
      }
    } else {
      for (const key of ['brief', 'draft', 'step', 'type']) {
        if (nextParams.has(key)) {
          nextParams.delete(key)
          changed = true
        }
      }
    }

    if (!changed) return

    const nextUrl = `${pathname}${nextParams.toString() ? `?${nextParams.toString()}` : ''}`
    router.replace(nextUrl, { scroll: false })
  }, [isOpen, pathname, router, searchParams])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-md"
      onClick={event => {
        if (event.target === event.currentTarget) {
          closeModal()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Studio project planner"
    >
      {stage === 'chooser' ? (
        <div className="w-full max-w-3xl rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_30px_120px_rgba(0,0,0,0.14)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">
                Quick Start
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                Pick the closest place to start.
              </h3>
              <p className="mt-3 text-sm leading-7 text-secondary sm:text-base">
                This keeps the first step light. Once you choose the closest fit,
                the guided planner stays in this same workspace and helps shape the
                right first move.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="self-start rounded-full border border-black/10 px-3 py-1.5 text-sm text-secondary transition hover:bg-black/3 hover:text-primary sm:self-auto"
            >
              Close
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {launcherOptions.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => openWizard(option.key)}
                className="rounded-[24px] border border-black/8 bg-section-bg p-5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
              >
                <p className="text-lg font-semibold tracking-tight">
                  {option.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-secondary">
                  {option.hint}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:Rugee.coder@gmail.com"
              className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary transition hover:bg-black/3"
            >
              Email instead
            </a>
          </div>
        </div>
      ) : (
        <ProjectBriefPageClient
          key={`modal-${wizardKey}`}
          initialDraft={wizardDraft}
          initialStepId={wizardStepId}
          optionDictionary={optionDictionary}
          mode="modal"
          onRequestClose={closeModal}
        />
      )}
    </div>
  )
}

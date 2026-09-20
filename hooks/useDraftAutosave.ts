'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { patchDraftState } from '../lib/brief/branching'
import {
  diffPersistableDraftPayload,
  isEmptyPersistablePatch,
  serializePersistableDraft,
} from '../lib/brief/serializers'
import type {
  ApiErrorResponse,
  BriefDraftPatch,
  BriefStepId,
  ProjectBriefDraft,
  SaveDraftResponse,
} from '../lib/brief/types'

export interface UseDraftAutosaveOptions {
  draft: ProjectBriefDraft
  debounceMs?: number
  onSaveSuccess?: (payload: {
    briefId: string
    currentStepId: BriefStepId
    completionPercent: number
    updatedAt: string
  }) => void
}

export interface UseDraftAutosaveResult {
  isSaving: boolean
  lastSavedAt: string | null
  saveError: string | null
  saveNow: () => Promise<SaveDraftResponse | null>
  savePatchNow: (patch: BriefDraftPatch) => Promise<SaveDraftResponse | null>
}

export function useDraftAutosave({
  draft,
  debounceMs = 900,
  onSaveSuccess,
}: UseDraftAutosaveOptions): UseDraftAutosaveResult {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(draft.updatedAt ?? null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const persistablePayload = useMemo(
    () => serializePersistableDraft(draft),
    [draft],
  )

  const lastSavedPayloadRef = useRef(persistablePayload)
  const lastSavedStepIdRef = useRef<BriefStepId>(draft.currentStepId)
  const inFlightPayloadRef = useRef<string | null>(null)
  const draftIdRef = useRef<string | undefined>(draft.id)
  const draftRef = useRef<ProjectBriefDraft>(draft)

  useEffect(() => {
    draftRef.current = draft
    if (draft.id) {
      draftIdRef.current = draft.id
    }
  }, [draft, draft.id])

  const performSave = useCallback(async (
    force = false,
    explicitDraft?: ProjectBriefDraft,
  ): Promise<SaveDraftResponse | null> => {
    const effectiveDraft = explicitDraft ?? draftRef.current
    const nextPayload = serializePersistableDraft(effectiveDraft)
    const patch = diffPersistableDraftPayload(lastSavedPayloadRef.current, nextPayload)
    const stepId = effectiveDraft.currentStepId
    const stepChanged = stepId !== lastSavedStepIdRef.current
    const hasDraftId = Boolean(draftIdRef.current)

    if (isEmptyPersistablePatch(patch) && !stepChanged && (!force || hasDraftId)) {
      return null
    }

    setIsSaving(true)
    setSaveError(null)
    inFlightPayloadRef.current = JSON.stringify(nextPayload)

    try {
      const response = await fetch('/api/project-brief/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefId: draftIdRef.current,
          currentStepId: stepId,
          patch,
        }),
      })

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as ApiErrorResponse | null
        throw new Error(errorPayload?.error.message ?? 'Unable to save your draft.')
      }

      const result = (await response.json()) as SaveDraftResponse
      lastSavedPayloadRef.current = nextPayload
      lastSavedStepIdRef.current = result.currentStepId
      draftIdRef.current = result.briefId
      setLastSavedAt(result.updatedAt)
      onSaveSuccess?.({
        briefId: result.briefId,
        currentStepId: result.currentStepId,
        completionPercent: result.completionPercent,
        updatedAt: result.updatedAt,
      })

      return result
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Unable to save your draft.')
      throw error instanceof Error ? error : new Error('Unable to save your draft.')
    } finally {
      setIsSaving(false)
      inFlightPayloadRef.current = null
    }
  }, [onSaveSuccess])

  useEffect(() => {
    const nextPayloadString = JSON.stringify(persistablePayload)
    const stepChanged = draft.currentStepId !== lastSavedStepIdRef.current

    if (
      nextPayloadString === JSON.stringify(lastSavedPayloadRef.current) &&
      !stepChanged
    ) {
      return
    }

    if (nextPayloadString === inFlightPayloadRef.current) {
      return
    }

    const timeout = window.setTimeout(() => {
      void performSave(false).catch(() => undefined)
    }, debounceMs)

    return () => window.clearTimeout(timeout)
  }, [debounceMs, performSave, persistablePayload])

  const saveNow = useCallback(() => performSave(true), [performSave])
  const savePatchNow = useCallback(
    (patch: BriefDraftPatch) => {
      const nextDraft = patchDraftState(draftRef.current, patch)
      return performSave(true, nextDraft)
    },
    [performSave],
  )

  return {
    isSaving,
    lastSavedAt,
    saveError,
    saveNow,
    savePatchNow,
  }
}

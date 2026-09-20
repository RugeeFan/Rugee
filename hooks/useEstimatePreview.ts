'use client'

import { useMemo } from 'react'
import { computeEstimatePreview } from '../lib/brief/estimator'
import type {
  BriefEstimateSnapshot,
  ProjectBriefDraft,
} from '../lib/brief/types'

export function useEstimatePreview(
  draft: ProjectBriefDraft,
): BriefEstimateSnapshot | null {
  return useMemo(() => computeEstimatePreview(draft), [draft])
}


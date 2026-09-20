import type {
  BriefUploadAsset,
  BriefUploadListItem,
  BriefDraftPatch,
  BriefFieldKey,
  BriefOptionDictionary,
  ProjectBriefDraft,
  ResolvedProjectTypeKey,
  StepValidationResult,
  UploadKind,
} from '../../../lib/brief/types'

export interface BriefStepProps {
  draft: ProjectBriefDraft
  options: BriefOptionDictionary
  visibleFields: BriefFieldKey[]
  validation: StepValidationResult
  resolvedProjectType?: ResolvedProjectTypeKey
  onPatch: (patch: BriefDraftPatch) => void
  isUploading?: boolean
  pendingUploadCount?: number
  uploadItems?: Record<UploadKind, BriefUploadListItem[]>
  submitGuardMessage?: string | null
  onUploadFiles?: (kind: UploadKind, files: File[]) => Promise<void>
  onRemoveUpload?: (
    kind: UploadKind,
    asset: BriefUploadAsset,
  ) => Promise<void>
  onRetryUploadSave?: (
    kind: UploadKind,
    item: BriefUploadListItem,
  ) => Promise<void>
}

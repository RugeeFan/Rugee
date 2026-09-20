export type BriefStepId =
  | 'project-type'
  | 'project-context'
  | 'features'
  | 'design'
  | 'budget-timeline'
  | 'contact-submit'

export type BriefStatusKey =
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'follow_up_needed'
  | 'quoted'
  | 'won'
  | 'closed_lost'
  | 'archived'

export type ProjectTypeKey =
  | 'showcase'
  | 'corporate'
  | 'ecommerce'
  | 'system'
  | 'unsure'

export type ResolvedProjectTypeKey =
  | 'showcase'
  | 'corporate'
  | 'ecommerce'
  | 'system'

export type UnsurePrimaryNeedKey =
  | 'brand'
  | 'leads'
  | 'sales'
  | 'operations'
  | 'booking'

export type UnsureNeedKey =
  | 'content_pages'
  | 'lead_forms'
  | 'sell_online'
  | 'member_login'
  | 'internal_management'
  | 'booking_calendar'

export type IndustryKey =
  | 'professional_services'
  | 'home_trades'
  | 'hospitality'
  | 'beauty_wellness'
  | 'education_coaching'
  | 'retail_brand'
  | 'technology'
  | 'real_estate'
  | 'non_profit'
  | 'other'

export type BusinessGoalKey =
  | 'build_trust'
  | 'generate_leads'
  | 'sell_online'
  | 'reduce_manual_work'
  | 'support_booking'
  | 'publish_content'

export type CurrentPresenceKey =
  | 'no_website'
  | 'legacy_website'
  | 'low_conversion_website'
  | 'social_only'
  | 'prototype_ready'

export type BuildScopeKey =
  | 'new_build'
  | 'redesign'
  | 'extend_existing'

export type ContentReadinessKey =
  | 'content_ready'
  | 'content_partial'
  | 'need_content_guidance'

export type PageCountBandKey =
  | 'pages_1_5'
  | 'pages_6_12'
  | 'pages_13_plus'

export type CatalogSizeBandKey =
  | 'sku_1_20'
  | 'sku_21_100'
  | 'sku_100_plus'

export type SystemAudienceBandKey =
  | 'internal_small_team'
  | 'multi_role_team'
  | 'customer_facing'

export type IntegrationLevelKey =
  | 'none'
  | 'simple'
  | 'complex'

export type StyleDirectionKey =
  | 'editorial_minimal'
  | 'modern_premium'
  | 'tech_forward'
  | 'warm_service'
  | 'luxury_brand'
  | 'creative_playful'
  | 'not_sure'

export type ColorDirectionKey =
  | 'neutral_bw'
  | 'dark_premium'
  | 'light_airy'
  | 'warm_accent'
  | 'cool_accent'
  | 'follow_existing_brand'

export type MotionLevelKey =
  | 'minimal'
  | 'subtle'
  | 'expressive'

export type BudgetBandKey =
  | 'under_5k'
  | 'band_5k_10k'
  | 'band_10k_20k'
  | 'band_20k_40k'
  | 'band_40k_plus'
  | 'not_sure'

export type LaunchWindowKey =
  | 'asap'
  | 'within_1_month'
  | 'within_2_3_months'
  | 'flexible'

export type PreferredContactMethodKey =
  | 'email'
  | 'whatsapp'
  | 'phone'

export type UploadKind =
  | 'reference_asset'
  | 'additional_file'
  | 'voice_note'

export type FeatureKey =
  | 'portfolio'
  | 'contact_form'
  | 'cms'
  | 'blog_news'
  | 'seo_setup'
  | 'multilingual'
  | 'animation_polish'
  | 'booking'
  | 'service_pages'
  | 'case_studies'
  | 'team_careers'
  | 'crm_integration'
  | 'cart_checkout'
  | 'payments'
  | 'order_admin'
  | 'inventory'
  | 'discounts'
  | 'customer_accounts'
  | 'reviews_wishlist'
  | 'subscriptions'
  | 'shipping_rules'
  | 'auth_roles'
  | 'admin_dashboard'
  | 'records_management'
  | 'reporting'
  | 'approval_flow'
  | 'notifications'
  | 'file_management'
  | 'crm_workflow'
  | 'third_party_integrations'

export type ValidationSeverity = 'blocking' | 'advisory'
export type ValidationMode = 'step' | 'submit'

export interface BriefUploadAsset {
  id: string
  kind: UploadKind
  publicId: string
  secureUrl: string
  resourceType: 'image' | 'video' | 'raw' | 'audio'
  mimeType: string
  originalFilename: string
  bytes: number
  durationSec?: number
}

export type BriefUploadItemStatus =
  | 'uploading'
  | 'pending-save'
  | 'saved'
  | 'failed-save'

export interface BriefUploadListItem {
  uiId: string
  kind: UploadKind
  filename: string
  status: BriefUploadItemStatus
  asset?: BriefUploadAsset
  errorMessage?: string
}

export interface EstimateLineItem {
  code: string
  label: string
  priceMin: number
  priceMax: number
  weeksMin: number
  weeksMax: number
}

export interface BriefEstimateSnapshot {
  version: 'v1'
  currency: 'AUD'
  priceMin: number
  priceMax: number
  weeksMin: number
  weeksMax: number
  phaseRecommendation: boolean
  budgetFit: 'below' | 'aligned' | 'above' | 'unknown'
  lineItems: EstimateLineItem[]
  generatedAt: string
}

export interface ProjectBriefDraft {
  id?: string
  publicCode?: string
  status: BriefStatusKey
  currentStepId: BriefStepId
  completionPercent: number

  projectType?: ProjectTypeKey
  resolvedProjectType?: ResolvedProjectTypeKey
  unsurePrimaryNeed?: UnsurePrimaryNeedKey
  unsureNeeds: UnsureNeedKey[]

  industry?: IndustryKey
  businessGoals: BusinessGoalKey[]
  currentPresence?: CurrentPresenceKey
  buildScope?: BuildScopeKey
  contentReadiness?: ContentReadinessKey

  pageCountBand?: PageCountBandKey
  catalogSizeBand?: CatalogSizeBandKey
  systemAudienceBand?: SystemAudienceBandKey
  integrationLevel?: IntegrationLevelKey
  featureSelections: FeatureKey[]
  customFeatureNote?: string

  styleDirection?: StyleDirectionKey
  colorDirection?: ColorDirectionKey
  motionLevel?: MotionLevelKey
  referenceLinks: string[]
  inspirationUploads: BriefUploadAsset[]

  budgetBand?: BudgetBandKey
  launchWindow?: LaunchWindowKey
  phasedDelivery?: boolean
  needsDiscoverySupport?: boolean

  additionalNotes?: string
  voiceNote?: BriefUploadAsset
  additionalUploads: BriefUploadAsset[]

  contactName?: string
  contactEmail?: string
  contactPhone?: string
  companyName?: string
  preferredContactMethod?: PreferredContactMethodKey
  consentToFollowUp?: boolean

  estimateFrozen?: BriefEstimateSnapshot

  createdAt?: string
  updatedAt?: string
  submittedAt?: string
}

export type BriefDraftPatch = Partial<ProjectBriefDraft>
export type BriefFieldKey = keyof ProjectBriefDraft

export type PersistableBriefFieldKey =
  | 'projectType'
  | 'unsurePrimaryNeed'
  | 'unsureNeeds'
  | 'industry'
  | 'businessGoals'
  | 'currentPresence'
  | 'buildScope'
  | 'contentReadiness'
  | 'pageCountBand'
  | 'catalogSizeBand'
  | 'systemAudienceBand'
  | 'integrationLevel'
  | 'featureSelections'
  | 'customFeatureNote'
  | 'styleDirection'
  | 'colorDirection'
  | 'motionLevel'
  | 'referenceLinks'
  | 'inspirationUploads'
  | 'budgetBand'
  | 'launchWindow'
  | 'phasedDelivery'
  | 'needsDiscoverySupport'
  | 'additionalNotes'
  | 'voiceNote'
  | 'additionalUploads'
  | 'contactName'
  | 'contactEmail'
  | 'contactPhone'
  | 'companyName'
  | 'preferredContactMethod'
  | 'consentToFollowUp'

export type PersistableProjectBriefPayload = Partial<
  Record<PersistableBriefFieldKey, unknown>
>

export interface ValidationIssue {
  field: BriefFieldKey
  severity: ValidationSeverity
  message: string
}

export interface StepValidationResult {
  stepId: BriefStepId
  blockingIssues: ValidationIssue[]
  advisoryIssues: ValidationIssue[]
  isValidForNext: boolean
}

export interface BriefOptionItem<T extends string> {
  key: T
  label: string
  hint?: string
}

export interface BriefOptionDictionary {
  projectTypes: BriefOptionItem<ProjectTypeKey>[]
  unsurePrimaryNeeds: BriefOptionItem<UnsurePrimaryNeedKey>[]
  unsureNeeds: BriefOptionItem<UnsureNeedKey>[]
  industries: BriefOptionItem<IndustryKey>[]
  businessGoals: BriefOptionItem<BusinessGoalKey>[]
  currentPresences: BriefOptionItem<CurrentPresenceKey>[]
  buildScopes: BriefOptionItem<BuildScopeKey>[]
  contentReadinessOptions: BriefOptionItem<ContentReadinessKey>[]
  pageCountBands: BriefOptionItem<PageCountBandKey>[]
  catalogSizeBands: BriefOptionItem<CatalogSizeBandKey>[]
  systemAudienceBands: BriefOptionItem<SystemAudienceBandKey>[]
  integrationLevels: BriefOptionItem<IntegrationLevelKey>[]
  styleDirections: BriefOptionItem<StyleDirectionKey>[]
  colorDirections: BriefOptionItem<ColorDirectionKey>[]
  motionLevels: BriefOptionItem<MotionLevelKey>[]
  budgetBands: BriefOptionItem<BudgetBandKey>[]
  launchWindows: BriefOptionItem<LaunchWindowKey>[]
  preferredContactMethods: BriefOptionItem<PreferredContactMethodKey>[]
  showcaseFeatures: BriefOptionItem<FeatureKey>[]
  corporateFeatures: BriefOptionItem<FeatureKey>[]
  ecommerceFeatures: BriefOptionItem<FeatureKey>[]
  systemFeatures: BriefOptionItem<FeatureKey>[]
}

export interface StepDefinition {
  id: BriefStepId
  title: string
  description: string
}

export type BriefSaveState = 'idle' | 'dirty' | 'saving' | 'saved'

export type BriefFieldErrorMap = Partial<Record<BriefFieldKey, string>>

export interface SaveDraftRequest {
  briefId?: string
  currentStepId: BriefStepId
  patch: PersistableProjectBriefPayload
}

export interface SaveDraftResponse {
  ok: true
  briefId: string
  status: 'draft'
  currentStepId: BriefStepId
  completionPercent: number
  updatedAt: string
}

export interface SubmitBriefRequest {
  briefId?: string
  payload: PersistableProjectBriefPayload
}

export interface SubmitBriefResponse {
  ok: true
  briefId: string
  publicCode: string
  status: 'submitted'
  submittedAt: string
  estimate: BriefEstimateSnapshot
  successUrl: string
}

export interface UploadSignRequest {
  briefId?: string
  kind: UploadKind
  filename: string
  mimeType: string
  bytes: number
}

export interface UploadSignResponse {
  ok: true
  upload: {
    cloudName: string
    apiKey: string
    timestamp: number
    signature: string
    folder: string
    publicId: string
    resourceType: 'image' | 'video' | 'raw' | 'auto'
    uploadUrl: string
  }
}

export interface CloudinaryUploadApiResponse {
  asset_id?: string
  public_id: string
  secure_url: string
  resource_type?: 'image' | 'video' | 'raw'
  bytes?: number
  original_filename?: string
  duration?: number
}

export interface ApiErrorResponse {
  ok: false
  error: {
    code:
      | 'VALIDATION_ERROR'
      | 'NOT_FOUND'
      | 'CONFLICT'
      | 'INTERNAL_ERROR'
      | 'ESTIMATE_ERROR'
      | 'UPLOAD_NOT_ALLOWED'
      | 'FILE_TOO_LARGE'
      | 'UNSUPPORTED_TYPE'
    message: string
    fieldErrors?: BriefFieldErrorMap
  }
}

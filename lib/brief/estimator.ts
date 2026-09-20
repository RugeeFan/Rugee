import { resolveProjectType } from './branching'
import type {
  BriefEstimateSnapshot,
  BudgetBandKey,
  EstimateLineItem,
  FeatureKey,
  IntegrationLevelKey,
  LaunchWindowKey,
  MotionLevelKey,
  PageCountBandKey,
  ProjectBriefDraft,
  ResolvedProjectTypeKey,
  CatalogSizeBandKey,
  SystemAudienceBandKey,
} from './types'

export interface EstimateModifier {
  priceMin: number
  priceMax: number
  weeksMin: number
  weeksMax: number
}

const EMPTY_MODIFIER: EstimateModifier = {
  priceMin: 0,
  priceMax: 0,
  weeksMin: 0,
  weeksMax: 0,
}

export const ESTIMATOR_VERSION = 'v1' as const

export const BASE_RANGES: Record<ResolvedProjectTypeKey, EstimateModifier> = {
  showcase: { priceMin: 3000, priceMax: 6000, weeksMin: 2, weeksMax: 4 },
  corporate: { priceMin: 5000, priceMax: 12000, weeksMin: 3, weeksMax: 6 },
  ecommerce: { priceMin: 9000, priceMax: 22000, weeksMin: 5, weeksMax: 10 },
  system: { priceMin: 15000, priceMax: 40000, weeksMin: 8, weeksMax: 16 },
}

const PAGE_COUNT_MODIFIERS: Record<PageCountBandKey, EstimateModifier> = {
  pages_1_5: EMPTY_MODIFIER,
  pages_6_12: { priceMin: 1000, priceMax: 3000, weeksMin: 1, weeksMax: 2 },
  pages_13_plus: { priceMin: 2500, priceMax: 6000, weeksMin: 2, weeksMax: 4 },
}

const CATALOG_SIZE_MODIFIERS: Record<CatalogSizeBandKey, EstimateModifier> = {
  sku_1_20: EMPTY_MODIFIER,
  sku_21_100: { priceMin: 1500, priceMax: 4000, weeksMin: 1, weeksMax: 2 },
  sku_100_plus: { priceMin: 4000, priceMax: 8000, weeksMin: 2, weeksMax: 4 },
}

const SYSTEM_AUDIENCE_MODIFIERS: Record<SystemAudienceBandKey, EstimateModifier> = {
  internal_small_team: EMPTY_MODIFIER,
  multi_role_team: { priceMin: 3000, priceMax: 7000, weeksMin: 2, weeksMax: 4 },
  customer_facing: { priceMin: 6000, priceMax: 15000, weeksMin: 4, weeksMax: 8 },
}

const FEATURE_MODIFIERS: Partial<Record<FeatureKey, EstimateModifier>> = {
  contact_form: { priceMin: 300, priceMax: 800, weeksMin: 0, weeksMax: 1 },
  cms: { priceMin: 800, priceMax: 2000, weeksMin: 0, weeksMax: 1 },
  blog_news: { priceMin: 600, priceMax: 1500, weeksMin: 0, weeksMax: 1 },
  seo_setup: { priceMin: 400, priceMax: 1200, weeksMin: 0, weeksMax: 1 },
  multilingual: { priceMin: 1000, priceMax: 3000, weeksMin: 1, weeksMax: 2 },
  animation_polish: { priceMin: 1000, priceMax: 3000, weeksMin: 1, weeksMax: 2 },
  booking: { priceMin: 1500, priceMax: 4000, weeksMin: 1, weeksMax: 2 },
  crm_integration: { priceMin: 1000, priceMax: 2500, weeksMin: 1, weeksMax: 2 },
  cart_checkout: { priceMin: 1200, priceMax: 3000, weeksMin: 1, weeksMax: 2 },
  payments: { priceMin: 1500, priceMax: 4000, weeksMin: 1, weeksMax: 2 },
  order_admin: { priceMin: 1500, priceMax: 4000, weeksMin: 1, weeksMax: 2 },
  inventory: { priceMin: 1500, priceMax: 4000, weeksMin: 1, weeksMax: 2 },
  customer_accounts: { priceMin: 1200, priceMax: 3500, weeksMin: 1, weeksMax: 2 },
  subscriptions: { priceMin: 2000, priceMax: 5000, weeksMin: 1, weeksMax: 3 },
  auth_roles: { priceMin: 1500, priceMax: 4000, weeksMin: 1, weeksMax: 2 },
  admin_dashboard: { priceMin: 2000, priceMax: 6000, weeksMin: 1, weeksMax: 3 },
  records_management: { priceMin: 2000, priceMax: 6000, weeksMin: 1, weeksMax: 3 },
  reporting: { priceMin: 1500, priceMax: 5000, weeksMin: 1, weeksMax: 3 },
  approval_flow: { priceMin: 2000, priceMax: 5000, weeksMin: 1, weeksMax: 3 },
  notifications: { priceMin: 800, priceMax: 2000, weeksMin: 0, weeksMax: 1 },
  file_management: { priceMin: 1200, priceMax: 3000, weeksMin: 1, weeksMax: 2 },
  crm_workflow: { priceMin: 2000, priceMax: 6000, weeksMin: 1, weeksMax: 3 },
  third_party_integrations: { priceMin: 1500, priceMax: 5000, weeksMin: 1, weeksMax: 3 },
}

const INTEGRATION_LEVEL_MODIFIERS: Record<IntegrationLevelKey, EstimateModifier> = {
  none: EMPTY_MODIFIER,
  simple: { priceMin: 1000, priceMax: 3000, weeksMin: 1, weeksMax: 2 },
  complex: { priceMin: 4000, priceMax: 12000, weeksMin: 2, weeksMax: 6 },
}

const MOTION_LEVEL_MODIFIERS: Record<MotionLevelKey, EstimateModifier> = {
  minimal: EMPTY_MODIFIER,
  subtle: { priceMin: 500, priceMax: 1500, weeksMin: 0, weeksMax: 1 },
  expressive: { priceMin: 1200, priceMax: 3500, weeksMin: 1, weeksMax: 2 },
}

const LAUNCH_WINDOW_MULTIPLIERS: Record<
  LaunchWindowKey,
  { priceMinMultiplier: number; priceMaxMultiplier: number }
> = {
  asap: { priceMinMultiplier: 1.15, priceMaxMultiplier: 1.3 },
  within_1_month: { priceMinMultiplier: 1.08, priceMaxMultiplier: 1.15 },
  within_2_3_months: { priceMinMultiplier: 1, priceMaxMultiplier: 1 },
  flexible: { priceMinMultiplier: 1, priceMaxMultiplier: 1 },
}

const BUDGET_RANGES: Record<
  Exclude<BudgetBandKey, 'not_sure'>,
  { min: number; max: number }
> = {
  under_5k: { min: 0, max: 4999 },
  band_5k_10k: { min: 5000, max: 10000 },
  band_10k_20k: { min: 10000, max: 20000 },
  band_20k_40k: { min: 20000, max: 40000 },
  band_40k_plus: { min: 40000, max: Number.MAX_SAFE_INTEGER },
}

function createLineItem(code: string, label: string, modifier: EstimateModifier): EstimateLineItem {
  return {
    code,
    label,
    ...modifier,
  }
}

function addModifier(base: EstimateModifier, modifier: EstimateModifier): EstimateModifier {
  return {
    priceMin: base.priceMin + modifier.priceMin,
    priceMax: base.priceMax + modifier.priceMax,
    weeksMin: base.weeksMin + modifier.weeksMin,
    weeksMax: base.weeksMax + modifier.weeksMax,
  }
}

function multiplyEstimate(
  modifier: EstimateModifier,
  priceMinMultiplier: number,
  priceMaxMultiplier: number,
): EstimateModifier {
  return {
    priceMin: Math.round(modifier.priceMin * priceMinMultiplier),
    priceMax: Math.round(modifier.priceMax * priceMaxMultiplier),
    weeksMin: modifier.weeksMin,
    weeksMax: modifier.weeksMax,
  }
}

export function collectEstimateLineItems(
  draft: ProjectBriefDraft,
  resolvedProjectType: ResolvedProjectTypeKey,
): EstimateLineItem[] {
  const items: EstimateLineItem[] = [
    createLineItem(
      `base:${resolvedProjectType}`,
      `Base scope: ${resolvedProjectType}`,
      BASE_RANGES[resolvedProjectType],
    ),
  ]

  if (draft.pageCountBand) {
    items.push(
      createLineItem(
        `pages:${draft.pageCountBand}`,
        'Page count scope',
        PAGE_COUNT_MODIFIERS[draft.pageCountBand],
      ),
    )
  }

  if (draft.catalogSizeBand) {
    items.push(
      createLineItem(
        `catalog:${draft.catalogSizeBand}`,
        'Catalog size scope',
        CATALOG_SIZE_MODIFIERS[draft.catalogSizeBand],
      ),
    )
  }

  if (draft.systemAudienceBand) {
    items.push(
      createLineItem(
        `audience:${draft.systemAudienceBand}`,
        'System audience scope',
        SYSTEM_AUDIENCE_MODIFIERS[draft.systemAudienceBand],
      ),
    )
  }

  if (draft.integrationLevel) {
    items.push(
      createLineItem(
        `integration:${draft.integrationLevel}`,
        'Integration complexity',
        INTEGRATION_LEVEL_MODIFIERS[draft.integrationLevel],
      ),
    )
  }

  if (draft.motionLevel) {
    items.push(
      createLineItem(
        `motion:${draft.motionLevel}`,
        'Motion polish',
        MOTION_LEVEL_MODIFIERS[draft.motionLevel],
      ),
    )
  }

  for (const featureKey of draft.featureSelections) {
    const modifier = FEATURE_MODIFIERS[featureKey]
    if (!modifier) continue

    items.push(
      createLineItem(`feature:${featureKey}`, featureKey.replaceAll('_', ' '), modifier),
    )
  }

  return items
}

export function sumEstimateLineItems(items: EstimateLineItem[]): EstimateModifier {
  return items.reduce<EstimateModifier>(
    (accumulator, item) => addModifier(accumulator, item),
    EMPTY_MODIFIER,
  )
}

export function resolveBudgetFit(
  budgetBand: BudgetBandKey | undefined,
  estimatedMin: number,
  estimatedMax: number,
): BriefEstimateSnapshot['budgetFit'] {
  if (!budgetBand || budgetBand === 'not_sure') return 'unknown'

  const budgetRange = BUDGET_RANGES[budgetBand]
  if (budgetRange.max < estimatedMin) return 'below'
  if (budgetRange.min > estimatedMax) return 'above'
  return 'aligned'
}

export function shouldRecommendPhases(
  draft: ProjectBriefDraft,
  estimatedMin: number,
): boolean {
  if (draft.phasedDelivery) return true
  if (!draft.budgetBand || draft.budgetBand === 'not_sure') return false

  const budgetRange = BUDGET_RANGES[draft.budgetBand]
  return budgetRange.max < estimatedMin
}

export function computeEstimatePreview(
  draft: ProjectBriefDraft,
): BriefEstimateSnapshot | null {
  const resolvedProjectType = resolveProjectType(draft)
  if (!resolvedProjectType) return null

  const baseItems = collectEstimateLineItems(draft, resolvedProjectType)
  let totals = sumEstimateLineItems(baseItems)

  if (draft.launchWindow) {
    const multiplier = LAUNCH_WINDOW_MULTIPLIERS[draft.launchWindow]
    totals = multiplyEstimate(totals, multiplier.priceMinMultiplier, multiplier.priceMaxMultiplier)
  }

  return {
    version: ESTIMATOR_VERSION,
    currency: 'AUD',
    priceMin: totals.priceMin,
    priceMax: totals.priceMax,
    weeksMin: totals.weeksMin,
    weeksMax: totals.weeksMax,
    phaseRecommendation: shouldRecommendPhases(draft, totals.priceMin),
    budgetFit: resolveBudgetFit(draft.budgetBand, totals.priceMin, totals.priceMax),
    lineItems: baseItems,
    generatedAt: new Date().toISOString(),
  }
}

export function computeFrozenEstimateOnSubmit(
  draft: ProjectBriefDraft,
): BriefEstimateSnapshot {
  const preview = computeEstimatePreview(draft)
  if (!preview) {
    throw new Error('Unable to compute estimate from incomplete draft.')
  }

  return preview
}


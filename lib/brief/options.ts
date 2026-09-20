import type {
  BriefOptionDictionary,
  BriefOptionItem,
  BudgetBandKey,
  BusinessGoalKey,
  CatalogSizeBandKey,
  ColorDirectionKey,
  ContentReadinessKey,
  CurrentPresenceKey,
  FeatureKey,
  IndustryKey,
  IntegrationLevelKey,
  LaunchWindowKey,
  MotionLevelKey,
  PageCountBandKey,
  PreferredContactMethodKey,
  ProjectTypeKey,
  ResolvedProjectTypeKey,
  StyleDirectionKey,
  SystemAudienceBandKey,
  UnsureNeedKey,
  UnsurePrimaryNeedKey,
  BuildScopeKey,
} from './types'

function option<T extends string>(
  key: T,
  label: string,
  hint?: string,
): BriefOptionItem<T> {
  return { key, label, hint }
}

export const projectTypeOptions = [
  option(
    'showcase',
    'Simple Website',
    'A lean site to explain the business clearly and build trust.',
  ),
  option(
    'corporate',
    'Lead Website',
    'A website built to attract enquiries and guide the right next step.',
  ),
  option(
    'ecommerce',
    'Online Store',
    'A product store with checkout, fulfilment, and simpler operations.',
  ),
  option(
    'system',
    'Workflow System',
    'A lighter system to reduce repeated admin and keep work moving.',
  ),
  option(
    'unsure',
    'Not Sure Yet',
    'I know something feels messy, but not what shape the solution should take.',
  ),
] satisfies BriefOptionItem<ProjectTypeKey>[]

export const unsurePrimaryNeedOptions = [
  option('brand', 'Look more credible'),
  option('leads', 'Get clearer enquiries'),
  option('sales', 'Sell online'),
  option('operations', 'Reduce repeated admin'),
  option('booking', 'Make bookings easier'),
] satisfies BriefOptionItem<UnsurePrimaryNeedKey>[]

export const unsureNeedOptions = [
  option('content_pages', 'Explain the business more clearly'),
  option('lead_forms', 'Collect better enquiries'),
  option('sell_online', 'Take orders or payments online'),
  option('member_login', 'Give people a login area'),
  option('internal_management', 'Track work or records internally'),
  option('booking_calendar', 'Handle bookings or scheduling'),
] satisfies BriefOptionItem<UnsureNeedKey>[]

export const industryOptions = [
  option('professional_services', 'Professional Services'),
  option('home_trades', 'Home & Trades'),
  option('hospitality', 'Hospitality'),
  option('beauty_wellness', 'Beauty & Wellness'),
  option('education_coaching', 'Education & Coaching'),
  option('retail_brand', 'Retail Brand'),
  option('technology', 'Technology'),
  option('real_estate', 'Real Estate'),
  option('non_profit', 'Non-profit'),
  option('other', 'Other'),
] satisfies BriefOptionItem<IndustryKey>[]

export const businessGoalOptions = [
  option('build_trust', 'Build trust faster'),
  option('generate_leads', 'Bring in better enquiries'),
  option('sell_online', 'Sell online'),
  option('reduce_manual_work', 'Reduce manual work'),
  option('support_booking', 'Make booking flow easier'),
  option('publish_content', 'Publish updates more easily'),
] satisfies BriefOptionItem<BusinessGoalKey>[]

export const currentPresenceOptions = [
  option('no_website', 'Nothing is set up yet'),
  option('legacy_website', 'There is something old, but it no longer fits'),
  option('low_conversion_website', 'There is a site, but it is not helping enough'),
  option('social_only', 'Most of it lives in social media or listings'),
  option('prototype_ready', 'I already have a rough plan, prototype, or wireframe'),
] satisfies BriefOptionItem<CurrentPresenceKey>[]

export const buildScopeOptions = [
  option('new_build', 'Start fresh'),
  option('redesign', 'Rework what is already there'),
  option('extend_existing', 'Improve one part of the current setup'),
] satisfies BriefOptionItem<BuildScopeKey>[]

export const contentReadinessOptions = [
  option('content_ready', 'Most of the content and brand material is ready'),
  option('content_partial', 'Some of it is ready, but there are gaps'),
  option('need_content_guidance', 'I need help shaping the message and content'),
] satisfies BriefOptionItem<ContentReadinessKey>[]

export const pageCountBandOptions = [
  option('pages_1_5', '1 to 5 core pages'),
  option('pages_6_12', '6 to 12 pages'),
  option('pages_13_plus', '13+ pages or a larger information setup'),
] satisfies BriefOptionItem<PageCountBandKey>[]

export const catalogSizeBandOptions = [
  option('sku_1_20', '1 to 20 products'),
  option('sku_21_100', '21 to 100 products'),
  option('sku_100_plus', '100+ products'),
] satisfies BriefOptionItem<CatalogSizeBandKey>[]

export const systemAudienceBandOptions = [
  option('internal_small_team', 'Small internal team'),
  option('multi_role_team', 'Team with different roles'),
  option('customer_facing', 'Clients or customers will use it too'),
] satisfies BriefOptionItem<SystemAudienceBandKey>[]

export const integrationLevelOptions = [
  option('none', 'Keep it simple for now'),
  option('simple', 'Connect a few tools that already matter'),
  option('complex', 'Needs deeper integrations or custom data flow'),
] satisfies BriefOptionItem<IntegrationLevelKey>[]

export const styleDirectionOptions = [
  option('editorial_minimal', 'Editorial Minimal'),
  option('modern_premium', 'Modern Premium'),
  option('tech_forward', 'Tech-forward'),
  option('warm_service', 'Warm Service'),
  option('luxury_brand', 'Luxury Brand'),
  option('creative_playful', 'Creative Playful'),
  option('not_sure', 'Not sure yet'),
] satisfies BriefOptionItem<StyleDirectionKey>[]

export const colorDirectionOptions = [
  option('neutral_bw', 'Black / white / neutral'),
  option('dark_premium', 'Dark premium'),
  option('light_airy', 'Light and airy'),
  option('warm_accent', 'Warm accents'),
  option('cool_accent', 'Cool accents'),
  option('follow_existing_brand', 'Follow my existing brand'),
] satisfies BriefOptionItem<ColorDirectionKey>[]

export const motionLevelOptions = [
  option('minimal', 'Static and restrained'),
  option('subtle', 'Subtle motion'),
  option('expressive', 'More visual movement'),
] satisfies BriefOptionItem<MotionLevelKey>[]

export const budgetBandOptions = [
  option('under_5k', 'Under 5k AUD'),
  option('band_5k_10k', '5k to 10k AUD'),
  option('band_10k_20k', '10k to 20k AUD'),
  option('band_20k_40k', '20k to 40k AUD'),
  option('band_40k_plus', '40k+ AUD'),
  option('not_sure', 'Not sure yet'),
] satisfies BriefOptionItem<BudgetBandKey>[]

export const launchWindowOptions = [
  option('asap', 'As soon as possible'),
  option('within_1_month', 'Within 1 month'),
  option('within_2_3_months', 'Within 2-3 months'),
  option('flexible', 'Flexible'),
] satisfies BriefOptionItem<LaunchWindowKey>[]

export const preferredContactMethodOptions = [
  option('email', 'Email'),
  option('whatsapp', 'WhatsApp'),
  option('phone', 'Phone'),
] satisfies BriefOptionItem<PreferredContactMethodKey>[]

export const showcaseFeatureOptions = [
  option('portfolio', 'Portfolio or gallery'),
  option('contact_form', 'Contact or enquiry form'),
  option('cms', 'Easy content updates'),
  option('blog_news', 'Articles or updates'),
  option('seo_setup', 'Basic SEO foundations'),
  option('multilingual', 'Multiple languages'),
  option('animation_polish', 'Polished motion details'),
  option('booking', 'Booking or consultation'),
] satisfies BriefOptionItem<FeatureKey>[]

export const corporateFeatureOptions = [
  option('service_pages', 'Service or offer pages'),
  option('case_studies', 'Proof, case studies, or testimonials'),
  option('team_careers', 'Team or hiring'),
  option('contact_form', 'Contact or enquiry form'),
  option('cms', 'Easy content updates'),
  option('blog_news', 'Articles or updates'),
  option('multilingual', 'Multiple languages'),
  option('seo_setup', 'Basic SEO foundations'),
  option('booking', 'Booking or enquiry flow'),
  option('crm_integration', 'CRM integration'),
] satisfies BriefOptionItem<FeatureKey>[]

export const ecommerceFeatureOptions = [
  option('cart_checkout', 'Cart and checkout'),
  option('payments', 'Payments'),
  option('order_admin', 'Order and fulfilment admin'),
  option('inventory', 'Inventory management'),
  option('discounts', 'Discounts and promo codes'),
  option('customer_accounts', 'Customer accounts'),
  option('reviews_wishlist', 'Reviews or wishlist'),
  option('subscriptions', 'Subscriptions'),
  option('shipping_rules', 'Shipping rules'),
  option('multilingual', 'Multi-language / multi-currency'),
] satisfies BriefOptionItem<FeatureKey>[]

export const systemFeatureOptions = [
  option('auth_roles', 'Login and user roles'),
  option('admin_dashboard', 'Dashboard or control panel'),
  option('records_management', 'Records and data management'),
  option('reporting', 'Reports and visibility'),
  option('approval_flow', 'Approvals or task flow'),
  option('notifications', 'Notifications or reminders'),
  option('file_management', 'Files or documents'),
  option('crm_workflow', 'Lead or client workflow'),
  option('third_party_integrations', 'Other tool integrations'),
  option('payments', 'Online payments'),
] satisfies BriefOptionItem<FeatureKey>[]

export const briefOptionDictionary: BriefOptionDictionary = {
  projectTypes: projectTypeOptions,
  unsurePrimaryNeeds: unsurePrimaryNeedOptions,
  unsureNeeds: unsureNeedOptions,
  industries: industryOptions,
  businessGoals: businessGoalOptions,
  currentPresences: currentPresenceOptions,
  buildScopes: buildScopeOptions,
  contentReadinessOptions,
  pageCountBands: pageCountBandOptions,
  catalogSizeBands: catalogSizeBandOptions,
  systemAudienceBands: systemAudienceBandOptions,
  integrationLevels: integrationLevelOptions,
  styleDirections: styleDirectionOptions,
  colorDirections: colorDirectionOptions,
  motionLevels: motionLevelOptions,
  budgetBands: budgetBandOptions,
  launchWindows: launchWindowOptions,
  preferredContactMethods: preferredContactMethodOptions,
  showcaseFeatures: showcaseFeatureOptions,
  corporateFeatures: corporateFeatureOptions,
  ecommerceFeatures: ecommerceFeatureOptions,
  systemFeatures: systemFeatureOptions,
}

export function getFeatureOptionsForResolvedType(
  resolvedType?: ResolvedProjectTypeKey,
): BriefOptionItem<FeatureKey>[] {
  switch (resolvedType) {
    case 'showcase':
      return showcaseFeatureOptions
    case 'corporate':
      return corporateFeatureOptions
    case 'ecommerce':
      return ecommerceFeatureOptions
    case 'system':
      return systemFeatureOptions
    default:
      return []
  }
}

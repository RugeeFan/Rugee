import Link from 'next/link'
import type { Metadata } from 'next'
import SiteFooter from '../../../../components/marketing/SiteFooter'
import SiteHeader from '../../../../components/marketing/SiteHeader'
import { createPageMetadata } from '../../../../lib/metadata'
import {
  briefOptionDictionary,
  getFeatureOptionsForResolvedType,
} from '../../../../lib/brief/options'
import { CONTACT_EMAIL, WHATSAPP_URL } from '../../../../lib/site'
import type { BriefOptionItem, ProjectTypeKey } from '../../../../lib/brief/types'
import { getSubmittedBriefById } from '../../../../lib/server/brief-repo'

type SearchParams = Record<string, string | string[] | undefined>

type SuccessPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams
}

export const metadata: Metadata = createPageMetadata({
  title: 'Planner Submitted',
  description:
    'Your planner has been received. Review the planning range and the next steps for follow-up.',
  path: '/project-brief/success',
  noIndex: true,
})

function getFirstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-AU').format(value)
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

export default async function ProjectBriefSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const briefId =
    getFirstValue(resolvedSearchParams.brief) ??
    getFirstValue(resolvedSearchParams.id)

  if (!briefId) {
    return (
      <div className="min-h-screen bg-white text-primary">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.04)] sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">
              Submission status
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Brief not found
            </h1>
            <p className="mt-4 text-base text-secondary">
              I could not find that planner. You can start a new one any time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Back to home
              </Link>
              <Link
                href="/project-brief"
                className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary"
              >
                Start a new brief
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const brief = await getSubmittedBriefById(briefId)

  if (!brief || !brief.estimateFrozen) {
    return (
      <div className="min-h-screen bg-white text-primary">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.04)] sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">
              Submission status
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Submission not available
            </h1>
            <p className="mt-4 text-base text-secondary">
              This planner has not been submitted yet, or it is no longer available.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/project-brief"
                className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
              >
                Start a new brief
              </Link>
              <Link
                href="/studio"
                className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary"
              >
                Back to home
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const projectTypeLabel =
    findLabel(
      briefOptionDictionary.projectTypes,
      brief.resolvedProjectType as ProjectTypeKey | undefined,
    ) ?? 'Pending review'
  const goalLabels = findLabels(
    briefOptionDictionary.businessGoals,
    brief.businessGoals,
  )
  const preferredReplyLabel =
    findLabel(briefOptionDictionary.preferredContactMethods, brief.preferredContactMethod) ??
    'Email'
  const featureLabels = findLabels(
    getFeatureOptionsForResolvedType(brief.resolvedProjectType),
    brief.featureSelections,
  )

  return (
    <div className="min-h-screen bg-white text-primary">
      <SiteHeader />
      <main className="bg-section-bg">
        <section className="border-b border-black/6 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">
                Planner received
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Your planner is in. Here is what happens next.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-secondary sm:text-lg">
                I have everything needed for an initial review. I will go through
                your planner, references, and constraints, then follow up if
                anything needs clarification before recommending the right next step.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-black/10 bg-section-bg px-4 py-2 text-sm text-primary">
                  Reply target: within 24 hours
                </span>
                <span className="rounded-full border border-black/10 bg-section-bg px-4 py-2 text-sm text-primary">
                  Likely reply via {preferredReplyLabel}
                </span>
                <span className="rounded-full border border-black/10 bg-section-bg px-4 py-2 text-sm text-primary">
                  You can still add context directly
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <InfoCard
                  label="Planner code"
                  value={brief.publicCode ?? brief.id ?? 'Unavailable'}
                />
                <InfoCard
                  label="Likely reply via"
                  value={preferredReplyLabel}
                />
                <InfoCard
                  label="Preferred timing"
                  value={
                    findLabel(briefOptionDictionary.launchWindows, brief.launchWindow) ??
                    'To be confirmed'
                  }
                />
              </div>

              <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
                <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                  Planning range
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  AUD {formatNumber(brief.estimateFrozen.priceMin)} - {formatNumber(brief.estimateFrozen.priceMax)}
                </p>
                <p className="mt-2 text-base text-secondary">
                  Roughly {brief.estimateFrozen.weeksMin}-{brief.estimateFrozen.weeksMax} weeks
                </p>
                <p className="mt-4 text-sm leading-7 text-secondary">
                  This is an initial planning range based on the direction you submitted.
                  It is useful for scope alignment, but it is not a locked quote until I
                  review the details and confirm whether anything important is missing.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <SummaryCard
                  title="What I see as the main project shape"
                  items={[projectTypeLabel]}
                  emptyLabel="I will confirm the overall direction during review."
                />
                <SummaryCard
                  title="What you most want to improve"
                  items={goalLabels}
                  emptyLabel="I will confirm the business goals during review."
                />
                <SummaryCard
                  title="What needs to happen in version one"
                  items={featureLabels}
                  emptyLabel="Feature details will be clarified during review."
                />
              </div>

              <SummaryCard
                title="What is driving the range"
                items={brief.estimateFrozen.lineItems.map(item => item.label)}
                emptyLabel="The pricing drivers will be confirmed during review."
              />
            </div>

            <aside className="space-y-6">
              <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium">What happens next</p>
                <ol className="mt-5 space-y-4 text-sm leading-7 text-secondary">
                  <li>1. I review your planner, uploads, and references.</li>
                  <li>2. If anything is unclear, I follow up with focused questions.</li>
                  <li>3. Then I reply with a recommendation, scope direction, and quote path.</li>
                </ol>
              </div>

              <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium">If you remember something important</p>
                <p className="mt-3 text-sm leading-7 text-secondary">
                  You can send extra context, links, screenshots, or a quick note before I reply.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
                  >
                    Email me
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
                <p className="text-sm font-medium">What helps the reply move faster</p>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-secondary">
                  <li>Clear examples of what feels repetitive or messy</li>
                  <li>Any existing links, screenshots, or reference files</li>
                  <li>Anything time-sensitive that affects the first phase</li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/studio"
              className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Back to home
            </Link>
            <Link
              href="/project-brief"
              className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary"
            >
              Start another planner
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
      <p className="text-xs uppercase tracking-[0.16em] text-secondary">
        {label}
      </p>
      <p className="mt-3 text-base font-medium text-primary">{value}</p>
    </div>
  )
}

function SummaryCard({
  title,
  items,
  emptyLabel,
}: {
  title: string
  items: string[]
  emptyLabel: string
}) {
  return (
    <div className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_20px_80px_rgba(0,0,0,0.04)]">
      <p className="text-sm font-medium">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-5 space-y-3 text-sm text-secondary">
          {items.map(item => (
            <li key={item} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-black" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm leading-7 text-secondary">{emptyLabel}</p>
      )}
    </div>
  )
}

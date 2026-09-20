import type { Metadata } from 'next'
import HomeBriefModalController from '../../components/marketing/HomeBriefModalController'
import CapabilitiesSection from '../../components/marketing/CapabilitiesSection'
import ContactSection from '../../components/marketing/ContactSection'
import HeroSection from '../../components/marketing/HeroSection'
import HomeStructuredData from '../../components/marketing/HomeStructuredData'
import OutcomesSection from '../../components/marketing/OutcomesSection'
import ProcessSection from '../../components/marketing/ProcessSection'
import ProblemSection from '../../components/marketing/ProblemSection'
import ProjectBriefTeaserSection from '../../components/marketing/ProjectBriefTeaserSection'
import SelectedWorkSection from '../../components/marketing/SelectedWorkSection'
import SiteFooter from '../../components/marketing/SiteFooter'
import SiteHeader from '../../components/marketing/SiteHeader'
import TrustSection from '../../components/marketing/TrustSection'
import TrustStripSection from '../../components/marketing/TrustStripSection'
import { createPageMetadata } from '../../lib/metadata'
import {
  briefOptionDictionary,
} from '../../lib/brief/options'
import { resolveBriefPageState } from '../../lib/server/brief-page-state'

export const metadata: Metadata = createPageMetadata({
  title: 'Websites And Systems For Simpler Operations',
  description:
    'Rugee helps growing small businesses simplify repeated admin with clearer websites and lightweight business systems.',
  path: '/',
})

type MarketingHomePageProps = {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>
}

export default async function MarketingHomePage({
  searchParams,
}: MarketingHomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const { initialDraft, initialStepId } = await resolveBriefPageState(
    resolvedSearchParams,
  )
  const openBriefOnLoad =
    resolvedSearchParams.brief === 'open' ||
    Boolean(resolvedSearchParams.draft) ||
    Boolean(resolvedSearchParams.type)

  return (
    <div className="min-h-screen bg-white text-primary">
      <HomeStructuredData />
      <SiteHeader />
      <main>
        <HeroSection />
        <TrustStripSection />
        <ProblemSection />
        <CapabilitiesSection />
        <OutcomesSection />
        <SelectedWorkSection />
        <ProcessSection />
        <TrustSection />
        <ProjectBriefTeaserSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <HomeBriefModalController
        initialDraft={initialDraft}
        initialStepId={initialStepId}
        optionDictionary={briefOptionDictionary}
        openOnLoad={openBriefOnLoad}
      />
    </div>
  )
}

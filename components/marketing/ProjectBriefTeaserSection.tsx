import Link from 'next/link'
import BriefLauncherButton from './BriefLauncherButton'
import SectionHeading from './SectionHeading'

const teaserSteps = [
  {
    title: 'Tell me where work feels messy',
    description: 'Start with the bottleneck, even if you do not know the right solution yet.',
  },
  {
    title: 'Show what keeps repeating',
    description: 'Use simple prompts instead of writing a long technical spec from scratch.',
  },
  {
    title: 'Get a clearer starting direction',
    description: 'Leave with a practical next step, whether that is a website, a workflow, or both.',
  },
]

export default function ProjectBriefTeaserSection() {
  return (
    <section id="brief" className="bg-section-bg">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-black/8 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.05)] sm:p-10">
          <SectionHeading
            eyebrow="Project Planner"
            title="Not sure whether you need a website, a system, or both?"
            description="That is exactly what the planner is for. It turns messy requirements into a more practical starting scope."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {teaserSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[28px] border border-black/8 bg-section-bg p-6"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                  Step 0{index + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-secondary">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <BriefLauncherButton label="Start the planner" />
            <Link
              href="/project-brief"
              className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-black/3"
            >
              Open the full planner page
            </Link>
            <a
              href="mailto:Rugee.coder@gmail.com"
              className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-black/3"
            >
              Email instead
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
